/**
 * Media manifest — the single source of truth for every image/video slot on the
 * site. Components resolve assets through these keys and never hardcode paths,
 * so real footage or stills can be dropped into `public/media/generated/` and
 * wired here with zero component changes.
 *
 * The libraries this resolves against:
 *   /media/generated  architectural & real-estate renders
 *   /media/pharma     the medical / mechanism-of-action library
 *   /media/products   product CGI — beauty, audio, wearable, jewellery, eyewear
 *   /media/saas       software work — abstract systems, explainer, storyboards
 *   /media/enterprise brand & social films
 *   /media/animation  character animation, logo builds, artwork
 *   /media/process    the studio's own production artifacts and flow diagrams
 *
 * CAPTIONS NAME THE CRAFT, NOT THE CLIENT. Several frames carry identifiable
 * third-party branding. Nothing here asserts a client relationship — a caption
 * says what the frame is ("Beauty — serum, caustics & sheer fabric"), never who
 * paid for it. See `docs/CLIENT_ATTRIBUTION.md` before changing that.
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
const PROD = "/media/products";
const SAAS = "/media/saas";
const ENT = "/media/enterprise";
const ANIM = "/media/animation";
const PROC = "/media/process";
// Note: stills are optimized JPGs (converted from the source PNG renders).

/* The intrinsic shapes the studio's own libraries come in, measured from the
   files themselves. Spread these instead of retyping numbers — a frame that
   claims the wrong shape is what causes a crop or a letterbox. */
const SHOT = { w: 1500, h: 844 } as const; // 16:9 render frames
const SHOT_B = { w: 1500, h: 843 } as const; // the beauty run, one pixel shorter
const SQ = { w: 1080, h: 1080 } as const; // square social masters
const SQ_LG = { w: 1280, h: 1280 } as const; // square simulation renders
const FILM = { w: 1800, h: 1013 } as const; // 16:9 explainer frames
const FILM_HD = { w: 1920, h: 1080 } as const; // 16:9 architectural interiors
const BOARD = { w: 1157, h: 806 } as const; // storyboard cells

/** The hero "scroll film". A short (11.6s) night-lit villa loop — ideal length
 *  for true scroll-scrub. Swap `video` to change the homepage hero footage. */
export const heroFilm: MediaAsset = {
  video: `${G}/villa-night.mp4`,
  poster: `${G}/villa-poster.jpg`,
  alt: "Southeast Media reel — night-lit villa exterior, cinematic render",
  tone: "blue",
};

/** The image-library "tower" — the scroll-driven perspective column. Drawn across
 *  disciplines on purpose: the column is the argument that one pipeline makes all
 *  of it, so no two adjacent frames come from the same vertical. */
export const towerAssets: MediaAsset[] = [
  {
    src: `${PROD}/serum-04.jpg`,
    tone: "gold",
    ratio: "wide",
    label: "Serum — caustics & sheer fabric",
    kicker: "Beauty / Product CGI",
    alt: "Product render, serum bottle behind falling sheer fabric in warm light",
  },
  {
    src: `${G}/exterior-02.jpg`,
    tone: "sky",
    ratio: "wide",
    label: "Dusk approach — tower elevation",
    kicker: "Institutional Real Estate",
    alt: "Photorealistic exterior render, tower at dusk",
  },
  {
    src: `${PROD}/fibre-07.jpg`,
    tone: "blue",
    ratio: "wide",
    label: "Signal — fibre-optic study",
    kicker: "Audio / Systems",
    alt: "Render of luminous fibre-optic strands over a ridged surface",
  },
  {
    src: `${SAAS}/creative-09.jpg`,
    tone: "violet",
    ratio: "wide",
    label: "Abstract systems — motion study",
    kicker: "SaaS / Product Film",
    alt: "Abstract render, glowing magenta arc against deep violet",
  },
  {
    src: `${PROD}/watch-05.jpg`,
    tone: "violet",
    ratio: "square",
    label: "Wearable — display treatments",
    kicker: "Product CGI",
    alt: "Product render, wearable displays lit in magenta",
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
    src: `${PROD}/horse-04.jpg`,
    tone: "blue",
    ratio: "square",
    label: "Volumetric — smoke & form",
    kicker: "VFX / Simulation",
    alt: "Volumetric simulation render, green smoke resolving into a form",
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
  // The city masterplan film, whole. The cut this used to carry was a 24s
  // excerpt at 960x400; the hero is the frame a visitor judges the studio on,
  // so it now runs the master's full 88 seconds with the letterbox cropped off
  // rather than scaled into. Poster is its own opening frame, so there is no
  // pop between the still and the first played frame.
  "real-estate": {
    src: `${G}/exterior-web-poster.jpg`,
    video: `${G}/exterior-web.mp4`,
    poster: `${G}/exterior-web-poster.jpg`,
    tone: "sky",
    ratio: "wide",
    alt: "Institutional pre-construction architectural render",
  },
  // The beauty film — the studio's most cinematic commercial piece, and the one
  // that makes the live-action division's case in the language of a finished ad.
  films: {
    src: `${PROD}/serum-poster.jpg`,
    video: `${PROD}/serum.mp4`,
    poster: `${PROD}/serum-poster.jpg`,
    tone: "gold",
    ratio: "wide",
    alt: "Cinematic product film frame — serum behind falling sheer fabric",
  },
  // X-Particles cloth and particle work, which is literally what the page sells.
  vfx: {
    src: `${PROD}/ribbon-poster.jpg`,
    video: `${PROD}/ribbon.mp4`,
    poster: `${PROD}/ribbon-poster.jpg`,
    tone: "violet",
    ratio: "wide",
    alt: "X-Particles simulation — a ribbon resolving out of drifting particles",
  },
  animation: {
    src: `${ANIM}/bugs-life-poster.jpg`,
    video: `${ANIM}/bugs-life.mp4`,
    poster: `${ANIM}/bugs-life-poster.jpg`,
    tone: "gold",
    ratio: "square",
    alt: "Character animation frame — a character at a desk in a rendered interior",
  },
  saas: {
    src: `${SAAS}/creative-poster.jpg`,
    video: `${SAAS}/creative.mp4`,
    poster: `${SAAS}/creative-poster.jpg`,
    tone: "violet",
    ratio: "wide",
    alt: "Abstract systems film frame — light tracing through deep violet",
  },
  enterprise: {
    src: `${ENT}/minimal-style-poster.jpg`,
    video: `${ENT}/minimal-style.mp4`,
    poster: `${ENT}/minimal-style-poster.jpg`,
    tone: "gold",
    ratio: "wide",
    alt: "Brand film frame — minimal motion system",
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
   SaaS & Enterprise.

   Both pages now stand on the studio's own work. The placeholders these slots
   used to carry — architectural renders standing in for software and brand
   films — are gone.

   THE SWAP CONTRACT is unchanged: to change a frame, drop the file into the
   right folder under `public/media/` and edit `src`, `video`, `w`, `h`, `alt`
   and `label` here. Nothing in `components/verticals/` needs to change — the
   layouts size themselves from `w`/`h` and caption themselves from `label`.
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

/**
 * A contact sheet, assembled from its own frames at render time.
 *
 * NOT a baked sheet JPG. Those were exported on a fixed grid, so a nine-frame
 * set on a four-column canvas shipped three empty cells and a black band as
 * part of the image — dead space no layout could remove, at print resolution.
 * The frames are held individually here and laid out live instead.
 *
 * `cols` is chosen so `frames.length` divides evenly by it at both breakpoints:
 * a contact sheet with holes in the last row reads as a broken grid, not as a
 * document. Change one and check the other.
 */
export type SheetSlot = {
  /** Stable identifier for the sheet. Used in `docs/MEDIA_SWAP_LIST.md`. */
  key: string;
  /** Caption naming what the sheet documents. */
  label: string;
  frames: MediaSlot[];
  /** Columns at desktop. Must divide `frames.length` exactly. */
  cols: 3 | 4 | 5;
};

// The shapes the film posters come in. Alternating these against the SHOT / SQ
// stills is what keeps adjacent frames from sharing a crop (Media Philosophy, §9).
const LOOP = { w: 1440, h: 810 } as const; // 16:9 poster frames
const LOOP_SQ = { w: 1080, h: 1080 } as const; // square poster frames
const WIDE = { w: 1920, h: 798 } as const; // architectural exteriors — 2.41:1

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
  /**
   * Hero demonstration panel — what goes in.
   *
   * A real storyboard cell from the hybrid-cloud explainer: a marker drawing of
   * a cloud over a fallen row of chairs. Pairing it with the finished film in
   * `heroOutputFrame` is the whole device — this is what a brief looks like when
   * it arrives, that is what leaves.
   */
  heroInputProduct: {
    key: "heroInputProduct",
    src: `${SAAS}/storyboard-01.jpg`,
    ...BOARD,
    alt: "Hand-drawn storyboard cell — a cloud above a toppled row of chairs",
    label: "Storyboard frame",
  },
  /** Hero demonstration panel — what comes out. The same project, finished. */
  heroOutputFrame: {
    key: "heroOutputFrame",
    src: `${SAAS}/hybrid-cloud-poster.jpg`,
    video: `${SAAS}/hybrid-cloud.mp4`,
    ...LOOP,
    alt: "Finished explainer film — hybrid cloud infrastructure sequence",
    label: "Master — 8K conform",
  },
  /**
   * The AI-privacy scene — the page's one deliberate dark room.
   *
   * A fibre-optic study: dark enough for the ground, and it says the literal
   * thing the section says. Data moving on infrastructure, not a stock server rack.
   */
  aiPrivacyFrame: {
    key: "aiPrivacyFrame",
    src: `${PROD}/fibre-07.jpg`,
    ...SHOT,
    alt: "Luminous fibre-optic strands carrying signal across a dark ridged plane",
    label: "On our own infrastructure",
  },
  /**
   * The eight named formats, in the order of `sections[1].items` on the SaaS
   * vertical — one frame per format card. Aspects alternate deliberately so no
   * two adjacent cards share a crop.
   */
  formatFrames: [
    {
      key: "formatLaunchFilm",
      src: `${SAAS}/creative-04.jpg`,
      ...SHOT,
      alt: "Launch film frame — light tracing across deep violet",
    },
    {
      key: "formatExplainer",
      src: `${SAAS}/infograph-02.jpg`,
      ...FILM,
      alt: "Explainer frame — figures working against a data wall",
    },
    {
      key: "formatAnimatedBRoll",
      src: `${PROD}/ribbon-03.jpg`,
      ...SHOT,
      alt: "Animated B-roll loop — particles resolving into a ribbon",
    },
    {
      key: "formatUiInContext",
      src: `${SAAS}/infograph-05.jpg`,
      ...FILM,
      alt: "Interface composited into a rendered environment",
    },
    {
      key: "formatSystemsArchitecture",
      src: `${PROD}/fibre-03.jpg`,
      ...SHOT,
      alt: "Systems visualization — signal carried along fibre",
    },
    {
      key: "formatAdCutdowns",
      src: `${SAAS}/creative-08.jpg`,
      ...SHOT,
      alt: "Paid cutdown frame — abstract motion study",
    },
    {
      // Square, because that is the actual point of the card it captions.
      key: "formatSocialVerticals",
      src: `${PROD}/watch-03.jpg`,
      ...SQ,
      alt: "Square social master — wearable product frame",
    },
    {
      key: "formatDemoEvent",
      src: `${SAAS}/infograph-01.jpg`,
      ...FILM,
      alt: "Event and booth loop frame — orbiting data forms",
    },
  ],
  /**
   * Selected work. Zipped by index with `vertical.gallery` on the SaaS page,
   * which supplies the caption and the format the slot is reserved for.
   *
   * The order is not arbitrary: the gallery splits this run into two columns by
   * even/odd index, so the aspects are sequenced to make each column alternate
   * down its own length. Keep that pattern when frames change.
   */
  galleryFrames: [
    {
      key: "galleryLaunchFilm",
      src: `${SAAS}/creative-poster.jpg`,
      video: `${SAAS}/creative.mp4`,
      ...LOOP,
      alt: "Abstract systems film — light resolving through violet",
    },
    {
      key: "galleryExplainer",
      src: `${SAAS}/infograph-03.jpg`,
      ...FILM,
      alt: "Explainer frame — dashboards assembled on a dark stage",
    },
    {
      key: "galleryAnimatedBRoll",
      src: `${SAAS}/creative-12.jpg`,
      ...SHOT,
      alt: "Feature loop frame — abstract motion study",
    },
    {
      key: "galleryUiInContext",
      src: `${SAAS}/infograph-06.jpg`,
      ...FILM,
      alt: "Interface in context — two figures working a lit data wall",
    },
    {
      key: "galleryAdCutdown",
      src: `${PROD}/fibre-09.jpg`,
      ...SHOT,
      alt: "Paid cutdown frame — fibre-optic signal study",
    },
    {
      key: "gallerySocialVertical",
      src: `${PROD}/watch-08.jpg`,
      ...SQ,
      alt: "Square social master — wearable display treatment",
    },
  ],
};

/** Enterprise page slots. */
export const enterpriseAssets: {
  marqueeRowA: MediaSlot[];
  marqueeRowB: MediaSlot[];
  segmentFrames: MediaSlot[][];
  governanceFrame: MediaSlot;
  library: MediaSlot[];
} = {
  /**
   * The two-row work marquee under the hero. Row A drifts left, row B drifts
   * right; the two rows carry different aspects on purpose so the wall never
   * reads as a uniform tile grid.
   *
   * Stills only, deliberately. Ten drifting frames is already a real decode
   * cost — the films themselves live in the segment tabs and the governance
   * frame, where one plays at a time.
   */
  marqueeRowA: [
    {
      key: "marqueeA1",
      src: `${ENT}/minimal-style-poster.jpg`,
      ...LOOP,
      alt: "Brand film frame — minimal motion system",
      label: "Minimal style — brand system",
    },
    {
      key: "marqueeA2",
      src: `${PROD}/serum-06.jpg`,
      ...SHOT_B,
      alt: "Product film frame — serum behind sheer falling fabric",
      label: "Beauty — serum film",
    },
    {
      key: "marqueeA3",
      src: `${ENT}/card-reel-poster.jpg`,
      ...LOOP,
      alt: "Product film frame — payment card in raking light",
      label: "Fintech — card reel",
    },
    {
      key: "marqueeA4",
      src: `${PROD}/watch-02.jpg`,
      ...SQ,
      alt: "Product render — wearable display treatment",
      label: "Wearable — display",
    },
    {
      key: "marqueeA5",
      src: `${PROD}/fibre-02.jpg`,
      ...SHOT,
      alt: "Fibre-optic signal study render",
      label: "Signal — fibre study",
    },
  ],
  marqueeRowB: [
    {
      key: "marqueeB1",
      src: `${ENT}/profile-poster.jpg`,
      ...LOOP,
      alt: "Social film frame — profile sequence",
      label: "Social — profile sequence",
    },
    {
      key: "marqueeB2",
      src: `${PROD}/jewellery-poster.jpg`,
      ...LOOP,
      alt: "Product film frame — jewellery in studio light",
      label: "Jewellery — product film",
    },
    {
      key: "marqueeB3",
      src: `${ENT}/pharma-brand-poster.jpg`,
      ...LOOP,
      alt: "Brand film frame — pharmaceutical sequence",
      label: "Pharma — brand film",
    },
    {
      key: "marqueeB4",
      src: `${ANIM}/character-04.jpg`,
      ...SQ,
      alt: "Character animation frame",
      label: "Character animation",
    },
    {
      key: "marqueeB5",
      src: `${SAAS}/creative-06.jpg`,
      ...SHOT,
      alt: "Abstract systems film frame",
      label: "Abstract systems",
    },
  ],
  /**
   * The buyer-segment tabs. Keys match the order of `sections[1].items` on the
   * Enterprise vertical — two frames revealed per segment. One frame in each
   * pair carries its film, so the tab plays rather than merely changing.
   */
  segmentFrames: [
    [
      {
        key: "segmentMarketingA",
        src: `${ENT}/minimal-style-comp-poster.jpg`,
        video: `${ENT}/minimal-style-comp.mp4`,
        ...LOOP,
        alt: "Brand film — minimal motion system",
        label: "Brand film",
      },
      {
        key: "segmentMarketingB",
        src: `${ENT}/profile-social-poster.jpg`,
        video: `${ENT}/profile-social.mp4`,
        ...LOOP,
        alt: "Social sequence — professional network profile, animated",
        label: "Social cadence",
      },
    ],
    [
      {
        key: "segmentAgenciesA",
        src: `${PROD}/ribbon-poster.jpg`,
        video: `${PROD}/ribbon.mp4`,
        ...LOOP,
        alt: "X-Particles simulation — a ribbon resolving out of particles",
        label: "Simulation capacity",
      },
      {
        key: "segmentAgenciesB",
        src: `${G}/exterior-04.jpg`,
        ...WIDE,
        alt: "Architectural elevation render",
        label: "White-label archviz",
      },
    ],
    [
      {
        key: "segmentProductA",
        src: `${PROD}/cell-divide-poster.jpg`,
        video: `${PROD}/cell-divide.mp4`,
        ...LOOP_SQ,
        alt: "Technical sequence — laboratory instrument, operating principle",
        label: "Operating-principle sequence",
      },
      {
        key: "segmentProductB",
        src: `${PROD}/earbuds-sheet-01.jpg`,
        w: 2400,
        h: 1803,
        alt: "Contact sheet of product renders — audio hardware, nine frames",
        label: "Full product set",
      },
    ],
    [
      {
        key: "segmentFacilitiesA",
        src: `${ENT}/pharma-brand-poster.jpg`,
        video: `${ENT}/pharma-brand.mp4`,
        ...LOOP,
        alt: "Brand film for a clinical setting",
        label: "Facility & clinical film",
      },
      {
        key: "segmentFacilitiesB",
        src: `${PROD}/watch-sheet.jpg`,
        w: 2400,
        h: 1644,
        alt: "Contact sheet of wearable renders — ten display treatments",
        label: "Video-wall content plate",
      },
    ],
  ],
  /** The AI-governance section's single wide frame. */
  governanceFrame: {
    key: "governanceFrame",
    src: `${PROD}/turbulence-poster.jpg`,
    video: `${PROD}/turbulence.mp4`,
    ...LOOP_SQ,
    alt: "Simulation running on the studio's own pipeline",
    label: "Rendered in-house, start to finish",
  },
  /**
   * Everything, on one sheet.
   *
   * The enterprise pitch is breadth — one studio that covers every discipline an
   * organisation would otherwise buy from five vendors. That claim is only worth
   * making if the range is visible in one place, so this deliberately crosses
   * every library rather than staying inside `/media/enterprise`.
   */
  library: [
    {
      key: "entBrand",
      src: `${ENT}/minimal-style-poster.jpg`,
      ...LOOP,
      alt: "Brand film frame — minimal motion system",
      label: "Brand system",
    },
    {
      key: "entBrandComp",
      src: `${ENT}/minimal-style-comp-poster.jpg`,
      ...LOOP,
      alt: "Brand film frame — composite",
      label: "Brand film",
    },
    {
      key: "entCard",
      src: `${ENT}/card-reel-poster.jpg`,
      ...LOOP,
      alt: "Payment card film frame",
      label: "Fintech reel",
    },
    {
      key: "entProfile",
      src: `${ENT}/profile-poster.jpg`,
      ...LOOP,
      alt: "Social profile sequence frame",
      label: "Social sequence",
    },
    {
      key: "entProfileSocial",
      src: `${ENT}/profile-social-poster.jpg`,
      ...LOOP,
      alt: "Professional network profile sequence frame",
      label: "Profile sequence — social cut",
    },
    {
      key: "entPharma",
      src: `${ENT}/pharma-brand-poster.jpg`,
      ...LOOP,
      alt: "Pharmaceutical brand film frame",
      label: "Clinical & pharma",
    },
    {
      key: "entSerum",
      src: `${PROD}/serum-08.jpg`,
      ...SHOT_B,
      alt: "Beauty product film frame",
      label: "Beauty",
    },
    {
      key: "entJewellery",
      src: `${PROD}/jewellery-poster.jpg`,
      ...LOOP,
      alt: "Jewellery product film frame",
      label: "Jewellery",
    },
    {
      key: "entEyewear",
      src: `${PROD}/eyewear-poster.jpg`,
      ...LOOP,
      alt: "Eyewear product film frame",
      label: "Eyewear",
    },
    {
      key: "entChain",
      src: `${PROD}/chain-poster.jpg`,
      ...LOOP,
      alt: "Chain product film frame",
      label: "Metal & light",
    },
    {
      key: "entWatch",
      src: `${PROD}/watch-07.jpg`,
      ...SQ,
      alt: "Wearable product render",
      label: "Wearable",
    },
    {
      key: "entEarbuds",
      src: `${PROD}/earbuds-key.jpg`,
      ...SHOT,
      alt: "Audio product key render",
      label: "Audio hardware",
    },
    {
      key: "entCell",
      src: `${PROD}/cell-02.jpg`,
      ...SQ,
      alt: "Technical laboratory sequence frame",
      label: "Technical & industrial",
    },
    {
      key: "entRibbon",
      src: `${PROD}/ribbon-05.jpg`,
      ...SHOT,
      alt: "Cloth and particle simulation frame",
      label: "Simulation",
    },
    {
      key: "entHorse",
      src: `${PROD}/horse-02.jpg`,
      ...SQ_LG,
      alt: "Volumetric simulation frame",
      label: "Volumetrics",
    },
    {
      key: "entCharacter",
      src: `${ANIM}/character-07.jpg`,
      ...SQ,
      alt: "Character animation frame",
      label: "Character animation",
    },
    {
      key: "entLogo",
      src: `${ANIM}/logo-poster.jpg`,
      ...LOOP,
      alt: "Logo build frame",
      label: "Brand builds",
    },
    {
      key: "entInfograph",
      src: `${SAAS}/infograph-04.jpg`,
      ...FILM,
      alt: "Explainer frame — data wall",
      label: "Explainer",
    },
    {
      key: "entCreative",
      src: `${SAAS}/creative-11.jpg`,
      ...SHOT,
      alt: "Abstract systems film frame",
      label: "Abstract systems",
    },
    {
      key: "entArch",
      src: `${G}/exterior-05.jpg`,
      ...WIDE,
      alt: "Architectural exterior render",
      label: "Architectural",
    },
    {
      key: "entArchInt",
      src: `${G}/interior-12.jpg`,
      ...FILM,
      alt: "Architectural interior render",
      label: "Interior visualization",
    },
    {
      key: "entPharmaAnat",
      src: `/media/pharma/brain.jpg`,
      w: 1600,
      h: 650,
      alt: "Anatomical brain render",
      label: "Medical",
    },
  ],
};

/* ---------------------------------------------------------------------------
   The full libraries, per discipline.

   A visitor arrives on one service page and never sees the others, so each page
   has to carry the whole of its own discipline rather than a curated six. These
   are the complete runs — every frame that came out of each project.

   Frames already used higher up a page reappear here on purpose: a contact sheet
   that skips the ones you have seen is not a contact sheet.
   --------------------------------------------------------------------------- */

/**
 * Build a numbered run of slots. Beats retyping fifteen near-identical objects.
 *
 * `alt` doubles as the hover caption in `FrameLibrary`, which is why it is a
 * readable phrase and not a filename — every tile in a contact sheet should be
 * able to say what it is without leaving the page.
 */
function frames(
  dir: string,
  prefix: string,
  count: number,
  dims: { w: number; h: number },
  alt: string,
): MediaSlot[] {
  return Array.from({ length: count }, (_, i) => i + 1).map((n) => {
    const id = String(n).padStart(2, "0");
    return {
      key: `${prefix}${id}`,
      src: `${dir}/${prefix}-${id}.jpg`,
      ...dims,
      alt: `${alt} — frame ${id}`,
      label: `${alt} · ${id}`,
    };
  });
}

/** Films — the cinematic product work. */
export const filmsAssets = {
  /** Fifteen consecutive frames from the beauty film, in cut order. */
  serumProgression: frames(
    PROD,
    "serum",
    15,
    SHOT_B,
    "Beauty film — serum, caustics and sheer fabric",
  ),
  /** Every finished film frame the vertical can show, as one sheet. */
  library: [
    ...frames(PROD, "serum", 15, SHOT_B, "Beauty film — serum"),
    {
      key: "filmJewellery",
      src: `${PROD}/jewellery-poster.jpg`,
      ...LOOP,
      alt: "Jewellery product film — studio light on metal",
    },
    {
      key: "filmEyewear",
      src: `${PROD}/eyewear-poster.jpg`,
      ...LOOP,
      alt: "Eyewear product film — frame detail",
    },
    {
      key: "filmChain",
      src: `${PROD}/chain-poster.jpg`,
      ...LOOP,
      alt: "Chain product film — metal and light",
    },
    {
      key: "filmCard",
      src: `${ENT}/card-reel-poster.jpg`,
      ...LOOP,
      alt: "Payment card film — raking light on a metal card",
    },
    {
      key: "filmProfile",
      src: `${ENT}/profile-poster.jpg`,
      ...LOOP,
      alt: "Social profile sequence — interface film",
    },
  ],
};

/* The wearable project, held once and referenced twice: the line pass feeds both
   the simulation library and the sheet, and the renders feed both the sheet and
   the sequence strip. One list per document means the two can never drift. */
const wearableLinePass = frames(PROD, "watch-sketch", 9, SQ, "Wearable line pass — pencil frame");
const wearableRenders = frames(PROD, "watch", 10, SQ, "Wearable render — display treatment");

/** VFX — the simulation library. Every sim frame the studio can show. */
export const vfxAssets: {
  library: MediaSlot[];
  wearableRenders: MediaSlot[];
  wearableSheets: SheetSlot[];
} = {
  library: [
    ...frames(PROD, "ribbon", 6, SHOT, "Cloth and particle simulation — ribbon"),
    ...frames(PROD, "cell", 7, SQ, "Technical sequence — laboratory instrument"),
    ...frames(PROD, "horse", 5, SQ_LG, "Volumetric simulation — smoke resolving into form"),
    ...frames(PROD, "sim", 3, SQ_LG, "Particle fill simulation — bottle"),
    ...frames(PROD, "fibre", 10, SHOT, "Fibre-optic signal study"),
    {
      key: "vfxTurbulence",
      src: `${PROD}/turbulence-poster.jpg`,
      ...LOOP_SQ,
      alt: "Turbulence field — X-Particles",
    },
    // The wearable line pass belongs in the library too: it is the same argument
    // the page's process makes, that geometry is settled before it is beautified.
    ...wearableLinePass,
    {
      key: "vfxWatchKey",
      src: `${PROD}/watch-key.jpg`,
      w: 1379,
      h: 1341,
      alt: "Wearable key render — hero display treatment",
    },
  ],
  /** The wearable project's ten finished display treatments, in sequence. */
  wearableRenders,
  /**
   * The line pass and the finished renders, as complete sheets.
   *
   * NOT presented as matched pairs. The pencil files carry arbitrary numeric
   * suffixes, so sketch N is not render N, and a compare slider would be
   * asserting a correspondence that does not exist. Whole documents, in sequence.
   *
   * Two sheets, not three. The old third sheet was a second export of the line
   * pass carrying the "final renders" caption, so the section claimed a
   * before/after while showing the same pencil frames twice.
   */
  wearableSheets: [
    {
      key: "wearableLinePassSheet",
      label: "Line pass — geometry and framing, before materials",
      frames: wearableLinePass,
      cols: 3, // 9 frames: 3 × 3, and 3 × 3 again at the mobile column count.
    },
    {
      key: "wearableFinalSheet",
      label: "Final renders — the same set, lit and graded",
      frames: wearableRenders,
      cols: 5, // 10 frames: 2 × 5 here, 5 × 2 on mobile. No short row either way.
    },
  ],
};

/**
 * A film in the animation page's reel theater.
 *
 * `note` is the discipline the reel demonstrates — it is what the playlist rail
 * reads, so it names the craft rather than the client (see the header note).
 */
export type ReelSlot = MediaSlot & { video: string; note: string };

/** A stage in the "how a frame gets made" ladder. */
export type LadderSlot = MediaSlot & { stage: string };

/**
 * Animation — character work, brand builds, and everything the bespoke page runs.
 *
 * THE TWELVE CHARACTER FRAMES ARE NOT A SHOT. They are twelve separate scenes
 * that share one look: the same soft key, the same matte rounded materials, the
 * same shallow depth of field. The page's set-piece says exactly that, because
 * the earlier copy ("twelve frames from one build, same rig, same set") was
 * describing a sequence these files are not. Consistency across scenes is the
 * stronger claim anyway — it is what a series or a brand system is bought for.
 */
export const animationAssets: {
  characterFrames: MediaSlot[];
  brandBuilds: MediaSlot[];
  reels: ReelSlot[];
  formatFrames: MediaSlot[];
  galleryFrames: MediaSlot[];
  anamorphic: ReelSlot[];
  aiFrame: MediaSlot;
  ladder: LadderSlot[];
} = {
  characterFrames: [
    ...frames(ANIM, "character", 11, SQ, "Character animation frame"),
    {
      key: "animShot02",
      src: `${ANIM}/shot-02.jpg`,
      ...SQ,
      alt: "Animation set — interior layout and lighting",
    },
  ],
  /** Brand builds, as posters. The films themselves run in the reel theater. */
  brandBuilds: [
    {
      key: "animLogo",
      src: `${ANIM}/logo-poster.jpg`,
      ...LOOP,
      alt: "Logo build frame",
      label: "Logo — build",
    },
    {
      key: "animLogoAlt",
      src: `${ANIM}/logo-alt-poster.jpg`,
      ...LOOP,
      alt: "Alternate logo build frame",
      label: "Logo — alternate build",
    },
    {
      key: "animLogoTrail",
      src: `${ANIM}/logo-trail-poster.jpg`,
      ...LOOP,
      alt: "Logo trail frame",
      label: "Logo — trail",
    },
    {
      key: "animArtwork",
      src: `${ANIM}/artwork-poster.jpg`,
      ...LOOP,
      alt: "Artwork reveal frame",
      label: "Artwork — reveal",
    },
  ],
  /**
   * The reel theater playlist — every moving thing this discipline can show, in
   * one player rather than a wall of simultaneous loops.
   *
   * ORDER IS THE ARGUMENT: character, then explainer, then brand build, then
   * abstract. A visitor who watches the first three has seen the whole range.
   * Only one plays at a time, which is the point — a six-tile wall of autoplaying
   * films is six decoders and no focus.
   */
  reels: [
    {
      key: "reelCharacterFilm",
      src: `${ANIM}/bugs-life-poster.jpg`,
      video: `${ANIM}/bugs-life.mp4`,
      ...SQ,
      alt: "Character animation film — a character in a rendered interior",
      label: "Character film",
      note: "Character animation",
    },
    {
      key: "reelCharacterTest",
      src: `${ANIM}/character-test-poster.jpg`,
      video: `${ANIM}/character-test.mp4`,
      ...LOOP,
      alt: "Character animation test — rig and performance pass",
      label: "Character test",
      note: "Rig & performance",
    },
    {
      key: "reelExplainer",
      src: `${SAAS}/hybrid-cloud-poster.jpg`,
      video: `${SAAS}/hybrid-cloud.mp4`,
      ...LOOP,
      alt: "Explainer film — infrastructure sequence in motion graphics",
      label: "Explainer film",
      note: "Motion graphics",
    },
    {
      key: "reelLogo",
      src: `${ANIM}/logo-poster.jpg`,
      video: `${ANIM}/logo.mp4`,
      ...LOOP,
      alt: "Logo build — a mark assembling in motion",
      label: "Logo build",
      note: "Brand animation",
    },
    {
      key: "reelLogoTrail",
      src: `${ANIM}/logo-trail-poster.jpg`,
      video: `${ANIM}/logo-trail.mp4`,
      ...LOOP,
      alt: "Logo trail — a mark drawn by a light trail",
      label: "Logo — light trail",
      note: "Brand animation",
    },
    {
      key: "reelArtwork",
      src: `${ANIM}/artwork-poster.jpg`,
      video: `${ANIM}/artwork.mp4`,
      ...LOOP,
      alt: "Artwork reveal sequence",
      label: "Artwork reveal",
      note: "Title & reveal",
    },
    {
      key: "reelAbstract",
      src: `${SAAS}/creative-poster.jpg`,
      video: `${SAAS}/creative.mp4`,
      ...LOOP,
      alt: "Abstract motion study — light resolving through deep violet",
      label: "Abstract motion",
      note: "Motion design",
    },
    {
      key: "reelBrandSystem",
      src: `${ENT}/minimal-style-poster.jpg`,
      video: `${ENT}/minimal-style.mp4`,
      ...LOOP,
      alt: "Brand film — a minimal motion system",
      label: "Brand motion system",
      note: "Brand animation",
    },
  ],
  /**
   * One frame per named format, in the order of `sections[0].items` on the
   * animation vertical. Aspects alternate deliberately — including one 3.6:1
   * strip, which is the shape an anamorphic LED plate actually is.
   */
  formatFrames: [
    {
      key: "animFormatExplainer",
      src: `${SAAS}/infograph-02.jpg`,
      ...FILM,
      alt: "Explainer frame — figures working against a lit data wall",
    },
    {
      key: "animFormatCharacter",
      src: `${ANIM}/character-05.jpg`,
      ...SQ,
      alt: "Character animation frame — a character on a turntable, soft key light",
    },
    {
      key: "animFormatBrand",
      src: `${ANIM}/logo-poster.jpg`,
      ...LOOP,
      alt: "Logo build frame — a mark mid-assembly",
    },
    {
      key: "animFormatBoard",
      src: `${SAAS}/storyboard-04.jpg`,
      ...BOARD,
      alt: "Hand-drawn storyboard cell from an explainer board",
    },
    {
      key: "animFormatAnamorphic",
      src: `${SAAS}/creative-band.jpg`,
      w: 1500,
      h: 420,
      alt: "Wide title strip — the shape of an LED plate",
    },
    {
      key: "animFormatImmersive",
      src: `${G}/interior-06.jpg`,
      ...FILM_HD,
      alt: "Interior environment render, built to be walked in real time",
    },
    {
      key: "animFormatAi",
      src: `${SAAS}/creative-09.jpg`,
      ...SHOT,
      alt: "Abstract motion study — a direction test frame",
    },
    {
      key: "animFormatSocial",
      src: `${ANIM}/character-02.jpg`,
      ...SQ,
      alt: "Square character frame — composed for social, not cropped to it",
    },
  ],
  /** Selected work. Zipped by index with `vertical.gallery` for the captions. */
  galleryFrames: [
    {
      key: "animGalleryDesk",
      src: `${ANIM}/character-09.jpg`,
      ...SQ,
      alt: "Character animation frame — workshop scene",
    },
    {
      key: "animGallerySet",
      src: `${ANIM}/shot-02.jpg`,
      ...SQ,
      alt: "Animation set — a diorama city, layout and lighting",
    },
    {
      key: "animGalleryLogoAlt",
      src: `${ANIM}/logo-alt-poster.jpg`,
      ...LOOP,
      alt: "Alternate logo build frame",
    },
    {
      key: "animGalleryExplainer",
      src: `${SAAS}/infograph-04.jpg`,
      ...FILM,
      alt: "Explainer frame — panels and spheres orbiting a lit core",
    },
    {
      key: "animGalleryCharacter",
      src: `${ANIM}/character-03.jpg`,
      ...SQ,
      alt: "Character animation frame",
    },
    {
      key: "animGalleryArtwork",
      src: `${ANIM}/artwork-poster.jpg`,
      ...LOOP,
      alt: "Artwork reveal frame",
    },
  ],
  /**
   * The two faces of the anamorphic corner. Two different builds on purpose —
   * a corner screen plays one continuous piece across both planes, and showing
   * the same file twice would read as a mirror rather than a wrap.
   */
  anamorphic: [
    {
      key: "animCornerLeft",
      src: `${ANIM}/logo-poster.jpg`,
      video: `${ANIM}/logo.mp4`,
      ...LOOP,
      alt: "Logo build running on the left plane of a corner screen",
      label: "Left plane",
      note: "Logo build",
    },
    {
      key: "animCornerRight",
      src: `${ANIM}/logo-trail-poster.jpg`,
      video: `${ANIM}/logo-trail.mp4`,
      ...LOOP,
      alt: "Light-trail build running on the right plane of a corner screen",
      label: "Right plane",
      note: "Light trail",
    },
  ],
  /**
   * The AI room's single frame.
   *
   * Deliberately a piece of finished animation, not a picture of compute. The
   * section's claim is that acceleration explores and artists finish, so the
   * frame beside it has to be something that shipped — a server-rack photograph
   * or an unrelated product simulation would illustrate the machinery and prove
   * nothing about the output.
   */
  aiFrame: {
    key: "animAiFrame",
    src: `${ANIM}/artwork-poster.jpg`,
    video: `${ANIM}/artwork.mp4`,
    ...LOOP,
    alt: "Artwork reveal sequence — a finished animated build",
    label: "Explored fast. Finished by artists.",
  },
  /**
   * How a frame gets made, as four artifacts rather than four illustrations.
   *
   * Same rule as `productionArtifacts`: every file here came off our own
   * machines. The stock "SCRIPT on a desk" photograph in `/media/process/` is
   * deliberately not among them — it is not the studio's work, so it is not
   * evidence of the studio's process.
   */
  ladder: [
    {
      key: "animLadderBoard",
      stage: "Board",
      src: `${SAAS}/storyboard-01.jpg`,
      ...BOARD,
      alt: "Hand-drawn storyboard cell — the shot, before it is built",
      label: "The shot, drawn. Cheapest place to change your mind.",
    },
    {
      key: "animLadderLayout",
      stage: "Layout & set",
      src: `${ANIM}/shot-02.jpg`,
      ...SQ,
      alt: "Animation set — a diorama city built for a character to move through",
      label: "The world the character has to move through, built.",
    },
    {
      key: "animLadderLighting",
      stage: "Look & lighting",
      src: `${PROC}/lighting.jpg`,
      w: 1200,
      h: 1398,
      alt: "Environment lighting study — a single shaft of light through a cavern",
      label: "One light, tested on one frame, before it costs anything.",
    },
    {
      key: "animLadderFinal",
      stage: "Final frame",
      src: `${ANIM}/character-07.jpg`,
      ...SQ,
      alt: "Finished character frame — a character beside a lit desk setup",
      label: "Rendered, graded, and matching the eleven frames either side of it.",
    },
  ],
};

/**
 * SaaS — the hybrid-cloud project, end to end, plus the full abstract library.
 *
 * The storyboard is the page's strongest asset: thirteen marker cells that
 * became the finished film sitting directly above them. Same project, both ends.
 */
export const saasLibrary = {
  storyboard: frames(SAAS, "storyboard", 13, BOARD, "Hybrid-cloud storyboard cell"),
  /** Thirteen frames from the abstract-systems film, in cut order. */
  creativeProgression: frames(SAAS, "creative", 13, SHOT, "Abstract systems film"),
  explainerFrames: frames(SAAS, "infograph", 6, FILM, "Explainer frame — data and dashboards"),
  /** A wide title strip from the same film. Its 3.6:1 shape makes it a divider. */
  band: {
    key: "saasBand",
    src: `${SAAS}/creative-band.jpg`,
    w: 1500,
    h: 420,
    alt: "Wide title strip from the abstract systems film",
  },
} satisfies Record<string, MediaSlot | MediaSlot[]>;

/**
 * Pharma — the deck cutouts the bespoke page's set-pieces do not already use.
 *
 * `public/media/pharma/slides/` used to hold two more of these. They were the
 * same artwork with a marketing headline baked into the frame, so they are gone
 * rather than shown; `deck/lung.jpg` was trimmed for the same reason. If a new
 * deck export lands, open it before wiring it — see [[pharma-deck-baked-text]].
 */
export const pharmaExtraFrames: MediaSlot[] = [
  {
    key: "pharmaFamily",
    src: `/media/pharma/deck/family.jpg`,
    w: 1082,
    h: 1600,
    alt: "Anatomical figures across ages and body types, standing in a row",
    label: "Body types & age range",
  },
  {
    key: "pharmaEyeSkull",
    src: `/media/pharma/deck/eye-skull.jpg`,
    w: 1525,
    h: 1601,
    alt: "Orbital anatomy — eyes seated in the skull, close cutaway",
    label: "Orbital — eye & skull",
  },
  {
    key: "pharmaLungCompare",
    src: `/media/pharma/deck/lung.jpg`,
    w: 1600,
    h: 539,
    alt: "Four lungs compared — healthy, smoker's, virus-affected and tuberculosis-affected",
    label: "Lung — disease comparison",
  },
  {
    key: "pharmaKnee",
    src: `/media/pharma/deck/knee.jpg`,
    w: 773,
    h: 1601,
    alt: "Knee joint anatomy — musculoskeletal cutaway",
    label: "Knee — musculoskeletal",
  },
  {
    key: "pharmaLeg",
    src: `/media/pharma/deck/leg.jpg`,
    w: 721,
    h: 1601,
    alt: "Leg musculature over bone, full length",
    label: "Leg — muscle over bone",
  },
  // The deck cutouts of organs the atlas above presents as slide frames. Same
  // subjects, different crop — the atlas shows one at a time behind a selector,
  // so a sheet of the isolated models is complementary rather than a repeat.
  ...(
    [
      ["heart", 1596, 1601, "Anatomical heart, isolated", "Heart"],
      ["brain", 1600, 1182, "Brain — neurological structures", "Brain"],
      ["liver", 410, 1601, "Liver — healthy through to disease", "Liver"],
      ["kidney", 1600, 1186, "Kidney and pancreas cross-section", "Kidney & pancreas"],
      ["stomach", 1545, 1601, "Stomach — abnormal tissue growth", "Stomach"],
      ["thyroid", 1600, 804, "Thyroid — healthy gland through to tumour", "Thyroid"],
      ["bronchial", 1600, 1195, "Bronchial cells — airway inflammation", "Bronchial"],
      ["cell", 1600, 1535, "Eukaryotic cell and mitochondria, cross-section", "Cellular"],
      ["fetal", 1600, 1493, "Fetal development stage", "Fetal development"],
      ["hand", 1600, 1019, "Hand muscle anatomy", "Hand"],
      ["orofacial", 1214, 1601, "Oral, dental and jaw structures", "Orofacial"],
      // The molecular section plays these as loops, so its `image` field never
      // renders — which left four of the best frames in the deck unseen.
      ["protein", 1402, 1601, "Protein structure — drug–target binding", "Protein structure"],
      ["moa-stills", 1253, 1601, "Mechanism-of-action sequence stills", "MoA — stills"],
      ["moa-pipeline", 1253, 1601, "The mechanism-of-action production pipeline", "MoA — pipeline"],
      [
        "interaction",
        1281,
        1600,
        "Molecular interaction — receptor activity",
        "Molecular interaction",
      ],
    ] as const
  ).map(([slug, w, h, alt, label]) => ({
    key: `pharmaDeck-${slug}`,
    src: `/media/pharma/deck/${slug}.jpg`,
    w,
    h,
    alt,
    label,
  })),
  // These two used to sit on the homepage reel. The reel now cycles all seven
  // disciplines rather than alternating two, so they come home to the vertical
  // they belong to instead of falling out of the site.
  {
    key: "pharmaMolecular",
    src: `/media/pharma/molecular.jpg`,
    w: 1600,
    h: 900,
    alt: "Molecular structure render",
    label: "Molecular structure",
  },
  {
    key: "pharmaTumor",
    src: `/media/pharma/tumor.jpg`,
    w: 1600,
    h: 900,
    alt: "Tumour formation in affected tissue",
    label: "Tumour formation",
  },
];

/**
 * Real estate — the complete architectural library.
 *
 * Twenty renders: every interior and exterior in `public/media/generated/`. The
 * curated six in `ARCHITECTURAL_GALLERY` are a shortlist for the work grid; this
 * is the set a developer actually wants to look through before commissioning.
 */
export const realEstateLibrary: MediaSlot[] = [
  ...Array.from({ length: 13 }, (_, i) => {
    const id = String(i + 1).padStart(2, "0");
    return {
      key: `reInterior${id}`,
      src: `${G}/interior-${id}.jpg`,
      ...FILM_HD,
      alt: `Photorealistic interior render — study ${id}`,
      label: "Interior",
    };
  }),
  ...Array.from({ length: 7 }, (_, i) => {
    const id = String(i + 1).padStart(2, "0");
    return {
      key: `reExterior${id}`,
      src: `${G}/exterior-${id}.jpg`,
      ...WIDE,
      alt: `Photorealistic architectural exterior render — elevation ${id}`,
      label: "Exterior",
    };
  }),
];

/**
 * Atmospheric stills used on the About / Who We Are page.
 *
 * Three stages of one craft rather than three finished pictures — pencil, then
 * simulation, then render. `MediaFrame` crops to a fixed box, so every source
 * here is square; feeding it a 16:9 frame would cut the sides off.
 */
export const aboutAssets: MediaAsset[] = [
  {
    src: `${PROD}/watch-sketch-04.jpg`,
    tone: "blue",
    ratio: "square",
    label: "The sketch",
    alt: "Pencil sketch pass over a wearable product render",
  },
  {
    src: `${PROD}/sim-02.jpg`,
    tone: "gold",
    ratio: "square",
    label: "The simulation",
    alt: "Particle simulation render — a bottle filling with suspended grain",
  },
  {
    src: `${PROD}/watch-06.jpg`,
    tone: "violet",
    ratio: "square",
    label: "The render",
    alt: "Finished product render — wearable displays in magenta light",
  },
];

/* ---------------------------------------------------------------------------
   The studio's own process, as artifacts.

   Not an illustrated diagram of how work gets made — the actual files from one
   audio project, in the order they were made. The argument the section makes is
   that every stage happened in this building, and the evidence is that every
   stage still exists.

   WHICH IS ALSO THE LIMIT ON WHAT CAN GO HERE. The run deliberately starts at
   the storyboard, not at the moodboard: a moodboard is collected reference by
   definition — the source sheets for this project carry competitor product
   photography, a stock watermark and another brand's marketing creative. None of
   that came off our machines, so none of it belongs under this heading. If a
   stage's artifact is not the studio's own work, leave the stage out.
   --------------------------------------------------------------------------- */

export type ProductionArtifact = MediaSlot & {
  /** The pipeline stage this file came out of. */
  stage: string;
};

export const productionArtifacts: ProductionArtifact[] = [
  {
    key: "artifactBoards",
    stage: "Storyboard",
    src: `${PROD}/earbuds-boards.jpg`,
    w: 2400,
    h: 1046,
    alt: "Storyboard strip — ten line-drawn frames of an audio product sequence",
    label: "Every shot in the film, drawn, in order.",
  },
  {
    key: "artifactLookdev",
    stage: "Look-dev",
    src: `${PROD}/fibre-05.jpg`,
    w: 1500,
    h: 844,
    alt: "Look-development render — fibre-optic strands carrying light",
    label: "Materials and light, tested on one frame.",
  },
  {
    key: "artifactKey",
    stage: "Key render",
    src: `${PROD}/earbuds-key.jpg`,
    w: 1500,
    h: 844,
    alt: "Key render — audio hardware on a mineral surface under blue light",
    label: "The frame the rest of the film is graded against.",
  },
  {
    key: "artifactSet",
    stage: "Full set",
    src: `${PROD}/earbuds-sheet-01.jpg`,
    w: 2400,
    h: 1803,
    alt: "Contact sheet — nine finished renders from an audio product film",
    label: "Nine finished frames, one look.",
  },
  {
    key: "artifactFinal",
    stage: "Final film",
    src: `${PROD}/earbuds-poster.jpg`,
    video: `${PROD}/earbuds.mp4`,
    ...LOOP,
    alt: "Finished audio product film",
    label: "Conformed, graded, delivered.",
  },
];

/**
 * The studio's two internal flow diagrams, published as-is.
 *
 * `pitching` is who touches a brief before it becomes a pitch; `workflow` is
 * what happens to it afterwards. They are working documents, not marketing
 * illustrations, which is exactly why they are worth showing.
 */
export const studioDiagrams = {
  pitching: {
    key: "diagramPitching",
    src: `${PROC}/pitching.jpg`,
    w: 2400,
    h: 1167,
    alt: "Flow diagram — client through producer, creative director, research, design, storyboard and animatic to pitch",
    label: "Brief to pitch",
  },
  workflow: {
    key: "diagramWorkflow",
    src: `${PROC}/workflow.jpg`,
    w: 2400,
    h: 1273,
    alt: "Flow diagram — idea through moodboard, storyboard, previz, animatic, asset development, rendering, compositing and sound to final",
    label: "Pitch to master",
  },
  desk: {
    key: "diagramDesk",
    src: `${PROC}/storyboard-desk.jpg`,
    w: 1080,
    h: 608,
    alt: "Storyboard sheets and a clapperboard on a desk, hand drawing a frame",
    label: "Boards",
  },
} satisfies Record<string, MediaSlot>;
