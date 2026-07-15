/**
 * Homepage content. One module, so copy never hides inside components.
 *
 * The copy here is drawn from the client's Corporate Capability Deck. Figures
 * (100TB, 15 servers, 96GB VRAM, 8K, 20+ years, Bengaluru & Hyderabad) are the
 * deck's own — don't invent new ones.
 */

export const heroContent = {
  eyebrow: "Elite digital infrastructure & immersive studio",
  headline: "Cinematic worlds, engineered to be believed.",
  body: "An elite digital infrastructure studio in Bengaluru and Hyderabad, translating Mechanism of Action data and high-stakes structural concepts into pristine 8K cinematic assets — in-house, and under NDA.",
  primaryCta: { label: "Start a project", href: "/contact" },
  secondaryCta: { label: "Explore our work", href: "/verticals" },
};

export const trustBar = {
  eyebrow: "The embedded media partner model",
  statement:
    "We replace the ad-hoc agency model. Southeast Media becomes your outsourced digital infrastructure partner — dedicated resource allocation, on access-controlled servers, for institutions that cannot afford to look uncertain.",
  /** Rendered as physics bodies you can shove around. Keep labels to 2–3 words. */
  blocks: [
    { value: "20+", label: "years of CGI", tone: "blue" },
    { value: "100TB", label: "secure storage", tone: "sky" },
    { value: "15", label: "render nodes", tone: "violet" },
    { value: "8K", label: "max resolution", tone: "gold" },
    { value: "96GB", label: "VRAM per node", tone: "sky" },
    { value: "0", label: "margin for error", tone: "blue" },
  ],
} as const;

/** Scene: the big services list. Hovering drops physics word-pills + a preview. */
export const servicesList = {
  eyebrow: "We know what we're good at",
  heading: "Pick a discipline.",
  items: [
    {
      title: "Medical & Pharma",
      href: "/pharma",
      media: "/media/pharma/heart-poster.jpg",
      pills: ["MoA Animation", "Anatomy", "Molecular", "Cellular", "Dermatology"],
    },
    {
      title: "Architectural CGI",
      href: "/real-estate",
      media: "/media/generated/exterior-05.jpg",
      pills: ["Interiors", "Exteriors", "Virtual Tours", "Walkthroughs", "VR"],
    },
    {
      title: "Film & Production",
      href: "/films",
      media: "/media/generated/exterior-07.jpg",
      pills: ["8K Capture", "DI Grade", "Ad Films", "Podcasts"],
    },
    {
      title: "VFX & Rendering",
      href: "/vfx",
      media: "/media/generated/interior-08.jpg",
      pills: ["Compositing", "X-Particles", "EmberGen", "LiquiGen", "Octane"],
    },
    {
      title: "Motion & Immersive",
      href: "/animation",
      media: "/media/generated/interior-03.jpg",
      pills: ["Explainers", "Anamorphic", "AR / VR", "Projection"],
    },
  ],
} as const;

/**
 * Scene: the pinned production pipeline.
 *
 * Two stages use real process imagery from the client's `ext` set (script,
 * lighting) instead of finished renders — the whole point of this section is to
 * show *how* the work is made, not the output.
 *
 * WITHHELD: the set also included an animatic and a modelling still, but both
 * arrived carrying other artists' watermarks ("© Robert Schlunze 2021" and a
 * "Demon Bust W.I.P." credit). Publishing another artist's work on a client's
 * production site is not something to do on a cropped-watermark basis, so those
 * two stay on generated stand-ins until the client confirms they are licensed or
 * supplies the studio's own captures (a real Maya viewport, a real grey-shader
 * pass). `script` and `lighting` carry no such attribution and are used here.
 */
export const pipeline = {
  eyebrow: "How the work gets made",
  heading: "Our pipeline.",
  steps: [
    {
      title: "Brief & Discovery",
      detail: "Scope, stakes and success criteria, agreed under NDA before a pixel moves.",
      media: "/media/generated/interior-01.jpg",
    },
    {
      title: "Script & Storyboard",
      detail: "The argument the visuals have to make, drawn frame by frame.",
      media: "/media/process/script.jpg",
    },
    {
      title: "Previz & Animatic",
      detail:
        "Reallusion Character Creator and iClone into Unreal Engine — real-time previews and structural validation before expensive frames are committed.",
      media: "/media/generated/interior-10.jpg",
    },
    {
      title: "Modelling & Look-Dev",
      detail: "Autodesk Maya and 3ds Max: modelling, rigging and physically based materials.",
      media: "/media/generated/interior-07.jpg",
    },
    {
      title: "Lighting & Rendering",
      detail:
        "Blender and Cinema 4D through Octane — 8K on a 15-server farm with 96GB VRAM nodes.",
      media: "/media/process/lighting.jpg",
    },
    {
      title: "VFX & Simulation",
      detail:
        "X-Particles, Marvelous Designer, EmberGen and LiquiGen — CG integrated into plates until the seam is gone.",
      media: "/media/generated/exterior-07.jpg",
    },
    {
      title: "Final Delivery",
      detail: "Conformed, Digital Intermediate graded, and mastered to every format you need.",
      media: "/media/generated/interior-13.jpg",
    },
  ],
} as const;

/** Scene: the film-reel cylinder. Frames wrap a rotating drum; any frame opens
 *  the verticals page. */
export const filmReel = {
  eyebrow: "The reel",
  // Count kept honest against the array below — it used to read "thirty-six" over
  // twenty frames. Now it is medical and architectural work interleaved, so the
  // drum reads as one studio across disciplines rather than one vertical.
  heading: "Twenty-four frames, one drum.",
  intro: "Scroll to turn it. Pick any frame — it opens the work.",
  cta: { label: "Explore all verticals", href: "/verticals" },
  href: "/verticals",
  images: [
    "/media/pharma/heart-poster.jpg",
    "/media/generated/exterior-01.jpg",
    "/media/pharma/lung-poster.jpg",
    "/media/generated/interior-01.jpg",
    "/media/pharma/brain.jpg",
    "/media/generated/exterior-02.jpg",
    "/media/pharma/skin-poster.jpg",
    "/media/generated/interior-03.jpg",
    "/media/pharma/molecular.jpg",
    "/media/generated/exterior-03.jpg",
    "/media/pharma/fetus-poster.jpg",
    "/media/generated/interior-05.jpg",
    "/media/pharma/protein.jpg",
    "/media/generated/exterior-05.jpg",
    "/media/pharma/heart-cross-poster.jpg",
    "/media/generated/interior-07.jpg",
    "/media/pharma/tumor.jpg",
    "/media/generated/exterior-07.jpg",
    "/media/generated/interior-09.jpg",
    "/media/generated/interior-10.jpg",
    "/media/generated/exterior-04.jpg",
    "/media/generated/interior-11.jpg",
    "/media/generated/exterior-06.jpg",
    "/media/generated/interior-13.jpg",
  ],
} as const;

export const filmContent = {
  eyebrow: "The reel — in motion",
  headline: "We make the unseen cinematic.",
  sublines: ["Frame by frame, rendered to be believed."],
  body: "Scroll to move through the sequence. Every asset is built at 8K, in-house — Maya and 3ds Max through to Octane.",
  primaryCta: { label: "View our verticals", href: "/verticals" },
  secondaryCta: { label: "Start a project", href: "/contact" },
};

export const disciplineTags = [
  "Medical & Pharma",
  "Institutional Real Estate",
  "Film & VFX",
  "Startup / Incubator",
  "Product & E-Commerce",
  "Animation Systems",
  "Design & Graphics",
];

export const mandate = {
  statement:
    "A zero-imperfection mandate, backed by ironclad data security and NDA-driven governance.",
  pillars: [
    {
      label: "Security",
      detail:
        "NDA-bound engagements on access-controlled servers, with a zero-tolerance policy on data breaches.",
    },
    {
      label: "Infrastructure",
      detail:
        "A 100TB RAID storage array, dual enterprise NVIDIA 96GB VRAM cards, and a 15-server farm on RTX 5090s.",
    },
    {
      label: "Pipeline",
      detail:
        "Maya and 3ds Max into Blender and Cinema 4D, finished through Octane — physically accurate 8K, every asset.",
    },
    {
      label: "Governance",
      detail:
        "Milestone-based Statements of Work, tracked in Zoho Projects for real-time procurement visibility.",
    },
  ],
};

/**
 * Scene 05 — the discipline mosaic. A wall of frames; point at one and the frame
 * morphs into the shape of the mark and turns over to show what it is.
 *
 * `span` drives the mosaic on a 4-column grid. `corner` is the radius of the
 * logo silhouette for that tile — it has to scale with the tile or the shape
 * stops reading as the mark.
 */
export const disciplineWall = {
  eyebrow: "05 — Every discipline",
  heading: "One studio. Six disciplines.",
  intro:
    "Point at any frame. Each one opens the vertical behind it — the people, the pipeline, and the work.",
  tiles: [
    {
      slug: "pharma",
      kicker: "Core vertical",
      title: "Medical & Pharmaceutical",
      sub: "Mechanism of Action, anatomy, molecular",
      href: "/pharma",
      media: "/media/pharma/heart-poster.jpg",
      // The biggest slot on the homepage plays the beating anatomical heart.
      video: "/media/pharma/heart.mp4",
      span: "md:col-span-2 md:row-span-2",
      corner: "6rem",
    },
    {
      slug: "real-estate",
      kicker: "Core vertical",
      title: "Architectural CGI",
      sub: "Pre-construction visualization",
      href: "/real-estate",
      media: "/media/generated/exterior-05.jpg",
      span: "md:col-span-2 md:row-span-1",
      corner: "3.25rem",
    },
    {
      slug: "films",
      kicker: "Capability",
      title: "Film & Production",
      sub: "Uncompressed 8K, in-house",
      href: "/films",
      media: "/media/generated/exterior-07.jpg",
      span: "md:col-span-1 md:row-span-1",
      corner: "3.25rem",
    },
    {
      slug: "vfx",
      kicker: "Capability",
      title: "VFX & Rendering",
      sub: "The zero-imperfection pipeline",
      href: "/vfx",
      media: "/media/generated/interior-11.jpg",
      span: "md:col-span-1 md:row-span-1",
      corner: "3.25rem",
    },
    {
      slug: "animation",
      kicker: "Capability",
      title: "Motion & Immersive",
      sub: "Explainers, anamorphic, AR / VR",
      href: "/animation",
      media: "/media/generated/interior-03.jpg",
      span: "md:col-span-2 md:row-span-1",
      corner: "3.25rem",
    },
    {
      slug: "graphics",
      kicker: "Engagement",
      title: "The Embedded Partner",
      sub: "Your outsourced media division",
      href: "/graphics",
      media: "/media/generated/exterior-02.jpg",
      span: "md:col-span-2 md:row-span-1",
      corner: "3.25rem",
    },
  ],
} as const;

export const enterpriseClose = {
  eyebrow: "Q3 / Q4 Production Bandwidth Allocation",
  headline: "Secure your production slot before capacity closes.",
  cta: "Initiate Vendor Protocol",
};
