import type { Metadata, MetadataRoute } from "next";
import { siteConfig } from "@/constants/site";
import { routeSeo, type SeoPath } from "@/data/seo";
import { verticalHeroes } from "@/data/media";

type MetadataInput = {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
};

export function absoluteUrl(path = "/") {
  return new URL(path, siteConfig.url).toString();
}

export function createMetadata({
  title,
  description = siteConfig.description,
  path = "/",
  // Every page gets a share card. Pass a page-specific image to override the
  // branded default (the wordmark over the anatomical-heart render).
  image = "/brand/og.jpg",
  noIndex,
}: MetadataInput = {}): Metadata {
  const canonical = absoluteUrl(path);

  /**
   * The full title, for share cards only.
   *
   * `title` below is deliberately the bare page name. The root layout declares
   * `title.template = "%s | Southeast Media"`, so returning the suffixed string
   * here produced "VFX | Southeast Media | Southeast Media" on every subpage.
   * The template owns the suffix; this function owns the page name.
   *
   * Open Graph and Twitter do not run through the template, so they take the
   * resolved string — a share card with a bare "VFX" on it says nothing.
   */
  const resolvedTitle = title
    ? `${title} | ${siteConfig.name}`
    : `${siteConfig.name} | ${siteConfig.projectName}`;

  return {
    title: title ?? { absolute: resolvedTitle },
    description,
    alternates: { canonical },
    openGraph: {
      type: "website",
      locale: siteConfig.locale,
      url: canonical,
      title: resolvedTitle,
      description,
      siteName: siteConfig.name,
      images: image ? [{ url: absoluteUrl(image), alt: resolvedTitle }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedTitle,
      description,
      images: image ? [absoluteUrl(image)] : undefined,
    },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
  };
}

/**
 * The metadata for a known route, taken from `data/seo.ts`.
 *
 * Prefer this over calling `createMetadata` with literals. The title and
 * description are search copy, not page copy — they belong in one module that
 * the sitemap, `llms.txt` and the Service schema also read, so a route cannot
 * end up described one way to a crawler and another way to a model.
 *
 * `createMetadata` stays exported for the cases this cannot cover: a route that
 * has no entry yet, or one that needs `noIndex`.
 */
export function metadataFor(path: SeoPath, options: { image?: string } = {}): Metadata {
  const seo = routeSeo[path];

  const metadata = createMetadata({
    title: seo.title,
    description: seo.description,
    path: seo.path,
    /**
     * The share card defaults to this page's own hero frame, not the site-wide
     * wordmark card.
     *
     * Every vertical previously shared as the same branded `og.jpg`, so seven
     * different services posted into a chat or a feed as seven identical images
     * — which is a click-through cost on the one surface where a studio's work
     * should be doing the selling. `verticalHeroes` already holds the frame the
     * page opens on, so this cannot drift from what the visitor then sees.
     *
     * An explicit `options.image` still wins; `/pharma` uses it to share the
     * anatomical heart rather than its MoA poster.
     */
    image: verticalHeroes[path.slice(1)]?.poster ?? undefined,
    ...options,
  });

  /**
   * The home page has to spell out its own suffix.
   *
   * `title.template` in the root layout applies to CHILD segments only, and
   * `app/page.tsx` sits in the *same* segment as `app/layout.tsx` — so the
   * template never runs on it and its title is emitted verbatim. Left alone the
   * homepage shipped `<title>Creative & 3D Animation Agency in Hyderabad</title>`
   * with no brand on it at all, which is the one page where the brand name most
   * needs to be in the result.
   *
   * `absolute` is the escape hatch for exactly this: it opts the value out of any
   * template rather than relying on one that was never going to apply. The share
   * cards were already correct — `createMetadata` resolves the suffix itself for
   * Open Graph and Twitter, because neither runs through the template either.
   */
  if (seo.path === "/") {
    metadata.title = { absolute: `${seo.title} | ${siteConfig.name}` };
  }

  return metadata;
}

/**
 * `createBreadcrumbSchema` used to live here and was never rendered by anything.
 * It now sits in `lib/schema.ts` alongside the rest of the JSON-LD, and pages
 * get their trail from `pageSchema()` rather than assembling one by hand.
 */

export function createRobots(): MetadataRoute.Robots {
  /**
   * Preview and development deployments must never be crawled. Left open they
   * get indexed under their *.vercel.app hostname and compete with the real
   * domain for the same copy — duplicate content the studio then has to ask
   * Google to remove.
   */
  const isProduction = process.env.VERCEL_ENV
    ? process.env.VERCEL_ENV === "production"
    : process.env.NODE_ENV === "production";

  if (!isProduction) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: [
      { userAgent: "*", allow: "/" },
      /**
       * The AI crawlers, named explicitly — and allowed.
       *
       * `userAgent: "*"` above already permits every one of these, so this group
       * changes nothing today. It is here to make the decision visible, because
       * the default is easy to reverse by accident: a great deal of "block the
       * AI scrapers" advice circulates, and for a studio that wants to be the
       * answer when someone asks ChatGPT for a medical animation company in
       * Hyderabad, blocking them is self-harm. There is nothing behind this site
       * but marketing copy the studio wants read as widely as possible.
       *
       * Two of these are not training crawlers and are worth understanding
       * separately: `Google-Extended` controls whether the site can be used in
       * AI Overviews and Gemini grounding, and `OAI-SearchBot` is what backs
       * ChatGPT's search citations. Disallowing either removes the studio from
       * the answer, not just from a training set.
       *
       * If the studio ever does want to opt out, this is the one place to do it
       * — and see docs/SEO_GEO_AEO.md §3.2 for what it costs.
       */
      {
        userAgent: [
          "GPTBot",
          "OAI-SearchBot",
          "ChatGPT-User",
          "ClaudeBot",
          "Claude-User",
          "Claude-SearchBot",
          "PerplexityBot",
          "Perplexity-User",
          "Google-Extended",
          "Applebot-Extended",
          "meta-externalagent",
          "Bytespider",
          "CCBot",
        ],
        allow: "/",
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
