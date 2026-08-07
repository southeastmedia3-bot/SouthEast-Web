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
  /**
   * Fallback shown to visitors when the enquiry form cannot reach us.
   *
   * MUST stay on southeastmedia.in — the domain the studio actually owns. This
   * read `studio@southeastmedia.com` for several releases, which is a domain
   * nobody here controls: the address is printed on the contact page and is the
   * only route offered when the form fails, so every visitor who hit an error
   * was handed an address that bounces. Change the domain here and in
   * `app/global-error.tsx` together — that boundary cannot import this module
   * safely, so it carries its own copy.
   */
  contactEmail: "info@southeastmedia.in",
  /**
   * Where the studio works from, and who it serves.
   *
   * These two feed `Organization.areaServed` in `lib/schema.ts` and are the only
   * geographic claim the site is currently able to make. Both cities come from
   * the client's Corporate Capability Deck — the same source as every figure in
   * `data/home.ts` — so they are safe to assert.
   *
   * WHAT IS DELIBERATELY MISSING: a street address and a phone number. A
   * `LocalBusiness` node needs both, and a `PostalAddress` with invented or
   * partial values is worse than no node at all — it is a wrong fact published
   * in a machine-readable format, and Google Business Profile will disagree with
   * it. See docs/SEO_GEO_AEO.md §6 for the full list of facts the studio still
   * has to supply before local schema can ship.
   *
   * Those fields now have a home: `businessProfile` below. It is the one place to
   * fill them in, and the schema, the footer and the contact page all read it.
   */
  cities: ["Hyderabad", "Bengaluru"],
  areaServed: ["Hyderabad", "Bengaluru", "India"],
  /**
   * Google Search Console site verification.
   *
   * Emitted by the root layout as `<meta name="google-site-verification">` and
   * ONLY when non-empty — an empty meta tag is not a neutral no-op, it is a
   * malformed verification claim that Search Console reports as a failure.
   *
   * Read from the environment rather than committed, so the string can be set on
   * the deployment without a code change and without the token living in a
   * public repository. Set `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` in
   * apphosting.yaml (BUILD availability is enough — the tag is baked into the
   * prerendered HTML, exactly like the canonicals).
   *
   * PREFER DNS VERIFICATION. A Domain property in Search Console covers the
   * apex, `www` and every subdomain in one, which this meta tag cannot do — it
   * verifies the single host that serves it. Use this only if the DNS TXT record
   * proves awkward. See docs/SEO_OFFSITE_CHECKLIST.md §2.1.
   */
  googleSiteVerification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ?? "",
  /**
   * Google Analytics 4 measurement ID, e.g. `G-XXXXXXXXXX`.
   *
   * The single source of this string for the whole site. The root layout is the
   * only reader, and it mounts `<GoogleAnalytics>` ONLY when this is non-empty —
   * so leaving it unset is a complete, supported state: no gtag.js request, no
   * cookie, no third-party contact at all. That is what makes local development
   * and any preview build analytics-free without a code change.
   *
   * `NEXT_PUBLIC_` is mandatory and BUILD availability is what counts: the value
   * is inlined into the client bundle by `next build`, so a RUNTIME-only value
   * arrives after the bundle is already written and GA silently never loads. Set
   * it in apphosting.yaml alongside NEXT_PUBLIC_SITE_URL.
   *
   * NOT A SECRET — a measurement ID is published in the page's own HTML by
   * design, which is why it sits here as a plain value rather than in Secret
   * Manager. It is read from the environment for the same reason as the
   * verification token above: so the deployment owns it, not the repository.
   *
   * If you set this, note what comes with it: gtag.js writes a first-party `_ga`
   * cookie, which is the point at which the "no consent banner required" note in
   * DEPLOYMENT.md stops being true for EU/UK visitors.
   */
  gaMeasurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "",
} as const;

/* ───────────────────────── business profile (NAP) ───────────────────────── */

/**
 * The studio's real-world identity: Name, Address, Phone, hours, coordinates.
 *
 * EVERY FIELD HERE IS `null` UNTIL THE STUDIO SUPPLIES IT, and that is the whole
 * design of this module. Consumers — `lib/schema.ts`, the footer, the contact
 * page — all test for `null` and render nothing when it is absent, so the site
 * stays honest on its own rather than relying on someone remembering to strip a
 * placeholder before launch.
 *
 * DO NOT FILL THESE IN WITH ANYTHING PLAUSIBLE. A postal address is not
 * decorative copy: published as `LocalBusiness` JSON-LD it is a machine-readable
 * factual claim, it will be compared against the Google Business Profile, and a
 * wrong one is materially worse than an absent one — it makes Google trust both
 * records less. The same goes for a phone number nobody answers.
 *
 * WHAT HAPPENS AUTOMATICALLY once `streetAddress`, `postalCode` and `telephone`
 * are all set: `lib/schema.ts` promotes the Organization node to
 * `LocalBusiness` and attaches `address`,
 * `telephone`, `geo` and `openingHoursSpecification`. Nothing else has to move,
 * because every other node already references the organization by `@id`. That
 * promotion is deliberately gated on the address being real: a `LocalBusiness`
 * missing `address` is reported by Google as an error, not treated as unstated.
 *
 * The facts still outstanding are listed in docs/SEO_GEO_AEO.md §6 and in
 * "SEM optimization" §2.2.
 */
export type OpeningHours = {
  /** schema.org `DayOfWeek` short names, e.g. ["Monday", "Tuesday"]. */
  days: readonly string[];
  /** 24-hour `HH:MM`. */
  opens: string;
  closes: string;
};

export type BusinessProfile = {
  /** Registered legal name, if it differs from the trading name. TODO: supply. */
  legalName: string | null;
  /** TODO: supply — street and building, as one line. */
  streetAddress: string | null;
  addressLocality: string;
  addressRegion: string;
  /** TODO: supply — six-digit PIN. */
  postalCode: string | null;
  /** ISO 3166-1 alpha-2. */
  addressCountry: string;
  /** TODO: supply — E.164, e.g. "+914012345678". One number, kept forever. */
  telephone: string | null;
  /** TODO: supply — from the Google Business Profile pin once it is verified. */
  geo: { latitude: number; longitude: number } | null;
  /** TODO: supply — the hours shown on the Business Profile. */
  openingHours: readonly OpeningHours[] | null;
  /** TODO: supply — the year the studio was founded. */
  foundingYear: number | null;
};

export const businessProfile: BusinessProfile = {
  legalName: null,
  streetAddress: null,
  // The two city names are safe to state: they come from the client's Corporate
  // Capability Deck, the same source as every figure in `data/home.ts`. It is the
  // street-level detail below them that nobody has supplied.
  addressLocality: "Hyderabad",
  addressRegion: "Telangana",
  postalCode: null,
  addressCountry: "IN",
  telephone: null,
  geo: null,
  openingHours: null,
  foundingYear: null,
};

/**
 * True once there is enough of a postal address to publish one at all.
 *
 * Both parts are required together. A `PostalAddress` carrying a locality and no
 * street is not a partial address, it is a wrong one — it resolves to the centre
 * of Hyderabad.
 */
export const hasPostalAddress = Boolean(
  businessProfile.streetAddress && businessProfile.postalCode,
);

/** The address as one human-readable line, or `null` if there isn't one yet. */
export function formattedAddress(): string | null {
  if (!hasPostalAddress) return null;

  return [
    businessProfile.streetAddress,
    `${businessProfile.addressLocality}, ${businessProfile.addressRegion} ${businessProfile.postalCode}`,
    "India",
  ].join(", ");
}

/**
 * The studio's own profiles on other platforms.
 *
 * EMPTY ON PURPOSE, and an empty array is the correct current state rather than
 * an unfinished one. `config/navigation.ts` previously carried three links
 * pointing at `instagram.com`, `linkedin.com` and `vimeo.com` — the platforms'
 * own homepages, not the studio's accounts. Those shipped in the footer, where
 * they sent visitors to Instagram's front door, and they were deliberately kept
 * out of `Organization.sameAs`, because `sameAs` asserts *identity*: publishing
 * them would have told every crawler that Southeast Media and LinkedIn are the
 * same entity.
 *
 * Add the real profile URLs here and two things happen at once — the footer
 * renders them, and they enter `sameAs` in the JSON-LD, which is one of the
 * strongest signals available for establishing that a business is a single, real,
 * identifiable entity. That signal matters disproportionately to the generative
 * engines. See docs/SEO_OFFSITE_CHECKLIST.md §5.
 *
 * One rule: every URL must be a profile the studio actually controls. Never a
 * platform homepage, never a search result, never a third-party directory page
 * about the studio.
 */
export type SocialProfile = { label: string; href: string };

export const socialProfiles: readonly SocialProfile[] = [
  // TODO: supply the real URLs, then uncomment. Examples of the shape expected:
  // { label: "LinkedIn", href: "https://www.linkedin.com/company/southeast-media" },
  // { label: "YouTube", href: "https://www.youtube.com/@southeastmedia" },
  // { label: "Instagram", href: "https://www.instagram.com/southeastmedia" },
  // { label: "Behance", href: "https://www.behance.net/southeastmedia" },
  // { label: "Vimeo", href: "https://vimeo.com/southeastmedia" },
];
