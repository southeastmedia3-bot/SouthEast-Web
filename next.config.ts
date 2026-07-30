import type { NextConfig } from "next";

/**
 * Content-Security-Policy.
 *
 * WHY THIS IS A STATIC POLICY AND NOT A NONCE POLICY
 *
 * The textbook Next.js CSP mints a per-request nonce in middleware. Doing that
 * here would be a straight downgrade: a nonce has to be unique per response, so
 * every page that carries one is opted out of static rendering. All 16 HTML
 * routes on this site are prerendered and served from the App Hosting CDN —
 * that is the whole reason `minInstances` is 0 in apphosting.yaml — and a nonce
 * would turn each one into a container hit with a cold start in front of it.
 * Paying that on a brochure site to tighten one directive is the wrong trade.
 *
 * So `script-src` keeps `'unsafe-inline'`, which is what Next's inline bootstrap
 * and streamed `self.__next_f.push(...)` payloads require without a nonce.
 * Be honest about what that means: this policy is not an XSS mitigation of last
 * resort. What it *does* do is close every other injection route, and those are
 * not decorative — `base-uri` blocks a `<base>` tag rewriting every relative URL
 * on the page, `form-action` stops an injected form posting the enquiry
 * elsewhere, `object-src` kills plugin embeds, and `connect-src 'self'` means
 * injected script cannot exfiltrate to an attacker's host.
 *
 * The allowlist is this tight because the site genuinely has no third parties:
 * no analytics, no tag manager, no embeds, no iframes, no remote images. Fonts
 * are self-hosted by `next/font`, every film and still is served from
 * `public/media`, and the only client-side fetch is same-origin to
 * /api/contact. `api.resend.com` is called from the route handler — server
 * side, so no CSP applies.
 *
 * IF YOU ADD A THIRD PARTY (analytics, a Vimeo embed, a font CDN) it will be
 * blocked and the console will name the directive. Add the host to that
 * directive; do not reach for a wildcard.
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  // See the note above: 'unsafe-inline' is Next's inline bootstrap, and the
  // price of keeping all 16 routes statically prerendered.
  "script-src 'self' 'unsafe-inline'",
  // GSAP, Lenis and Framer Motion all animate by writing inline styles.
  "style-src 'self' 'unsafe-inline'",
  // `data:` covers next/image's inline blur placeholders; `blob:` covers canvas
  // readback in the particle/physics scenes.
  "img-src 'self' data: blob:",
  // Every film is local. No CDN, no Vimeo.
  "media-src 'self'",
  // next/font self-hosts Geist, Manrope and Instrument Serif at build time, so
  // nothing is fetched from fonts.gstatic.com at runtime.
  "font-src 'self'",
  // The only client fetch is POST /api/contact, same-origin.
  "connect-src 'self'",
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  // The site embeds nothing.
  "frame-src 'none'",
  "object-src 'none'",
  // Stop an injected <base> silently repointing every relative URL on the page.
  "base-uri 'self'",
  // The enquiry form may only post back to this origin.
  "form-action 'self'",
  // The modern half of the X-Frame-Options pair below. Kept as 'self' so the two
  // agree — SAMEORIGIN and frame-ancestors 'none' would be a contradiction.
  "frame-ancestors 'self'",
  "upgrade-insecure-requests",
].join("; ");

/**
 * Baseline security headers, applied to every route.
 */
const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  // Stop MIME sniffing turning an upload into an executable script.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Clickjacking: nothing here is meant to be framed by another origin.
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  // Send the origin cross-site, the full path same-site. Keeps referrer
  // analytics useful without leaking deep URLs to third parties.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // The site asks for none of these; deny them up front. `browsing-topics` is
  // the name that actually replaced FLoC — `interest-cohort` alone is now
  // ignored by Chrome, so both are listed.
  {
    key: "Permissions-Policy",
    value:
      "camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), " +
      "accelerometer=(), gyroscope=(), interest-cohort=(), browsing-topics=()",
  },
  // Two years of HTTPS-only, including subdomains. App Hosting terminates TLS
  // and redirects http→https already; this closes the first-request window.
  //
  // `preload` is a real commitment: submitting to the HSTS preload list makes
  // southeastmedia.in and EVERY subdomain HTTPS-only in shipped browsers, and
  // removal takes months. That is correct here — nothing is served over plain
  // HTTP — but do not copy this header onto a domain with a legacy http-only
  // subdomain.
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  // Severs the opener relationship for anything this site opens or is opened
  // by, which is what closes cross-origin window handle attacks.
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  // Adobe's crossdomain.xml legacy: nothing here should ever be read by a Flash
  // or PDF client acting on another origin's behalf.
  { key: "X-Permitted-Cross-Domain-Policies", value: "none" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        /**
         * Everything under /public/media — ~37MB of film and several hundred
         * stills. That total matters: see "Keep the static payload small" in
         * DEPLOYMENT.md before adding to it.
         *
         * Next serves `public/` with `Cache-Control: public, max-age=0` by
         * default, which revalidates every asset on every view. On a site that
         * is mostly video that is the difference between a fast second page and
         * a second download of the same 5MB film — it is also why a film used
         * twice on one page was fetched twice rather than served from cache.
         *
         * A day fresh, a week stale-while-revalidate: repeat visits are instant,
         * and a replaced file still reaches everyone within about a day.
         *
         * NOT `immutable`. These filenames are stable and get overwritten in
         * place (see docs/MEDIA_SWAP_LIST.md), so a year-long immutable cache
         * would strand viewers on an old cut. If you ever need an instant swap,
         * rename the file rather than lengthening this header.
         */
        source: "/media/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
