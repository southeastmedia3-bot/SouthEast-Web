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
  image: `${DECK}/family.jpg`,
  imageAlt: "A family of realistic full-body anatomy models — male, female, child",
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
    { src: `${DECK}/head-cutaway.jpg`, alt: "Head anatomy cutaway — musculature and vasculature over the skull" },
    { src: `${DECK}/head-cross.jpg`, alt: "Layered cross-section of the head, skin to skull" },
    { src: `${DECK}/eye-skull.jpg`, alt: "Eye anatomy set within the orbital bone of the skull" },
  ],
};

/**
 * Slides 9–22 — the atlas. Organ by organ, the disease-state library.
 * `video` marks the ones with an animation loop; those are featured. The rest
 * render as a specimen grid. Every slide's subject and copy is here.
 */
export type Organ = {
  slug: string;
  name: string;
  detail: string;
  image: string;
  video?: string;
  poster?: string;
  /** For the multi-state disease slides. */
  states?: string[];
};

export const pharmaAtlas: { eyebrow: string; title: string; body: string; featured: Organ[]; grid: Organ[] } = {
  eyebrow: "The atlas",
  title: "Organ by organ, in medical clarity.",
  body: "A disease-state library rendered to clear a review board — healthy tissue and pathology, sectioned, labelled and animated. Point at the animated studies; scan the rest.",
  featured: [
    {
      slug: "heart",
      name: "Heart",
      detail:
        "Our hero model — built with unmatched scientific precision and animated with real cardiac dynamics. Finally, a heart animation that reflects true physiology.",
      video: `${PH}/heart.mp4`,
      poster: `${PH}/heart-poster.jpg`,
      image: `${DECK}/heart.jpg`,
    },
    {
      slug: "lung",
      name: "Lung — health to disease",
      detail:
        "Lung health, damage, infection and disease progression, side by side: healthy, smoker's, COVID-affected and tuberculosis-affected.",
      video: `${PH}/lung.mp4`,
      poster: `${PH}/lung-poster.jpg`,
      image: `${DECK}/lung.jpg`,
      states: ["Healthy", "Smoker's", "COVID-affected", "Tuberculosis-affected"],
    },
    {
      slug: "fetal",
      name: "Fetal development",
      detail:
        "3D fetal-development visuals that clearly show prenatal growth stages with medical accuracy and visual clarity.",
      video: `${PH}/fetus.mp4`,
      poster: `${PH}/fetus-poster.jpg`,
      image: `${DECK}/fetal.jpg`,
    },
  ],
  grid: [
    {
      slug: "brain",
      name: "Brain",
      detail:
        "3D brain illustrations that present complex neurological structures with clarity, accuracy and visual impact.",
      image: `${DECK}/brain.jpg`,
    },
    {
      slug: "liver",
      name: "Liver",
      detail:
        "Disease progression simplified — healthy liver, to fatty liver, to cancer-affected liver.",
      image: `${DECK}/liver.jpg`,
    },
    {
      slug: "bronchial",
      name: "Bronchial inflammation",
      detail:
        "Airway inflammation, mucus build-up and breathing difficulty, revealed at a cellular level.",
      image: `${DECK}/bronchial.jpg`,
    },
    {
      slug: "stomach",
      name: "Stomach cancer",
      detail:
        "Abnormal tissue growth, tumour formation and affected regions within the stomach.",
      image: `${DECK}/stomach.jpg`,
    },
    {
      slug: "kidney",
      name: "Kidney & pancreas",
      detail:
        "Cross-section visuals that simplify internal anatomy and disease understanding.",
      image: `${DECK}/kidney.jpg`,
    },
    {
      slug: "orofacial",
      name: "Orofacial",
      detail: "Oral, dental, jaw and facial structures, simplified with medical clarity.",
      image: `${DECK}/orofacial.jpg`,
    },
    {
      slug: "musculoskeletal",
      name: "Musculoskeletal",
      detail:
        "Spine and knee — vertebrae, discs, cartilage, ligaments and joint movement, for injury, pain and therapy.",
      image: `${DECK}/knee.jpg`,
    },
    {
      slug: "hand",
      name: "Hand",
      detail: "Detailed muscle structure, tendon connections and functional movement of the hand.",
      image: `${DECK}/hand.jpg`,
    },
    {
      slug: "leg",
      name: "Leg",
      detail:
        "Highly detailed leg-muscle visuals for injury, treatment, movement and rehabilitation.",
      image: `${DECK}/leg.jpg`,
    },
    {
      slug: "cell",
      name: "Cell & mitochondria",
      detail:
        "Cross-sectional views of eukaryotic cells and mitochondria — organelle structure and microscopic biological processes.",
      image: `${DECK}/cell.jpg`,
    },
    {
      slug: "thyroid",
      name: "Thyroid",
      detail: "Healthy thyroid through to thyroid cancer — gland, lobes and tumour, fully labelled.",
      image: `${DECK}/thyroid.jpg`,
    },
    {
      slug: "heart-cross",
      name: "Heart — cross-section",
      detail: "The four chambers sectioned, valves and flow made visible.",
      video: `${PH}/heart-cross.mp4`,
      poster: `${PH}/heart-cross-poster.jpg`,
      image: `${PH}/heart-cross-poster.jpg`,
    },
    {
      slug: "cardiac-cycle",
      name: "Cardiac cycle",
      detail: "A single beat, looped — the hero model in real cardiac motion.",
      video: `${PH}/heartbeat.mp4`,
      poster: `${PH}/heartbeat-poster.jpg`,
      image: `${PH}/heartbeat-poster.jpg`,
    },
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
      image: `${DECK}/moa-pipeline.jpg`,
    },
    {
      slug: "structure",
      title: "Molecular structure models",
      body: "Complex scientific data as clear, striking structure models — extended into 3D-print-ready assets for exhibitions, medical conferences and activation spaces.",
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
