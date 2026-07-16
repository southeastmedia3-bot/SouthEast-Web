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
  graphics: {
    src: `${G}/interior-03.jpg`,
    tone: "sky",
    ratio: "wide",
    alt: "Interior design layout",
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
  { src: `${G_PHARMA}/4-organs.png`, label: "Viscera", detail: "The organs, assembled in the torso." },
  { src: `${G_PHARMA}/5-nervous.png`, label: "Nervous", detail: "The full neural network, head to foot." },
  { src: `${G_PHARMA}/6-circulatory.png`, label: "Circulatory", detail: "Arteries and veins throughout." },
  { src: `${G_PHARMA}/7-skeleton.png`, label: "Skeletal", detail: "The frame it all hangs on." },
  { src: `${G_PHARMA}/8-skeletomuscular.png`, label: "Musculoskeletal", detail: "Muscle laid over bone." },
  { src: `${G_PHARMA}/9-muscular.png`, label: "Muscular", detail: "Every muscle group." },
  { src: `${G_PHARMA}/10-full.png`, label: "Complete", detail: "The whole body — fully rigged." },
] as const;

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
