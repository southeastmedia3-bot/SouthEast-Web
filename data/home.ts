/** Homepage content. One module, so copy never hides inside components. */

export const heroContent = {
  eyebrow: "Animation · Film · Visual Effects",
  headline: "Cinematic worlds, engineered to be believed.",
  body: "A studio for the frames that cannot be wrong — medical, architectural and cinematic imagery built at physically accurate 8K, in-house and under NDA.",
  primaryCta: { label: "Start a project", href: "/contact" },
  secondaryCta: { label: "Explore our work", href: "/verticals" },
};

export const trustBar = {
  eyebrow: "Why studios and boards trust us",
  statement:
    "Southeast Media operates as your embedded visual division — under NDA, on secure servers, for institutions that cannot afford to look uncertain.",
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

/** Scene: capability grid. Hovering a card assembles its particles into a shape. */
export const capabilities = {
  eyebrow: "What we build",
  heading: "Six disciplines. One pipeline.",
  intro: "Hover a discipline — the field will show you what it makes.",
  items: [
    {
      shape: "anatomy",
      title: "Medical & Pharma",
      blurb: "Doctor-reviewed anatomy and mechanism-of-action films built to clear a review board.",
      href: "/pharma",
    },
    {
      shape: "building",
      title: "Institutional Real Estate",
      blurb: "Pre-construction visualization that secures buyers before ground is broken.",
      href: "/real-estate",
    },
    {
      shape: "camera",
      title: "Film & Production",
      blurb: "Uncompressed 8K capture, DI colour grading and finishing, end to end in-house.",
      href: "/films",
    },
    {
      shape: "vfx",
      title: "Visual Effects",
      blurb: "CG integration and compositing rendered to a zero-imperfection standard.",
      href: "/vfx",
    },
    {
      shape: "character",
      title: "Animation",
      blurb: "High-fidelity 2D and 3D motion systems, from brand idents to investor films.",
      href: "/animation",
    },
    {
      shape: "graphics",
      title: "Design & Graphics",
      blurb: "Token-driven design systems and campaign collateral at studio finish.",
      href: "/graphics",
    },
  ],
} as const;

/** Scene: the big services list. Hovering drops physics word-pills + a preview. */
export const servicesList = {
  eyebrow: "We know what we're good at",
  heading: "Pick a discipline.",
  items: [
    {
      title: "3D Animation",
      href: "/animation",
      media: "/media/generated/interior-08.jpg",
      pills: ["Character", "Rigging", "Previz", "Motion", "Rendering"],
    },
    {
      title: "Medical & Pharma",
      href: "/pharma",
      media: "/media/generated/interior-06.jpg",
      pills: ["MoA Films", "Anatomy", "Molecular", "HCP", "Review-ready"],
    },
    {
      title: "Architectural CGI",
      href: "/real-estate",
      media: "/media/generated/exterior-05.jpg",
      pills: ["Exteriors", "Interiors", "Walkthrough", "Masterplan"],
    },
    {
      title: "Film & VFX",
      href: "/vfx",
      media: "/media/generated/exterior-07.jpg",
      pills: ["Compositing", "Simulation", "DI Grade", "8K Plates"],
    },
    {
      title: "Design & Graphics",
      href: "/graphics",
      media: "/media/generated/interior-03.jpg",
      pills: ["Systems", "Key Art", "Social", "Collateral"],
    },
  ],
} as const;

/** Scene: the pinned production pipeline. */
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
      media: "/media/generated/interior-03.jpg",
    },
    {
      title: "Previz & Animatic",
      detail: "Timing, camera and blocking locked before expensive frames are committed.",
      media: "/media/generated/interior-10.jpg",
    },
    {
      title: "Modelling & Look-Dev",
      detail: "Physically based materials and assets built to survive a close-up.",
      media: "/media/generated/interior-07.jpg",
    },
    {
      title: "Lighting & Rendering",
      detail: "8K on a 15-server farm with dual 96GB VRAM nodes.",
      media: "/media/generated/exterior-05.jpg",
    },
    {
      title: "VFX & Compositing",
      detail: "CG integrated into plates until the seam is gone.",
      media: "/media/generated/exterior-07.jpg",
    },
    {
      title: "Final Delivery",
      detail: "Conformed, graded and mastered to every format you need.",
      media: "/media/generated/interior-13.jpg",
    },
  ],
} as const;

/** Scene: the film-reel cylinder. Frames wrap a rotating drum; any frame opens
 *  the verticals page. */
export const filmReel = {
  eyebrow: "The reel",
  heading: "Thirty-six frames, one drum.",
  intro: "Scroll to turn it. Pick any frame — it opens the work.",
  cta: { label: "Explore all verticals", href: "/verticals" },
  href: "/verticals",
  images: [
    "/media/generated/exterior-01.jpg",
    "/media/generated/interior-01.jpg",
    "/media/generated/exterior-02.jpg",
    "/media/generated/interior-02.jpg",
    "/media/generated/exterior-03.jpg",
    "/media/generated/interior-03.jpg",
    "/media/generated/exterior-04.jpg",
    "/media/generated/interior-04.jpg",
    "/media/generated/exterior-05.jpg",
    "/media/generated/interior-05.jpg",
    "/media/generated/exterior-06.jpg",
    "/media/generated/interior-06.jpg",
    "/media/generated/exterior-07.jpg",
    "/media/generated/interior-07.jpg",
    "/media/generated/interior-08.jpg",
    "/media/generated/interior-09.jpg",
    "/media/generated/interior-10.jpg",
    "/media/generated/interior-11.jpg",
    "/media/generated/interior-12.jpg",
    "/media/generated/interior-13.jpg",
  ],
} as const;

export const filmContent = {
  eyebrow: "The reel — in motion",
  headline: "We make the unseen cinematic.",
  sublines: ["Frame by frame, rendered to be believed."],
  body: "Scroll to move through the sequence. Every asset is built at 8K in an in-house Maya-to-Octane pipeline.",
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
      detail: "NDA-bound engagements, zero-tolerance breach policy, access-controlled servers.",
    },
    {
      label: "Infrastructure",
      detail: "100TB RAID storage, dual 96GB VRAM render nodes, a 15-server dedicated farm.",
    },
    {
      label: "Pipeline",
      detail: "Maya, 3ds Max, Blender & Octane — physically accurate 8K output, every asset.",
    },
    {
      label: "Governance",
      detail: "Milestone-based SOWs tracked in real time for total procurement visibility.",
    },
  ],
};

export const enterpriseClose = {
  eyebrow: "Q3 / Q4 Production Bandwidth Allocation",
  headline: "Secure your production slot before capacity closes.",
  cta: "Initiate Vendor Protocol",
};
