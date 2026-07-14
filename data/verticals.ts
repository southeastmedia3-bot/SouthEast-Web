import type { MediaTone } from "@/data/media";

/**
 * Vertical content.
 *
 * SOURCE OF TRUTH: everything here is drawn from the client's own material —
 * the Corporate Capability Deck, the Pharma / Medical 3D portfolio, and the Real
 * Estate 3D-rendering web copy. Pharma and Real Estate are the two verticals with
 * full source material and are written out in depth; the other four carry only
 * what the capability deck actually supports.
 *
 * NOTHING HERE IS INVENTED. The `proof` block used to be a "representative
 * engagement" with fabricated client outcomes ("a tower pre-sold from renders
 * alone", "cleared in a single review cycle"). Those were placeholders and read as
 * real engagements, so they are gone. What replaces them is verifiable: the
 * studio's own capability, infrastructure, and stated delivery terms. If a real
 * case study ever lands, it belongs here — with the client's sign-off.
 */

export type VerticalSlug =
  | "pharma"
  | "real-estate"
  | "films"
  | "vfx"
  | "animation"
  | "graphics";

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
  /** The engagement, start to finish. Every vertical runs the studio's one
   *  pipeline; the wording is what changes. */
  process?: { step: string; detail: string }[];
  /**
   * Selected work.
   *
   * PLACEHOLDER MEDIA: the only assets we hold are the real-estate renders, so
   * they stand in on every vertical for now, at the client's instruction. On the
   * pharma page in particular these images are wrong and should be swapped the
   * moment medical stills exist.
   */
  gallery?: string[];
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
const PLACEHOLDER_GALLERY = [
  "/media/generated/interior-06.jpg",
  "/media/generated/exterior-05.jpg",
  "/media/generated/interior-11.jpg",
  "/media/generated/exterior-02.jpg",
  "/media/generated/interior-03.jpg",
  "/media/generated/exterior-07.jpg",
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
  title: "Six disciplines, one pipeline.",
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
    gallery: PLACEHOLDER_GALLERY,
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
    slug: "graphics",
    label: "Graphics",
    title: "The Embedded Media Partner Model",
    eyebrow: "Engagement",
    tone: "sky",
    summary:
      "Not an agency on retainer — your outsourced digital infrastructure partner, with dedicated resource allocation.",
    intro:
      "We replace the traditional, ad-hoc agency model by serving as your fully integrated, outsourced digital infrastructure partner. Our dedicated resource allocation considerably reduces internal headcount and digital overhead while guaranteeing regular, elite engagement.",
    headline: [
      { value: "NDA", label: "on every engagement" },
      { value: "SOW", label: "milestone-based" },
      { value: "Zoho", label: "tracked, in real time" },
    ],
    capabilities: [
      {
        name: "For Brand Facilities & Hospitals",
        detail:
          "Complete physical and digital media management — executive testimonial videos, corporate podcasts, and the design, installation and periodic upgrade of video-wall setups and content on your premises.",
      },
      {
        name: "For Consumer Products",
        detail:
          "End-to-end lifecycle visual support, from the high-fidelity website hero launch film to a continuous stream of premium content for regular social engagement.",
      },
      {
        name: "For Startups",
        detail:
          "An elite visual incubation suite: visualize abstract ideas for high-stakes investor pitches, conduct visual market research, design product sales explainers, and hold a high-end daily social presence.",
      },
      {
        name: "Governance & Project Management",
        detail:
          "Milestone-based Statements of Work with every project lifecycle, progress and deliverable tracked in Zoho Projects — real-time visibility for corporate procurement boards.",
      },
    ],
    process: STUDIO_PROCESS,
    gallery: PLACEHOLDER_GALLERY,
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
