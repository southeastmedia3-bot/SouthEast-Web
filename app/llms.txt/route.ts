import { siteConfig } from "@/constants/site";
import { seoRoutes, studioExpertise } from "@/data/seo";
import { absoluteUrl } from "@/lib/seo";

/**
 * `/llms.txt` — the site, written for a language model rather than a crawler.
 *
 * WHAT IT IS. An emerging convention (llmstxt.org): a single markdown file at
 * the root that states plainly what a site is and what each page covers, so a
 * model answering a question does not have to infer the studio's business from
 * scrolling animation and cinematic copy. Nothing consumes it as a standard yet
 * the way `robots.txt` is consumed — treat it as cheap insurance rather than a
 * ranking factor. It costs one prerendered text file.
 *
 * WHY IT EARNS ITS PLACE HERE SPECIFICALLY. This site is unusually hostile to
 * plain extraction: the pages are visual, the H1s are deliberately oblique
 * ("The Zero-Imperfection Rendering Pipeline"), and the real claims live inside
 * physics-driven widgets and scroll scenes. A model reading the rendered HTML
 * gets far less than a visitor does. This file states the same facts in the
 * flattest possible form.
 *
 * WHY A ROUTE HANDLER AND NOT `public/llms.txt`. A static file would be a second
 * copy of every page description, and it would rot silently the first time a
 * page changed. This is generated from `data/seo.ts` — the same module the
 * titles, descriptions and Service schema come from — so it cannot drift.
 *
 * It is fully static: no request is read, so Next prerenders it at build time
 * and App Hosting's CDN serves it without waking the container.
 */
export const dynamic = "force-static";

export function GET() {
  const services = seoRoutes.filter((route) => route.service);
  const other = seoRoutes.filter((route) => !route.service && route.path !== "/");

  const body = `# ${siteConfig.name}

> ${siteConfig.description}

${siteConfig.name} is a creative, CGI and video production studio working from ${siteConfig.cities.join(" and ")}, India, and serving clients across India. The studio runs its own infrastructure: a 15-server GPU render farm with 672GB of VRAM and 100TB of RAID storage, an 8K delivery pipeline, and in-house Digital Intermediate colour grading. Every engagement is NDA-bound and milestone-tracked.

Contact: ${siteConfig.contactEmail}

## Services

${services
  .map((route) => `- [${route.service!.name}](${absoluteUrl(route.path)}): ${route.blurb}`)
  .join("\n")}

## About the studio

${other.map((route) => `- [${route.breadcrumb}](${absoluteUrl(route.path)}): ${route.blurb}`).join("\n")}

## Areas of expertise

${studioExpertise.map((topic) => `- ${topic}`).join("\n")}
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      // Same day-fresh / week-stale policy as the rest of the static payload.
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
    },
  });
}
