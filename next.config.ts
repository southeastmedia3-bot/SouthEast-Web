import type { NextConfig } from "next";
import { PHARMA_LIBRARY_REV } from "./constants/media-rev";

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
 * elsewhere, `object-src` kills plugin embeds, and `connect-src` means injected
 * script cannot exfiltrate anywhere but this origin and Google's analytics
 * endpoints — neither of which will hand the data back to an attacker.
 *
 * The allowlist is this tight because the site has exactly one third party:
 * Google Analytics 4 (see `gaMeasurementId` in constants/site.ts). No tag
 * manager, no embeds, no iframes, no remote images. Fonts are self-hosted by
 * `next/font`, every film and still is served from `public/media`, and the only
 * client-side fetch of our own is same-origin to /api/contact. `api.resend.com`
 * is called from the route handler — server side, so no CSP applies.
 *
 * IF YOU ADD A THIRD PARTY (a Vimeo embed, a font CDN) it will be blocked and
 * the console will name the directive. Add the host to that directive; do not
 * reach for a wildcard.
 */

/**
 * The hosts Google Analytics 4 needs, split by directive.
 *
 * Named here rather than inlined below so the GA surface is one readable list:
 * if analytics is ever removed, deleting these three constants and their
 * references is the whole job.
 *
 * `www.googletagmanager.com` is spelled out rather than wildcarded because that
 * is the only tag-manager host gtag.js is ever fetched from — see the `src` in
 * @next/third-parties' GoogleAnalytics component.
 *
 * The analytics collection hosts are the one place a wildcard is justified.
 * GA4 posts hits to a REGIONAL endpoint chosen by the visitor's location —
 * `region1.google-analytics.com` through `region14.` and counting — so an
 * enumerated list would silently drop hits from whichever region Google adds
 * next. That failure is invisible: the page works, the numbers are just wrong.
 * `*.analytics.google.com` is the same story for Google Signals.
 *
 * ONE GA REQUEST IS DELIBERATELY BLOCKED, and it logs a CSP error in the
 * console on every page load. Do not "fix" it by adding the host.
 *
 * gtag.js also fires a second copy of each hit at `https://www.google.<TLD>/g/collect`.
 * That is an ADVERTISING FEATURES endpoint — remarketing audiences, demographics
 * and interests — not measurement. Every `page_view`, session and event still
 * reaches `www.google-analytics.com` and every report a brochure site reads is
 * complete; verified against a real browser, including page views across App
 * Router client navigations. Blocking it costs the demographics/interests
 * reports and nothing else.
 *
 * It stays blocked because allowing it properly is not possible. CSP forbids a
 * wildcard on the right of a hostname, so `*.google.<TLD>` is not a pattern a
 * browser accepts — Google's own CSP guide says each Google top-level domain
 * "must be specified individually". Covering an audience that resolves to
 * google.co.in, google.com, google.co.uk and the rest means enumerating Google's
 * ccTLD list by hand and re-checking it forever, to hand an ads endpoint data
 * the site does not use. See docs at developers.google.com/tag-platform/security/guides/csp.
 *
 * IF GOOGLE ADS IS EVER LINKED to this property, that changes: add the ccTLDs
 * the audience actually uses, plus `https://*.g.doubleclick.net`, to both
 * `img-src` and `connect-src`.
 */
const GA_SCRIPT_HOSTS = ["https://www.googletagmanager.com"];
// gtag.js falls back to an image beacon when `navigator.sendBeacon` is
// unavailable or the page is unloading, so the collection hosts are needed here
// too — not only in connect-src.
const GA_IMG_HOSTS = ["https://www.googletagmanager.com", "https://*.google-analytics.com"];
const GA_CONNECT_HOSTS = [
  "https://*.google-analytics.com",
  "https://*.analytics.google.com",
  "https://www.googletagmanager.com",
];
const contentSecurityPolicy = [
  "default-src 'self'",
  // See the note above: 'unsafe-inline' is Next's inline bootstrap, and the
  // price of keeping all 16 routes statically prerendered.
  `script-src 'self' 'unsafe-inline' ${GA_SCRIPT_HOSTS.join(" ")}`,
  // GSAP, Lenis and Framer Motion all animate by writing inline styles.
  "style-src 'self' 'unsafe-inline'",
  // `data:` covers next/image's inline blur placeholders; `blob:` covers canvas
  // readback in the particle/physics scenes.
  `img-src 'self' data: blob: ${GA_IMG_HOSTS.join(" ")}`,
  // Every film is local. No CDN, no Vimeo.
  "media-src 'self'",
  // next/font self-hosts Geist, Manrope and Instrument Serif at build time, so
  // nothing is fetched from fonts.gstatic.com at runtime.
  "font-src 'self'",
  // POST /api/contact is same-origin; the rest is where GA4 sends its hits.
  `connect-src 'self' ${GA_CONNECT_HOSTS.join(" ")}`,
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
    /**
     * An allowlist, so it has to name everything — declaring `localPatterns` at
     * all blocks every local source that does not match one of these, with a 400.
     *
     * The first entry is the site as it was: any path under /public, no query
     * string. The second is the one exception, the pharma library's revision tag
     * (see `constants/media-rev.ts`). Both spell `search` out rather than
     * omitting it — omitting it allows *any* query, which lets someone else
     * point the optimizer at URLs of their choosing.
     */
    localPatterns: [
      { pathname: "/**", search: "" },
      { pathname: "/media/pharma/**", search: PHARMA_LIBRARY_REV },
    ],
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
         * Everything under /public/media — ~61MB of film and several hundred
         * stills, ~25MB of which is the homepage showreel. That total matters:
         * see "Keep the static payload small" in DEPLOYMENT.md before adding to
         * it.
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
      {
        /**
         * The brand lockup, on the same terms as the media above — and it was
         * the one asset on the site that had no cache at all.
         *
         * `/media/:path*` never matched `/brand/`, so the four logo files fell
         * through to Next's `public, max-age=0` default and were revalidated on
         * every single view. Measured against the deployed backend on a 4 Mbps
         * link: the header mark and wordmark (54KB between them) did not decode
         * until ~3.5s, because they were queued behind the homepage reel while
         * it saturated the connection — the bar rendered with its nav links and
         * an empty space where the logo goes. Every navigation paid it again.
         *
         * These are served raw, not through `next/image`: App Hosting's adapter
         * hands `/brand/*.png` straight to the CDN, so this header is what the
         * browser actually gets. Same day-fresh / week-stale policy and the same
         * reason it is not `immutable` — the files are overwritten in place when
         * the identity changes.
         */
        source: "/brand/:path*",
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
