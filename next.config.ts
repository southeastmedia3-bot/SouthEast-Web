import type { NextConfig } from "next";

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
        /**
         * Everything under /public/media — ~68MB of film and several hundred
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
