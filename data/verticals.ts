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
  capabilities: { name: string; detail: string }[];
  /** Long-form content. Only the verticals with real source material carry it. */
  sections?: VerticalSection[];
  /** The dark band near the foot of the page. Capability and terms — not a
   *  fabricated client story. */
  proof: {
    label: string;
    title: string;
    body: string;
    metrics: { value: string; label: string }[];
  };
};

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
