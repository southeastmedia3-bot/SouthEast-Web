/**
 * Per-route search metadata. One module, so the same strings feed every consumer.
 *
 * WHY THIS EXISTS SEPARATELY FROM `data/verticals.ts`
 *
 * The vertical content is written for a reader — the H1s are deliberately
 * oblique ("The Zero-Imperfection Rendering Pipeline", "Shot in 8K, cut and
 * graded in the same building"), and that is a design decision worth keeping.
 * But nobody searches those phrases. This module holds the other half: the plain
 * commercial phrasing a buyer actually types, kept out of the page copy so the
 * two never have to compromise on each other.
 *
 * FOUR THINGS READ THIS FILE, and they must not drift apart:
 *   - each `page.tsx`, for its `<title>`, description and Service schema
 *   - `app/sitemap.ts`, for `lastModified`
 *   - `app/llms.txt/route.ts`, for the model-readable site map
 *   - `lib/schema.ts`, for `knowsAbout` on the Organization
 *
 * TITLE BUDGET IS 42 CHARACTERS. The root layout appends " | Southeast Media"
 * (18 chars) via `title.template`, and Google truncates the rendered title at
 * roughly 60. Every `title` below is written to fit inside that, so check the
 * length before editing one — a truncated title loses the phrase at the end,
 * which is usually the location.
 *
 * DESCRIPTIONS ARE 150–160 CHARACTERS for the same reason. They are not
 * summaries of the page; they are the sentence that has to win the click, and
 * each one names the studio and the service in the plain form.
 *
 * KEYWORD SOURCE: the client's "Keywords for southeast Media" list. The mapping
 * of clusters to routes, and the reasoning for not building a page per keyword,
 * is in docs/SEO_GEO_AEO.md §1.1. Do not add routes here that exist only to hold
 * a keyword — that is a doorway page and Google demotes them.
 */

export type RouteSeo = {
  path: string;
  /** The page-name part of `<title>`. Max ~42 chars — see the note above. */
  title: string;
  /** `<meta name="description">`. 150–160 chars. */
  description: string;
  /** Label used in the BreadcrumbList trail. Short. */
  breadcrumb: string;
  /** One line describing the page, for `llms.txt`. Written for a model to quote. */
  blurb: string;
  /**
   * schema.org `Service`. Present only on pages that sell something — the hub,
   * about and contact pages get breadcrumbs but no Service node, because
   * claiming a service that has no page is how a knowledge graph goes wrong.
   */
  service?: {
    /** `Service.name` — the commercial name of the offering. */
    name: string;
    /** `Service.serviceType` — the category, in the form a search engine indexes. */
    serviceType: string;
  };
  /**
   * The date this page's *content* last changed — not the date of the last
   * deploy.
   *
   * The sitemap used to send `new Date()` for every URL, which claimed all 11
   * pages changed on every push. Google learns to discount a `lastmod` that
   * moves without the content moving, and then the field is worth nothing when
   * a page really does change. Bump the one line you edited; leave the rest.
   */
  lastModified: string;
};

/**
 * Keyed by route so a page can look itself up by the path it already declares to
 * `createMetadata`, rather than importing a named export and letting the two
 * disagree about which page they describe.
 */
export const routeSeo = {
  "/": {
    path: "/",
    title: "Creative & 3D Animation Agency in Hyderabad",
    description:
      "Creative and 3D animation agency in Hyderabad. Southeast Media builds 8K CGI, medical animation, architectural visualization and corporate film in-house.",
    breadcrumb: "Home",
    blurb:
      "Southeast Media is a creative, CGI and video production studio in Hyderabad and Bengaluru, India, working across medical and pharmaceutical animation, architectural visualization, live-action film, VFX and motion graphics.",
    lastModified: "2026-08-05",
  },
  "/verticals": {
    path: "/verticals",
    title: "Creative, 3D & Video Production Services",
    description:
      "Creative, 3D and video production services from Southeast Media, Hyderabad — medical animation, architectural visualization, film, VFX, motion graphics and CGI.",
    breadcrumb: "Services",
    blurb:
      "The full list of Southeast Media's services, with a page for each: pharma and medical animation, architectural visualization, live-action film, VFX and CGI, motion graphics and animation, product and SaaS video, and enterprise retainers.",
    lastModified: "2026-08-05",
  },
  "/pharma": {
    path: "/pharma",
    title: "Medical Animation Company in Hyderabad",
    description:
      "Southeast Media is a medical animation company in Hyderabad — Mechanism of Action films, 3D medical visualization and pharma marketing at 4K–8K, under NDA.",
    breadcrumb: "Medical & Pharma",
    blurb:
      "Medical and pharmaceutical 3D animation: Mechanism of Action (MoA) films, anatomical and molecular visualization, patient education animation and pharmaceutical video production, rendered at 4K–8K with MD-reviewed anatomy under NDA.",
    service: {
      name: "Medical & Pharmaceutical 3D Animation",
      serviceType: "Medical animation and pharmaceutical visualization",
    },
    lastModified: "2026-08-05",
  },
  "/real-estate": {
    path: "/real-estate",
    title: "Architectural Visualization, Hyderabad",
    description:
      "Architectural visualization studio in Hyderabad. Photorealistic 3D rendering, real-estate walkthrough animation and virtual tours for institutional developments.",
    breadcrumb: "Real Estate",
    blurb:
      "Architectural and real-estate visualization: photorealistic 3D exterior and interior rendering, property walkthrough animation, 3D virtual tours and pre-construction CGI for institutional, commercial and premium residential developments.",
    service: {
      name: "Architectural & Real-Estate Visualization",
      serviceType: "3D architectural visualization and rendering",
    },
    lastModified: "2026-08-05",
  },
  "/films": {
    path: "/films",
    title: "Corporate Video Production, Hyderabad",
    description:
      "Corporate video production company in Hyderabad — uncompressed 8K capture, commercial and corporate film, complex facility shoots and in-house DI colour grading.",
    breadcrumb: "Films",
    blurb:
      "Live-action film production: corporate video, TV and commercial film, product films and facility shoots inside hospitals and manufacturing plants, captured in uncompressed 8K and finished with in-house Digital Intermediate colour grading.",
    service: {
      name: "Corporate & Commercial Film Production",
      serviceType: "Video and film production",
    },
    lastModified: "2026-08-05",
  },
  "/vfx": {
    path: "/vfx",
    title: "VFX Studio & CGI Production, Hyderabad",
    description:
      "VFX studio and CGI production company in Hyderabad. A 15-server GPU render farm finishing photorealistic, physically accurate frames through Octane at 8K.",
    breadcrumb: "VFX",
    blurb:
      "Visual effects and CGI production: simulation, compositing, look development and photorealistic rendering on a 15-server GPU render farm, finished through Octane at 8K.",
    service: {
      name: "VFX & CGI Production",
      serviceType: "Visual effects and CGI production",
    },
    lastModified: "2026-08-05",
  },
  "/animation": {
    path: "/animation",
    title: "3D Animation & Motion Graphics Studio",
    description:
      "3D animation company in Hyderabad — 2D and 3D motion graphics, explainer videos, product animation and AR, VR and projection-mapped experiential work.",
    breadcrumb: "Animation",
    blurb:
      "2D and 3D animation and motion graphics: explainer videos, character animation, kinetic typography, 3D product animation, and AR, VR and projection-mapped experiential media built in Unreal and Twinmotion.",
    service: {
      name: "3D Animation & Motion Graphics",
      serviceType: "3D animation and motion graphics",
    },
    lastModified: "2026-08-05",
  },
  "/saas": {
    path: "/saas",
    title: "Product & SaaS Video Production",
    description:
      "Product and SaaS video production — 3D product animation, photorealistic product rendering and social-media film for software and e-commerce brands.",
    breadcrumb: "SaaS & Product",
    blurb:
      "Product and software video: launch films, product explainers, 3D product animation and rendering, animated B-roll and paid social cutdowns, produced end to end in one studio.",
    service: {
      name: "Product & SaaS Video Production",
      serviceType: "Product video and 3D product animation",
    },
    lastModified: "2026-08-05",
  },
  "/enterprise": {
    path: "/enterprise",
    title: "Enterprise Media Retainers",
    description:
      "Southeast Media works as an embedded media partner for enterprises — dedicated resource allocation on access-controlled servers, under NDA and milestone SOW.",
    breadcrumb: "Enterprise",
    blurb:
      "Enterprise retainers: Southeast Media operating as an outsourced media division for brands, agencies and product teams, with assigned artists, reserved render capacity, NDA cover and milestone-based statements of work.",
    service: {
      name: "Enterprise Media Retainer",
      serviceType: "Outsourced media production retainer",
    },
    lastModified: "2026-08-05",
  },
  "/about": {
    path: "/about",
    /**
     * THE TWENTY YEARS BELONG TO THE TEAM, NOT THE COMPANY. These three strings
     * used to read "About the Studio — 20 Years in CGI" and "Twenty years of CGI
     * from a Hyderabad and Bengaluru studio", which says the studio has been
     * trading since ~2006. It has not: the studio was founded in 2025, and the
     * figure on the page is labelled "years combined CGI experience" in
     * `data/about.ts` — an aggregate over the people, which is a normal and
     * defensible claim for a new firm of veterans.
     *
     * The distinction became load-bearing the moment `businessProfile.foundingYear`
     * arrived, because `lib/schema.ts` publishes it as `Organization.foundingDate`
     * on every page. A page whose own JSON-LD says 2025 while its title claims
     * twenty years is not a matter of tone — it is two contradictory facts about
     * one entity, served together, to a reader that checks.
     */
    title: "About the Team — 20 Years of CGI",
    description:
      "Southeast Media is a Hyderabad CGI studio founded in 2025 by a team with 20+ years of combined experience, running a 15-server render farm and an 8K pipeline.",
    breadcrumb: "About",
    blurb:
      "Who Southeast Media is: a Hyderabad and Bengaluru studio founded in 2025 by a team carrying over twenty years of combined CGI experience, running a 15-server render farm with 672GB of VRAM and 100TB of RAID storage, and an 8K pipeline operated in-house.",
    lastModified: "2026-08-11",
  },
  "/contact": {
    path: "/contact",
    title: "Contact",
    description:
      "Start a project with Southeast Media, a creative and 3D production studio in Hyderabad. Confidential scoping under NDA, answered within two business days.",
    breadcrumb: "Contact",
    blurb:
      "How to reach Southeast Media: an enquiry form routed to info@southeastmedia.in, answered within two business days, with a confidential scoping call under NDA.",
    lastModified: "2026-08-05",
  },
} as const satisfies Record<string, RouteSeo>;

export type SeoPath = keyof typeof routeSeo;

/** Every route, in the order they should appear in the sitemap and llms.txt. */
export const seoRoutes = Object.values(routeSeo) as readonly RouteSeo[];

/**
 * What the studio does, phrased as the topics a knowledge graph indexes.
 *
 * Fed to `Organization.knowsAbout`. This is one of the few places a flat keyword
 * list is genuinely the right shape — it is a machine-readable statement of
 * competence, not prose, and it is a strong and underused signal for the
 * generative engines (see docs/SEO_GEO_AEO.md §3.2).
 *
 * Drawn from the client's keyword list, deduplicated to the root terms. Keep
 * every entry to something the site actually shows work for; a `knowsAbout`
 * that overclaims is worse than a short one.
 */
export const studioExpertise = [
  "3D animation",
  "Medical animation",
  "Mechanism of Action (MoA) animation",
  "Pharmaceutical marketing",
  "Healthcare video production",
  "Patient education animation",
  "Medical 3D visualization",
  "Architectural visualization",
  "3D architectural rendering",
  "Real estate walkthrough animation",
  "Corporate video production",
  "Commercial film production",
  "TV commercial production",
  "Visual effects (VFX)",
  "CGI production",
  "Photorealistic 3D rendering",
  "Motion graphics",
  "Explainer video production",
  "3D product animation",
  "Product visualization",
  "Augmented and virtual reality production",
] as const;
