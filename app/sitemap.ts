import type { MetadataRoute } from "next";
import { siteConfig } from "@/constants/site";
import { seoRoutes } from "@/data/seo";
import { homeShowreel, verticalHeroes } from "@/data/media";

/**
 * The hero film on each vertical page, for the sitemap's `videos` entries.
 *
 * Video sitemaps are worth the few lines here: these films are the product, and
 * a video entry is what makes a page eligible for video rich results and video
 * search — a channel a CGI studio should not be leaving on the table. Google
 * needs a thumbnail, a title and a description per video, all of which already
 * exist in `data/media.ts` and `data/seo.ts`.
 *
 * Only pages with a real hero film appear. `/about`, `/contact` and `/verticals`
 * are omitted rather than pointed at somebody else's reel.
 */
const pageVideos: Record<string, { video: string; poster: string }> = Object.fromEntries(
  [
    ["/", homeShowreel] as const,
    ...Object.entries(verticalHeroes).map(([slug, asset]) => [`/${slug}`, asset] as const),
  ]
    .filter(([, asset]) => Boolean(asset.video && asset.poster))
    .map(([path, asset]) => [path, { video: asset.video!, poster: asset.poster! }]),
);

export default function sitemap(): MetadataRoute.Sitemap {
  return seoRoutes.map((seo) => {
    const url = new URL(seo.path, siteConfig.url).toString();
    const media = pageVideos[seo.path];

    return {
      url,
      /**
       * The date the page's content changed, from `data/seo.ts` — not
       * `new Date()`.
       *
       * This used to send the build time for all 11 URLs, which told Google
       * every page changed on every deploy. A `lastmod` that moves without the
       * content moving gets discounted, and then it is worth nothing on the day
       * a page really does change. Bump the single line in `data/seo.ts`.
       */
      lastModified: new Date(seo.lastModified),
      changeFrequency: "monthly" as const,
      priority: seo.path === "/" ? 1 : 0.7,
      ...(media
        ? {
            images: [new URL(media.poster, siteConfig.url).toString()],
            videos: [
              {
                title: `${seo.title} — ${siteConfig.name}`,
                description: seo.description,
                thumbnail_loc: new URL(media.poster, siteConfig.url).toString(),
                content_loc: new URL(media.video, siteConfig.url).toString(),
              },
            ],
          }
        : {}),
    };
  });
}
