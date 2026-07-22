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
 *   1. NEXT_PUBLIC_SITE_URL   — the real domain. Set this in production.
 *   2. VERCEL_PROJECT_PRODUCTION_URL — the stable production hostname Vercel
 *      injects at build time. Correct on preview builds too (it points at
 *      production, so previews don't advertise themselves as canonical).
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

  return "http://localhost:3000";
}

export const siteConfig = {
  name: "Southeast Media",
  projectName: "Elite CGI, Enterprise Media & Immersive VFX",
  description:
    "Southeast Media engineers physically accurate 8K visualization and enterprise media systems for pharmaceutical, institutional real estate, film, and venture-stage institutions.",
  url: resolveSiteUrl(),
  locale: "en_US",
  themeColor: "#f8f6f1",
  /** Fallback shown to visitors when the enquiry form cannot reach us. */
  contactEmail: "studio@southeastmedia.com",
} as const;
