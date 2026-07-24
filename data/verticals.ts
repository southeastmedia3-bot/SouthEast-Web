import type { MediaTone } from "@/data/media";

/**
 * Vertical content.
 *
 * SOURCE OF TRUTH: everything here is drawn from the client's own material —
 * the Corporate Capability Deck, the Pharma / Medical 3D portfolio, and the Real
 * Estate 3D-rendering web copy. Pharma, Real Estate, Films, SaaS and Enterprise
 * are written out in depth; VFX and Animation carry only what the capability deck
 * actually supports.
 *
 * FILMS IS WRITTEN OUT, NOT INVENTED. Everything in that entry expands on four
 * lines the deck really carries — uncompressed 8K capture for compositing, the
 * PR / actor-coordination network and DoP roster, complex facility shoots on
 * hospital floors and plant floors, and in-house editing suites with Digital
 * Intermediate grading. What was added is the craft reasoning around them: why an
 * uncompressed plate matters, how a facility shoot is scheduled, what a live-
 * action engagement runs through. No client, outcome or timeline is asserted.
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
    step: "Confidential by Design",
    detail:
      "Every engagement begins under NDA, with a clearly defined scope, restricted project access and secure infrastructure protecting files and workflows from brief to final delivery.",
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
    step: "Designed Looks. Simulated Reality.",
    detail:
      "Art-directed materials, particles, cloth, fire, smoke and fluid effects — crafted through specialised simulation workflows to bring natural movement, atmosphere and physical detail to every frame.",
  },
  {
    step: "Render Power, Fully In-House",
    detail:
      "Blender and Cinema 4D scenes are processed through Octane on our own servers and on-site render farm — giving us direct control over security, quality, timelines and outputs up to 8K.",
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
        name: "Interior Visualisation",
        detail:
          "Turning floor plans and design concepts into photorealistic interiors that reveal the layout, materials, lighting, furniture and atmosphere — allowing every space to be experienced before it is built.",
      },
      {
        name: "Exterior Visualisation",
        detail:
          "Transforming architectural plans into photorealistic exterior visuals that reveal façade materials, lighting, landscaping, scale and environmental context — helping clients present, evaluate and market developments before construction begins.",
      },
      {
        name: "Virtual Tours",
        detail:
          "Transforming architectural layouts into immersive visual journeys through animated floor plans and cinematic walkthroughs that reveal spatial flow, design, scale and atmosphere — helping audiences understand and connect with the project before it is built.",
      },
      {
        name: "Cinematic Walkthroughs & Animated Floor Plans",
        detail:
          "Dynamic floor plans, cinematic walkthroughs and feel-good films that hook an audience and drive conversion.",
      },
      {
        name: "Interactive VR Experiences",
        detail:
          "Creating immersive, real-time property experiences that let buyers explore, personalise and configure layouts, materials, furniture and finishes — helping them experience their future space before construction begins.",
      },
      {
        name: "Commercial & Custom Developments",
        detail:
          "Creating tailored architectural visualisations for retail, hospitality, workplaces, public spaces and mixed-use developments — capturing each project's unique function, scale, audience and spatial requirements.",
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
            name: "Clarity Before Construction",
            detail:
              "Transforming architectural plans into clear, realistic visuals that reveal layout, scale, spatial flow and design intent — helping buyers and stakeholders understand the complete project before it is built.",
          },
          {
            name: "Presentation with Precision",
            detail:
              "Presenting materials, lighting, proportions and finishes with realistic accuracy — creating visuals that feel credible, resolved and true to the intended design.",
          },
          {
            name: "Vision Buyers Can Believe In",
            detail:
              "Presenting unbuilt spaces with enough realism and atmosphere to create trust, curiosity and emotional connection.",
          },
          {
            name: "A Stronger Market Position",
            detail:
              "Distinctive, high-quality visualisation gives the development greater credibility, recognition and perceived value — helping it stand apart across listings, campaigns and sales presentations.",
          },
          {
            name: "Clarity That Protects the Budget",
            detail:
              "Visualise and refine the project early to prevent misunderstandings, unnecessary revisions and avoidable expenses.",
          },
          {
            name: "One Vision, Built for Every Touchpoint",
            detail:
              "A versatile library of premium visuals strengthens listings, brochures, sales decks, websites and campaigns — giving the property a consistent, polished and recognisable presence across every platform.",
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
          "We refine the model through detailed grey-shader reviews until its geometry, proportions and spatial relationships are fully approved.",
      },
      {
        step: "Materials, Defined by Light",
        detail:
          "Every surface is developed for its true texture, finish and reflectivity, then shaped through physically accurate lighting, shadows and reflections — revealing the architecture with depth, atmosphere and realism.",
      },
      {
        step: "First Draft Review",
        detail:
          "Initial renders bring the layout, scale, materials and visual direction into focus — giving stakeholders a clear basis for feedback before final refinement begins.",
      },
      {
        step: "Unlimited Revisions. One Clear Outcome.",
        detail:
          "We continue refining layouts, materials, finishes and atmosphere until every detail is resolved, every stakeholder is aligned and the final visuals are ready for approval.",
      },
      {
        step: "The Complete Visual Delivery",
        detail:
          "8K stills, cinematic walkthroughs, animated floor plans, virtual tours and VR experiences — delivered in the formats that best support the project, audience and sales objective.",
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
        a: "Most standard render sets are completed within one to two weeks, including review and revisions. Larger or more complex projects receive a tailored timeline.",
      },
      {
        q: "What do you need to get started?",
        a: "Share your floor plans, elevations and any available material or design references. If the design is still evolving, we begin with grey-shader previews to confirm geometry, scale and camera angles before final rendering.",
      },
      {
        q: "Can you visualise a property before the design is final?",
        a: "Yes. We can begin with early plans, sketches or references and develop the visualisation alongside the design — refining layouts, materials and details as the project evolves.",
      },
      {
        q: "Do you offer more than still renders?",
        a: "Yes. We create animated floor plans, cinematic walkthroughs, virtual tours and interactive VR experiences that let buyers explore, understand and personalise the property before it is built.",
      },
      {
        q: "Do you work in commercial and mixed-use, not just residential?",
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
    /**
     * The page title is the claim, not the category. `films-title-card.tsx` sets
     * the closing phrase in Instrument Serif — the studio's quiet aside — so the
     * accent string on that component has to keep matching this line word for
     * word, punctuation included, or it is silently ignored.
     */
    title: "Shot in 8K, cut and graded in the same building.",
    eyebrow: "The live-action division",
    // Gold, not violet: this page is lit by projector light, and its hero film —
    // the beauty master in `verticalHeroes.films` — is a warm frame. VFX keeps
    // violet, so the two never read as the same room.
    tone: "gold",
    summary:
      "A fully equipped in-house live-action division — uncompressed 8K capture, complex compositing, and Digital Intermediate colour grading, end to end.",
    intro:
      "Complementing our CGI infrastructure is a fully equipped, in-house cinematic live-action division capable of end-to-end video production and complex compositing workflows. One company from the recce to the master — so nobody inherits a problem they were not in the room for.",
    headline: [
      { value: "8K", label: "uncompressed capture" },
      { value: "0", label: "external hand-offs" },
      { value: "DI", label: "in-house colour grade" },
    ],
    /**
     * Read as a call sheet on the page — see `films-call-sheet.tsx`. Six units
     * rather than the four the deck lists as prose, because "the gear" and "the
     * finish" are each two departments a producer books separately, and a call
     * sheet that collapses them is not a call sheet.
     */
    capabilities: [
      {
        name: "Camera & capture",
        detail:
          "State-of-the-art camera systems supporting uncompressed 8K footage capture — the format that makes a clean key, a stable track and a flawless composite possible rather than merely likely.",
      },
      {
        name: "Lighting & grip",
        detail:
          "High-end lighting and grip, so the frame is lit for the finish it is going to get rather than rescued in the grade afterwards.",
      },
      {
        name: "Cast, crew & coordination",
        detail:
          "Established connections with top-tier PR and actor coordination agencies, alongside a roster of expert Directors of Photography and cinematographers.",
      },
      {
        name: "Location & facility units",
        detail:
          "Specialised execution for complex facility shoots — active hospital floors, corporate office spaces and heavy manufacturing plants.",
      },
      {
        name: "Composite & VFX integration",
        detail:
          "Plates shot to be built on. Background replacement, CG integration and clean-up run on the same pipeline, in the same building, as the shoot that fed them.",
      },
      {
        name: "Edit, DI & mastering",
        detail:
          "Comprehensive editing suites and advanced Digital Intermediate colour grading — ad films, corporate podcasts, promotional reels and interviews, finished internally and mastered to every format the release calls for.",
      },
    ],
    /**
     * Section order maps to the bespoke page as:
     *   [0] what we shoot · [1] where the unit goes · [2] why uncompressed ·
     *   [3] where it earns.
     * `[0].items` becomes the slate wall — no frames are zipped to it, and the
     * note on `filmsAssets` in `data/media.ts` says why.
     */
    sections: [
      {
        eyebrow: "What we shoot",
        heading: "Eight things this division can be booked to shoot.",
        lead: "Named formats, one unit, one grade — so the launch film and the interview cut still look like they came out of the same company.",
        items: [
          {
            name: "Ad film",
            detail:
              "The commercial itself. Boarded, shot, composited and graded as one continuous piece of work rather than three separate purchases.",
          },
          {
            name: "Brand film",
            detail:
              "The longer form — what the company is and why it exists — cut to survive both a boardroom projector and a phone screen.",
          },
          {
            name: "Product & tabletop",
            detail:
              "Macro work on a locked-off rig, where the light is the performance and a millimetre of flag position is the difference.",
          },
          {
            name: "Corporate podcast",
            detail:
              "Multi-camera, in your space or ours, cut to full episodes and the short pulls that actually travel.",
          },
          {
            name: "Interview & testimonial",
            detail:
              "Lit, framed and directed properly. The format most often shot badly, and the one where that shows fastest.",
          },
          {
            name: "Facility & plant",
            detail:
              "Live floors, clean rooms and production lines — shot around the operation rather than through it.",
          },
          {
            name: "Launch & event",
            detail:
              "Coverage cut fast enough to still matter, at the quality of a planned shoot rather than a camera in the aisle.",
          },
          {
            name: "Social cutdowns",
            detail:
              "9:16 and 1:1 framed on the day, with the safe areas taped on the monitor — not cropped out of widescreen a week later.",
          },
        ],
      },
      {
        eyebrow: "Where the unit goes",
        heading: "The shoots most crews quote themselves out of.",
        lead: "Active hospital floors, working offices and heavy manufacturing plants — locations where the shoot is the guest and the operation does not stop for it.",
        body: [
          "A facility shoot is a scheduling and access problem before it is a camera problem. The floor keeps running, the people on it have a job that is not this, and the areas that photograph best are usually the ones you are least allowed to stand in.",
          "We plan those shoots as a discipline rather than a risk premium: the unit works to the building's rhythm, moves in the windows it is given, and lights for a room it cannot rearrange.",
        ],
        items: [
          {
            name: "Active hospital floors",
            detail:
              "Clinical settings shot without interrupting care — small units, fast set-ups, and framing that respects what is actually happening in the room.",
          },
          {
            name: "Corporate office spaces",
            detail:
              "Working floors, meeting rooms and lobbies, filmed while the company keeps using them.",
          },
          {
            name: "Heavy manufacturing plants",
            detail:
              "Production lines, machinery and scale — the environments where a shoot has to fit the safety brief before it fits the shot list.",
          },
        ],
      },
      {
        eyebrow: "Why uncompressed",
        heading: "The plate is a decision, not a recording.",
        lead: "Uncompressed 8K capture is the difference between a composite that holds at full size and one that only holds at the size it was reviewed on.",
        body: [
          "Compression throws away exactly what a composite needs most: the clean edge a key is pulled from, the fine grain a tracker locks to, the highlight roll-off a CG element has to sit inside. None of that is missed on a laptop preview. All of it is missed on a cinema screen or a 4K TV.",
          "So the plate is shot for the thing it will become. The same building that will replace the background, integrate the CG and grade the result is the one that specifies the capture — which is the whole argument for not splitting a film across two companies.",
        ],
      },
      {
        eyebrow: "Where it earns",
        heading: "The briefs a real shoot answers better than anything else.",
        items: [
          {
            name: "A face and a voice",
            detail:
              "Founders, clinicians, engineers, customers. Nothing rendered substitutes for a person saying it themselves.",
          },
          {
            name: "A place that exists",
            detail:
              "The plant, the ward, the floor. Proof that the operation is real, filmed where it is real.",
          },
          {
            name: "Live action plus CG",
            detail:
              "Shot plates with rendered elements inside them — the hybrid that needs both departments to have been in the same conversation.",
          },
          {
            name: "A campaign, not a video",
            detail:
              "One shoot cut into the ad, the cutdowns, the socials and the interviews, all off one grade.",
          },
        ],
      },
    ],
    contrast: {
      heading: "What changes when the crew and the finish are the same company.",
      without: {
        label: "The usual",
        points: [
          "A production house that shoots it and a post house that has to live with it.",
          "Compressed footage that keys well enough in the review and falls apart at full size.",
          "A grade booked by the hour, in a room you meet for the first time at the end of the project.",
          "A quote that grows every time the schedule touches a working facility.",
        ],
      },
      with: {
        label: "With Southeast Media",
        points: [
          "One company from the recce to the master. Nobody inherits a problem they were not in the room for.",
          "Uncompressed 8K plates, shot to be composited, on the same pipeline that will composite them.",
          "Digital Intermediate colour grading in our own suites, available from the first day of the edit.",
          "Facility shoots run as a discipline — hospital floors, offices and plants, planned around the operation.",
        ],
      },
    },
    /**
     * A live-action schedule, not the CGI pipeline. This vertical used to inherit
     * `STUDIO_PROCESS`, which starts at pre-visualization and ends at render — an
     * answer to "how is this modelled", on the one page where the honest question
     * is "who is on set on the day, and what happens to the footage afterwards".
     */
    process: [
      {
        step: "Brief & treatment, under NDA",
        detail:
          "What the film has to make someone do, and the treatment that answers it. Scope, deliverables and access agreed before a date is held.",
      },
      {
        step: "Board & shot list",
        detail:
          "Every set-up drawn and listed before a truck is booked. The cheapest place in the whole production to change your mind.",
      },
      {
        step: "Recce & schedule",
        detail:
          "The location, walked. Power, access, noise, light through the day, and the windows the operation can actually give us — then a schedule built to them.",
      },
      {
        step: "Pre-light & test",
        detail:
          "Rigged and tested before the talent stands in it. Where a facility allows no pre-light, the set-ups are designed to be fast rather than clever.",
      },
      {
        step: "Principal photography",
        detail:
          "State-of-the-art camera systems, uncompressed 8K, with high-end lighting and grip. Shot as a plate where anything is going to be built on it.",
      },
      {
        step: "Offline edit",
        detail:
          "Structure and pace argued out in our own suites, on the full-resolution material rather than a proxy someone else conformed.",
      },
      {
        step: "Composite & VFX integration",
        detail:
          "Background replacement, clean-up and CG integration on the same pipeline as everything else in the building — Maya, Cinema 4D and Octane, out to 8K on the in-house farm.",
      },
      {
        step: "DI grade & delivery",
        detail:
          "Advanced Digital Intermediate colour grading, then conform and master to every ratio and length the release calls for.",
      },
    ],
    // Captions only — the frames resolve through `filmsAssets.galleryFrames` and
    // are zipped to these by index, so changing a picture never changes what the
    // page says about it. Captions name the craft, never the client: several
    // frames carry third-party branding. See docs/CLIENT_ATTRIBUTION.md.
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
    // No `videos` block. Every film this vertical can show runs in the screening
    // room at the top of its bespoke page, off `filmsAssets.programme` — a second
    // wall of six simultaneous loops would only play the same files again.
    faqs: [
      {
        q: "Do you actually shoot, or is this CGI with a camera department bolted on?",
        a: "We shoot. The live-action division is in-house and fully equipped — camera systems capable of uncompressed 8K, high-end lighting and grip, and a roster of expert Directors of Photography and cinematographers, plus established connections with top-tier PR and actor coordination agencies. What makes it unusual is the other half: the same building composites and grades what it shoots.",
      },
      {
        q: "Why does uncompressed 8K matter to us?",
        a: "Because of what happens after the shoot. Compression discards the clean edges a key is pulled from, the fine detail a tracker locks to, and the highlight roll-off a CG element has to sit inside — none of which is visible on a review link and all of which is visible on a cinema screen. If anything is going to be replaced, integrated or heavily graded, the plate has to be captured for it.",
      },
      {
        q: "Can you shoot inside our hospital, office or plant?",
        a: "Yes — complex facility shoots are a specialisation, not an exception. Active hospital floors, corporate office spaces and heavy manufacturing plants. The unit works to the building's schedule and safety brief: small crews, fast set-ups, and framing designed around an operation that does not stop for us.",
      },
      {
        q: "What do we get at the end?",
        a: "The graded master, plus every ratio and length the channel plan calls for, all conformed from one Digital Intermediate grade. Social verticals are framed on the day rather than cropped out of widescreen afterwards.",
      },
      {
        q: "Can you mix a shoot with the CG work you do on the other pages?",
        a: "That is the point of having both. Plates are shot knowing what will be built into them, and the composite runs on the same Maya, Cinema 4D and Octane pipeline as the studio's rendered work — out to 8K on the 15-server farm we own and operate on-site.",
      },
      {
        q: "How is confidentiality handled on a shoot?",
        a: "NDA on the engagement, the same as every other vertical. Footage lands on access-controlled servers in this building and is edited, composited and graded there; we do not push client material through third-party services at any stage.",
      },
    ],
    proof: {
      label: "The standard",
      title: "Shot, cut and graded without leaving the building.",
      body: "The entire process is handled internally — no external hand-offs, no pipeline seams between the plate and the composite, and a Digital Intermediate grade for a flawless final picture. The people who specify the capture are the people who have to finish it.",
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
        name: "Real-Time Previsualisation & Virtual Production",
        detail:
          "Characters, environments, cameras and sequences are developed interactively to validate framing, movement, timing and production decisions before final execution.",
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
      title: "A zero-imperfection mandate requires uncompromised computation.",
      body: "Compute behind every final frame. 100TB RAID storage, enterprise NVIDIA GPUs and a dedicated 15-server render farm support demanding 8K, simulation and effects workflows entirely on-site.",
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
        name: "Motion, Explained and Experienced",
        detail:
          "A minimalistic, character-driven design approach built for clarity and rapid turnover, across the full Adobe Creative Suite.",
      },
      {
        name: "Beyond-the-Screen Visual Experiences",
        detail:
          "Anamorphic 3D content and projection mapping transform digital displays and architectural surfaces into immersive experiences shaped around space, perspective and audience movement.",
      },
      {
        name: "Interactive Worlds in Real Time",
        detail:
          "Detailed 3D assets become immersive AR and VR experiences for product demonstrations, medical training and investor presentations — designed to be explored, understood and experienced.",
      },
      {
        name: "AI-Secured Visual Production",
        detail:
          "Generative video workflows protected by secure systems, trusted processes and controlled data handling.",
      },
    ],
    /**
     * Section order maps to the bespoke page as:
     *   [0] the named formats · [1] beyond the screen · [2] AI acceleration ·
     *   [3] where it earns.
     * `[0].items` is zipped by index with `animationAssets.formatFrames`.
     */
    sections: [
      {
        eyebrow: "What we make",
        heading: "Eight things this page can be commissioned to build.",
        lead: "Named formats, all off one pipeline — so the launch film and the social cutdown of it are genuinely the same piece of work.",
        items: [
          {
            name: "Explainer film",
            detail:
              "The argument, made in motion. Built to survive being watched at 1.5× with the sound off.",
          },
          {
            name: "Character animation",
            detail:
              "Rigged characters with a performance in them — modelled, rigged and animated in Maya and 3ds Max, not posed off a shelf.",
          },
          {
            name: "Logo & brand builds",
            detail:
              "The mark, assembled. Stings, endboards and title systems a brand keeps using after the campaign ends.",
          },
          {
            name: "Storyboard & animatic",
            detail:
              "Every shot drawn and cut to timing before render cost begins. Deliverable on its own if that is all you need.",
          },
          {
            name: "Anamorphic & projection",
            detail:
              "Forced-perspective content built to the geometry of the actual screen — corner LED, façade, video wall.",
          },
          {
            name: "Immersive AR & VR",
            detail:
              "Unreal Engine and Twinmotion builds: product demonstration, medical training and investor showcases you can walk through.",
          },
          {
            name: "AI-accelerated iteration",
            detail:
              "Direction tests explored in hours on our own servers. Never shipped raw — it finishes nothing.",
          },
          {
            name: "Social & cutdowns",
            detail:
              "9:16 and 1:1 composed at build stage, not cropped out of widescreen after the fact.",
          },
        ],
      },
      {
        eyebrow: "Beyond the screen",
        heading: "Animation that stops being a rectangle.",
        lead: "Forced-perspective 3D built to the geometry of the surface it plays on — a corner LED, a lobby wall, a building façade.",
        body: [
          "A frame composed for a 16:9 player falls apart on a screen that turns a corner. Anamorphic content is built the other way round: the installation is the camera, and the illusion resolves from exactly where the audience stands.",
          "Same pipeline as everything else on this page — built in Maya, rendered through Octane, cut to the plate the screen actually takes.",
        ],
        items: [
          {
            name: "Corner & wrap LED",
            detail:
              "Content built to the fold, so the image reads as one volume rather than two flat panels meeting at an edge.",
          },
          {
            name: "Projection mapping",
            detail:
              "Surfaces surveyed, then animated to their own edges — brand facilities, hospital lobbies, corporate experience centres.",
          },
          {
            name: "Real-time & interactive",
            detail:
              "Unreal Engine and Twinmotion, for demonstrations a visitor drives instead of watches.",
          },
        ],
      },
      {
        eyebrow: "Speed, honestly accounted for",
        heading: "The fastest tools available, on hardware we own.",
        lead: "Kling, Google Veo, Luma Dream Machine, Seedance, Higgsfield and Runway — every one of them running on our own secure servers.",
        body: [
          "Generation runs on our own infrastructure, which guarantees two things a hosted tool cannot: the whole machine is allocated to your job, and nothing about your project is uploaded anywhere to make a mood film faster.",
          "It compresses the exploratory half of the work — the part where a direction is still being argued about — and it finishes nothing. Every frame that leaves this building is built, corrected and graded by artists on the Maya, Cinema 4D and Octane pipeline.",
        ],
      },
      {
        eyebrow: "Where it earns",
        heading: "The moments an animation is the only thing that will do.",
        items: [
          {
            name: "Launch & campaign",
            detail:
              "Hero film, cutdowns and social set out of one build, so the whole campaign reads as one thing.",
          },
          {
            name: "Explaining the invisible",
            detail:
              "Process, software, mechanism — anything with no photograph to take and no set to shoot.",
          },
          {
            name: "Training & induction",
            detail:
              "Procedure and safety content people actually finish, because it moves and it is specific to your floor.",
          },
          {
            name: "Rooms & facilities",
            detail:
              "Lobbies, experience centres, booths and video walls — cut to the geometry of the screen, not letterboxed into it.",
          },
        ],
      },
    ],
    contrast: {
      heading: "What changes when the whole film is made in one building.",
      without: {
        label: "The usual",
        points: [
          "A chain of vendors — one writes it, one boards it, one animates it, one grades it — and the direction thins out at every hand-off.",
          "Template motion off a stock library, recognisable as the same asset three other brands bought this quarter.",
          "Material pushed into third-party cloud tools to hit the date, unreleased product included.",
          "A second film a year later that plainly did not come from the same place as the first.",
        ],
      },
      with: {
        label: "With Southeast Media",
        points: [
          "Script, board, animatic, animation, render and grade under one roof and one art direction.",
          "Characters and worlds built for you, rigged so the next film reuses the build instead of restarting it.",
          "AI generation on servers we own and operate on-site — nothing about the project leaves the premises.",
          "A house style that lives in the assets themselves, so film twelve still matches film one.",
        ],
      },
    },
    process: [
      {
        step: "Brief, under NDA",
        detail:
          "What the film has to make someone do, agreed first. Server access provisioned and locked to the engagement.",
      },
      {
        step: "Script & storyboard",
        detail:
          "Every shot drawn before anything is built — the cheapest place in the whole project to change your mind.",
      },
      {
        step: "Animatic & previz",
        detail:
          "Boards cut to timing, then a moving previz through Reallusion Character Creator and iClone into Unreal. Pace and camera lock here.",
      },
      {
        step: "Design, model & rig",
        detail:
          "The look settled on one frame, then built in Autodesk Maya and 3ds Max and rigged to be reused by the next film.",
      },
      {
        step: "Animation",
        detail:
          "The performance pass — weight, timing, anticipation and hold. The part of this that cannot be bought off a shelf.",
      },
      {
        step: "Look-dev, FX & render",
        detail:
          "X-Particles, EmberGen and LiquiGen where a shot needs simulation; Blender and Cinema 4D through Octane, out to 8K on the 15-server farm we own on-site.",
      },
      {
        step: "Sound, conform & delivery",
        detail:
          "Edit, sound design and Digital Intermediate grade in our own suites, mastered to every ratio and length the plan calls for.",
      },
    ],
    // Captions only — the frames resolve through `animationAssets.galleryFrames`
    // and are zipped to these by index, so changing a picture never changes what
    // the page says about it.
    gallery: [
      { src: "/media/animation/character-09.jpg", title: "Workshop", note: "Character animation" },
      { src: "/media/animation/shot-02.jpg", title: "Diorama city", note: "Layout & set" },
      {
        src: "/media/animation/logo-alt-poster.jpg",
        title: "Mark, assembling",
        note: "Brand animation",
      },
      { src: "/media/saas/infograph-04.jpg", title: "Orbiting panels", note: "Explainer" },
      {
        src: "/media/animation/character-03.jpg",
        title: "Character study",
        note: "Look & lighting",
      },
      {
        src: "/media/animation/artwork-poster.jpg",
        title: "Artwork reveal",
        note: "Title & reveal",
      },
    ],
    // No `videos` block. Every film this vertical can show runs in the reel
    // theater at the top of its bespoke page, off `animationAssets.reels` — a
    // second wall of six simultaneous loops would only play the same files again.
    faqs: [
      {
        q: "How long does an animated film take?",
        a: "It depends on how much has to be built from nothing. A motion-graphics explainer reusing an established look is fastest; a character film with new modelling, rigging and an 8K render is not. We scope it against milestones in the SOW rather than quote a number we would immediately have to caveat.",
      },
      {
        q: "Do you do 2D as well as 3D?",
        a: "Both, and most films we deliver use both. The motion-graphics and explainer work runs on the full Adobe Creative Suite with a minimalistic, character-driven design approach; the 3D runs through Maya, 3ds Max, Blender and Cinema 4D, finished in Octane.",
      },
      {
        q: "Can you work from our script, or do you write it?",
        a: "Either. If the argument is already settled, we start at storyboard. If it is not, we start at script — settling it on paper costs a fraction of settling it in render.",
      },
      {
        q: "What do we actually get at the end?",
        a: "The master at up to 8K, plus every ratio and length the channel plan calls for, all conformed from one grade. What happens to project files and built assets afterwards is written into the SOW rather than left to assumption.",
      },
      {
        q: "Do you use AI, and does it end up in the film?",
        a: "We use it, and no. Kling, Veo, Luma, Seedance, Higgsfield and Runway run on our own secure servers for direction tests and iteration speed. Every frame delivered is built, corrected and graded by artists.",
      },
      {
        q: "Can you build for a screen that isn't a rectangle?",
        a: "Yes — corner LED, video walls, façades and projection mapping, built as forced-perspective content to the geometry of the actual installation. Interactive and walkthrough work is built in Unreal Engine and Twinmotion.",
      },
      {
        q: "Can you keep producing after the first film?",
        a: "Yes, and it is the model we prefer. Ongoing work runs as a milestone-based SOW against a library that already exists — the rigs, sets and look developed for film one are exactly what make film two quick.",
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
          "Your interface is composed into rendered environments — device, desk, control room, factory floor.",
      },
      {
        name: "Product Motion Loops",
        detail:
          "Silent animated sequences built as one cohesive visual system for feature pages, changelogs, product updates and in-app moments.",
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
        name: "AI-Generated. Studio Refined.",
        detail:
          "AI generation helps us explore more creative directions in less time. We use generative tools to test concepts, motion ideas, mood, composition and early visual routes — while every approved direction is refined through our studio workflow for quality, consistency and final production use.",
      },
      {
        name: "Event Experiences, Digitally Crafted",
        detail:
          "We create immersive event content that brings products, spaces and brand stories to life through interactive demos, booth visuals, anamorphic displays and real-time 3D environments.",
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
              "The argument, agreed before anything is drawn. The cheapest place to change your mind.",
          },
          {
            name: "Storyboard to Moving Previz",
            detail:
              "We define the key frames first, then build a real-time Unreal Engine previz to confirm camera movement, timing and sequence flow before final production begins.",
          },
          {
            name: "Production-Ready Models & Rigs",
            detail:
              "Detailed models and flexible rigs are built as lasting 3D assets — ready for animation today and reusable across future stories, campaigns and releases.",
          },
          {
            name: "Look Development & FX",
            detail:
              "We develop materials, lighting, atmosphere and visual effects to make abstract systems feel physical, dimensional and believable — giving complex ideas texture, weight and clarity on screen.",
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
            name: "Final Grade & Multi-Format Delivery",
            detail:
              "A cinematic DI grade brings colour, contrast and tonal consistency together before the master film is adapted into every platform-ready output required for release.",
          },
        ],
      },
      {
        eyebrow: "Output formats",
        heading: "One production, every format the launch needs.",
        lead: "Named formats, all conformed from a single master — so the campaign cut and the site cut are genuinely the same film.",
        items: [
          {
            name: "The Film That Defines the Launch",
            detail:
              "A cinematic 8K launch film that brings the brand positioning, product story and visual identity together in one powerful masterpiece — built to hold detail across websites, presentations, event screens and large-format projections.",
          },
          {
            name: "Explainer",
            detail: "Has to survive being watched at 1.5x with the sound off. Ruthless about pace.",
          },
          {
            name: "Animated B-Roll",
            detail:
              "Short, silent motion loops for product pages, updates and website sections — simple, consistent and easy to reuse.",
          },
          {
            name: "UI in context",
            detail:
              "Your interface is composed into rendered environments, on the 8K plate workflow.",
          },
          {
            name: "Systems & architecture",
            detail:
              "Data movement, pipeline behaviour, network topology — simulated, not diagrammed.",
          },
          {
            name: "Ad cutdowns",
            detail:
              "We adapt one approved master film into shorter versions for pre-roll, app-store previews, product pages and digital placements — keeping the message, look and quality consistent across every format.",
          },
          {
            name: "Social verticals",
            detail: "9:16 and 1:1 framed at build stage — composed, not cropped out of widescreen.",
          },
          {
            name: "Demo & event media",
            detail:
              "Real-time Unreal Engine and Twinmotion experiences, along with motion loops designed to fit the exact size, shape and layout of each event display.",
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
            name: "Fundraising Visualisation",
            detail:
              "Clear 3D visuals for unseen systems, future spaces and technical architecture — built to support investor understanding and high-stakes pitch conversations.",
          },
          {
            name: "Sales & onboarding",
            detail: "Shortens the part of the call where someone draws the system on a whiteboard.",
          },
          {
            name: "Continuous Release Support",
            detail:
              "Feature visuals are delivered milestone by milestone, keeping every product release consistent without restarting the production process each time.",
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
        step: "Clear Brief. Restricted Access.",
        detail:
          "We align on the core message before production begins, while every project asset stays within a controlled NDA workflow accessible only to the authorised engagement team.",
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
        step: "Build & Look Development",
        detail:
          "We build detailed 3D assets in Maya and 3ds Max, then refine materials, lighting and simulations using tools like X-Particles, Marvelous Designer, EmberGen and LiquiGen to create believable, production-ready visuals.",
      },
      {
        step: "The Render Pipeline",
        detail: "Cinema 4D through Octane, out to 8K on the 15-server farm we own on-site.",
      },
      {
        step: "Final Grade & Multi-Format Delivery",
        detail:
          "One approved master is conformed and colour graded in-house, then adapted into every required ratio, resolution and format for the launch plan.",
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
        q: "How long does a product film take?",
        a: "It depends on the build. Existing assets and approved styles move faster; new modelling, simulation and 8K rendering take longer. We define timelines through clear SOW milestones.",
      },
      {
        q: "What do you need from us to start?",
        a: "The product — a demo account or a build we can look at — plus whatever positioning material exists. If the messaging is not settled, we start with script and storyboard so it gets settled on paper rather than in render.",
      },
      {
        q: "How do you protect unreleased product material?",
        a: "Unreleased product assets are handled under NDA, stored in a restricted project server, and accessed only by the assigned team throughout the engagement.",
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
        name: "Embedded Production Support",
        detail:
          "Assigned artists and reserved production capacity give your project consistent support across every milestone.",
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
            name: "Studio-Owned Render Power",
            detail:
              "Our in-house 15-server render farm gives every production dedicated GPU capacity for faster, controlled and consistent high-resolution rendering.",
          },
          {
            name: "96GB VRAM",
            detail:
              "A 96GB VRAM workstation gives us the memory headroom needed for complex particles, fluids, volumetrics and high-detail 3D production.",
          },
          {
            name: "100TB RAID",
            detail: "A storage array built for uncompressed 8K, on-site and access-controlled.",
          },
          {
            name: "8K Capture with Cinematic Control",
            detail:
              "Uncompressed 8K capture with in-house lighting and grip for clean, controlled and high-detail production.",
          },
          {
            name: "Complete 3D Production, In-House",
            detail:
              "Modelling, animation, real-time visualisation and final rendering handled within one controlled studio pipeline.",
          },
          {
            name: "In-House Post & Picture Finishing",
            detail:
              "Editing, colour grading and final delivery handled under one roof for a controlled, consistent final finish.",
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
              "Server bandwidth and artist capacity are reserved, so your work does not compete with the book.",
          },
          {
            name: "Visibility",
            detail:
              "Every deliverable tracked in Zoho Projects — reportable without a status call.",
          },
          {
            name: "Review cadence",
            detail:
              "We set clear approval gates at script, previz and pre-render, so major decisions are made early while changes are still fast and manageable.",
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
