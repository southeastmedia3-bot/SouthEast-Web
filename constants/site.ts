/**
 * Resolve the origin this deployment is actually served from.
 *
 * Every canonical URL, Open Graph image, sitemap entry and robots directive is
 * built on top of this, so a wrong value here is not cosmetic: it de-indexes
 * the site or points every share card at a domain that does not exist. The
 * previous default was `southeastmedia.example.com`, which would have shipped
 * exactly that failure to production.
 *
 * Order of trust:
 *   1. NEXT_PUBLIC_SITE_URL   — the real domain. Set this in production. On
 *      Firebase App Hosting it comes from apphosting.yaml, where it must be
 *      declared `availability: [BUILD, RUNTIME]`. BUILD is the one that counts:
 *      every page here is prerendered, so canonicals and the sitemap are frozen
 *      at build time and a runtime-only value arrives too late to affect them.
 *   2. VERCEL_PROJECT_PRODUCTION_URL — the stable production hostname Vercel
 *      injects at build time. Retained so a Vercel preview still resolves
 *      correctly; unset on Firebase.
 *   3. localhost              — development only.
 *
 * Note `NEXT_PUBLIC_` is required on (1): the value is read in client bundles
 * as well, and Next only inlines that prefix. (2) is build-time server-side and
 * gets baked in here at module scope, which is why it may be read bare.
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel.replace(/\/$/, "")}`;

  /**
   * Reaching here on a *deployed* build means it is about to bake
   * `http://localhost:3000` into every canonical tag, share card and sitemap
   * entry — a silent, site-wide SEO failure that looks completely normal in a
   * browser. Shout about it in the build log.
   *
   * Gated on CI/cloud rather than on NODE_ENV alone, because `next build` and
   * `next start` both set NODE_ENV=production locally. Warning there would fire
   * every time someone previews a production build on their own machine, where
   * localhost is the correct answer — and a warning that cries wolf on the
   * common path is one nobody reads on the path that matters.
   */
  const isDeployed = Boolean(
    process.env.CI ||
    process.env.K_SERVICE || // Cloud Run — App Hosting's runtime
    process.env.GOOGLE_CLOUD_PROJECT || // Cloud Build — App Hosting's builder
    process.env.VERCEL,
  );

  if (isDeployed) {
    console.warn(
      "\n[site] NEXT_PUBLIC_SITE_URL is not set for this deployment.\n" +
        "       Canonical URLs, Open Graph images and the sitemap will all point\n" +
        "       at http://localhost:3000. On Firebase App Hosting, set it in\n" +
        "       apphosting.yaml with availability: [BUILD, RUNTIME].\n",
    );
  }

  return "http://localhost:3000";
}

export const siteConfig = {
  name: "Southeast Media",
  projectName: "Trusted Digital Infrastructure & Immersive Production Studio",
  description:
    "Southeast Media engineers physically accurate 8K visualization and enterprise media systems for pharmaceutical, institutional real estate, film, and venture-stage institutions.",
  url: resolveSiteUrl(),
  locale: "en_US",
  themeColor: "#f8f6f1",
  /** Fallback shown to visitors when the enquiry form cannot reach us. */
  contactEmail: "studio@southeastmedia.com",
} as const;
