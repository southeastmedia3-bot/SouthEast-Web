import type { MetadataRoute } from "next";
import { siteConfig } from "@/constants/site";
import { seoRoutes } from "@/data/seo";
import { homeShowreel, verticalHeroes } from "@/data/media";

/**
 * XML-escape a string before it reaches the sitemap.
 *
 * NEXT DOES NOT DO THIS FOR YOU, and the omission is not obvious. Next 16's
 * sitemap serializer (`resolve-route-data.js`) builds the XML by raw template
 * interpolation — `` `<video:title>${video.title}</video:title>` `` — with no
 * escaping on any field. So a single `&` in a title emits a bare ampersand,
 * which is not legal XML.
 *
 * That is exactly what happened here. Four route titles in `data/seo.ts` contain
 * one: "Creative & 3D Animation Agency in Hyderabad", "VFX Studio & CGI
 * Production", "3D Animation & Motion Graphics Studio", "Product & SaaS Video
 * Production". The served sitemap.xml failed to parse at the first of them, and
 * a malformed sitemap is rejected *whole* — Search Console reports a parse error
 * and submits none of the URLs, not just the four broken entries.
 *
 * Applied to `title` and `description` only. The URLs are built by `new URL()`
 * and are already percent-encoded; `lastModified` is an ISO date. If a future
 * field carries free text, escape it here too.
 *
 * One pass, not five sequential `.replace()` calls — chaining them would rewrite
 * the `&` introduced by an earlier substitution and produce `&amp;lt;`.
 */
/**
 * Keyed by a union rather than `string`, so the lookup below returns `string`
 * and not `string | undefined` — the project runs `noUncheckedIndexedAccess`,
 * and a `?? char` fallback would be the wrong answer in an escaping function
 * anyway: it would silently emit the raw character it was asked to escape.
 */
type XmlSpecial = "&" | "<" | ">" | '"' | "'";

const XML_ENTITIES: Record<XmlSpecial, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&apos;",
};

function escapeXml(value: string) {
  // The cast is discharged by the character class: the regex matches exactly the
  // five keys above, so every `char` handed to the callback is an `XmlSpecial`.
  return value.replace(/[&<>"']/g, (char) => XML_ENTITIES[char as XmlSpecial]);
}

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
                // Escaped — see `escapeXml` above. Next emits these raw.
                title: escapeXml(`${seo.title} — ${siteConfig.name}`),
                description: escapeXml(seo.description),
                thumbnail_loc: new URL(media.poster, siteConfig.url).toString(),
                content_loc: new URL(media.video, siteConfig.url).toString(),
              },
            ],
          }
        : {}),
    };
  });
}
