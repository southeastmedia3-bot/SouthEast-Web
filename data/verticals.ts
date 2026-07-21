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
 * SaaS and Enterprise are positioning pages, not portfolio pages: the studio has
 * no published client work in either, so every line on them is drawn from the
 * capability deck (pipeline, infrastructure, AI-on-own-servers, NDA + milestone
 * SOW governance) and nothing else. The Enterprise page carries forward the deck's
 * "embedded media partner" model, which used to sit on the retired Graphics page.
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
   * PLACEHOLDER MEDIA: the four verticals without a real library still stand on
   * the architectural renders, at the client's instruction, with generic
   * captions. Pharma and real estate carry their own.
   */
  gallery?: { src: string; title: string; note?: string }[];
  /** A wall of animation loops that autoplay together — "the library in motion".
   *  Only pharma has a video library today. */
  videos?: { src: string; poster: string; label: string }[];
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

/** Stand-in imagery. See the note on `Vertical.gallery`. */
const PLACEHOLDER_GALLERY: NonNullable<Vertical["gallery"]> = [
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
    gallery: PLACEHOLDER_GALLERY,
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
    gallery: PLACEHOLDER_GALLERY,
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
    gallery: PLACEHOLDER_GALLERY,
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
    gallery: PLACEHOLDER_GALLERY,
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
      "Your script, your brand, your product — in. A launch-ready film, mastered to every format the campaign needs — out. Everything in between happens on one pipeline inside one building, and nothing about your product is uploaded anywhere to make it happen. Software is invisible by nature; making it worth watching is the entire job.",
    headline: [
      { value: "8K", label: "final render output" },
      { value: "In-house", label: "AI generation servers" },
      { value: "15", label: "server render farm" },
    ],
    capabilities: [
      {
        name: "Product Explainers",
        detail:
          "The minimalistic, character-driven motion approach applied to software: what the problem costs, what the product does, why the architecture matters — built for clarity and rapid turnover across the full Adobe Creative Suite.",
      },
      {
        name: "Launch & Hero Films",
        detail:
          "The high-fidelity film that sits at the top of the site on launch day. Modelled, lit and rendered through Octane at 8K, not assembled from stock.",
      },
      {
        name: "UI in Context",
        detail:
          "Your interface composited into rendered environments — device, desk, control room, factory floor — using the same uncompressed 8K plate workflow the VFX pipeline runs for film.",
      },
      {
        name: "Animated B-Roll & Feature Loops",
        detail:
          "Short, silent, endlessly reusable loops for feature pages, changelogs, release notes and in-app moments. Built as a set from one look, so the library stays coherent as the product ships.",
      },
      {
        name: "Systems & Architecture Visualization",
        detail:
          "Abstract infrastructure made physical — data movement, pipelines, model behaviour, network topology — using X-Particles and simulation tooling rather than another flat diagram.",
      },
      {
        name: "Ad Cutdowns & Paid Variants",
        detail:
          "One production, mastered out to every ratio and length the channel plan needs: web hero, app store, YouTube pre-roll, vertical social, conference loop.",
      },
      {
        name: "AI-Accelerated Iteration",
        detail:
          "Kling, Google Veo, Luma Dream Machine, Seedance, Higgsfield and Runway, run on our own secure servers — used to explore direction fast, never shipped raw.",
      },
      {
        name: "Event, Demo & Immersive",
        detail:
          "Booth loops, anamorphic screens, and interactive product demonstrations built in Unreal Engine and Twinmotion for conferences and investor showcases.",
      },
    ],
    sections: [
      {
        eyebrow: "One studio, every role",
        heading: "The creative squad you don't have to hire.",
        lead: "A product film needs eight jobs done. All eight sit in this building.",
        body: [
          "The usual way one gets made is a chain: an agency writes it, a freelancer boards it, a 3D shop renders it, an editor cuts it, and a colourist you have never met finishes it. Every link re-learns your product, and every hand-off is a place where the intent thins out.",
          "We are not a marketplace routing your brief back outward. These are staff roles, working in the same building as the render farm — which is why you explain your product once, and why the person who storyboarded the sequence is still in the room when it is graded.",
        ],
        items: [
          {
            name: "Concept & research",
            detail:
              "Reading the product, the category and the competitive set closely enough to know which claim the film has to carry and which one it can drop.",
          },
          {
            name: "Scriptwriter",
            detail:
              "The argument, written down and agreed before anything is drawn. Cheapest place in the process to change your mind.",
          },
          {
            name: "Storyboard & pre-viz",
            detail:
              "Frames, then a moving previz in Unreal — timing, camera and blocking locked before render cost is committed.",
          },
          {
            name: "Modeller & rigger",
            detail:
              "Product, environment and character assets built in Maya and 3ds Max, rigged so they can be reused for the next release rather than rebuilt.",
          },
          {
            name: "Look-dev & FX artist",
            detail:
              "Materials, lighting and simulation through X-Particles, Marvelous Designer, EmberGen and LiquiGen — the pass that decides whether abstract systems read as physical.",
          },
          {
            name: "Motion designer",
            detail:
              "Typography, UI motion, diagrams and transitions across the full Adobe Creative Suite, matched to the 3D so the two halves look like one film.",
          },
          {
            name: "Editor",
            detail:
              "Pace, structure and sound in our own suites — including the cutdown versions, conformed from the same timeline as the master.",
          },
          {
            name: "Colourist & delivery",
            detail:
              "Digital Intermediate grade, then mastering to every ratio and length the channel plan calls for. One look across all of them.",
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
              "The hero at the top of the site that has to carry the whole positioning. Rendered at 8K, so it holds on a 5K display and a stage projector alike.",
          },
          {
            name: "Explainer",
            detail:
              "The one that has to survive being watched at 1.5x with the sound off. Motion-graphics led, character-driven where that helps, ruthless about pace.",
          },
          {
            name: "Animated B-roll",
            detail:
              "Short silent loops for feature pages, changelogs, release notes and in-app moments — built as a set from one look, so the library stays coherent as the product ships.",
          },
          {
            name: "UI in context",
            detail:
              "Your interface composited into rendered environments — device, desk, control room, factory floor — on the same uncompressed 8K plate workflow the VFX pipeline runs for film.",
          },
          {
            name: "Systems & architecture",
            detail:
              "Abstract infrastructure made physical: data movement, pipeline behaviour, network topology, model inference — built with simulation tooling rather than another flat diagram.",
          },
          {
            name: "Ad cutdowns",
            detail:
              "Paid variants conformed from the same master — pre-roll lengths, app-store cuts, product-page trims — rather than re-edited from scratch by someone else.",
          },
          {
            name: "Social verticals",
            detail:
              "9:16 and 1:1 masters framed at the build stage, so the vertical is composed rather than cropped out of a widescreen edit.",
          },
          {
            name: "Demo & event media",
            detail:
              "Interactive Unreal and Twinmotion builds for sales floors and conference booths, plus anamorphic and projection-mapped loops cut to the geometry of the screen they play on.",
          },
        ],
      },
      {
        eyebrow: "Speed, honestly accounted for",
        heading: "AI acceleration that stays inside the building.",
        lead: "The fastest tools available, running on hardware we own, on material that never leaves the premises.",
        body: [
          "We run AI video generation — Kling, Google Veo, Luma Dream Machine, Seedance, Higgsfield and Runway — directly on our own secure server infrastructure. That is a deliberate operational decision, not a preference: it guarantees maximum computational allocation, and it means your unreleased product, your roadmap and your demo data are never uploaded to a third-party cloud to make a mood film faster.",
          "What AI does here is compress the exploratory half of the work. Direction, motion tests and alternate treatments that used to cost days now cost hours, which means more of the schedule is spent on the version you are actually shipping.",
          "What AI does not do here is finish anything. Every frame that leaves the studio is built, corrected and graded by artists on the industry-standard pipeline. Generation is a starting point, never a deliverable.",
        ],
      },
      {
        eyebrow: "Where it earns",
        heading: "Built for the moments that decide the quarter.",
        items: [
          {
            name: "Launch",
            detail:
              "The website hero film, the announcement cut, and the social set — produced together from one look so the launch reads as one thing.",
          },
          {
            name: "Fundraising",
            detail:
              "Visualizing an abstract product for a high-stakes investor room, including the parts of the architecture that have no photograph.",
          },
          {
            name: "Sales & onboarding",
            detail:
              "Explainers and product walkthroughs that shorten the part of the call where someone draws the system on a whiteboard.",
          },
          {
            name: "Continuous release",
            detail:
              "An ongoing stream of feature loops and B-roll under a milestone SOW, so shipping a feature does not mean starting a video project from zero.",
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
          "Product, audience and the claim the film has to land, agreed before anything is built. Server access is provisioned and locked to the engagement.",
      },
      {
        step: "Script & storyboard",
        detail:
          "The argument the video makes, drawn frame by frame — including which parts of the product are shown literally and which are visualized.",
      },
      {
        step: "Previz & direction tests",
        detail:
          "Timing, camera and blocking locked in Unreal. This is where in-house AI generation earns its place: alternate treatments explored in hours, on our own servers.",
      },
      {
        step: "Build & look-dev",
        detail:
          "Modelling, rigging and motion in Maya and 3ds Max; simulation and materials through X-Particles, Marvelous Designer, EmberGen and LiquiGen.",
      },
      {
        step: "Render",
        detail:
          "Blender and Cinema 4D through Octane, out to 8K on the 15-server farm we own and operate on-site.",
      },
      {
        step: "Conform, grade & versioning",
        detail:
          "Edit and Digital Intermediate colour grade in-house, then mastered to every ratio and length the launch plan calls for.",
      },
    ],
    // PLACEHOLDER — no SaaS library exists yet. Real studio renders stand in, per
    // the note on `Vertical.gallery`. `note` carries the output format the slot is
    // reserved for, so real product-film frames drop into an already-correct
    // structure; `title` describes the frame actually on screen today. The set is
    // deliberately different from the one the capability verticals carry so the
    // pages do not read as the same page.
    gallery: [
      { src: "/media/generated/interior-04.jpg", title: "Interior study", note: "Launch film" },
      { src: "/media/generated/exterior-01.jpg", title: "Exterior massing", note: "Explainer" },
      { src: "/media/generated/interior-12.jpg", title: "Detail pass", note: "Animated B-roll" },
      { src: "/media/generated/exterior-06.jpg", title: "Approach", note: "UI in context" },
      { src: "/media/generated/interior-05.jpg", title: "Volume study", note: "Ad cutdown" },
      { src: "/media/generated/exterior-04.jpg", title: "Elevation", note: "Social vertical" },
    ],
    faqs: [
      {
        q: "How fast can you turn a product film around?",
        a: "It depends entirely on how much has to be built. Explainers and feature loops that reuse an established look are the fastest; a hero film with new modelling, simulation and an 8K render is not. We scope it against milestones in the SOW rather than quoting a number we would have to caveat, and in-house AI generation is what compresses the exploratory phase.",
      },
      {
        q: "What do you need from us to start?",
        a: "The product itself — a demo account or a build we can look at — plus whatever positioning material exists: brand guidelines, a deck, the launch messaging. If you have UI to feature, design files and screen captures at the highest resolution you can export. If the messaging is not settled yet, we start with script and storyboard so it gets settled on paper rather than in render.",
      },
      {
        q: "Our product is unreleased. How is our material handled?",
        a: "Every engagement runs under NDA on access-controlled servers, provisioned per project, with a zero-tolerance policy on data breaches. We do not push client material through third-party services — including for AI generation, which runs on our own in-house infrastructure precisely so unreleased product footage never has to be uploaded anywhere.",
      },
      {
        q: "Do you use AI, and does it end up in the final video?",
        a: "We use it, and no. Kling, Google Veo, Luma Dream Machine, Seedance, Higgsfield and Runway run on our own servers, and they are used for direction tests, alternate treatments and iteration speed. Everything delivered is built and finished by artists on the Maya, Cinema 4D and Octane pipeline, then graded in our own suite.",
      },
      {
        q: "How do revisions work?",
        a: "Revisions are agreed at the milestone level in the Statement of Work, and the sequence is designed so the expensive decisions happen cheaply: script, then storyboard, then previz, each signed off before the next begins. By the time anything is rendering, the argument and the timing are already settled.",
      },
      {
        q: "What formats and ratios do you deliver?",
        a: "Whatever the channel plan needs, mastered from one conform: widescreen web hero, app-store and product-page cuts, YouTube pre-roll lengths, vertical and square social variants, and event or booth loops. Final output is rendered at up to 8K, so downscaled masters stay clean.",
      },
      {
        q: "Can you keep producing after launch?",
        a: "Yes — that is the model we prefer for software. Ongoing production runs as a milestone-based SOW with dedicated resource allocation, tracked in Zoho Projects, so a new feature becomes another asset in an existing library rather than a new video project.",
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
      "Southeast Media is a full-stack visual production studio — CGI, VFX, live action and motion — that operates as the outsourced media division for brands, developers, agencies and product teams. We replace the traditional, ad-hoc agency model with dedicated resource allocation, so an organisation can show a product, a building or a procedure clearly before it is built, photographed or launched, and can keep showing it every quarter without adding a single internal hire.",
    headline: [
      { value: "15", label: "server render farm" },
      { value: "100TB", label: "RAID storage array" },
      { value: "NDA", label: "on every engagement" },
    ],
    capabilities: [
      {
        name: "Dedicated Resource Allocation",
        detail:
          "Server bandwidth and artist time reserved against your engagement rather than bid for project by project — the operational difference between a vendor and a department.",
      },
      {
        name: "For Brand Facilities & Hospitals",
        detail:
          "Complete physical and digital media management — executive testimonial videos, corporate podcasts, and the design, installation and periodic upgrade of video-wall setups and the content that runs on them.",
      },
      {
        name: "For Consumer Products",
        detail:
          "End-to-end lifecycle visual support, from the high-fidelity website hero launch film to a continuous stream of premium content for regular social engagement.",
      },
      {
        name: "For Agencies & White-Label Capacity",
        detail:
          "Senior 3D, VFX and render capacity behind your name. The full pipeline — Maya and 3ds Max through Octane at 8K — available as overflow or as the permanent back end.",
      },
      {
        name: "For Startups",
        detail:
          "An elite visual incubation suite: visualize abstract ideas for high-stakes investor pitches, conduct visual market research, design product sales explainers, and hold a high-end daily social presence.",
      },
      {
        name: "In-House Live Action",
        detail:
          "Uncompressed 8K capture with high-end lighting and grip, an established network of Directors of Photography, and specialised execution for complex facility shoots — active hospital floors, corporate offices, heavy manufacturing plants.",
      },
      {
        name: "Governance & Project Management",
        detail:
          "Milestone-based Statements of Work, with every project lifecycle, progress point and deliverable tracked in Zoho Projects — real-time visibility for corporate procurement boards.",
      },
      {
        name: "Data Security by Architecture",
        detail:
          "NDA on every engagement, strictly provisioned server access, and AI generation performed only on our own infrastructure. Nothing moves through a service we do not control.",
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
          "Southeast Media owns, operates and maintains its production infrastructure on-site. That is the reason a delivery date is a commitment rather than a hope — there is no queue at a third-party farm sitting between us and your deadline, and no external hand-off between the plate and the finished picture.",
        ],
        items: [
          {
            name: "15 servers",
            detail:
              "A dedicated in-house render farm on the latest RTX 5090 and 50-series GPUs, allocated against live engagements.",
          },
          {
            name: "96GB VRAM",
            detail:
              "Dual enterprise NVIDIA cards, reserved for the heaviest particle, fluid and simulation work.",
          },
          {
            name: "100TB RAID",
            detail:
              "A storage array configured specifically for uncompressed 8K workflows, on-site and access-controlled.",
          },
          {
            name: "8K capture",
            detail:
              "Camera systems shooting uncompressed for flawless compositing, with high-end lighting and grip in-house.",
          },
          {
            name: "Full 3D pipeline",
            detail:
              "Maya, 3ds Max, Unreal, Blender and Cinema 4D through Octane — every stage on our own machines.",
          },
          {
            name: "In-house finish",
            detail:
              "Comprehensive editing suites and Digital Intermediate colour grading under the same roof as the farm.",
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
              "A permanent content requirement without a permanent production hire. Launch and hero films, executive and testimonial video, corporate podcasts, campaign cutdowns, social cadence and event media — one SOW instead of five procurement cycles.",
          },
          {
            name: "Agencies & white-label capacity",
            detail:
              "Senior 3D, VFX and render capacity behind your name. You keep the client relationship and the creative direction; we supply the pipeline, the farm and the artists. Archviz, product CGI, animation, compositing and 8K finishing, delivered as your studio.",
          },
          {
            name: "Product & industrial teams",
            detail:
              "Manufacturing, medical-device and hardware groups who need the inside of a product shown accurately, from CAD and engineering reference: cutaways, exploded assemblies, operating-principle sequences, installation and service walkthroughs, trade-show loops.",
          },
          {
            name: "Brand facilities & hospitals",
            detail:
              "Organisations running physical premises as media surfaces. Video walls specified, installed and periodically refreshed, plus the executive, testimonial and patient- or visitor-facing content that plays on them — physical and digital media managed as one contract.",
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
          "We run AI video generation — Kling, Google Veo, Luma Dream Machine, Seedance, Higgsfield and Runway — directly on our own secure server infrastructure. That decision costs us hardware and buys you two things: maximum computational allocation, and the certainty that your material is never uploaded to a platform we do not operate.",
          "The operating model is human-led. Generation is used to widen the field of options before a sign-off gate, so the brief sharpens on evidence rather than on argument, and so a direction can be seen rather than described. Nothing generated is a deliverable. Every frame that leaves the studio is built, corrected and graded by artists on the industry-standard pipeline, which is also what keeps a year of output looking like it came from one place.",
        ],
        items: [
          {
            name: "Where it runs",
            detail:
              "On our own servers, on-site, inside the same access-controlled environment as the render farm and the storage array.",
          },
          {
            name: "What it is used for",
            detail:
              "Direction tests, alternate treatments and iteration during pre-visualization — before render cost is committed.",
          },
          {
            name: "What it never does",
            detail:
              "Ship. Delivered work is modelled, animated, rendered through Octane and graded by artists, every time.",
          },
          {
            name: "Why it matters to you",
            detail:
              "No client material crosses into a third-party cloud at any stage, and consistency stays a function of art direction rather than of a prompt.",
          },
        ],
      },
      {
        eyebrow: "How working together works",
        heading: "The engagement, stated in full.",
        lead: "Ready to start without hiring, chasing freelancers, or managing a vendor chain? This is what you get instead.",
        body: [
          "We operate exclusively via structured corporate retainers and milestone-based Statement of Work allocations. The SOW is what makes the relationship legible to a procurement board: scope, milestones, deliverables and dependencies written down before work starts, and progress tracked against them in Zoho Projects in real time. Both shapes exist — a single defined project, or an ongoing allocation for teams with a continuous requirement — and scope is defined per milestone rather than sold from a rate card.",
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
              "Requirements, volume and cadence assessed against the pipeline, then written as a Statement of Work with named milestones rather than an open-ended retainer.",
          },
          {
            name: "Allocation",
            detail:
              "Dedicated server bandwidth and artist capacity reserved for the engagement, so scheduled work does not compete with the rest of the studio's book.",
          },
          {
            name: "Visibility",
            detail:
              "Every lifecycle stage, progress point and deliverable tracked in Zoho Projects — reportable to procurement without a status call.",
          },
          {
            name: "Review cadence",
            detail:
              "Sign-off gates at script, pre-visualization and pre-render, so the expensive decisions are made while they are still cheap to change.",
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
          "Volume, cadence and confidentiality terms agreed first. NDA executed and server access provisioned and locked to the engagement before anything is shared.",
      },
      {
        step: "Scoping & SOW",
        detail:
          "The programme written as a milestone-based Statement of Work: scope, deliverables, dependencies and sign-off gates, structured for a procurement board rather than a handshake.",
      },
      {
        step: "Allocation",
        detail:
          "Dedicated server bandwidth and artist capacity reserved against the engagement, so scheduled work is not competing with the rest of the studio's book.",
      },
      {
        step: "Production",
        detail:
          "The studio's one pipeline — previz in Unreal, build in Maya and 3ds Max, simulation and look-dev, render through Octane at 8K, live action captured in-house where the brief needs it.",
      },
      {
        step: "Review & reporting",
        detail:
          "Sign-off gates at script, previz and pre-render, with every lifecycle stage and deliverable tracked in Zoho Projects for real-time procurement visibility.",
      },
      {
        step: "Delivery & continuity",
        detail:
          "Conform, Digital Intermediate grade and mastering to every format required — then the next milestone, on the same allocation, without a new procurement cycle.",
      },
    ],
    // PLACEHOLDER — no enterprise-specific library exists yet. Real studio renders
    // stand in with generic captions, per the note on `Vertical.gallery`.
    gallery: [
      {
        src: "/media/generated/exterior-03.jpg",
        title: "Exterior elevation",
        note: "Full massing",
      },
      { src: "/media/generated/interior-01.jpg", title: "Interior volume", note: "Daylight study" },
      { src: "/media/generated/exterior-02.jpg", title: "Dusk approach", note: "Tower elevation" },
      { src: "/media/generated/interior-10.jpg", title: "Styled space", note: "Material detail" },
      { src: "/media/generated/exterior-07.jpg", title: "Night elevation", note: "Lighting pass" },
      { src: "/media/generated/interior-07.jpg", title: "Island & counter", note: "Finish detail" },
    ],
    faqs: [
      {
        q: "What does an engagement actually look like?",
        a: "A structured corporate retainer or a milestone-based Statement of Work. The SOW names the scope, the milestones, the deliverables and the sign-off gates before work begins, and progress against it is tracked in Zoho Projects — so procurement can see the state of the programme without asking for a status call.",
      },
      {
        q: "Can you create visuals before the thing is built, photographed or launched?",
        a: "That is the core of the discipline. Buildings before construction, products before tooling, procedures that cannot be filmed, facilities that cannot be shut down for a shoot — all of it is modelled and rendered rather than captured. Where a real shoot is the right answer, the in-house live-action division handles that too, so the decision is made on merit rather than on what a vendor happens to own.",
      },
      {
        q: "Do you work with early-stage concepts, or only finished designs?",
        a: "Both. When the design is settled we build to it directly. When it is still moving, we work the way the architectural pipeline does — grey-shader and pre-visualization passes that validate geometry, scale and timing before materials, lighting or render time are committed, so the concept can keep changing while it is still cheap to change.",
      },
      {
        q: "Can you support both marketing and technical stakeholders?",
        a: "Yes, and they usually need different cuts of the same build. One asset set produces the marketing film and the technically accurate sequence — the same model, lit and paced for two audiences. For regulated and engineering-led work, accuracy sign-off happens at storyboard and again before render, which is the same review discipline the medical vertical runs.",
      },
      {
        q: "What do you need from us to start?",
        a: "An executed NDA, then the material the work is built from: brand guidelines, CAD or engineering reference, plans and elevations, product photography, existing footage, and any script or messaging already agreed. Common formats are fine — we would rather take your working files than ask you to prepare something. Beyond that, a clear picture of volume and cadence over the coming quarters, because that is what turns a project into an allocation.",
      },
      {
        q: "How quickly can a project start?",
        a: "It depends on current allocation, and we would rather tell you the real date than a marketing one. Scoping and the SOW can move immediately; production starts when capacity is reserved against the engagement. Because the farm, the gear and the artists are ours rather than subcontracted, that date is something we control instead of something we forward on to you.",
      },
      {
        q: "Can you handle ongoing, multi-asset production?",
        a: "That is the model. Dedicated resource allocation means server bandwidth and artist capacity are reserved against your engagement rather than bid for each time, which is what makes a continuous content requirement viable without an internal production hire.",
      },
      {
        q: "How do you keep quality consistent across a year of output?",
        a: "Consistency is an asset-library problem before it is a taste problem. Models, rigs, materials and grade settings are built to be reused and extended rather than remade, so the twelfth asset comes off the same look as the first. One pipeline, one set of artists and one Digital Intermediate suite is what makes that possible; a rotating roster of freelancers is what makes it impossible.",
      },
      {
        q: "How is confidentiality and IP handled?",
        a: "NDA on every engagement, with server access strictly provisioned per project and an uncompromising zero-tolerance policy on data breaches. Work stays on infrastructure we own and operate on-site; we do not route client material through third-party services at any stage of the pipeline.",
      },
      {
        q: "Do you use AI, and how is it governed?",
        a: "Yes, and only on our own servers. We run Kling, Google Veo, Luma Dream Machine, Seedance, Higgsfield and Runway on our own secure infrastructure to guarantee maximum computational allocation and absolute data privacy. It is used to accelerate exploration and iteration; delivered work is built and finished by artists on the industry-standard pipeline.",
      },
      {
        q: "Why not just rent render capacity, or hire freelancers?",
        a: "Both work until a deadline is real. We own and operate the farm on-site — 15 servers on RTX 5090-class GPUs, dual enterprise NVIDIA 96GB VRAM cards, a 100TB RAID array for uncompressed 8K — so your delivery date does not sit in a third party's queue, and your assets do not live on machines outside the building.",
      },
      {
        q: "How often do we review work in progress?",
        a: "At named gates rather than continuously: script, pre-visualization, and again before render. The order is deliberate — it puts the decisions that cost the most to reverse at the point where they are still cheap. Between gates, Zoho Projects carries the live status.",
      },
      {
        q: "What do you deliver, and in what formats?",
        a: "Whatever the programme requires, mastered in-house: 8K stills and film, cinematic sequences, live-action ad films, corporate podcasts, testimonial and interview content, motion graphics, AR and VR builds, and video-wall or anamorphic content cut to the geometry of the surface it plays on. Conform and Digital Intermediate grading are done in our own suites.",
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
