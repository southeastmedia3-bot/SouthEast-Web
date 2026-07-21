import type { MediaTone } from "@/data/media";

/**
 * Vertical content.
 *
 * SOURCE OF TRUTH: everything here is drawn from the client's own material —
 * the Corporate Capability Deck, the Pharma / Medical 3D portfolio, and the Real
 * Estate 3D-rendering web copy. Pharma, Real Estate, SaaS and Enterprise are
 * written out in depth; Films, VFX and Animation carry only what the capability
 * deck actually supports.
 *
 * Every vertical now carries real work. The claims on SaaS and Enterprise are
 * still drawn only from the capability deck (pipeline, infrastructure,
 * AI-on-own-servers, NDA + milestone SOW governance) — what changed is that the
 * imagery beside them is the studio's own, not borrowed from another vertical.
 * The Enterprise page carries forward the deck's "embedded media partner" model,
 * which used to sit on the retired Graphics page.
 *
 * TEXT BUDGET: these are services pages, and the media carries them. Prose is
 * kept to what a buyer cannot get from looking — terms, governance, sequence.
 * If a paragraph restates what the frame beside it already shows, cut it.
 *
 * NOTHING HERE IS INVENTED. The `proof` block used to be a "representative
 * engagement" with fabricated client outcomes ("a tower pre-sold from renders
 * alone", "cleared in a single review cycle"). Those were placeholders and read as
 * real engagements, so they are gone. What replaces them is verifiable: the
 * studio's own capability, infrastructure, and stated delivery terms. If a real
 * case study ever lands, it belongs here — with the client's sign-off.
 */

export type VerticalSlug =
  "pharma" | "real-estate" | "films" | "vfx" | "animation" | "saas" | "enterprise";

/** A long-form block on a vertical page. Every field is optional bar the heading,
 *  so a section can be a paragraph, a list, a pair-grid, or any mix. */
export type VerticalSection = {
  eyebrow?: string;
  heading: string;
  /** A single emphasised line under the heading. */
  lead?: string;
  /** Body paragraphs. */
  body?: string[];
  /** A plain list — use for short, scannable points. */
  bullets?: string[];
  /** A name/detail grid — use when each point needs explaining. */
  items?: { name: string; detail: string }[];
};

export type Vertical = {
  slug: VerticalSlug;
  /** Nav / short label. */
  label: string;
  /** Full page title line. */
  title: string;
  eyebrow: string;
  tone: MediaTone;
  /** One-line summary used on the overview grid. */
  summary: string;
  /** Lead paragraph on the subpage. */
  intro: string;
  /** Three hard numbers under the hero, so the page states its terms up front. */
  headline?: { value: string; label: string }[];
  capabilities: { name: string; detail: string }[];
  /** Long-form content. Only the verticals with real source material carry it. */
  sections?: VerticalSection[];
  /** The case for the discipline, stated as a contrast. Costs nothing to read and
   *  it is the one section that answers "why not just keep doing what we do". */
  contrast?: {
    heading: string;
    without: { label: string; points: string[] };
    with: { label: string; points: string[] };
  };
  /** The engagement, start to finish. Every vertical runs the studio's one
   *  pipeline; the wording is what changes. */
  process?: { step: string; detail: string }[];
  /**
   * Selected work. Each frame morphs into the mark on hover and turns over to a
   * caption card — so `title` (and optional `note`) name what the image is.
   *
   * Every vertical now stands on its own library. Captions name the craft and
   * never the client — a number of frames carry identifiable third-party
   * branding, and nothing here asserts who commissioned it.
   */
  gallery?: { src: string; title: string; note?: string }[];
  /** A wall of loops that autoplay together — "the library in motion". Every
   *  vertical bar SaaS and Enterprise carries one; those two show their films
   *  inside their own bespoke layouts instead. */
  videos?: { src: string; poster: string; label: string }[];
  /** The one line above the video wall. Required wherever `videos` is set — the
   *  wall used to hardcode pharma's wording, which was wrong on every other page. */
  videosLead?: string;
  /** Answers a buyer needs before they will call. Grounded in the source decks —
   *  do not invent a timeline or a guarantee that isn't written down. */
  faqs?: { q: string; a: string }[];
  /** The dark band near the foot of the page. Capability and terms — not a
   *  fabricated client story. */
  proof: {
    label: string;
    title: string;
    body: string;
    metrics: { value: string; label: string }[];
  };
};

/** The architectural library. Real pre-construction work — it belongs to the
 *  real-estate vertical and is no longer borrowed by anything else. */
const ARCHITECTURAL_GALLERY: NonNullable<Vertical["gallery"]> = [
  { src: "/media/generated/interior-06.jpg", title: "Interior study", note: "Material & light" },
  { src: "/media/generated/exterior-05.jpg", title: "Exterior massing", note: "Full elevation" },
  { src: "/media/generated/interior-11.jpg", title: "Stair & light well", note: "Interior detail" },
  { src: "/media/generated/exterior-02.jpg", title: "Dusk approach", note: "Tower elevation" },
  { src: "/media/generated/interior-03.jpg", title: "Living volume", note: "Daylight study" },
  { src: "/media/generated/exterior-07.jpg", title: "Night elevation", note: "Lighting pass" },
];

/**
 * The studio's one pipeline, as stated in the Corporate Capability Deck. Every
 * vertical runs it. Pharma and real estate override it with wording specific to
 * their engagement; the rest inherit it, so no vertical page is left without an
 * answer to "how does this actually work".
 */
const STUDIO_PROCESS: Vertical["process"] = [
  {
    step: "Brief, under NDA",
    detail:
      "Scope, stakes and success criteria agreed before a pixel moves. Server access is provisioned and locked to the engagement.",
  },
  {
    step: "Pre-visualization",
    detail:
      "Reallusion Character Creator and iClone into Unreal Engine — lightning-fast, high-fidelity previews and rapid structural validation.",
  },
  {
    step: "Modelling & rigging",
    detail:
      "Autodesk Maya and 3ds Max: the industry-standard core, for high-end modelling, rigging and complex animation.",
  },
  {
    step: "Look-dev & simulation",
    detail:
      "X-Particles, Marvelous Designer, EmberGen for volumetric fire and smoke, LiquiGen for fluid dynamics.",
  },
  {
    step: "Render",
    detail:
      "Blender and Cinema 4D pushed through Octane, out to 8K on a 15-server farm we own and operate on-site.",
  },
  {
    step: "Finish & delivery",
    detail:
      "Comprehensive editing suites and Digital Intermediate colour grading, mastered to every format you need.",
  },
];

export const verticalsOverview = {
  eyebrow: "Capabilities",
  title: "Seven disciplines, one pipeline.",
  intro:
    "Every vertical runs through the same in-house pipeline — Maya and 3ds Max for modelling and animation, Blender and Cinema 4D finished through Octane, rendered at 8K on our own farm. Choose the outcome; the craft underneath is constant.",
};

export const verticals: Vertical[] = [
  {
    slug: "pharma",
    label: "Pharma",
    title: "Medical, Pharmaceutical & Scientific Visualization",
    eyebrow: "Core vertical",
    tone: "blue",
    summary:
      "Physically accurate 3D for the medical device and pharmaceutical sectors — Mechanism of Action rendered to 4K–8K, under regulatory compliance and ironclad data security.",
    intro:
      "Translating advanced biology into flawless visual narratives requires an uncompromising dedication to scientific truth. We build physically accurate, complex 3D models tailored explicitly for the medical device and pharmaceutical sectors, strictly adhering to regulatory compliance and ironclad data security protocols.",
    headline: [
      { value: "10 yrs", label: "of medical 3D" },
      { value: "4K–8K", label: "MoA delivery" },
      { value: "MD", label: "reviewed anatomy" },
    ],
    capabilities: [
      {
        name: "3D Mechanism of Action Animation",
        detail:
          "How a drug works inside the body — target binding, receptor interaction, pathway modulation, cellular response and therapeutic impact.",
      },
      {
        name: "Human Anatomy Library",
        detail:
          "Layered and well organised, expert-reviewed by medical doctors. Complete male, female, child and pathology models at high-resolution texture fidelity.",
      },
      {
        name: "Anatomy Poses & Clinical Scenarios",
        detail:
          "Fully rigged models, so conditions, procedures and patient experiences can be posed and moved rather than merely illustrated.",
      },
      {
        name: "Disease-State Visualization",
        detail:
          "Progression made legible — healthy to fatty to cancer-affected liver; smoker's, COVID-affected and tuberculosis-affected lung; bronchial inflammation at cellular level.",
      },
      {
        name: "Molecular Structures & Interaction",
        detail:
          "Drug–target binding, receptor activity, protein interactions, enzyme mechanisms and pathway responses — extended into 3D-print-ready models for conferences and activations.",
      },
      {
        name: "Cellular & Sub-Cellular",
        detail:
          "Cross-sectional views of eukaryotic cells and mitochondria, explaining organelle structure and microscopic biological process with visual accuracy.",
      },
      {
        name: "Skin Anatomy for Cosmetic & Dermatology",
        detail:
          "Skin concerns, product action and treatment benefit explained with scientific clarity and premium visual impact.",
      },
      {
        name: "Body Types & Ethnicities",
        detail:
          "A growing range of anatomical variants representing different body types and ethnic backgrounds — inclusive, diverse and realistic.",
      },
    ],
    sections: [
      {
        eyebrow: "Built for accuracy",
        heading: "Trusted by experts.",
        lead: "Scientific truth is the constraint every frame is engineered against.",
        body: [
          "For ten years, our team of medical experts and 3D artists has crafted one of the most accurate and complete libraries of anatomical models for licensing. Since 2015, Southeast Media has built high-quality, scientifically accurate 3D models — trusted across industries and use cases.",
          "Our hero model is the heart: built with unmatched scientific precision and animated with real cardiac dynamics. Finally, a heart animation that reflects true physiology.",
        ],
      },
      {
        eyebrow: "What the pipelines visualize",
        heading: "Scientific demonstration, mapped end to end.",
        items: [
          {
            name: "Therapeutics & Modalities",
            detail:
              "Clear visual mapping of specific drug modalities (small molecules, antibodies, gene therapies), specific disease indications, dangerous contraindications, and unintended cellular off-target effects.",
          },
          {
            name: "Research & Clinical Stages",
            detail:
              "High-fidelity narratives tracing in vitro (cellular) to in vivo (whole organism) testing. We visualize the translational research pipeline (bench-to-bedside), observable phenotypes, trial efficacy vs. effectiveness, critical endpoints, and measurable biological biomarkers.",
          },
          {
            name: "Pathology & Cellular Dynamics",
            detail:
              "Accurate 3D animation of disease etiology (root causes), biological homeostasis adjustments, and the complex chain reactions of downstream signalling pathways.",
          },
        ],
      },
      {
        eyebrow: "The anatomy library",
        heading: "Organ by organ, system by system.",
        lead: "Every model in the library is built to be posed, sectioned and animated — not just rendered once.",
        bullets: [
          "Brain — complex neurological structures with clarity, accuracy and visual impact",
          "Heart — animated with true cardiac dynamics",
          "Liver — healthy, fatty and cancer-affected progression",
          "Lung — healthy, smoker's, COVID-affected, tuberculosis-affected",
          "Bronchial cells — airway inflammation, mucus build-up, breathing difficulty",
          "Stomach — abnormal tissue growth, tumour formation, affected regions",
          "Kidney & pancreas — cross-sections that simplify internal anatomy",
          "Thyroid — healthy gland through to tumour, fully labelled",
          "Fetal development — prenatal growth stages with medical accuracy",
          "Orofacial — oral, dental, jaw and facial structures",
          "Musculoskeletal — spine, knee, hand and leg, for injury, therapy and rehabilitation",
        ],
      },
      {
        eyebrow: "Production",
        heading: "The MoA pipeline.",
        body: [
          "Our mechanism-of-action animations are produced using industry-standard Cinema 4D and Octane Render workflows, ensuring crisp detailing, smooth motion, and premium visual quality — ideal for pharma collaterals, product communication, HCP education, and scientific presentations.",
          "We don't just create medical visuals. We aim to stretch the possibilities of visualization and contribute to science through clarity, precision, and storytelling.",
        ],
      },
    ],
    contrast: {
      heading: "What changes when the science is the constraint.",
      without: {
        label: "The usual",
        points: [
          "Stock anatomy a clinician can pick apart in the first review round.",
          "A vendor learning your science on your time, and your budget.",
          "Material moving through third-party services you cannot audit.",
          "Assets that die with the campaign that paid for them.",
        ],
      },
      with: {
        label: "With Southeast Media",
        points: [
          "An anatomy library reviewed by medical doctors — extended, not reinvented, for each project.",
          "Scientific sign-off at storyboard and again at animatic, before render cost is committed.",
          "NDA, access-controlled servers, zero tolerance on breaches. Nothing leaves the building.",
          "Rigged, reusable assets that carry into print, 3D-print, AR, VR and the next launch.",
        ],
      },
    },
    process: [
      {
        step: "Brief, under NDA",
        detail:
          "Scope, science and success criteria agreed before a pixel moves. Server access is provisioned and locked to the engagement.",
      },
      {
        step: "Script & storyboard",
        detail:
          "The argument the visuals have to make — the mechanism, the pathway, the outcome — drawn frame by frame and agreed against the science.",
      },
      {
        step: "Previz & animatic",
        detail:
          "Timing, camera and blocking locked in Unreal before any expensive frame is committed.",
      },
      {
        step: "Modelling & look-dev",
        detail:
          "Anatomy and molecular assets built in Maya and 3ds Max, drawn from the reviewed library where it already exists.",
      },
      {
        step: "Animation & render",
        detail:
          "Cinema 4D and Octane, out to 4K–8K on the in-house farm. No render work leaves the building.",
      },
      {
        step: "Review & delivery",
        detail:
          "Iterative review against scientific accuracy, then conform and master to every format the campaign needs.",
      },
    ],
    // Real medical work from the studio's pharma library. Text-free stills cut
    // from the anatomy / MoA animations, plus a clean brain render.
    gallery: [
      { src: "/media/pharma/heart-poster.jpg", title: "Heart", note: "Real cardiac dynamics" },
      { src: "/media/pharma/lung-poster.jpg", title: "Lung", note: "Disease progression" },
      { src: "/media/pharma/brain.jpg", title: "Brain", note: "Neurological structures" },
      { src: "/media/pharma/skin-poster.jpg", title: "Skin", note: "Cosmetic & dermatology" },
      {
        src: "/media/pharma/fetus-poster.jpg",
        title: "Fetal development",
        note: "Prenatal stages",
      },
      {
        src: "/media/pharma/protein.jpg",
        title: "Mechanism of Action",
        note: "Drug–target binding",
      },
    ],
    // The library in motion — these autoplay together lower on the page, beneath
    // the 66s Mechanism-of-Action film that runs as the signature.
    videosLead:
      "Not stills — animation. Rigged anatomy and mechanism-of-action sequences, built in Cinema 4D and Octane and running the way they ship.",
    videos: [
      {
        src: "/media/pharma/heart.mp4",
        poster: "/media/pharma/heart-poster.jpg",
        label: "Anatomical heart",
      },
      {
        src: "/media/pharma/lung.mp4",
        poster: "/media/pharma/lung-poster.jpg",
        label: "Lung — disease comparison",
      },
      {
        src: "/media/pharma/skin.mp4",
        poster: "/media/pharma/skin-poster.jpg",
        label: "Skin & dermatology",
      },
      {
        src: "/media/pharma/heart-cross.mp4",
        poster: "/media/pharma/heart-cross-poster.jpg",
        label: "Heart — cross-section",
      },
      {
        src: "/media/pharma/fetus.mp4",
        poster: "/media/pharma/fetus-poster.jpg",
        label: "Fetal development",
      },
      {
        src: "/media/pharma/heartbeat.mp4",
        poster: "/media/pharma/heartbeat-poster.jpg",
        label: "Cardiac cycle",
      },
      {
        src: "/media/pharma/moa2.mp4",
        poster: "/media/pharma/moa2-poster.jpg",
        label: "Molecular interaction",
      },
    ],
    faqs: [
      {
        q: "How do you guarantee scientific accuracy?",
        a: "Our anatomy library is expert-reviewed by medical doctors, and it is the base every project is built from rather than a fresh interpretation each time. Reviews are iterative and collaborative: your scientific team signs off on the storyboard before animation begins, and again on the animatic before rendering.",
      },
      {
        q: "Can you work with our compound, our data, our unpublished results?",
        a: "Yes. Engagements run under NDA on access-controlled servers, with a zero-tolerance policy on data breaches. Server access is strictly provisioned per engagement, and we do not push client material through third-party services.",
      },
      {
        q: "What resolution do you deliver?",
        a: "4K–8K. Our render farm is 15 servers on RTX 5090-class GPUs with dual enterprise NVIDIA 96GB VRAM cards, backed by a 100TB RAID array built for uncompressed 8K workflows — so 8K is the standard, not an upcharge.",
      },
      {
        q: "We already have a library of assets. Can you extend it?",
        a: "Yes. Our own library is layered and fully rigged — male, female, child and pathology models, with body-type and ethnicity variants — and it is designed to be extended rather than replaced. We can build to your existing look and hand back assets you own.",
      },
      {
        q: "Can these visuals be used beyond video?",
        a: "Yes. Molecular structures extend into 3D-print-ready models for exhibitions, medical conferences and activation spaces, and the same assets drive AR and VR experiences for product demonstration, medical training and investor showcases through our Unreal Engine pipeline.",
      },
    ],
    proof: {
      label: "The standard",
      title: "Built to satisfy a review board, not just an audience.",
      body: "Every asset is modelled against scientific fact, reviewed by medical doctors, and rendered through Cinema 4D and Octane to 4K–8K. Engagements run under NDA on access-controlled servers, with a zero-tolerance policy on data breaches — because pharmaceutical IP does not get a second chance.",
      metrics: [
        { value: "10 yrs", label: "building the anatomy library" },
        { value: "4K–8K", label: "MoA delivery resolution" },
        { value: "0", label: "tolerance for scientific error" },
      ],
    },
  },
  {
    slug: "real-estate",
    label: "Real Estate",
    title: "Premium Architectural & Real-Estate Visualization",
    eyebrow: "Core vertical",
    tone: "sky",
    summary:
      "Photorealistic 3D rendering that lets buyers, tenants and boards understand a property before it exists.",
    intro:
      "We execute elite pre-construction visualizations for institutional, commercial, and premium residential developments. Moving beyond standard renders, we target corporate boards and high-end buyers demanding absolute infrastructural accuracy and immersive pre-sales experiences.",
    headline: [
      { value: "1–2 wks", label: "typical delivery" },
      { value: "Unlimited", label: "revisions" },
      { value: "8K", label: "render output" },
    ],
    capabilities: [
      {
        name: "3D Interior Rendering",
        detail:
          "Floor plans and design concepts turned into realistic interiors — layout, furniture placement, materials, lighting, textures and colour — showing how a space will function and feel.",
      },
      {
        name: "3D Exterior Rendering",
        detail:
          "Materials, finishes, lighting conditions, landscaping and environmental context, for pre-construction marketing, investor presentations and planning approvals.",
      },
      {
        name: "Virtual Tours",
        detail:
          "Photorealistic renders assembled into an interactive walkthrough — move through interior and exterior spaces and understand scale and flow as if physically present.",
      },
      {
        name: "Cinematic Walkthroughs & Floor Plans",
        detail:
          "Dynamic floor plans, cinematic walkthroughs and feel-good films that hook an audience and drive conversion.",
      },
      {
        name: "Interactive VR",
        detail:
          "Real-time custom flat design in VR, for pre-sales experiences that let a buyer configure the space they are standing in.",
      },
      {
        name: "Custom & Commercial Projects",
        detail:
          "Retail outlets, malls, restaurants, cafés, hospitality, offices, public buildings and mixed-use developments that don't fit a standard residential template.",
      },
    ],
    sections: [
      {
        eyebrow: "Understanding 3D rendering",
        heading: "What is 3D rendering in real estate?",
        lead: "A visual way to show how a property will look before it is built, renovated, or staged.",
        body: [
          "3D rendering is the process of creating realistic visual representations of a property using advanced computer modelling. These renderings simulate real-world elements such as lighting, materials, textures, and spatial depth to create lifelike images of a space.",
          "In real estate, it is commonly used to showcase unbuilt homes, renovations, and design concepts. It allows buyers, tenants, and stakeholders to clearly understand layout, finishes, and scale before construction begins or changes are made.",
          "By turning plans and concepts into visual assets, 3D renderings reduce uncertainty, improve communication, and help people make decisions with confidence.",
        ],
      },
      {
        eyebrow: "Why real-estate teams use it",
        heading: "The benefits, plainly.",
        items: [
          {
            name: "Clear understanding of the project",
            detail:
              "A complete visual of the property, so buyers and stakeholders understand layout, scale and design intent without relying on imagination.",
          },
          {
            name: "More accurate presentations",
            detail:
              "Precise materials, lighting and proportions, so presentations feel realistic and trustworthy rather than conceptual or abstract.",
          },
          {
            name: "Stronger buyer attraction",
            detail:
              "High-quality visuals capture attention faster and appeal to a wider audience, especially for pre-construction and off-plan properties.",
          },
          {
            name: "Better market positioning",
            detail:
              "Listings with 3D renderings stand out in competitive markets and signal professionalism, clarity and preparedness.",
          },
          {
            name: "Lower costs, fewer revisions",
            detail:
              "Visual clarity early reduces misunderstandings, change requests and costly revisions later in the project lifecycle.",
          },
          {
            name: "Higher-quality marketing assets",
            detail:
              "Listing pages, brochures, pitch decks and digital campaigns lifted by consistent, premium visuals.",
          },
        ],
      },
      {
        eyebrow: "Technical rigour",
        heading: "Uncompromised realism, and how we get there.",
        body: [
          "We achieve uncompromised realism using advanced global illumination and ray-traced shadows. We prioritise highly detailed grey-shader iterations for precise mesh visualization and structural validation before any final material pass — so the geometry is right before it is beautiful.",
          "The aesthetic is a pristine, factory-finished identity: clean geometric lines, perfect symmetry, and flawless material textures like polished stone, raw concrete, and expansive glass façades.",
        ],
      },
      {
        eyebrow: "Built for real estate",
        heading: "Who this is for.",
        items: [
          {
            name: "Real-estate developers",
            detail:
              "Communicate design intent, secure approvals, attract investors, and pre-sell residential or commercial developments before construction begins.",
          },
          {
            name: "Build-to-rent companies",
            detail:
              "Visualize floor plans, interiors and amenities so buyers, renters and investors understand the final product — accelerating leasing and sales cycles.",
          },
          {
            name: "Real-estate agents",
            detail:
              "Market properties that do not yet exist. Generate qualified leads by showing future homes and renovations with visuals that convey space, layout and value.",
          },
        ],
      },
    ],
    contrast: {
      heading: "What changes when the building doesn't exist yet.",
      without: {
        label: "The usual",
        points: [
          "Waiting for construction to photograph the thing you are trying to sell.",
          "Concept art that looks like concept art, and buyers left to imagine the rest.",
          "Change requests discovered on site, at the point they are most expensive.",
          "A different look in every listing, brochure and pitch deck.",
        ],
      },
      with: {
        label: "With Southeast Media",
        points: [
          "Photorealistic renders of a property that has not been built, in one to two weeks.",
          "Materials, lighting and scale accurate enough to be trusted, not merely admired.",
          "Grey-shader validation first: the geometry is signed off before it is made beautiful.",
          "One consistent set of assets across listings, brochures, decks and campaigns.",
        ],
      },
    },
    process: [
      {
        step: "Plans & brief",
        detail:
          "Floor plans, elevations and design intent in; scope, deliverables and the audience they have to convince, agreed out.",
      },
      {
        step: "Grey-shader iteration",
        detail:
          "Highly detailed grey-shader passes for precise mesh visualization and structural validation — the geometry is signed off before it is ever made beautiful.",
      },
      {
        step: "Materials & lighting",
        detail:
          "Advanced global illumination and ray-traced shadows. Polished stone, raw concrete, expansive glass — the factory-finished identity.",
      },
      {
        step: "First drafts",
        detail:
          "Draft renders for review. This is where layout, finishes and scale get argued out — early, cheaply, on screen rather than on site.",
      },
      {
        step: "Revision",
        detail:
          "Unlimited revisions. Visual clarity now is what prevents change requests and costly revisions later in the project lifecycle.",
      },
      {
        step: "Final delivery",
        detail:
          "8K stills, cinematic walkthroughs, dynamic floor plans, virtual tours or an interactive VR build — whatever the sale actually needs.",
      },
    ],
    gallery: ARCHITECTURAL_GALLERY,
    videosLead:
      "Walkthroughs and lighting passes, moving. The same renders the stills come from, cut for the sale.",
    videos: [
      {
        src: "/media/generated/exterior-web.mp4",
        poster: "/media/generated/exterior-05.jpg",
        label: "Exterior — approach",
      },
      {
        src: "/media/generated/villa-night.mp4",
        poster: "/media/generated/villa-poster.jpg",
        label: "Night elevation — lighting pass",
      },
    ],
    faqs: [
      {
        q: "How long does a set of renders take?",
        a: "One to two weeks is typical, with unlimited revisions inside the engagement. Complex or large-scale developments are scoped individually.",
      },
      {
        q: "What do you need from us to start?",
        a: "Floor plans, elevations and any design intent you have — material boards, references, a brand look. If the design is still moving, we start with grey-shader passes so the geometry can be validated before materials are committed.",
      },
      {
        q: "Can you render a property that hasn't been designed yet?",
        a: "Yes. That is the point of the discipline: showing unbuilt, under-construction or renovated property so buyers, tenants and stakeholders understand layout, finishes and scale before construction begins or changes are made.",
      },
      {
        q: "Do you do more than still images?",
        a: "Yes. Dynamic floor plans, cinematic walkthroughs, feel-good films, virtual tours assembled from photorealistic renders, and interactive VR for real-time custom flat design — so a buyer can configure the space they are standing in.",
      },
      {
        q: "Do you work on commercial and mixed-use, not just residential?",
        a: "Yes. Retail outlets, malls, restaurants and cafés, hospitality, offices, public buildings and large-scale mixed-use developments — anything that does not fit a standard residential template.",
      },
    ],
    proof: {
      label: "How we work",
      title: "Delivered in one to two weeks, with unlimited revisions.",
      body: "Show unbuilt or under-construction properties with realistic 3D renderings that help buyers, tenants and stakeholders understand the space before it exists. Realistic materials, lighting and scale — turned around fast, and revised until it is right.",
      metrics: [
        { value: "1–2 wks", label: "typical delivery" },
        { value: "Unlimited", label: "revisions" },
        { value: "8K", label: "render output" },
      ],
    },
  },
  {
    slug: "films",
    label: "Films",
    title: "In-House Live-Action & Cinematic Production",
    eyebrow: "Capability",
    tone: "violet",
    summary:
      "A fully equipped in-house live-action division — uncompressed 8K capture, DI colour grading, end-to-end.",
    intro:
      "Complementing our CGI infrastructure is a fully equipped, in-house cinematic live-action division capable of end-to-end video production and complex compositing workflows.",
    headline: [
      { value: "8K", label: "uncompressed capture" },
      { value: "0", label: "external hand-offs" },
      { value: "DI", label: "in-house colour grade" },
    ],
    capabilities: [
      {
        name: "The Gear & Capture",
        detail:
          "State-of-the-art camera systems supporting uncompressed 8K footage capture for flawless background compositing and VFX integration, backed by high-end lighting and grip.",
      },
      {
        name: "The Network",
        detail:
          "Established connections with top-tier PR and actor coordination agencies, alongside a roster of expert Directors of Photography and cinematographers.",
      },
      {
        name: "The Deployments",
        detail:
          "Specialised execution for complex facility shoots — active hospital floors, corporate office spaces and heavy manufacturing plants.",
      },
      {
        name: "The Deliverables & Finish",
        detail:
          "Ad films, corporate podcasts, promotional reels and interviews, handled internally through comprehensive editing suites and advanced Digital Intermediate colour grading.",
      },
    ],
    process: STUDIO_PROCESS,
    // Commercial product films. Captions name the craft, never the client —
    // several frames carry third-party branding. See docs/CLIENT_ATTRIBUTION.md.
    gallery: [
      { src: "/media/products/serum-04.jpg", title: "Serum & sheer fabric", note: "Beauty" },
      { src: "/media/products/serum-12.jpg", title: "Caustics pass", note: "Lighting" },
      { src: "/media/products/jewellery-poster.jpg", title: "Jewellery", note: "Studio light" },
      {
        src: "/media/enterprise/card-reel-poster.jpg",
        title: "Card, raking light",
        note: "Fintech",
      },
      { src: "/media/products/eyewear-poster.jpg", title: "Eyewear", note: "Product film" },
      { src: "/media/products/chain-poster.jpg", title: "Chain — metal & light", note: "Detail" },
    ],
    videosLead:
      "Commercial product films, running the way they ship. Modelled, lit, simulated and graded in this building.",
    videos: [
      {
        src: "/media/products/serum.mp4",
        poster: "/media/products/serum-poster.jpg",
        label: "Beauty — serum film",
      },
      // Jewellery and chain are the same shoot and read as near-duplicates when
      // stacked, so the card reel sits between them to break the column up.
      {
        src: "/media/products/jewellery.mp4",
        poster: "/media/products/jewellery-poster.jpg",
        label: "Jewellery — product film",
      },
      {
        src: "/media/products/eyewear.mp4",
        poster: "/media/products/eyewear-poster.jpg",
        label: "Eyewear — product film",
      },
      {
        src: "/media/products/chain.mp4",
        poster: "/media/products/chain-poster.jpg",
        label: "Chain — metal & light",
      },
      {
        src: "/media/enterprise/card-reel.mp4",
        poster: "/media/enterprise/card-reel-poster.jpg",
        label: "Fintech — card reel",
      },
      {
        src: "/media/enterprise/profile.mp4",
        poster: "/media/enterprise/profile-poster.jpg",
        label: "Social — profile sequence",
      },
    ],
    proof: {
      label: "The standard",
      title: "Shot, cut and graded without leaving the building.",
      body: "The entire process is handled internally — no external hand-offs, no pipeline seams between the plate and the composite, and a Digital Intermediate grade for a flawless final picture.",
      metrics: [
        { value: "8K", label: "uncompressed capture" },
        { value: "0", label: "external hand-offs" },
        { value: "DI", label: "in-house colour grade" },
      ],
    },
  },
  {
    slug: "vfx",
    label: "VFX",
    title: "The Zero-Imperfection Rendering Pipeline",
    eyebrow: "Capability",
    tone: "violet",
    summary:
      "A multi-stage GPU pipeline built for speed and absolute physical accuracy — finished through Octane at 8K.",
    intro:
      "Our 3D department is powered by a sophisticated, multi-stage, GPU-based software workflow designed to maximise both speed and absolute physical accuracy across every discipline.",
    headline: [
      { value: "15", label: "server render farm" },
      { value: "96GB", label: "VRAM per node" },
      { value: "100TB", label: "RAID storage" },
    ],
    capabilities: [
      {
        name: "Industry-Standard Core 3D",
        detail:
          "A robust foundation of Autodesk Maya and 3ds Max for high-end modelling, rigging and complex animation workflows.",
      },
      {
        name: "Rapid Pre-Visualization",
        detail:
          "Reallusion Character Creator and iClone integrated with Unreal Engine, for lightning-fast high-fidelity previews, real-time environment building and rapid structural validation.",
      },
      {
        name: "The Final Cinematic Polish",
        detail:
          "Assets transition into Blender and Cinema 4D, pushed through the raw power of Octane Renderer for the final 8K output.",
      },
      {
        name: "Next-Gen VFX Simulation",
        detail:
          "X-Particles, Marvelous Designer, EmberGen for volumetric fire and smoke, and LiquiGen for fluid dynamics — state-of-the-art asset generation and environmental physics.",
      },
    ],
    process: STUDIO_PROCESS,
    // The simulation library — X-Particles, volumetrics and fluid work, which is
    // exactly what the capabilities above claim.
    gallery: [
      { src: "/media/products/ribbon-04.jpg", title: "Ribbon", note: "Cloth & particles" },
      { src: "/media/products/horse-03.jpg", title: "Volumetric smoke", note: "Form from field" },
      { src: "/media/products/sim-01.jpg", title: "Particle fill", note: "Fluid dynamics" },
      { src: "/media/products/fibre-06.jpg", title: "Fibre-optic signal", note: "Look-dev" },
      { src: "/media/products/cell-05.jpg", title: "Laboratory sequence", note: "Technical" },
      {
        src: "/media/products/turbulence-poster.jpg",
        title: "Turbulence field",
        note: "X-Particles",
      },
    ],
    videosLead:
      "Cloth, particles, volumetrics and fluid — the simulation work the pipeline above exists to render.",
    videos: [
      {
        src: "/media/products/ribbon.mp4",
        poster: "/media/products/ribbon-poster.jpg",
        label: "Ribbon — X-Particles",
      },
      {
        src: "/media/products/turbulence.mp4",
        poster: "/media/products/turbulence-poster.jpg",
        label: "Turbulence field",
      },
      {
        src: "/media/products/horse.mp4",
        poster: "/media/products/horse-poster.jpg",
        label: "Volumetric — smoke to form",
      },
      {
        src: "/media/products/cell-divide.mp4",
        poster: "/media/products/cell-divide-poster.jpg",
        label: "Laboratory sequence",
      },
      {
        src: "/media/products/earbuds.mp4",
        poster: "/media/products/earbuds-poster.jpg",
        label: "Product — compositing",
      },
      {
        src: "/media/saas/creative.mp4",
        poster: "/media/saas/creative-poster.jpg",
        label: "Abstract systems",
      },
    ],
    proof: {
      label: "The infrastructure",
      title: "A zero-imperfection mandate requires uncompromised compute.",
      body: "Southeast Media owns, operates and maintains its render infrastructure on-site: a 100TB RAID-configured storage array built for uncompressed 8K workflows, dual enterprise NVIDIA 96GB VRAM cards for the most demanding particle and simulation tasks, and a dedicated 15-server farm on the latest RTX 5090 and 50-series GPUs.",
      metrics: [
        { value: "96GB", label: "VRAM per enterprise node" },
        { value: "15", label: "server render farm" },
        { value: "100TB", label: "RAID storage array" },
      ],
    },
  },
  {
    slug: "animation",
    label: "Animation",
    title: "Motion Graphics, Explainers & Experiential Media",
    eyebrow: "Capability",
    tone: "gold",
    summary:
      "2D and 3D motion graphics, explainer films, and AR, VR and projection-mapped work that redefines a physical space.",
    intro:
      "Extensive expertise in 2D and 3D motion graphics, built on the complete Adobe Creative Suite with a minimalistic, character-driven design approach suited to explainer videos and rapid turnover — and extended, beyond the screen, into experiential media.",
    headline: [
      { value: "2D + 3D", label: "motion graphics" },
      { value: "AR / VR", label: "Unreal & Twinmotion" },
      { value: "In-house", label: "AI generation" },
    ],
    capabilities: [
      {
        name: "Explainer & Motion Graphics",
        detail:
          "A minimalistic, character-driven design approach built for clarity and rapid turnover, across the full Adobe Creative Suite.",
      },
      {
        name: "Anamorphic & Projection Mapping",
        detail:
          "Forced-perspective 3D anamorphic content and projection mapping for video walls, brand facilities, hospital lobbies and corporate experience centres.",
      },
      {
        name: "Immersive AR & VR",
        detail:
          "Deep Unreal Engine and Twinmotion expertise, translating pristine assets into interactive experiences for product demonstration, medical training and investor showcases.",
      },
      {
        name: "AI Acceleration",
        detail:
          "Proprietary AI video generation run on our own secure servers — Kling, Google Veo, Luma Dream Machine, Seedance, Higgsfield and Runway — for speed and iteration capacity, never at the cost of data privacy.",
      },
    ],
    process: STUDIO_PROCESS,
    // Character animation, logo builds and explainer motion graphics.
    gallery: [
      {
        src: "/media/animation/character-05.jpg",
        title: "Desk sequence",
        note: "Character animation",
      },
      { src: "/media/animation/character-09.jpg", title: "Workshop", note: "Character animation" },
      { src: "/media/animation/shot-02.jpg", title: "Interior set", note: "Layout & lighting" },
      { src: "/media/saas/infograph-04.jpg", title: "Data wall", note: "Explainer" },
      { src: "/media/animation/logo-poster.jpg", title: "Logo build", note: "Brand animation" },
      { src: "/media/saas/creative-10.jpg", title: "Abstract motion", note: "Motion graphics" },
    ],
    videosLead:
      "Character work, logo builds and explainer motion, running at full length rather than described.",
    videos: [
      {
        src: "/media/animation/bugs-life.mp4",
        poster: "/media/animation/bugs-life-poster.jpg",
        label: "Character animation",
      },
      // All three logo builds run, but the order keeps them apart: at three
      // columns this puts a different subject beside and above each one.
      {
        src: "/media/animation/logo.mp4",
        poster: "/media/animation/logo-poster.jpg",
        label: "Logo — build",
      },
      {
        src: "/media/animation/character-test.mp4",
        poster: "/media/animation/character-test-poster.jpg",
        label: "Character test",
      },
      {
        src: "/media/animation/logo-trail.mp4",
        poster: "/media/animation/logo-trail-poster.jpg",
        label: "Logo — trail",
      },
      {
        src: "/media/animation/artwork.mp4",
        poster: "/media/animation/artwork-poster.jpg",
        label: "Artwork — reveal",
      },
      {
        src: "/media/animation/logo-alt.mp4",
        poster: "/media/animation/logo-alt-poster.jpg",
        label: "Logo — alternate build",
      },
    ],
    proof: {
      label: "The standard",
      title: "Generated in-house, on our own servers.",
      body: "We conduct AI video generation tests directly on our own secure server infrastructure, to guarantee maximum computational allocation and absolute data privacy for our clients. The fastest tools available, without your material ever leaving our building.",
      metrics: [
        { value: "In-house", label: "AI generation infrastructure" },
        { value: "6+", label: "cinematic video models in rotation" },
        { value: "0", label: "client data leaving our servers" },
      ],
    },
  },
  {
    slug: "saas",
    label: "SaaS",
    title: "Send the brief. Get the launch film.",
    eyebrow: "Product marketing",
    tone: "violet",
    summary:
      "Product video for software teams — explainers, launch films, animated B-roll and paid cutdowns, produced end to end inside one studio.",
    intro:
      "Your script, your brand, your product — in. A launch-ready film, mastered to every format the campaign needs — out. Everything in between happens on one pipeline, inside one building.",
    headline: [
      { value: "8K", label: "final render output" },
      { value: "In-house", label: "AI generation servers" },
      { value: "15", label: "server render farm" },
    ],
    capabilities: [
      {
        name: "Product Explainers",
        detail:
          "What the problem costs, what the product does, why the architecture matters. Motion-graphics led, built for clarity and pace.",
      },
      {
        name: "Launch & Hero Films",
        detail: "The film at the top of the site on launch day. Modelled, lit and rendered at 8K.",
      },
      {
        name: "UI in Context",
        detail:
          "Your interface composited into rendered environments — device, desk, control room, factory floor.",
      },
      {
        name: "Animated B-Roll & Feature Loops",
        detail:
          "Short silent loops for feature pages, changelogs and in-app moments. Built as a set, from one look.",
      },
      {
        name: "Systems & Architecture Visualization",
        detail:
          "Data movement, pipelines, model behaviour, network topology — built with X-Particles, not another flat diagram.",
      },
      {
        name: "Ad Cutdowns & Paid Variants",
        detail: "Every ratio and length the channel plan needs, conformed from one master.",
      },
      {
        name: "AI-Accelerated Iteration",
        detail:
          "Kling, Veo, Luma, Seedance, Higgsfield and Runway on our own servers. Direction tests only — never shipped raw.",
      },
      {
        name: "Event, Demo & Immersive",
        detail:
          "Booth loops, anamorphic screens and interactive demos built in Unreal Engine and Twinmotion.",
      },
    ],
    sections: [
      {
        eyebrow: "One studio, every role",
        heading: "The creative squad you don't have to hire.",
        lead: "A product film needs eight jobs done. All eight sit in this building.",
        body: [
          "The usual way one gets made is a chain: an agency writes it, a freelancer boards it, a 3D shop renders it, an editor cuts it, and a colourist you have never met finishes it. Every hand-off is a place where the intent thins out.",
        ],
        items: [
          {
            name: "Concept & research",
            detail: "Which claim the film has to carry, and which one it can drop.",
          },
          {
            name: "Scriptwriter",
            detail:
              "The argument, agreed before anything is drawn. Cheapest place to change your mind.",
          },
          {
            name: "Storyboard & pre-viz",
            detail:
              "Frames, then a moving previz in Unreal. Timing and camera locked before render cost.",
          },
          {
            name: "Modeller & rigger",
            detail: "Assets built in Maya and 3ds Max, rigged to be reused for the next release.",
          },
          {
            name: "Look-dev & FX artist",
            detail: "The pass that decides whether abstract systems read as physical.",
          },
          {
            name: "Motion designer",
            detail:
              "Typography, UI motion and transitions, matched to the 3D so it reads as one film.",
          },
          {
            name: "Editor",
            detail: "Pace, structure and sound — cutdowns conformed from the master timeline.",
          },
          {
            name: "Colourist & delivery",
            detail: "Digital Intermediate grade, then every ratio the channel plan calls for.",
          },
        ],
      },
      {
        eyebrow: "Output formats",
        heading: "One production, every format the launch needs.",
        lead: "Named formats, all conformed from a single master — so the campaign cut and the site cut are genuinely the same film.",
        items: [
          {
            name: "Launch film",
            detail:
              "Carries the whole positioning. Rendered at 8K — holds on a display and a projector alike.",
          },
          {
            name: "Explainer",
            detail: "Has to survive being watched at 1.5x with the sound off. Ruthless about pace.",
          },
          {
            name: "Animated B-roll",
            detail: "Silent loops for feature pages, changelogs and release notes. Built as a set.",
          },
          {
            name: "UI in context",
            detail:
              "Your interface composited into rendered environments, on the 8K plate workflow.",
          },
          {
            name: "Systems & architecture",
            detail:
              "Data movement, pipeline behaviour, network topology — simulated, not diagrammed.",
          },
          {
            name: "Ad cutdowns",
            detail: "Pre-roll, app-store and product-page cuts, conformed from the same master.",
          },
          {
            name: "Social verticals",
            detail: "9:16 and 1:1 framed at build stage — composed, not cropped out of widescreen.",
          },
          {
            name: "Demo & event media",
            detail: "Unreal and Twinmotion builds, plus loops cut to the geometry of the screen.",
          },
        ],
      },
      {
        eyebrow: "Speed, honestly accounted for",
        heading: "AI acceleration that stays inside the building.",
        lead: "The fastest tools available, running on hardware we own, on material that never leaves the premises.",
        body: [
          "Kling, Veo, Luma, Seedance, Higgsfield and Runway run on our own secure servers. Your unreleased product, your roadmap and your demo data are never uploaded to a third-party cloud to make a mood film faster.",
          "It compresses the exploratory half of the work, and it finishes nothing. Every frame that leaves the studio is built, corrected and graded by artists.",
        ],
      },
      {
        eyebrow: "Where it earns",
        heading: "Built for the moments that decide the quarter.",
        items: [
          {
            name: "Launch",
            detail:
              "Hero film, announcement cut and social set — one look, so the launch reads as one thing.",
          },
          {
            name: "Fundraising",
            detail:
              "The parts of the architecture that have no photograph, for a high-stakes room.",
          },
          {
            name: "Sales & onboarding",
            detail: "Shortens the part of the call where someone draws the system on a whiteboard.",
          },
          {
            name: "Continuous release",
            detail:
              "Feature loops under a milestone SOW — shipping a feature is not a new video project.",
          },
        ],
      },
      // The page's one provocation, positioned to hand straight off into the
      // contrast block that answers it.
      {
        eyebrow: "The open question",
        heading: "Video-first is not the decision any more.",
        lead: "Every serious software company will ship product video this year. The only question left is who makes it — and how far your unreleased product has to travel to get made.",
        body: [
          "Ours does not travel. That is the whole argument, and what follows is what it means in practice.",
        ],
      },
    ],
    contrast: {
      heading: "What changes when the product is the thing being sold.",
      without: {
        label: "The usual",
        points: [
          "Prompts, screen recordings and unreleased builds pushed into third-party cloud tools to move faster.",
          "Template output that looks like every other product video generated the same week.",
          "A vendor chain where nobody owns the final picture, and the grade is the fifth person's guess.",
          "A launch film and a paid cutdown that plainly came from two different productions.",
        ],
      },
      with: {
        label: "With Southeast Media",
        points: [
          "AI generation on servers we own and operate on-site — nothing about your product leaves the building.",
          "Acceleration used for exploration only; every shipped frame is finished by artists on the industry pipeline.",
          "One studio from script to Digital Intermediate grade, accountable for the final picture.",
          "Every format mastered from one conform, under NDA and a milestone-based SOW.",
        ],
      },
    },
    process: [
      {
        step: "Brief, under NDA",
        detail:
          "The claim the film has to land, agreed first. Server access locked to the engagement.",
      },
      {
        step: "Script & storyboard",
        detail: "Drawn frame by frame — including what is shown literally and what is visualized.",
      },
      {
        step: "Previz & direction tests",
        detail:
          "Timing and camera locked in Unreal. Alternate treatments explored in hours, on our servers.",
      },
      {
        step: "Build & look-dev",
        detail:
          "Maya and 3ds Max; simulation through X-Particles, Marvelous Designer, EmberGen, LiquiGen.",
      },
      {
        step: "Render",
        detail: "Cinema 4D through Octane, out to 8K on the 15-server farm we own on-site.",
      },
      {
        step: "Conform, grade & versioning",
        detail: "Digital Intermediate grade in-house, then every ratio the launch plan calls for.",
      },
    ],
    // Captions only. The frames themselves resolve through `saasAssets.galleryFrames`
    // and are zipped to these by index, so changing a picture never touches what
    // the page says about it. `note` is the output format the slot demonstrates.
    gallery: [
      {
        src: "/media/saas/creative-poster.jpg",
        title: "Abstract systems film",
        note: "Launch film",
      },
      { src: "/media/saas/infograph-03.jpg", title: "Dashboards, assembled", note: "Explainer" },
      { src: "/media/saas/creative-12.jpg", title: "Motion study", note: "Animated B-roll" },
      {
        src: "/media/saas/infograph-06.jpg",
        title: "Interface, in the room",
        note: "UI in context",
      },
      { src: "/media/products/fibre-09.jpg", title: "Signal study", note: "Ad cutdown" },
      { src: "/media/products/watch-08.jpg", title: "Square master", note: "Social vertical" },
    ],
    faqs: [
      {
        q: "How fast can you turn a product film around?",
        a: "It depends on how much has to be built. Explainers reusing an established look are fastest; a hero film with new modelling, simulation and an 8K render is not. We scope it against milestones in the SOW rather than quote a number we would have to caveat.",
      },
      {
        q: "What do you need from us to start?",
        a: "The product — a demo account or a build we can look at — plus whatever positioning material exists. If the messaging is not settled, we start with script and storyboard so it gets settled on paper rather than in render.",
      },
      {
        q: "Our product is unreleased. How is our material handled?",
        a: "Under NDA, on access-controlled servers provisioned per project. We do not push client material through third-party services — including for AI generation, which is exactly why that runs on our own infrastructure.",
      },
      {
        q: "Do you use AI, and does it end up in the final video?",
        a: "We use it, and no. It runs on our own servers for direction tests and iteration speed. Everything delivered is built and finished by artists on the Maya, Cinema 4D and Octane pipeline, then graded in our own suite.",
      },
      {
        q: "How do revisions work?",
        a: "Agreed at the milestone level in the SOW, sequenced so the expensive decisions happen cheaply: script, then storyboard, then previz, each signed off before the next begins.",
      },
      {
        q: "What formats do you deliver?",
        a: "Whatever the channel plan needs, mastered from one conform — web hero, app-store and product-page cuts, pre-roll lengths, vertical and square social, event loops. Rendered at up to 8K, so downscaled masters stay clean.",
      },
      {
        q: "Can you keep producing after launch?",
        a: "Yes, and it is the model we prefer for software. Ongoing production runs as a milestone-based SOW with dedicated resource allocation, so a new feature becomes another asset in an existing library.",
      },
    ],
    proof: {
      label: "The terms",
      title: "Your unreleased product never leaves our servers.",
      body: "AI video generation runs directly on our own secure infrastructure, guaranteeing maximum computational allocation and absolute data privacy. Every frame that ships is finished by artists through Maya, Cinema 4D and Octane, rendered at up to 8K on a 15-server farm we own and operate on-site — under NDA, on access-controlled servers, tracked against a milestone-based SOW.",
      metrics: [
        { value: "In-house", label: "AI generation infrastructure" },
        { value: "8K", label: "final render output" },
        { value: "0", label: "client data leaving our servers" },
      ],
    },
  },
  {
    slug: "enterprise",
    label: "Enterprise",
    title: "The Embedded Media Partner Model",
    eyebrow: "Engagement",
    tone: "gold",
    summary:
      "A senior production department without the headcount — one accountable studio, one secured building, milestone-based terms for brands, agencies and product teams.",
    intro:
      "A full-stack visual production studio — CGI, VFX, live action and motion — operating as the outsourced media division for brands, agencies and product teams. Show a product, a building or a procedure before it is built, photographed or launched, and keep showing it every quarter without an internal hire.",
    headline: [
      { value: "15", label: "server render farm" },
      { value: "100TB", label: "RAID storage array" },
      { value: "NDA", label: "on every engagement" },
    ],
    capabilities: [
      {
        name: "Dedicated Resource Allocation",
        detail:
          "Server bandwidth and artist time reserved against your engagement — the difference between a vendor and a department.",
      },
      {
        name: "For Brand Facilities & Hospitals",
        detail:
          "Executive and testimonial video, corporate podcasts, and video-wall setups designed, installed and refreshed with the content that runs on them.",
      },
      {
        name: "For Consumer Products",
        detail:
          "From the website hero launch film to a continuous stream of content for social cadence.",
      },
      {
        name: "For Agencies & White-Label Capacity",
        detail:
          "Senior 3D, VFX and render capacity behind your name — as overflow, or as the permanent back end.",
      },
      {
        name: "For Startups",
        detail:
          "Abstract ideas visualized for investor rooms, product explainers, and a daily social presence.",
      },
      {
        name: "In-House Live Action",
        detail:
          "Uncompressed 8K capture with lighting and grip, and specialised execution for complex facility shoots.",
      },
      {
        name: "Governance & Project Management",
        detail:
          "Milestone-based SOWs, every deliverable tracked in Zoho Projects — real-time procurement visibility.",
      },
      {
        name: "Data Security by Architecture",
        detail:
          "NDA on every engagement, provisioned server access, AI on our own infrastructure only.",
      },
    ],
    sections: [
      // Trust signal first. This section occupies the position a reference site
      // gives its client-logo wall — we have no logos to drop, so the proof is
      // hardware we own. Figures render as the `name` so they read as a stat band.
      {
        eyebrow: "Infrastructure",
        heading: "We prove capacity instead of dropping names.",
        lead: "Enterprise buyers are buying certainty. This is what ours is made of.",
        body: [
          "We own, operate and maintain the production infrastructure on-site. That is why a delivery date is a commitment rather than a hope — no third-party queue sits between us and your deadline.",
        ],
        items: [
          {
            name: "15 servers",
            detail: "In-house render farm on the latest RTX 5090 and 50-series GPUs.",
          },
          {
            name: "96GB VRAM",
            detail: "Dual enterprise NVIDIA cards, for the heaviest particle and simulation work.",
          },
          {
            name: "100TB RAID",
            detail: "A storage array built for uncompressed 8K, on-site and access-controlled.",
          },
          {
            name: "8K capture",
            detail: "Uncompressed camera systems, with lighting and grip in-house.",
          },
          {
            name: "Full 3D pipeline",
            detail:
              "Maya, 3ds Max, Unreal, Blender and Cinema 4D through Octane — on our own machines.",
          },
          {
            name: "In-house finish",
            detail:
              "Editing suites and Digital Intermediate grading under the same roof as the farm.",
          },
        ],
      },
      {
        eyebrow: "Who this is built for",
        heading: "Four ways enterprises use us.",
        lead: "The common thread is capacity that behaves like an internal team and contracts like a vendor.",
        items: [
          {
            name: "Marketing & brand teams",
            detail:
              "A permanent content requirement without a permanent hire. Launch films, executive video, campaign cutdowns, social cadence and event media — one SOW instead of five procurement cycles.",
          },
          {
            name: "Agencies & white-label capacity",
            detail:
              "You keep the client and the creative direction; we supply the pipeline, the farm and the artists. Archviz, product CGI, animation and 8K finishing, delivered as your studio.",
          },
          {
            name: "Product & industrial teams",
            detail:
              "The inside of a product shown accurately, from CAD: cutaways, exploded assemblies, operating-principle sequences, service walkthroughs, trade-show loops.",
          },
          {
            name: "Brand facilities & hospitals",
            detail:
              "Premises run as media surfaces. Video walls specified, installed and refreshed, plus the content that plays on them — physical and digital managed as one contract.",
          },
        ],
      },
      // AI is broken out of the engagement section deliberately. On the SaaS page
      // the AI argument is speed; here it is quality and governance, which is what
      // an enterprise procurement board is actually assessing.
      {
        eyebrow: "The AI operating model",
        heading: "AI-accelerated, artist-finished, and never off our servers.",
        lead: "The tools are only an advantage if the governance around them survives a procurement review.",
        body: [
          "AI video generation — Kling, Veo, Luma, Seedance, Higgsfield and Runway — runs directly on our own secure servers. That costs us hardware and buys you two things: maximum computational allocation, and the certainty that your material never reaches a platform we do not operate.",
          "The model is human-led. Generation widens the field of options before a sign-off gate; nothing generated is a deliverable.",
        ],
        items: [
          {
            name: "Where it runs",
            detail:
              "On our own servers, inside the same access-controlled environment as the farm.",
          },
          {
            name: "What it is used for",
            detail: "Direction tests and iteration during previz, before render cost is committed.",
          },
          {
            name: "What it never does",
            detail:
              "Ship. Delivered work is modelled, rendered through Octane and graded by artists.",
          },
          {
            name: "Why it matters to you",
            detail: "No client material crosses into a third-party cloud, at any stage.",
          },
        ],
      },
      {
        eyebrow: "How working together works",
        heading: "The engagement, stated in full.",
        lead: "Ready to start without hiring, chasing freelancers, or managing a vendor chain? This is what you get instead.",
        body: [
          "We operate via structured corporate retainers and milestone-based Statements of Work. The SOW is what makes the relationship legible to a procurement board: scope, milestones, deliverables and dependencies written down before work starts, and tracked in Zoho Projects in real time.",
        ],
        bullets: [
          "A standing senior team, not a roster assembled per project",
          "One accountable studio from brief to Digital Intermediate grade",
          "Milestone-based SOWs, tracked in Zoho Projects and reportable to procurement",
          "NDA executed and server access provisioned before anything is shared",
        ],
        items: [
          {
            name: "Scoping",
            detail:
              "Volume and cadence assessed against the pipeline, written as named milestones.",
          },
          {
            name: "Allocation",
            detail:
              "Server bandwidth and artist capacity reserved, so your work does not compete with the book.",
          },
          {
            name: "Visibility",
            detail:
              "Every deliverable tracked in Zoho Projects — reportable without a status call.",
          },
          {
            name: "Review cadence",
            detail:
              "Gates at script, previz and pre-render — expensive decisions made while still cheap.",
          },
        ],
      },
    ],
    contrast: {
      heading: "What changes when one studio owns the whole thing.",
      without: {
        label: "The usual",
        points: [
          "A vendor chain — agency, freelancer, render shop, editor — with nobody accountable for the final picture.",
          "Project assets scattered across freelancer machines, with IP handling nobody has actually read.",
          "Render capacity rented from a third party, so your deadline sits in someone else's queue.",
          "A new procurement cycle every time the marketing calendar produces another asset.",
        ],
      },
      with: {
        label: "With Southeast Media",
        points: [
          "One accountable studio from brief to Digital Intermediate grade, on one contract.",
          "NDA on every engagement, access-controlled servers, and a zero-tolerance policy on data breaches.",
          "A 15-server farm we own and operate on-site, with capacity allocated to your engagement.",
          "Milestone-based SOWs tracked in Zoho Projects — visible to procurement without a status call.",
        ],
      },
    },
    process: [
      {
        step: "Requirement & NDA",
        detail:
          "Terms agreed first. NDA executed and server access locked before anything is shared.",
      },
      {
        step: "Scoping & SOW",
        detail:
          "Scope, deliverables and sign-off gates, written for a procurement board rather than a handshake.",
      },
      {
        step: "Allocation",
        detail: "Server bandwidth and artist capacity reserved against the engagement.",
      },
      {
        step: "Production",
        detail:
          "One pipeline — previz in Unreal, build in Maya, render through Octane at 8K, live action in-house.",
      },
      {
        step: "Review & reporting",
        detail: "Gates at script, previz and pre-render, tracked in Zoho Projects throughout.",
      },
      {
        step: "Delivery & continuity",
        detail: "Conform, grade and master — then the next milestone, on the same allocation.",
      },
    ],
    // No `gallery` here on purpose. The Enterprise page shows its work in the
    // two-row marquee under the hero and inside the buyer-segment tabs, both of
    // which resolve through `enterpriseAssets` — a second grid would be the same
    // frames a third time.
    faqs: [
      {
        q: "What does an engagement actually look like?",
        a: "A structured corporate retainer or a milestone-based Statement of Work. The SOW names scope, milestones, deliverables and sign-off gates before work begins, and progress is tracked in Zoho Projects — so procurement can see the programme without asking for a status call.",
      },
      {
        q: "Can you create visuals before the thing is built, photographed or launched?",
        a: "That is the core of the discipline. Buildings before construction, products before tooling, procedures that cannot be filmed. Where a real shoot is the right answer, the in-house live-action division handles that too — so the decision is made on merit rather than on what a vendor happens to own.",
      },
      {
        q: "What do you need from us to start?",
        a: "An executed NDA, then the material the work is built from: brand guidelines, CAD or engineering reference, plans, product photography, any script already agreed. Working files are fine. Beyond that, a picture of volume over the coming quarters — that is what turns a project into an allocation.",
      },
      {
        q: "How quickly can a project start?",
        a: "It depends on current allocation, and we would rather give you the real date than a marketing one. Scoping can move immediately; production starts when capacity is reserved. Because the farm and the artists are ours, that date is something we control rather than forward on to you.",
      },
      {
        q: "How do you keep quality consistent across a year of output?",
        a: "Consistency is an asset-library problem before it is a taste problem. Models, rigs, materials and grade settings are built to be reused rather than remade, so the twelfth asset comes off the same look as the first.",
      },
      {
        q: "How is confidentiality and IP handled?",
        a: "NDA on every engagement, server access provisioned per project, zero tolerance on breaches. Work stays on infrastructure we own on-site; we do not route client material through third-party services at any stage — including AI generation.",
      },
      {
        q: "Why not just rent render capacity, or hire freelancers?",
        a: "Both work until a deadline is real. We own the farm on-site — 15 servers on RTX 5090-class GPUs, dual 96GB VRAM cards, a 100TB RAID array — so your delivery date does not sit in a third party's queue, and your assets do not live on machines outside the building.",
      },
    ],
    proof: {
      label: "Governance & security",
      title: "Structured retainers, access-controlled servers, ironclad NDA.",
      body: "Southeast Media operates exclusively via structured corporate retainers and milestone-based SOW allocations, ensuring dedicated server bandwidth for proprietary client IP. Server access is strictly controlled, and we maintain an uncompromising zero-tolerance policy for data breaches.",
      metrics: [
        { value: "NDA", label: "on every engagement" },
        { value: "SOW", label: "milestone-based allocation" },
        { value: "0", label: "tolerance for data breaches" },
      ],
    },
  },
];

export function getVertical(slug: string): Vertical | undefined {
  return verticals.find((v) => v.slug === slug);
}
