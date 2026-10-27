import type { NextConfig } from "next";
import { PHARMA_LIBRARY_REV } from "./constants/media-rev";
import { assetCacheControl, securityHeaders } from "./config/security-headers.mjs";

/**
 * The Content-Security-Policy and the other baseline security headers now live
 * in config/security-headers.mjs, so the cPanel build's generated .htaccess
 * (scripts/build-static.mjs) emits exactly the same policy. Read the long CSP
 * rationale there.
 */

/**
 * `STATIC_EXPORT=1` (set by `npm run build:static`, see scripts/build-static.mjs)
 * switches to a fully static export for plain Apache / cPanel hosting. Unset —
 * which is every Firebase App Hosting build — nothing below changes.
 */
const isStaticExport = process.env.STATIC_EXPORT === "1";

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
            value: assetCacheControl,
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
            value: assetCacheControl,
          },
        ],
      },
    ];
  },
};

/**
 * The cPanel / Apache build: `npm run build:static` -> `STATIC_EXPORT=1`.
 *
 * - `output: "export"` writes plain HTML to `out/`, with no Node server.
 * - `trailingSlash: true` emits `/pharma/index.html` rather than `/pharma.html`, so
 *   Apache's `DirectoryIndex` serves every route with no rewrite rules.
 * - `images.unoptimized` — the image optimizer is a server feature, so
 *   `next/image` emits the file URL itself (including the pharma `?v=` revision
 *   query) instead of `/_next/image?...`. The 13MB of stills ship as authored.
 * - `headers()` is unsupported in an export (Next warns and ignores it), so it
 *   is dropped here; the same headers are written to out/.htaccess from
 *   config/security-headers.mjs by scripts/build-static.mjs.
 *
 * Everything else — `reactStrictMode`, `experimental`, the pharma
 * `localPatterns` — is carried over unchanged.
 */
function toStaticExport(config: NextConfig): NextConfig {
  const staticConfig: NextConfig = {
    ...config,
    output: "export",
    trailingSlash: true,
    images: { ...config.images, unoptimized: true },
  };
  delete staticConfig.headers;
  return staticConfig;
}

export default isStaticExport ? toStaticExport(nextConfig) : nextConfig;
