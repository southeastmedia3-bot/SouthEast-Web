/**
 * The pharma vertical, rebuilt from the source deck (Pharma PPT, 29 slides).
 *
 * Every slide's content and imagery lives here, and every media file in the
 * delivery is referenced. The page (components/pharma/*) is a view over this
 * data — copy never hides inside a component. Text is verbatim from the deck;
 * imagery is cut clean from each slide (see public/media/pharma/deck) or is one
 * of the eight animation loops.
 */

const DECK = "/media/pharma/deck";
const PH = "/media/pharma";

/** Slide 1 — the opening statement, and the credibility the deck opens on
 *  (slides 4, 6, 7). */
export const pharmaIntro = {
  eyebrow: "Medical, pharmaceutical & scientific visualization",
  title: "Medical 3D visuals that make complex healthcare clear.",
  body: "High-quality 3D renders, animation, and visual storytelling for pharma brands, hospital chains, healthcare campaigns, and medical education — built for product launches, patient awareness, doctor communication, and digital-first healthcare marketing.",
  image: `${DECK}/orbital-eyes.jpg`,
  imageAlt: "A 3D render of the eyes set within the orbital bones of the skull",
  stats: [
    { value: "10 yrs", label: "building the model library" },
    { value: "Since 2015", label: "scientifically accurate 3D" },
    { value: "MD", label: "reviewed by medical doctors" },
    { value: "Better", label: "patient & doctor engagement" },
  ],
};

/** Slide 2 — the anatomy library, laid out. */
export const pharmaLibrary = {
  eyebrow: "The library",
  title: "Human anatomy — layered, and well organized.",
  body: "A complete, reusable anatomy base built to be posed, sectioned and animated rather than illustrated once. It is the foundation every project on this page is built from.",
  image: `${DECK}/systems.jpg`,
  imageAlt: "The human body rendered as separate anatomical systems in a row",
  points: [
    "Expert-reviewed by medical doctors",
    "Complete male, female, child and pathology models",
    "High-resolution, state-of-the-art textures",
    "Fully rigged for custom poses and clinical scenarios",
  ],
};

/**
 * Slides 7 & 8 — inclusive anatomy. Two feature rows share this data; the head
 * studies (slides 4/5/6) ride along as supporting frames.
 */
export const pharmaBodyTypes = {
  eyebrow: "Body types & ethnicities",
  title: "Every patient the campaign has to reach.",
  body: "A growing range of anatomical variants representing different body types and ethnic backgrounds — inclusive, diverse and realistic. High-precision anatomy, built for better patient and doctor engagement.",
  images: [
    { src: `${DECK}/bodytypes-a.jpg`, alt: "Four realistic body-type and ethnicity variants, standing" },
    { src: `${DECK}/bodytypes-b.jpg`, alt: "A second set of diverse full-body anatomy variants" },
  ],
  studies: [
    {
      src: `${DECK}/head-cutaway.jpg`,
      alt: "Head anatomy cutaway — musculature and vasculature over the skull",
      title: "Head cutaway",
      sub: "Musculature and vasculature layered over the skull.",
    },
    {
      src: `${DECK}/head-cross.jpg`,
      alt: "Layered cross-section of the head, skin to skull",
      title: "Head cross-section",
      sub: "Every layer registered, skin through to skull.",
    },
  ],
  // The orbital & eye study, shown as the full source slide, whole.
  orbitalSlide: {
    src: "/media/pharma/slides/orbital-eye.jpg",
    alt: "Orbital and eye anatomy set within the skull — built on experience",
  },
};

/**
 * Slides 8–21 — the atlas. Organ by organ, the disease-state library.
 *
 * Each entry is one full source slide (uniform 16:9), shown whole: the slide
 * already carries its own title, description and render, so the page frames it
 * rather than re-captioning it. `name` is for the alt text only.
 */
const SLIDES = "/media/pharma/slides";

export type OrganPlate = {
  slug: string;
  name: string;
  image: string;
  /** Full-width organs carry their own title + blurb, revealed on the morph hover. */
  title?: string;
  blurb?: string;
};

export type MotionClip = {
  slug: string;
  name: string;
  note: string;
  video: string;
  poster: string;
};

export const pharmaAtlas: {
  eyebrow: string;
  title: string;
  body: string;
  plates: OrganPlate[];
  motion: { title: string; body: string; squares: MotionClip[]; wide: MotionClip };
} = {
  eyebrow: "The atlas",
  title: "Organ by organ, in medical clarity.",
  body: "A disease-state library rendered to clear a review board — healthy tissue and pathology, sectioned, labelled and shown at full plate. Every organ, whole, at the shape it was made in.",
  motion: {
    title: "The atlas in motion",
    body: "The same models, animated — the loops that play the moment they reach the screen.",
    squares: [
      { slug: "heart-cycle", name: "Heart", note: "Real cardiac dynamics, looped.", video: `${PH}/heart.mp4`, poster: `${PH}/heart-poster.jpg` },
      { slug: "heart-cross", name: "Heart — cross-section", note: "Four chambers, valves and flow.", video: `${PH}/heart-cross.mp4`, poster: `${PH}/heart-cross-poster.jpg` },
      { slug: "cardiac", name: "Cardiac cycle", note: "A single beat, held in loop.", video: `${PH}/heartbeat.mp4`, poster: `${PH}/heartbeat-poster.jpg` },
      { slug: "fetal", name: "Fetal development", note: "Prenatal stages, in sequence.", video: `${PH}/fetus.mp4`, poster: `${PH}/fetus-poster.jpg` },
    ],
    wide: { slug: "lung", name: "Lung — health to disease", note: "Healthy, smoker's, COVID-affected and tuberculosis-affected, side by side.", video: `${PH}/lung.mp4`, poster: `${PH}/lung-poster.jpg` },
  },
  plates: [
    { slug: "heart", name: "Heart anatomy", image: `${SLIDES}/heart.jpg` },
    {
      slug: "brain",
      name: "Brain anatomy",
      image: `${SLIDES}/brain-crop.jpg`,
      title: "Brain anatomy, visualized with scientific precision",
      blurb: "3D brain illustrations that present complex neurological structures with clarity, accuracy and visual impact — helping brands, hospitals and clinicians communicate more effectively.",
    },
    {
      slug: "lung",
      name: "Lung — health to disease",
      image: `${SLIDES}/lung-crop.jpg`,
      title: "Lung health, damage, infection & disease progression",
      blurb: "Healthy, smoker's, corona-affected and tuberculosis-affected lungs, side by side — disease progression rendered with clinical clarity.",
    },
    {
      slug: "liver",
      name: "Liver health",
      image: `${SLIDES}/liver.jpg`,
      title: "Visualizing liver health",
      blurb: "3D liver visuals that simplify disease progression — from a healthy liver to fatty liver and cancer-affected liver.",
    },
    { slug: "stomach", name: "Stomach cancer", image: `${SLIDES}/stomach.jpg` },
    { slug: "kidney", name: "Kidney & pancreas", image: `${SLIDES}/kidney.jpg` },
    { slug: "bronchial", name: "Bronchial inflammation", image: `${SLIDES}/bronchial.jpg` },
    { slug: "fetal", name: "Fetal development", image: `${SLIDES}/fetal.jpg` },
    { slug: "orofacial", name: "Orofacial anatomy", image: `${SLIDES}/orofacial.jpg` },
    { slug: "musculoskeletal", name: "Musculoskeletal — spine & knee", image: `${SLIDES}/musculoskeletal.jpg` },
    { slug: "hand", name: "Hand muscle anatomy", image: `${SLIDES}/hand.jpg` },
    { slug: "cell", name: "Cellular & mitochondrial anatomy", image: `${SLIDES}/cell.jpg` },
    { slug: "thyroid", name: "Thyroid — healthy to cancer", image: `${SLIDES}/thyroid.jpg` },
  ],
};

/** Slide 24 — dermatology. Pairs with the skin animation loop. */
export const pharmaSkin = {
  eyebrow: "Cosmetic & dermatology",
  title: "Skin anatomy, at premium visual impact.",
  body: "Detailed 3D skin-anatomy visualizations that help cosmetic and dermatology brands explain skin concerns, product action and treatment benefits with scientific clarity.",
  video: `${PH}/skin.mp4`,
  poster: `${PH}/skin-poster.jpg`,
  image: `${DECK}/skin.jpg`,
};

/**
 * Slides 23, 25, 26, 27, 28 — the pharma core: molecular science and Mechanism
 * of Action. Ordered as a build: protein -> MoA animation -> pipeline ->
 * structure -> interaction.
 */
export const pharmaMolecular = {
  eyebrow: "Molecular & Mechanism of Action",
  title: "Where the drug meets the biology.",
  body: "The invisible made clear — target binding, receptor activity, protein interaction, enzyme mechanisms and cellular pathway response, rendered so a pharma audience can follow the science.",
  items: [
    {
      slug: "protein",
      title: "Accurate 3D protein models",
      body: "Protein models that make mechanism of action, molecular interaction and drug-target communication clear and visually engaging.",
      video: `${PH}/moa-protein.mp4`,
      poster: `${PH}/moa-protein-poster.jpg`,
      image: `${DECK}/protein.jpg`,
    },
    {
      slug: "moa",
      title: "3D MoA animation",
      body: "Mechanism-of-action animations that show how a drug works inside the body — from target binding and receptor interaction to pathway modulation, cellular response and therapeutic impact.",
      video: `${PH}/moa2.mp4`,
      poster: `${PH}/moa2-poster.jpg`,
      image: `${DECK}/moa-stills.jpg`,
    },
    {
      slug: "pipeline",
      title: "The production pipeline",
      body: "Produced through industry-standard Cinema 4D and Octane Render workflows — crisp detailing, smooth motion and premium quality for collaterals, HCP education and scientific presentations.",
      video: `${PH}/moa-pipeline-loop.mp4`,
      poster: `${PH}/moa-pipeline-loop-poster.jpg`,
      image: `${DECK}/moa-pipeline.jpg`,
    },
    {
      slug: "structure",
      title: "Molecular structure models",
      body: "Complex scientific data as clear, striking structure models — extended into 3D-print-ready assets for exhibitions, medical conferences and activation spaces.",
      video: `${PH}/moa-structure.mp4`,
      poster: `${PH}/moa-structure-poster.jpg`,
      image: `${PH}/molecular.jpg`,
    },
    {
      slug: "interaction",
      title: "Molecular interaction",
      body: "Drug-target binding, receptor activity, protein interactions, enzyme mechanisms and cellular pathway responses — invisible biological processes made clear and engaging.",
      video: `${PH}/moa.mp4`,
      poster: `${PH}/moa-poster.jpg`,
      image: `${DECK}/interaction.jpg`,
    },
  ],
};

/** Slide 29 — the closing manifesto. */
export const pharmaClosing = {
  eyebrow: "Beyond capabilities",
  title: "Toward meaningful medical visualization.",
  body: "We don't just create medical visuals — we aim to stretch the possibilities of visualization and contribute to science through clarity, precision and storytelling.",
  image: `${DECK}/closing.jpg`,
};
