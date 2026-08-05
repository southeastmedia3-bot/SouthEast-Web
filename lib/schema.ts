import { siteConfig } from "@/constants/site";
import { routeSeo, seoRoutes, studioExpertise, type RouteSeo, type SeoPath } from "@/data/seo";
import { homeShowreel, verticalHeroes } from "@/data/media";
import { getVertical } from "@/data/verticals";
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
 * Every `FAQPage` below is generated from the questions the page actually
 * renders, which is the only way to keep that guarantee as the copy changes.
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

/** Routes that sell a service, i.e. the seven vertical pages. */
const SERVICE_ROUTES: readonly SeoPath[] = [
  "/pharma",
  "/real-estate",
  "/films",
  "/vfx",
  "/animation",
  "/saas",
  "/enterprise",
];

function isServiceRoute(path: string): path is SeoPath {
  return SERVICE_ROUTES.includes(path as SeoPath);
}

/* ────────────────────────────── the entity ────────────────────────────── */

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
     * Email only. A `ContactPoint` with a `telephone` is the field that matters
     * most here and the studio has not published one — see `siteConfig.cities`.
     */
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      email: siteConfig.contactEmail,
      areaServed: siteConfig.areaServed.map(String),
      availableLanguage: ["English"],
    },
    /**
     * A machine-readable statement of competence. This is the single field an
     * answer engine is most likely to use when deciding whether this studio is a
     * candidate answer for "3D medical animation company in India".
     */
    knowsAbout: [...studioExpertise],
    /**
     * The seven services, as a catalogue hanging off the entity rather than only
     * as seven unconnected `Service` nodes on seven pages. This is what lets a
     * consumer that has read *one* page enumerate everything the studio offers
     * without crawling the rest of the site.
     */
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `${siteConfig.name} services`,
      itemListElement: seoRoutes
        .filter((route) => route.service)
        .map((route) => ({
          "@type": "Offer",
          itemOffered: { "@id": `${absoluteUrl(route.path)}#service` },
        })),
    },
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

/* ─────────────────────────────── per page ─────────────────────────────── */

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
 * The breadcrumb trail for a route.
 *
 * The seven verticals hang off the Services hub; `/about` and `/contact` hang
 * off the root. The trail has to match how the site is actually navigated, or it
 * is a claim about structure that the nav contradicts.
 */
function breadcrumbTrail(seo: RouteSeo) {
  // Annotated, not inferred: `routeSeo` is `as const`, so an unannotated array
  // would take its element type from the first entry and reject every push.
  const trail: Array<{ name: string; path: string }> = [
    { name: routeSeo["/"].breadcrumb, path: "/" },
  ];

  if (isServiceRoute(seo.path)) {
    trail.push({ name: routeSeo["/verticals"].breadcrumb, path: "/verticals" });
  }

  if (seo.path !== "/") {
    trail.push({ name: seo.breadcrumb, path: seo.path });
  }

  return trail;
}

function breadcrumbNode(seo: RouteSeo) {
  return {
    "@type": "BreadcrumbList",
    "@id": `${absoluteUrl(seo.path)}#breadcrumb`,
    itemListElement: breadcrumbTrail(seo).map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

/**
 * The page itself.
 *
 * `AboutPage` and `ContactPage` are not decoration — they are the two page types
 * a search engine explicitly looks for when deciding which URL to surface for
 * "<brand> contact" or "about <brand>", and they are the pages an answer engine
 * reaches for when asked how to get in touch. `CollectionPage` on the hub says
 * the same thing about `/verticals`: it is an index, not another service page.
 */
function pageTypeFor(path: string) {
  if (path === "/about") return "AboutPage";
  if (path === "/contact") return "ContactPage";
  if (path === "/verticals") return "CollectionPage";
  return "WebPage";
}

function webPageNode(seo: RouteSeo) {
  const video = videoNode(seo);

  return {
    "@type": pageTypeFor(seo.path),
    "@id": `${absoluteUrl(seo.path)}#webpage`,
    url: absoluteUrl(seo.path),
    name: `${seo.title} | ${siteConfig.name}`,
    description: seo.description,
    inLanguage: SCHEMA_LOCALE,
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": ORGANIZATION_ID },
    // The root gets no breadcrumb — a one-item trail reading "Home" is noise.
    ...(seo.path === "/" ? {} : { breadcrumb: { "@id": `${absoluteUrl(seo.path)}#breadcrumb` } }),
    ...(video ? { primaryImageOfPage: video.thumbnailUrl, video: { "@id": video["@id"] } } : {}),
  };
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
 * The hero film on this page, as a `VideoObject`.
 *
 * These films are the product, and a video entry is what makes a page eligible
 * for video rich results and video search — a channel a CGI studio should not be
 * leaving on the table. It also gives an answer engine something concrete to
 * cite: "here is the studio's mechanism-of-action reel" is a better answer than
 * a link to a page that happens to contain one.
 *
 * `uploadDate` is required by Google and is taken from the route's content date
 * in `data/seo.ts`. That is honest: it is the date the film was published *on
 * this site*, which is exactly what the field means for a self-hosted video.
 * `duration` is omitted rather than guessed — it is optional, and a wrong ISO
 * duration is worse than a missing one.
 */
function videoNode(seo: RouteSeo) {
  const asset = seo.path === "/" ? homeShowreel : verticalHeroes[seo.path.slice(1)];
  if (!asset?.video || !asset.poster) return null;

  return {
    "@type": "VideoObject",
    "@id": `${absoluteUrl(seo.path)}#video`,
    name: `${seo.title} — ${siteConfig.name}`,
    description: asset.alt,
    thumbnailUrl: absoluteUrl(asset.poster),
    contentUrl: absoluteUrl(asset.video),
    embedUrl: absoluteUrl(seo.path),
    uploadDate: seo.lastModified,
    inLanguage: SCHEMA_LOCALE,
    isFamilyFriendly: true,
    publisher: { "@id": ORGANIZATION_ID },
  };
}

/**
 * The page's FAQ, generated from the questions the page renders.
 *
 * BE CLEAR ABOUT WHAT THIS BUYS. Google withdrew FAQ rich results for most sites
 * in 2023 — they now show only for recognised government and health authorities,
 * so do not expect the accordion to appear under the blue link. The reason it is
 * here is AEO and GEO: `FAQPage` is still read by Bing, and it is the single
 * cleanest question-and-answer format an answer engine can lift, which is what
 * puts the studio inside the response rather than in a citation list under it.
 *
 * Generated from `vertical.faqs` rather than written out here, so it cannot drift
 * from what `FaqList` displays. Schema that claims a Q&A the visitor cannot find
 * on the page is a guidelines violation, and hand-maintained copies are how that
 * happens.
 */
function faqNode(seo: RouteSeo) {
  if (!isServiceRoute(seo.path)) return null;

  const faqs = getVertical(seo.path.slice(1))?.faqs;
  if (!faqs?.length) return null;

  return {
    "@type": "FAQPage",
    "@id": `${absoluteUrl(seo.path)}#faq`,
    isPartOf: { "@id": `${absoluteUrl(seo.path)}#webpage` },
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };
}

/**
 * The Services hub, as an ordered index of the seven service pages.
 *
 * Gives a crawler — and a model — the whole offering from one URL, in the site's
 * own running order, without having to infer it from a grid of cards.
 */
function serviceIndexNode() {
  return {
    "@type": "ItemList",
    "@id": `${absoluteUrl("/verticals")}#services`,
    name: `${siteConfig.name} services`,
    numberOfItems: SERVICE_ROUTES.length,
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    itemListElement: SERVICE_ROUTES.map((path, index) => {
      // Widened to `RouteSeo`: `routeSeo` is `as const`, so indexing it with the
      // whole `SeoPath` union yields a union of literal shapes — and `/` has no
      // `service` key at all, which makes the optional access a type error.
      const entry: RouteSeo = routeSeo[path];

      return {
        "@type": "ListItem",
        position: index + 1,
        name: entry.service?.name ?? entry.breadcrumb,
        url: absoluteUrl(path),
      };
    }),
  };
}

/**
 * Everything this URL asserts, as one graph.
 *
 * One `<script>` per page rather than several: the nodes cross-reference by
 * `@id`, and splitting them across tags makes the relationships harder for a
 * consumer to resolve and easier for an edit to break.
 */
export function pageSchema(path: SeoPath) {
  const seo = routeSeo[path];

  const nodes: Array<Record<string, unknown> | null> = [
    webPageNode(seo),
    path === "/" ? null : breadcrumbNode(seo),
    serviceNode(seo),
    videoNode(seo),
    faqNode(seo),
    path === "/verticals" ? serviceIndexNode() : null,
  ];

  return {
    "@context": "https://schema.org",
    "@graph": nodes.filter((node): node is Record<string, unknown> => node !== null),
  };
}
