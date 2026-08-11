/**
 * The first sentence names the cities the studio works from.
 *
 * About is the page a search engine and an answer engine both reach for when
 * working out what and where a business is, and it was describing a studio with
 * no location at all — "Hyderabad" and "Bengaluru" appeared in the page title and
 * the JSON-LD but in none of the prose underneath. One clause fixes that; the
 * claim itself is not new, it is the same one `siteConfig.cities` already makes
 * to crawlers, and it comes from the client's Corporate Capability Deck.
 */
export const aboutHero = {
  eyebrow: "Who We Are",
  headline: "A studio built for the frames that can't be wrong.",
  body: "Southeast Media is a cinematic animation, film, and visual-effects studio working from Hyderabad and Bengaluru, and delivering across India. We sit inside the institutions we serve — under NDA, on secure servers — as the embedded visual division that turns science, architecture, and ambition into images people believe.",
};

export const aboutStory = {
  eyebrow: "The studio",
  title: "Craft, held to a standard the work can't hide.",
  paragraphs: [
    "We started from a simple conviction: in medicine, real estate, and film, a visual is not decoration — it is the argument. A review board, an investor, an audience: each is deciding whether to trust what they see. So we build every frame to survive that scrutiny.",
    "That means physically accurate rendering, doctor-reviewed anatomy, reference-monitor colour, and a zero-imperfection mandate on everything that leaves the building. It also means treating security as craft: NDA-bound engagements, access-controlled infrastructure, and governance you can audit.",
    "The result is a studio that behaves like an embedded division — not a vendor. One pipeline, one standard, seven disciplines.",
  ],
};

export const aboutPrinciples = [
  {
    label: "Accuracy over spectacle",
    detail:
      "The image has to be true before it is beautiful. We build to pass review, then we make it cinematic.",
  },
  {
    label: "One pipeline, one standard",
    detail:
      "Every vertical shares the same 8K colour science and the same zero-imperfection finish.",
  },
  {
    label: "Crafted by security",
    detail:
      "NDA-bound, access-controlled, and auditable. Your work never leaves a secure environment.",
  },
  {
    label: "Embedded, not outsourced",
    detail: "We operate as your visual division — inside the timeline, inside the stakes.",
  },
];

/**
 * The three frames under the story, given their stages.
 *
 * The images have always been there — `aboutAssets` in `data/media.ts` carries
 * them with the labels "The sketch", "The simulation", "The render" — but the
 * page rendered them as three unlabelled squares, so the sequence they describe
 * was invisible. These lines name what each stage is *for*. Order matches
 * `aboutAssets`; the labels come from there and are not repeated here.
 *
 * NOTHING HERE DESCRIBES A CLIENT OR AN OUTCOME. It is the studio's own process,
 * which is the one thing this page can assert without a sign-off.
 */
export const aboutStages = [
  "Form, angle and light are settled by hand, while changing them is still cheap. Nothing is modelled until the drawing is right.",
  "Physics does what a keyframe cannot. Cloth, fluid and particle behaviour are solved rather than posed, so the motion is a consequence and not a guess.",
  "The finished frame — materials, lighting and grade resolved to the same standard every discipline here is held to.",
];

/**
 * The Corridor — the page's one set-piece.
 *
 * The copy has to do a specific job here, because the scene itself is silent:
 * say what is flying past and who made it, in the two lines a visitor reads
 * before the first panel arrives. Everything else is the frames.
 *
 * NO CLAIM ABOUT DURATION OR VOLUME. "Years of work" and "hundreds of frames"
 * are the obvious lines to write under a scene like this and neither is
 * supportable — the studio was founded in 2025, and nobody has counted the
 * archive. What is true is where the frames come from and what they share.
 */
export const aboutCorridor = {
  eyebrow: "The archive",
  title: "One pass through everything the pipeline has made.",
  body: "Medical, architectural, product, character, motion and effects work, drawn from every library the studio keeps — modelled, lit, rendered and graded on the same machines, by the same people, to the same standard.",
};

/**
 * The studio's range, as one band of frames.
 *
 * The story ends on "one pipeline, one standard, seven disciplines", which the
 * page then asked the reader to take on trust. This is the evidence, and it is
 * deliberately a drifting band rather than a grid of cards: `/verticals` is
 * already the card grid, and repeating it here would be the same page twice.
 */
export const aboutRange = {
  eyebrow: "The range",
  title: "Seven disciplines, one pipeline.",
  body: "Medical, architectural, product, brand, character, commercial and effects work — all of it through the same modelling, lighting and colour chain, on the same machines.",
  cta: { label: "See all seven disciplines", href: "/verticals" },
};

/**
 * The infrastructure, stated twice: as numbers a visitor scans, and as one
 * sentence a machine can quote.
 *
 * THE SENTENCE IS NOT DECORATION. `docs/SEO_GEO_AEO.md` §3.2 makes the case: a
 * `<div>` reading "100TB" next to a caption reading "RAID storage" is a figure an
 * answer engine cannot lift, because there is no claim in it — only two fragments
 * that happen to sit near each other. The same fact written as a complete
 * declarative sentence, with the studio as its subject, is quotable verbatim.
 * Every number in it is one of `aboutMetrics` below; if a number changes, change
 * both or the page contradicts itself.
 */
export const aboutInfrastructure = {
  eyebrow: "Built in-house",
  title: "The machines are ours, and so is the standard they hold.",
  statement:
    "Southeast Media operates a 15-server render farm carrying 672GB of VRAM and 100TB of RAID-configured storage, delivering physically accurate imagery at up to 8K — modelled, lit, rendered, composited and graded inside one building.",
};

export const aboutMetrics = [
  { value: 20, suffix: "+", label: "years combined CGI experience" },
  { value: 100, suffix: "TB", label: "secure RAID-configured storage" },
  { value: 15, suffix: "", label: "server dedicated render farm" },
  { value: 8, suffix: "K", label: "physically accurate max resolution" },
];

export const aboutClose = {
  eyebrow: "Work with us",
  headline: "Bring us the frame that can't be wrong.",
  body: "If your next visual has to clear a board, close a round, or hold up on a cinema screen, we should talk.",
  cta: { label: "Initiate Vendor Protocol", href: "/contact" },
};
