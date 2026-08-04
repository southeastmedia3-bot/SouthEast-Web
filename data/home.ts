/**
 * Homepage content. One module, so copy never hides inside components.
 *
 * The copy here is drawn from the client's Corporate Capability Deck. Figures
 * (100TB, 15 servers, 672GB VRAM across the farm, 8K, 20+ years, Bengaluru &
 * Hyderabad) are the deck's own — don't invent new ones.
 */
import { siteConfig } from "@/constants/site";

/**
 * The hero carries one line and two buttons, and shows them as a scroll beat —
 * the page opens on the reel alone. The eyebrow and the descriptive paragraph
 * that used to sit here were dropped with that change rather than left dangling:
 * the same claims are made properly by `trustBar` and the mandate scene.
 */
export const heroContent = {
  // `siteConfig.projectName`, not a copy of it. The same sentence is already the
  // studio's positioning line everywhere the site names itself — the page title,
  // the Open Graph card, the Twitter card — and the hero is where a visitor
  // reads it rather than a crawler. Two copies of a positioning line drift.
  headline: siteConfig.projectName,
  primaryCta: { label: "Start a project", href: "/contact" },
  secondaryCta: { label: "Explore our work", href: "/verticals" },
};

export const trustBar = {
  eyebrow: "The embedded media partner model",
  statement:
    "We replace the ad-hoc agency model. Southeast Media becomes your outsourced digital infrastructure partner — dedicated resource allocation, on access-controlled servers, for institutions that cannot afford to look uncertain.",
  /**
   * Rendered as physics bodies you can shove around.
   *
   * Each block names the thing, not just the unit — "enterprise render nodes",
   * not "render nodes" — because the number on its own reads as a statistic and
   * the pairing is what reads as a capability. Keep labels to 2–3 words: the
   * block is a square roughly 120px across, and a fourth word wraps to a third
   * line and starts crowding the figure above it.
   */
  blocks: [
    { value: "20+", label: "years CGI experience", tone: "blue" },
    { value: "672GB", label: "total render VRAM", tone: "sky" },
    { value: "15", label: "enterprise render nodes", tone: "violet" },
    { value: "100TB", label: "secure RAID storage", tone: "gold" },
    { value: "8K", label: "master resolution", tone: "sky" },
    { value: "0", label: "margin for error", tone: "blue" },
  ],
} as const;

/**
 * Scene: the big services list. Hovering drops physics word-pills + a preview.
 *
 * THE ORDER IS THE PRIORITY ORDER, and it is deliberate: healthcare, real
 * estate, product & SaaS, startups & enterprise, films & VFX. Films and VFX sit
 * last on purpose — they are the capability the studio sells least often as the
 * headline, and leading with them buried the two core verticals. Keep this order
 * in step with `disciplineWall` below and with the `verticals` array in
 * `data/verticals.ts`; all three are read as one running order.
 *
 * TWO ROWS ARE MERGED PAIRS. Films and VFX are one purchase (the same building
 * shoots the plate and composites it), and startups and enterprise are one
 * engagement model at two sizes. Each merged row links to the primary page of
 * its pair and its pills are drawn from both; the second page of each pair stays
 * reachable from the Services mega-menu and the footer, so nothing is orphaned.
 */
export const servicesList = {
  eyebrow: "We know what we're good at",
  heading: "Pick a discipline.",
  items: [
    {
      title: "Healthcare",
      href: "/pharma",
      media: "/media/pharma/heart-poster.jpg",
      pills: ["MoA Animation", "Anatomy", "Molecular", "Cellular", "Dermatology"],
    },
    {
      title: "Real Estate",
      href: "/real-estate",
      media: "/media/generated/exterior-05.jpg",
      pills: ["Interiors", "Exteriors", "Virtual Tours", "Walkthroughs", "VR"],
    },
    {
      title: "Product & SaaS",
      href: "/saas",
      media: "/media/saas/creative-poster.jpg",
      pills: ["Launch Films", "Explainers", "UI in Context", "Systems", "Cutdowns"],
    },
    {
      // /animation (the startup-facing explainer work) merged with /enterprise
      // (the retainer). Links to the engagement model; the animation page is one
      // click away under Video Services in the mega-menu.
      title: "Startups & Enterprise",
      href: "/enterprise",
      media: "/media/enterprise/minimal-style-poster.jpg",
      pills: ["Explainers", "AR / VR", "Retainers", "White-Label", "Governance"],
    },
    {
      // /films merged with /vfx, and last in the running order.
      title: "Films & VFX",
      href: "/films",
      media: "/media/products/serum-poster.jpg",
      pills: ["8K Capture", "DI Grade", "Compositing", "X-Particles", "Octane"],
    },
  ],
} as const;

/**
 * Scene: the pinned production pipeline.
 *
 * Every stage is a real artifact rather than a finished render standing in for
 * one — the whole point of the section is to show *how* the work is made. All
 * seven are now the studio's own stage artifacts, supplied per stage: the brief
 * document, the storyboard panels, the animatic frame, the character turnaround,
 * the lighting render, the VFX plate and the graded delivery frame.
 *
 * WITHHELD, still: the earlier source set also included a modelling still
 * carrying another artist's watermark ("© Robert Schlunze 2021", and a "Demon
 * Bust W.I.P." credit). Publishing another artist's work on a cropped-watermark
 * basis is not something to do, so it stays out.
 *
 * `w`/`h` are each file's real pixel dimensions, measured from the file, and
 * they DRIVE THE FRAME: the scene sizes each stage's box to that stage's own
 * aspect ratio, so the artifact fills its box corner to corner with no mat
 * around it (see `FRAME_SIDE` in `components/scenes/pipeline.tsx`). The set
 * spans 0.93 for the portrait storyboard up to 2.35 for the delivery frame, so a
 * wrong pair here is a visibly stretched or matted frame. Measure a replacement
 * before swapping it in.
 */
export const pipeline = {
  eyebrow: "How the work gets made",
  heading: "Our pipeline.",
  steps: [
    {
      title: "Brief & Discovery",
      detail: "Scope, stakes and success criteria, agreed under NDA before a pixel moves.",
      media: "/media/process/creative-brief.jpg",
      w: 1400,
      h: 1002,
    },
    {
      title: "Script & Storyboard",
      detail: "The argument the visuals have to make, drawn frame by frame.",
      media: "/media/process/storyboard-frames.jpg",
      w: 1200,
      h: 1294,
    },
    {
      title: "Previz & Animatic",
      detail:
        "Reallusion Character Creator and iClone into Unreal Engine — real-time previews and structural validation before expensive frames are committed.",
      media: "/media/process/previz-animatic.jpg",
      w: 639,
      h: 360,
    },
    {
      title: "Modelling & Look-Dev",
      detail: "Autodesk Maya and 3ds Max: modelling, rigging and physically based materials.",
      media: "/media/process/modelling-turnaround.jpg",
      w: 1600,
      h: 900,
    },
    {
      title: "Lighting & Rendering",
      detail: "Blender and Cinema 4D through Octane — 8K on a 15-server farm with 96GB VRAM nodes.",
      media: "/media/process/lighting-render.jpg",
      w: 1600,
      h: 682,
    },
    {
      title: "VFX & Simulation",
      detail:
        "X-Particles, Marvelous Designer, EmberGen and LiquiGen — CG integrated into plates until the seam is gone.",
      media: "/media/process/vfx-plate.jpg",
      w: 1600,
      h: 790,
    },
    {
      title: "Final Delivery",
      detail: "Conformed, Digital Intermediate graded, and mastered to every format you need.",
      media: "/media/process/final-frame.jpg",
      w: 1600,
      h: 686,
    },
  ],
} as const;

/** Scene: the film-reel cylinder. Frames wrap a rotating drum; any frame opens
 *  the verticals page. */
export const filmReel = {
  eyebrow: "The reel",
  // One frame per cell — the drum has 3 rings x 12 slots, so this array is
  // exactly 36 long and nothing repeats on it. A frame seen twice reads as a
  // thin library, which is the opposite of the point. The order cycles the six
  // work libraries (pharma, products, generated, saas, animation, enterprise)
  // and each ring starts two libraries further along, so no two frames are from
  // the same library side by side or stacked — a turn of the drum is the range
  // argument in one gesture. Count in the heading kept honest against the array.
  heading: "Thirty-six frames, one drum.",
  intro: "Scroll to turn it. Pick any frame — it opens the work.",
  cta: { label: "Explore all verticals", href: "/verticals" },
  href: "/verticals",
  images: [
    // ring 1
    "/media/pharma/heart-poster.jpg",
    "/media/products/serum-04.jpg",
    "/media/generated/exterior-01.jpg",
    "/media/saas/creative-09.jpg",
    "/media/animation/character-05.jpg",
    "/media/enterprise/card-reel-poster.jpg",
    "/media/pharma/lung-poster.jpg",
    "/media/products/watch-05.jpg",
    "/media/generated/interior-01.jpg",
    "/media/saas/infograph-02.jpg",
    "/media/animation/character-09.jpg",
    "/media/enterprise/profile-poster.jpg",
    // ring 2
    "/media/generated/exterior-02.jpg",
    "/media/saas/creative-04.jpg",
    "/media/animation/character-02.jpg",
    "/media/enterprise/minimal-style-poster.jpg",
    "/media/pharma/brain.jpg",
    "/media/products/earbuds-key.jpg",
    "/media/generated/interior-07.jpg",
    "/media/saas/storyboard-05.jpg",
    "/media/animation/character-11.jpg",
    "/media/enterprise/pharma-brand-poster.jpg",
    "/media/pharma/skin-poster.jpg",
    "/media/products/ribbon-04.jpg",
    // ring 3
    "/media/animation/artwork-poster.jpg",
    "/media/enterprise/profile-social-poster.jpg",
    "/media/pharma/protein.jpg",
    "/media/products/horse-03.jpg",
    "/media/generated/exterior-05.jpg",
    "/media/saas/infograph-05.jpg",
    "/media/animation/shot-02.jpg",
    "/media/enterprise/minimal-style-comp-poster.jpg",
    "/media/pharma/molecular.jpg",
    "/media/products/jewellery-poster.jpg",
    "/media/generated/interior-11.jpg",
    "/media/saas/creative-12.jpg",
  ],
} as const;

export const filmContent = {
  eyebrow: "The reel — in motion",
  headline: "We make the unseen cinematic.",
  sublines: ["Frame by frame, rendered to be believed."],
  body: "Scroll to move through the sequence. Every asset is built at 8K, in-house — Maya and 3ds Max, Blender, through to Cinema 4D and Octane.",
  primaryCta: { label: "View our verticals", href: "/verticals" },
  secondaryCta: { label: "Start a project", href: "/contact" },
};

/** The marquee under the film scene. Same running order as `servicesList` and
 *  `disciplineWall` — the merged pairs read as one tag each. */
export const disciplineTags = [
  "Healthcare",
  "Real Estate",
  "Product & SaaS",
  "Startups & Enterprise",
  "Films & VFX",
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
  heading: "One studio. Five disciplines.",
  intro:
    "Point at any frame. Each one opens the vertical behind it — the people, the pipeline, and the work.",
  /**
   * Five tiles, in the same running order as `servicesList` — films and VFX
   * merged into one, animation and enterprise merged into one, and the merged
   * film tile last.
   *
   * The mosaic fills a 4-column grid exactly: pharma takes a 2x2 block on the
   * left, real estate and SaaS stack beside it, and the two merged tiles form the
   * closing row. Change a `span` and check the grid still closes — a wall with a
   * hole in it is what this layout is arranged to avoid.
   */
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
      slug: "saas",
      kicker: "Product marketing",
      title: "Product & SaaS Film",
      sub: "Launch films, explainers, systems",
      href: "/saas",
      media: "/media/saas/creative-poster.jpg",
      span: "md:col-span-2 md:row-span-1",
      corner: "3.25rem",
    },
    {
      slug: "enterprise",
      kicker: "Engagement",
      title: "Startups & Enterprise",
      sub: "Explainers, immersive, embedded retainers",
      href: "/enterprise",
      media: "/media/enterprise/minimal-style-poster.jpg",
      span: "md:col-span-2 md:row-span-1",
      corner: "3.25rem",
    },
    {
      slug: "films",
      kicker: "Capability",
      title: "Films & VFX",
      sub: "Uncompressed 8K, shot and composited in-house",
      href: "/films",
      media: "/media/products/serum-poster.jpg",
      // The second and last video on this wall. Five autoplaying tiles would be
      // five concurrent decodes above the fold; two is the budget.
      video: "/media/products/serum.mp4",
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

/**
 * A card on the team rail.
 *
 * Every field is empty until the real roster lands. A member with no `name`
 * renders as a *pending* card — silhouette portrait, two blank rules where the
 * name and role will sit — so the rail can be built, scrolled and reviewed
 * before a single headshot exists. Filling `name`, `role` and dropping a
 * portrait into `/public/media/team/` turns one live; no component edits.
 *
 * Portraits are shot (or cropped) 3:4 and rendered in black and white, so the
 * rail reads as one wall of faces rather than fourteen different lighting
 * setups. Feed it the colour original — the greyscale is applied in CSS.
 */
export type TeamMember = {
  name: string;
  role: string;
  /** Path under /public. Empty string = portrait still to come. */
  photo: string;
};

/** Scene: the team rail — a dragged / arrowed carousel of the people. */
export const team: {
  eyebrow: string;
  heading: string;
  intro: string;
  members: TeamMember[];
} = {
  eyebrow: "The people",
  heading: "Our team of specialists.",
  intro:
    "Artists, animators and engineers who have spent their careers on frames that had to be right the first time.",
  // Twelve blanks. Add or remove rows freely — the rail counts them itself.
  members: [
    { name: "", role: "", photo: "" },
    { name: "", role: "", photo: "" },
    { name: "", role: "", photo: "" },
    { name: "", role: "", photo: "" },
    { name: "", role: "", photo: "" },
    { name: "", role: "", photo: "" },
    { name: "", role: "", photo: "" },
    { name: "", role: "", photo: "" },
    { name: "", role: "", photo: "" },
    { name: "", role: "", photo: "" },
    { name: "", role: "", photo: "" },
    { name: "", role: "", photo: "" },
  ],
};
