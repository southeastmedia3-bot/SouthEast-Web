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
    src: `${G}/interior-06.jpg`,
    tone: "blue",
    ratio: "wide",
    alt: "Architectural interior visualization",
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
