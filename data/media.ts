/**
 * Media manifest — the single source of truth for every image/video slot on the
 * site. Components resolve assets through these keys and never hardcode paths,
 * so real footage or stills can be dropped into `public/media/generated/` and
 * wired here with zero component changes.
 *
 * Current assets are client-provided architectural/real-estate renders used as
 * trial content. Swap the paths below to change what appears anywhere.
 */

export type MediaTone = "sky" | "blue" | "gold" | "violet";
export type MediaRatio = "portrait" | "wide" | "square" | "tall";

export type MediaAsset = {
  /** Optional still image path under /public (e.g. /media/generated/...). */
  src?: string;
  /** Optional short loop / scrub-ready mp4 path under /public. */
  video?: string;
  /** Poster still shown before the video loads and as reduced-motion fallback. */
  poster?: string;
  alt: string;
  tone: MediaTone;
  ratio?: MediaRatio;
  /** Short caption shown on gallery/tower cards. */
  label?: string;
  /** Discipline / context line. */
  kicker?: string;
};

const G = "/media/generated";
const G_PHARMA = "/media/pharma/anat";
// Note: stills are optimized JPGs (converted from the source PNG renders).

/** The hero "scroll film". A short (11.6s) night-lit villa loop — ideal length
 *  for true scroll-scrub. Swap `video` to change the homepage hero footage. */
export const heroFilm: MediaAsset = {
  video: `${G}/villa-night.mp4`,
  poster: `${G}/villa-poster.jpg`,
  alt: "Southeast Media reel — night-lit villa exterior, cinematic render",
  tone: "blue",
};

/** The image-library "tower" — the scroll-driven perspective column. */
export const towerAssets: MediaAsset[] = [
  {
    src: `${G}/exterior-02.jpg`,
    tone: "sky",
    ratio: "wide",
    label: "Dusk approach — tower elevation",
    kicker: "Institutional Real Estate",
    alt: "Photorealistic exterior render, tower at dusk",
  },
  {
    src: `${G}/interior-03.jpg`,
    tone: "blue",
    ratio: "wide",
    label: "Living volume — daylight study",
    kicker: "Interior Visualization",
    alt: "Photorealistic interior render, living space in daylight",
  },
  {
    src: `${G}/exterior-05.jpg`,
    tone: "blue",
    ratio: "wide",
    label: "Massing — full exterior",
    kicker: "Institutional Real Estate",
    alt: "Photorealistic architectural exterior render",
  },
  {
    src: `${G}/interior-07.jpg`,
    tone: "sky",
    ratio: "wide",
    label: "Kitchen & island — material detail",
    kicker: "Interior Visualization",
    alt: "Photorealistic kitchen interior render",
  },
  {
    src: `${G}/exterior-07.jpg`,
    tone: "violet",
    ratio: "wide",
    label: "Night elevation — lighting pass",
    kicker: "Institutional Real Estate",
    alt: "Photorealistic exterior render at night",
  },
  {
    src: `${G}/interior-11.jpg`,
    tone: "gold",
    ratio: "wide",
    label: "Stair & light well",
    kicker: "Interior Visualization",
    alt: "Photorealistic interior render, staircase and light well",
  },
  {
    src: `${G}/interior-13.jpg`,
    tone: "blue",
    ratio: "wide",
    label: "Suite — evening grade",
    kicker: "Interior Visualization",
    alt: "Photorealistic interior suite render, evening",
  },
];

/** Signature hero for each vertical page, keyed by route slug. Real-estate also
 *  carries a looping video. Others reuse the architectural stills as trial fill. */
export const verticalHeroes: Record<string, MediaAsset> = {
  pharma: {
    // The Aumolertinib mechanism-of-action film — the studio's marquee pharma
    // asset. Cinematic protein-binding sequence, cut to a clean 18s web loop.
    video: `/media/pharma/moa.mp4`,
    poster: `/media/pharma/moa-poster.jpg`,
    src: `/media/pharma/moa-poster.jpg`,
    tone: "blue",
    ratio: "wide",
    alt: "3D mechanism-of-action animation — EGFR protein binding",
  },
  "real-estate": {
    src: `${G}/exterior-05.jpg`,
    video: `${G}/exterior-web.mp4`,
    poster: `${G}/exterior-05.jpg`,
    tone: "sky",
    ratio: "wide",
    alt: "Institutional pre-construction architectural render",
  },
  films: {
    src: `${G}/exterior-07.jpg`,
    tone: "violet",
    ratio: "wide",
    alt: "Cinematic exterior render, night",
  },
  vfx: {
    src: `${G}/interior-09.jpg`,
    tone: "violet",
    ratio: "wide",
    alt: "Interior compositing frame",
  },
  animation: {
    src: `${G}/interior-08.jpg`,
    tone: "gold",
    ratio: "wide",
    alt: "Interior motion frame",
  },
  // PLACEHOLDER — replace with real saas assets. No product-film library exists
  // yet, so these borrow the architectural renders the way the other capability
  // verticals do. Everything still routes through this manifest, so a real hero
  // is a one-line swap.
  saas: {
    src: `${G}/interior-04.jpg`,
    tone: "violet",
    ratio: "wide",
    alt: "Product film frame — interior environment study",
  },
  // PLACEHOLDER — replace with real enterprise assets.
  enterprise: {
    src: `${G}/exterior-01.jpg`,
    tone: "gold",
    ratio: "wide",
    alt: "Corporate facility exterior render",
  },
};

/**
 * The anatomy-reveal layers on the pharma page.
 *
 * Extracted from a single deck slide (Page 03) — the same rigged figure rendered
 * as ten anatomical layers, cut out registered so they stack in place. Ordered
 * kidney -> whole body: scrolling cross-dissolves through them so the figure
 * assembles from one organ to the complete build. Black-bg JPGs, so they sit
 * seamlessly on the section's black ground.
 */
export const anatomyLayers = [
  { src: `${G_PHARMA}/1-kidney.png`, label: "Renal", detail: "One organ, in isolation." },
  { src: `${G_PHARMA}/2-lungs.png`, label: "Respiratory", detail: "The lungs and airway, added." },
  { src: `${G_PHARMA}/3-digestive.png`, label: "Digestive", detail: "The gut, layered in." },
  {
    src: `${G_PHARMA}/4-organs.png`,
    label: "Viscera",
    detail: "The organs, assembled in the torso.",
  },
  {
    src: `${G_PHARMA}/5-nervous.png`,
    label: "Nervous",
    detail: "The full neural network, head to foot.",
  },
  {
    src: `${G_PHARMA}/6-circulatory.png`,
    label: "Circulatory",
    detail: "Arteries and veins throughout.",
  },
  { src: `${G_PHARMA}/7-skeleton.png`, label: "Skeletal", detail: "The frame it all hangs on." },
  {
    src: `${G_PHARMA}/8-skeletomuscular.png`,
    label: "Musculoskeletal",
    detail: "Muscle laid over bone.",
  },
  { src: `${G_PHARMA}/9-muscular.png`, label: "Muscular", detail: "Every muscle group." },
  { src: `${G_PHARMA}/10-full.png`, label: "Complete", detail: "The whole body — fully rigged." },
] as const;

/* ---------------------------------------------------------------------------
   SaaS & Enterprise — borrowed placeholders.

   Neither page has a real asset library yet, so every slot below is filled from
   the libraries that DO exist (`public/media/generated/` architectural renders,
   plus the pharma loops where the subject is contextually honest). The slot keys
   describe the *purpose* of the frame, not what happens to be in it today.

   THE SWAP CONTRACT: when the real footage lands, drop the files into
   `public/media/saas/` or `public/media/enterprise/` and edit `src`, `video`,
   `w`, `h`, `alt` and `label` here. Nothing in `components/verticals/` needs to
   change — the layouts size themselves from `w`/`h` and caption themselves from
   `label`. `docs/MEDIA_SWAP_LIST.md` is the shot list keyed to these entries.
   --------------------------------------------------------------------------- */

/**
 * One media slot on a bespoke vertical page.
 *
 * `w`/`h` are the file's true pixel dimensions, measured — not guessed. They are
 * what lets a frame take the image's own shape before it loads, so the full image
 * fills its box corner to corner with no crop, no letterbox and no layout shift.
 * Replacing an asset means replacing these two numbers with the new file's.
 */
export type MediaSlot = {
  /** Stable identifier for the slot. Used in `docs/MEDIA_SWAP_LIST.md`. */
  key: string;
  /** Still under /public. Doubles as the poster when `video` is set. */
  src: string;
  /** Intrinsic pixel width of `src`. */
  w: number;
  /** Intrinsic pixel height of `src`. */
  h: number;
  alt: string;
  /** Optional muted loop under /public. */
  video?: string;
  /** Caption describing the frame actually on screen. */
  label?: string;
};

// The two shapes the borrowed library comes in. Alternating them is what keeps
// adjacent frames from sharing a crop (Media Philosophy, §9).
const WIDE = { w: 1920, h: 798 } as const; // exteriors — 2.41:1
const FILM = { w: 1920, h: 1080 } as const; // interiors — 16:9

/**
 * SaaS page slots. Ordered groups match the order of the content they sit
 * beside in `data/verticals.ts`, so a card grid can zip the two together.
 */
export const saasAssets: {
  heroInputProduct: MediaSlot;
  heroOutputFrame: MediaSlot;
  aiPrivacyFrame: MediaSlot;
  formatFrames: MediaSlot[];
  galleryFrames: MediaSlot[];
} = {
  /** Hero demonstration panel — the "product frame" input chip. */
  // PLACEHOLDER — replace with real saas asset.
  heroInputProduct: {
    key: "heroInputProduct",
    src: `${G}/interior-08.jpg`,
    ...FILM,
    alt: "Product frame supplied to the studio",
    label: "Product frame",
  },
  /** Hero demonstration panel — the large "output" film frame. */
  // PLACEHOLDER — replace with real saas asset.
  heroOutputFrame: {
    key: "heroOutputFrame",
    src: `${G}/villa-poster.jpg`,
    video: `${G}/villa-night.mp4`,
    ...FILM,
    alt: "Finished film frame rendered by the studio",
    label: "Master — 8K conform",
  },
  /**
   * The AI-privacy scene — the page's one deliberate dark room.
   *
   * Deliberately NOT one of the pharma loops: several of those carry slide text
   * burned into the frame ("Mutant EGFR"), which reads as another client's deck
   * on a page about software. A night elevation is dark enough for the ground and
   * says the literal thing the section says — it stays inside the building.
   */
  // PLACEHOLDER — replace with real saas asset.
  aiPrivacyFrame: {
    key: "aiPrivacyFrame",
    src: `${G}/exterior-07.jpg`,
    ...WIDE,
    alt: "The studio at night — generation running on hardware we own",
    label: "On our own infrastructure",
  },
  /**
   * The eight named formats, in the order of `sections[1].items` on the SaaS
   * vertical — one frame per format card. Aspects alternate deliberately so no
   * two adjacent cards share a crop.
   */
  // PLACEHOLDER — replace with real saas assets.
  formatFrames: [
    {
      key: "formatLaunchFilm",
      src: `${G}/exterior-05.jpg`,
      ...WIDE,
      alt: "Wide establishing frame standing in for a launch film",
    },
    {
      key: "formatExplainer",
      src: `${G}/interior-03.jpg`,
      ...FILM,
      alt: "Interior study standing in for an explainer frame",
    },
    {
      key: "formatAnimatedBRoll",
      src: `${G}/interior-12.jpg`,
      ...FILM,
      alt: "Detail pass standing in for an animated B-roll loop",
    },
    {
      key: "formatUiInContext",
      src: `${G}/exterior-06.jpg`,
      ...WIDE,
      alt: "Approach frame standing in for UI composited in context",
    },
    {
      key: "formatSystemsArchitecture",
      src: `${G}/exterior-04.jpg`,
      ...WIDE,
      alt: "Elevation standing in for a systems visualization",
    },
    {
      key: "formatAdCutdowns",
      src: `${G}/interior-05.jpg`,
      ...FILM,
      alt: "Volume study standing in for a paid cutdown",
    },
    {
      key: "formatSocialVerticals",
      src: `${G}/interior-09.jpg`,
      ...FILM,
      alt: "Interior frame standing in for a social vertical master",
    },
    {
      key: "formatDemoEvent",
      src: `${G}/exterior-02.jpg`,
      ...WIDE,
      alt: "Dusk approach standing in for an event or booth loop",
    },
  ],
  /**
   * Selected work. Zipped by index with `vertical.gallery` on the SaaS page,
   * which supplies the caption and the format the slot is reserved for.
   *
   * The order is not arbitrary: the gallery splits this run into two columns by
   * even/odd index, so the aspects are sequenced F-W-W-F-F-W to make each column
   * alternate down its own length. Keep that pattern when real frames land.
   */
  // PLACEHOLDER — replace with real saas assets.
  galleryFrames: [
    {
      key: "galleryLaunchFilm",
      src: `${G}/interior-04.jpg`,
      ...FILM,
      alt: "Interior study",
    },
    {
      key: "galleryExplainer",
      src: `${G}/exterior-01.jpg`,
      ...WIDE,
      alt: "Exterior massing",
    },
    {
      key: "galleryAnimatedBRoll",
      src: `${G}/exterior-07.jpg`,
      ...WIDE,
      alt: "Night elevation",
    },
    {
      key: "galleryUiInContext",
      src: `${G}/interior-13.jpg`,
      ...FILM,
      alt: "Suite, evening grade",
    },
    {
      key: "galleryAdCutdown",
      src: `${G}/interior-06.jpg`,
      ...FILM,
      alt: "Interior study",
    },
    {
      key: "gallerySocialVertical",
      src: `${G}/exterior-03.jpg`,
      ...WIDE,
      alt: "Exterior elevation",
    },
  ],
};

/** Enterprise page slots. */
export const enterpriseAssets: {
  marqueeRowA: MediaSlot[];
  marqueeRowB: MediaSlot[];
  segmentFrames: MediaSlot[][];
  governanceFrame: MediaSlot;
} = {
  /**
   * The two-row work marquee under the hero. Row A drifts left, row B drifts
   * right; the two rows carry different aspects on purpose so the wall never
   * reads as a uniform tile grid.
   */
  // PLACEHOLDER — replace with real enterprise assets.
  marqueeRowA: [
    {
      key: "marqueeA1",
      src: `${G}/exterior-05.jpg`,
      ...WIDE,
      alt: "Architectural exterior render",
      label: "Massing — full exterior",
    },
    {
      key: "marqueeA2",
      src: `${G}/interior-03.jpg`,
      ...FILM,
      alt: "Interior render, living space in daylight",
      label: "Living volume — daylight",
    },
    {
      key: "marqueeA3",
      src: `${G}/exterior-07.jpg`,
      ...WIDE,
      alt: "Exterior render at night",
      label: "Night elevation",
    },
    {
      key: "marqueeA4",
      src: `${G}/interior-11.jpg`,
      ...FILM,
      alt: "Interior render, staircase and light well",
      label: "Stair & light well",
    },
    {
      key: "marqueeA5",
      src: `${G}/exterior-02.jpg`,
      ...WIDE,
      alt: "Tower render at dusk",
      label: "Dusk approach — tower",
    },
  ],
  // PLACEHOLDER — replace with real enterprise assets.
  marqueeRowB: [
    {
      key: "marqueeB1",
      src: `${G}/interior-07.jpg`,
      ...FILM,
      alt: "Kitchen interior render",
      label: "Island & counter — finish",
    },
    {
      key: "marqueeB2",
      src: `${G}/exterior-03.jpg`,
      ...WIDE,
      alt: "Exterior architectural render",
      label: "Exterior elevation",
    },
    {
      key: "marqueeB3",
      src: `${G}/interior-01.jpg`,
      ...FILM,
      alt: "Interior volume render",
      label: "Interior volume",
    },
    {
      key: "marqueeB4",
      src: `${G}/exterior-06.jpg`,
      ...WIDE,
      alt: "Exterior approach render",
      label: "Approach",
    },
    {
      key: "marqueeB5",
      src: `${G}/interior-10.jpg`,
      ...FILM,
      alt: "Styled interior render",
      label: "Styled space — material",
    },
  ],
  /**
   * The buyer-segment tabs. Keys match the order of `sections[1].items` on the
   * Enterprise vertical — two frames revealed per segment.
   */
  // PLACEHOLDER — replace with real enterprise assets.
  segmentFrames: [
    [
      {
        key: "segmentMarketingA",
        src: `${G}/interior-02.jpg`,
        ...FILM,
        alt: "Interior render detail",
        label: "Brand film frame",
      },
      {
        key: "segmentMarketingB",
        src: `${G}/exterior-01.jpg`,
        ...WIDE,
        alt: "Corporate facility exterior render",
        label: "Campaign master",
      },
    ],
    [
      {
        key: "segmentAgenciesA",
        src: `${G}/exterior-04.jpg`,
        ...WIDE,
        alt: "Architectural elevation render",
        label: "White-label archviz",
      },
      {
        key: "segmentAgenciesB",
        src: `${G}/interior-05.jpg`,
        ...FILM,
        alt: "Interior volume study render",
        label: "Overflow render capacity",
      },
    ],
    [
      {
        key: "segmentProductA",
        src: `/media/pharma/deck/cell.jpg`,
        w: 1600,
        h: 1535,
        alt: "Technical cutaway render",
        label: "Cutaway — technical",
      },
      {
        key: "segmentProductB",
        src: `${G}/interior-09.jpg`,
        ...FILM,
        alt: "Interior compositing frame",
        label: "Operating-principle sequence",
      },
    ],
    [
      {
        key: "segmentFacilitiesA",
        src: `${G}/exterior-02.jpg`,
        ...WIDE,
        alt: "Facility exterior render at dusk",
        label: "Facility exterior",
      },
      {
        key: "segmentFacilitiesB",
        src: `${G}/interior-13.jpg`,
        ...FILM,
        alt: "Interior suite render",
        label: "Video-wall content plate",
      },
    ],
  ],
  /** The AI-governance section's single wide frame. */
  // PLACEHOLDER — replace with real enterprise asset.
  governanceFrame: {
    key: "governanceFrame",
    src: `${G}/exterior-05.jpg`,
    video: `${G}/exterior-web.mp4`,
    ...WIDE,
    alt: "Work in progress on the studio's own pipeline",
    label: "Rendered in-house, start to finish",
  },
};

/** Atmospheric stills used on the About / Who We Are page. */
export const aboutAssets: MediaAsset[] = [
  {
    src: `${G}/interior-02.jpg`,
    tone: "blue",
    ratio: "portrait",
    label: "The craft",
    alt: "Interior render detail",
  },
  {
    src: `${G}/exterior-03.jpg`,
    tone: "sky",
    ratio: "tall",
    label: "The pipeline",
    alt: "Exterior architectural render",
  },
  {
    src: `${G}/interior-10.jpg`,
    tone: "violet",
    ratio: "portrait",
    label: "The room",
    alt: "Interior render, styled space",
  },
];
