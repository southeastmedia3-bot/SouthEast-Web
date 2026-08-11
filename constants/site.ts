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
   * These two feed `Organization.areaServed` in `lib/schema.ts`. Both cities come
   * from the client's Corporate Capability Deck — the same source as every figure
   * in `data/home.ts` — so they are safe to assert.
   *
   * `areaServed` IS NOT AN ADDRESS, and the distinction now matters: the studio's
   * one postal address is in Hyderabad (`businessProfile` below, which is what
   * makes the schema a `LocalBusiness`), while these are the places it works in
   * and delivers to. Bengaluru appears here and in the copy but has no address of
   * its own; if it is ever staffed as a second office it needs its own Business
   * Profile listing, not a second address in this file.
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
  /**
   * Microsoft Clarity project ID, e.g. `xytc24b20t`.
   *
   * The single source of this string for the whole site, on exactly the terms as
   * `gaMeasurementId` above: the root layout is the only reader, it mounts
   * `<MicrosoftClarity>` ONLY when this is non-empty, and leaving it unset is a
   * complete supported state — no clarity.ms request, no cookie, nothing.
   *
   * `NEXT_PUBLIC_` is mandatory and BUILD availability is what counts, for the
   * same reason as GA: the value is inlined into the client bundle by
   * `next build`, so a RUNTIME-only value arrives after the bundle is written
   * and the tag silently never loads. Set it in apphosting.yaml.
   *
   * NOT A SECRET — the ID is published in the page's own HTML by design, and it
   * is the URL of a public tag file (clarity.ms/tag/<id>). It grants no access
   * to the dashboard, which is behind a Microsoft account.
   *
   * WHAT COMES WITH IT: Clarity writes first-party `_clck` and `_clsk` cookies
   * and records session replays. That is the same consent threshold GA already
   * crossed — see the cookie note in DEPLOYMENT.md. Clarity masks text and
   * inputs by default, so the enquiry form's contents are not captured unless
   * someone turns masking off in the dashboard. Leave it on.
   */
  clarityProjectId: process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID ?? "",
} as const;

/* ───────────────────────── business profile (NAP) ───────────────────────── */

/**
 * The studio's real-world identity: Name, Address, Phone, hours, coordinates.
 *
 * SUPPLIED BY THE STUDIO 2026-08-11 and populated below. Every field was `null`
 * before that, and the `null`-gating stays: consumers — `lib/schema.ts`, the
 * footer, the contact page — all test for `null` and render nothing when a value
 * is absent, so the one field still outstanding (`geo`) costs nothing and no
 * placeholder can ever reach a page.
 *
 * DO NOT EDIT THESE TO ANYTHING PLAUSIBLE. A postal address is not decorative
 * copy: published as `LocalBusiness` JSON-LD it is a machine-readable factual
 * claim, it will be compared against the Google Business Profile, and a wrong one
 * is materially worse than an absent one — it makes Google trust both records
 * less. The same goes for a phone number nobody answers. Change anything here
 * only when the studio says so, and change it on the Business Profile and every
 * directory listing in the same sitting — see docs/SEO_OFFSITE_CHECKLIST.md §0.
 *
 * WHAT THIS NOW SWITCHES ON, automatically, because `streetAddress`, `postalCode`
 * and `telephone` are all set: `lib/schema.ts` promotes the Organization node to
 * `LocalBusiness` and attaches `address`, `telephone` and
 * `openingHoursSpecification`. Nothing else had to move, because every other node
 * already references the organization by `@id`. That promotion is gated on the
 * address being real: a `LocalBusiness` missing `address` is reported by Google
 * as an error, not treated as unstated.
 */
export type OpeningHours = {
  /** schema.org `DayOfWeek` short names, e.g. ["Monday", "Tuesday"]. */
  days: readonly string[];
  /** 24-hour `HH:MM`. */
  opens: string;
  closes: string;
};

export type BusinessProfile = {
  /**
   * Registered legal name, only when it differs from the trading name.
   *
   * `null` on purpose: the studio confirmed the registered name is exactly
   * "Southeast Media" — no Pvt Ltd, no LLP suffix — so it is already carried by
   * `siteConfig.name`. Repeating it as `legalName` would publish the same string
   * twice in one node and imply a distinction that does not exist.
   */
  legalName: string | null;
  /** Street and building, as one line. */
  streetAddress: string | null;
  addressLocality: string;
  addressRegion: string;
  /** Six-digit PIN. */
  postalCode: string | null;
  /** ISO 3166-1 alpha-2. */
  addressCountry: string;
  /**
   * The one published number, with its country code.
   *
   * Stored in the exact form it should be *read* in, because the footer and the
   * contact page print this string verbatim and `Organization.telephone` carries
   * it as-is — NAP matching compares the strings a human and a crawler both see,
   * so there must be only one of them. The `tel:` href strips the separators, so
   * spacing costs nothing on a phone.
   */
  telephone: string | null;
  /** From the Google Business Profile pin once it is verified. */
  geo: { latitude: number; longitude: number } | null;
  /** The hours shown on the Business Profile. */
  openingHours: readonly OpeningHours[] | null;
  /** The year the studio was founded. */
  foundingYear: number | null;
};

export const businessProfile: BusinessProfile = {
  // See the type above — the registered name is the trading name.
  legalName: null,
  /**
   * Word for word as the studio wrote it, including the order of the building
   * and the door number. It reads oddly — the flat number sits third — but this
   * is the string that has to go on the Google Business Profile and on every
   * directory listing unchanged, and "tidying" it here is exactly how one
   * business becomes two in a citation index.
   */
  streetAddress: "B Block, Asian Sun City, 309, Kondapur, Forest Dept Colony",
  addressLocality: "Hyderabad",
  addressRegion: "Telangana",
  postalCode: "500084",
  addressCountry: "IN",
  telephone: "+91 72079 30735",
  /**
   * Still `null`, and correctly so. Coordinates should be read off the Business
   * Profile pin once that listing is verified, not guessed from a map search —
   * a `GeoCoordinates` node that disagrees with the pin is a contradiction
   * between two things Google reads about the same business. `LocalBusiness` is
   * complete without it; see docs/SEO_OFFSITE_CHECKLIST.md §1.
   */
  geo: null,
  /**
   * One slot, spelled out day by day rather than as a range, because
   * `OpeningHoursSpecification` takes a list of `DayOfWeek` values and the footer
   * renders "first–last" from it. Saturday and Sunday are absent, which is how
   * schema.org says "closed" — do not add a zero-length slot for them.
   */
  openingHours: [
    {
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "10:00",
      closes: "19:00",
    },
  ],
  /**
   * 2025 — the studio is genuinely new. That is not in tension with the "20+
   * years combined CGI experience" figure on `/about`: the number counts the
   * team's experience, not the company's age, which is why it is labelled
   * "combined" in `data/about.ts`. The `/about` title and description used to
   * blur the two ("Twenty years of CGI from a Hyderabad … studio"), and were
   * corrected when this date arrived — a `foundingDate` of 2025 sitting in the
   * same page's JSON-LD as a claim of twenty years' trading is a contradiction a
   * machine can see.
   */
  foundingYear: 2025,
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
 * These are read twice over: the footer renders them as links, and `lib/schema.ts`
 * publishes them as `Organization.sameAs` — "these accounts are the same entity as
 * this website", one of the strongest signals available for establishing that a
 * business is a single, real, identifiable thing. That signal matters
 * disproportionately to the generative engines. See docs/SEO_OFFSITE_CHECKLIST.md §5.
 *
 * WHY THIS LIST WAS EMPTY UNTIL NOW, and the rule it leaves behind:
 * `config/navigation.ts` used to carry three links pointing at `instagram.com`,
 * `linkedin.com` and `vimeo.com` — the platforms' own homepages, not the studio's
 * accounts. They shipped in the footer of every page, sending visitors to
 * Instagram's front door, and they were deliberately kept out of `sameAs`, because
 * publishing them would have asserted that Southeast Media *is* LinkedIn.
 *
 * So: every URL here must be a profile the studio actually controls. Never a
 * platform homepage, never a search result, never a third-party directory page
 * about the studio. Both below were supplied by the studio on 2026-08-11.
 */
export type SocialProfile = { label: string; href: string };

export const socialProfiles: readonly SocialProfile[] = [
  // Note the hyphenation: the LinkedIn slug is `south-east-media`, which does not
  // match the brand's own one-word spelling. It is the account that exists, so it
  // is the one that goes in `sameAs`; do not "correct" it to `southeast-media`.
  { label: "LinkedIn", href: "https://www.linkedin.com/company/south-east-media" },
  // Likewise the trailing `03` — it is the real handle.
  { label: "YouTube", href: "https://www.youtube.com/@SouthEastMedia03" },
  // Instagram is coming; the studio said it would follow. Add it here when it
  // arrives and both the footer and `sameAs` pick it up together. Behance and
  // Vimeo are still worth creating — see the checklist §5.
];
