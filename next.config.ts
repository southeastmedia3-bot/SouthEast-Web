import type { NextConfig } from "next";

/**
 * Baseline security headers, applied to every route.
 *
 * No Content-Security-Policy here on purpose. GSAP, Lenis and Framer Motion all
 * write inline styles, and Next injects inline bootstrap scripts, so a correct
 * CSP for this site needs nonce plumbing through middleware — worth doing, but
 * it is a change that breaks the page silently if it is wrong, and it should
 * not ride along with a first deploy. The headers below carry no such risk.
 */
const securityHeaders = [
  // Stop MIME sniffing turning an upload into an executable script.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Clickjacking: nothing here is meant to be framed by another origin.
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  // Send the origin cross-site, the full path same-site. Keeps referrer
  // analytics useful without leaking deep URLs to third parties.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // The site asks for none of these; deny them up front.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  // Two years of HTTPS-only, including subdomains. Vercel terminates TLS and
  // redirects http→https already; this closes the first-request window.
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
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
         * Everything under /public/media — ~127MB of film and several hundred
         * stills.
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
