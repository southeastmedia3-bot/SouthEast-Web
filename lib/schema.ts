import { siteConfig } from "@/constants/site";
import { routeSeo, studioExpertise, type RouteSeo, type SeoPath } from "@/data/seo";
import { absoluteUrl } from "@/lib/seo";

/**
 * schema.org JSON-LD for the site.
 *
 * WHY THIS MATTERS MORE THAN IT USED TO. Structured data was always the way to
 * earn a rich result; it is now also how a language model resolves what this
 * studio *is*. An AI asked "who does medical animation in Hyderabad" is reading
 * entities, not paragraphs — a `Service` node with a `provider` and an
 * `areaServed` is directly answerable in a way that the same claim buried in
 * prose is not. That is the whole of the GEO/AEO case for this file.
 *
 * EVERYTHING HERE MUST BE TRUE AND MUST BE ON THE PAGE. Structured data that
 * asserts something the visitor cannot see is a Google guidelines violation and
 * gets the site's rich results suppressed manually. So: no ratings, no review
 * counts, no invented founding date, no `LocalBusiness` until there is a real
 * postal address to put in it (see `siteConfig.cities` for why that is blocked).
 *
 * THE `@id` DISCIPLINE. Nodes reference each other by `@id` rather than being
 * re-declared inline — one Organization exists at `/#organization`, and every
 * Service on every page points its `provider` at that single node. Inlining a
 * fresh copy per page is the common mistake and it produces N organizations in
 * the graph instead of one entity with N services.
 *
 * CSP: `next.config.ts` keeps `script-src 'self' 'unsafe-inline'`, so the inline
 * <script type="application/ld+json"> that carries this renders without a nonce.
 * If that directive is ever tightened, JSON-LD is the first thing to break.
 */

const ORGANIZATION_ID = absoluteUrl("/#organization");
const WEBSITE_ID = absoluteUrl("/#website");

/**
 * `en-IN`, where Open Graph says `en_US`.
 *
 * Not an inconsistency to tidy up: `og:locale` uses a fixed vocabulary that
 * predates most regional English tags and `en_US` is the safe value there,
 * whereas schema.org takes a BCP 47 tag and every keyword this site targets is
 * an Indian one. This is the field where the region is worth stating.
 */
const SCHEMA_LOCALE = "en-IN";

/** `areaServed` as schema.org expects it — Places, not bare strings. */
const areaServed = siteConfig.areaServed.map((name) => ({ "@type": "Place", name }));

/**
 * The studio, as one entity.
 *
 * Typed `Organization` rather than `ProfessionalService` on purpose.
 * `ProfessionalService` is a `LocalBusiness` subtype, and a LocalBusiness
 * without `address` and `telephone` is an incomplete node — Google reports it as
 * an error rather than treating the missing fields as unstated. When the studio
 * supplies its address and phone (docs/SEO_GEO_AEO.md §6), change the `@type` to
 * `ProfessionalService` and add `address`, `geo`, `telephone` and `openingHours`
 * here; nothing else in this file has to move, because everything already
 * references this node by `@id`.
 */
function organizationNode() {
  return {
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: siteConfig.name,
    url: absoluteUrl("/"),
    slogan: siteConfig.projectName,
    description: siteConfig.description,
    email: siteConfig.contactEmail,
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl("/brand/logo-lockup.png"),
      caption: `${siteConfig.name} logo`,
    },
    image: absoluteUrl("/brand/og.jpg"),
    areaServed,
    /**
     * A machine-readable statement of competence. This is the single field an
     * answer engine is most likely to use when deciding whether this studio is a
     * candidate answer for "3D medical animation company in India".
     */
    knowsAbout: [...studioExpertise],
    /**
     * NO `sameAs` YET — and do not wire it to `socialNavigation`.
     *
     * Those hrefs are placeholders pointing at `instagram.com`, `linkedin.com`
     * and `vimeo.com` themselves. `sameAs` means "this URL is another identity
     * of this same entity", so publishing those would assert that Southeast
     * Media is LinkedIn. Add the real profile URLs here when they exist; it is
     * one of the strongest entity-disambiguation signals there is.
     */
  };
}

/** The site itself, distinct from the organization that publishes it. */
function websiteNode() {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: absoluteUrl("/"),
    name: siteConfig.name,
    description: siteConfig.description,
    inLanguage: SCHEMA_LOCALE,
    publisher: { "@id": ORGANIZATION_ID },
    /**
     * No `potentialAction` / SearchAction. The sitelinks searchbox markup
     * requires a real on-site search endpoint, and declaring one this site does
     * not have is a fabricated capability — Google ignores it at best.
     */
  };
}

/**
 * Site-wide graph. Rendered once, from the root layout, so every page carries
 * the entity and no page has to re-declare it.
 */
export function siteSchema() {
  return {
    "@context": "https://schema.org",
    "@graph": [organizationNode(), websiteNode()],
  };
}

export function createBreadcrumbSchema(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

/**
 * Routes that sit under the Services hub in the breadcrumb trail.
 *
 * These are the seven vertical pages. `/about` and `/contact` hang off the root
 * instead — the trail has to match how the site is actually navigated, or it is
 * a claim about structure that the nav contradicts.
 */
const SERVICE_ROUTES: readonly SeoPath[] = [
  "/pharma",
  "/real-estate",
  "/films",
  "/vfx",
  "/animation",
  "/saas",
  "/enterprise",
];

function breadcrumbTrail(seo: RouteSeo) {
  // Annotated, not inferred: `routeSeo` is `as const`, so an unannotated array
  // would take its element type from the first entry and reject every push.
  const trail: Array<{ name: string; path: string }> = [
    { name: routeSeo["/"].breadcrumb, path: "/" },
  ];

  if (SERVICE_ROUTES.includes(seo.path as SeoPath)) {
    trail.push({ name: routeSeo["/verticals"].breadcrumb, path: "/verticals" });
  }

  if (seo.path !== "/") {
    trail.push({ name: seo.breadcrumb, path: seo.path });
  }

  return trail;
}

function serviceNode(seo: RouteSeo) {
  if (!seo.service) return null;

  return {
    "@type": "Service",
    "@id": `${absoluteUrl(seo.path)}#service`,
    name: seo.service.name,
    serviceType: seo.service.serviceType,
    description: seo.description,
    url: absoluteUrl(seo.path),
    // By reference, never inline — see the `@id` note at the top of this file.
    provider: { "@id": ORGANIZATION_ID },
    areaServed,
  };
}

/**
 * Per-page graph: the breadcrumb trail, plus a `Service` node on the pages that
 * sell one. Returns a single object so a page renders exactly one <script>.
 *
 * The root is excluded — it carries the site-wide graph already, and a
 * one-item breadcrumb ("Home") is noise.
 */
export function pageSchema(path: SeoPath) {
  const seo = routeSeo[path];
  const service = serviceNode(seo);

  const nodes: Record<string, unknown>[] = [
    {
      "@type": "BreadcrumbList",
      "@id": `${absoluteUrl(seo.path)}#breadcrumb`,
      itemListElement: breadcrumbTrail(seo).map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: absoluteUrl(item.path),
      })),
    },
  ];

  if (service) nodes.push(service);

  return { "@context": "https://schema.org", "@graph": nodes };
}
