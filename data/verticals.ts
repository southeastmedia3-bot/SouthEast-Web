import type { MediaTone } from "@/data/media";

export type VerticalSlug =
  | "pharma"
  | "real-estate"
  | "films"
  | "vfx"
  | "animation"
  | "graphics";

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
  /** A 3dforscience-style representative engagement. */
  caseStudy: {
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
    "Every vertical runs through the same in-house, physically accurate 8K pipeline — the same colour science, the same review governance, the same zero-imperfection standard. Choose the outcome; the craft underneath is constant.",
};

export const verticals: Vertical[] = [
  {
    slug: "pharma",
    label: "Pharma",
    title: "Medical & Pharmaceutical Visualization",
    eyebrow: "Vertical 01",
    tone: "blue",
    summary: "Doctor-reviewed anatomy, mechanism-of-action animation, and clinical visualization for review boards.",
    intro:
      "We build a doctor-reviewed 3D anatomy and disease-state library, then pair it with Cinema 4D–Octane mechanism-of-action animation and 3D-print-ready molecular models. Every frame is engineered to clear a pharmaceutical review board on the first pass.",
    capabilities: [
      { name: "Mechanism of Action", detail: "Physiologically accurate MoA films for HCP and patient education." },
      { name: "Anatomy & Disease-State Library", detail: "A reusable, review-approved 3D asset base built for scale." },
      { name: "Molecular & Scientific Renders", detail: "Binding-site and pathway visualization down to the atom." },
      { name: "Regulatory-Ready Delivery", detail: "MLR-conscious versioning with a full reference and citation trail." },
    ],
    caseStudy: {
      label: "Representative engagement",
      title: "A cardiac MoA series cleared in a single review cycle.",
      body: "A multi-scene mechanism-of-action series produced at 8K, storyboarded with a medical advisory board and delivered with an annotated reference pack — approved without a revision round.",
      metrics: [
        { value: "8K", label: "delivery resolution" },
        { value: "1", label: "review cycle to approval" },
        { value: "40+", label: "reusable library assets" },
      ],
    },
  },
  {
    slug: "real-estate",
    label: "Real Estate",
    title: "Institutional Real-Estate Visualization",
    eyebrow: "Vertical 02",
    tone: "sky",
    summary: "Photorealistic pre-construction renders that secure institutional buyers before ground is broken.",
    intro:
      "Photorealistic interiors and exteriors, cinematic walkthroughs, and interactive virtual tours built for corporate boards and investor presentations. We visualize the asset so convincingly that capital commits before the first foundation is poured.",
    capabilities: [
      { name: "Exterior & Interior Renders", detail: "Physically based lighting and materials at architectural fidelity." },
      { name: "Cinematic Walkthroughs", detail: "Directed fly-throughs that sell the experience, not just the plan." },
      { name: "Virtual Tours", detail: "Interactive, board-ready environments for remote stakeholders." },
      { name: "Phasing & Masterplan Visuals", detail: "Sequenced visualization for multi-phase institutional developments." },
    ],
    caseStudy: {
      label: "Representative engagement",
      title: "A tower pre-sold from renders alone.",
      body: "A full exterior-to-interior visualization package plus a two-minute cinematic walkthrough, delivered ahead of a launch that closed institutional interest before ground-breaking.",
      metrics: [
        { value: "120s", label: "cinematic walkthrough" },
        { value: "4K/8K", label: "still + motion delivery" },
        { value: "Pre-GB", label: "committed interest" },
      ],
    },
  },
  {
    slug: "films",
    label: "Films",
    title: "In-House Film & Cinematic Production",
    eyebrow: "Vertical 03",
    tone: "violet",
    summary: "Uncompressed 8K live-action capture, DI colour grading, and end-to-end cinematic production.",
    intro:
      "Our in-house cinematic production division handles uncompressed 8K live-action capture, digital-intermediate colour grading, and finishing end-to-end. Story, camera, and post under one roof — with the render infrastructure to match.",
    capabilities: [
      { name: "8K Live-Action Capture", detail: "Uncompressed acquisition built for the finishing pipeline." },
      { name: "DI Colour Grading", detail: "Reference-monitor grading for a consistent, cinematic look." },
      { name: "Directing & Production", detail: "Concept, boards, and on-set direction handled in-house." },
      { name: "Finishing & Delivery", detail: "Conform, master, and multi-format delivery." },
    ],
    caseStudy: {
      label: "Representative engagement",
      title: "A launch film shot, graded, and mastered in one house.",
      body: "A brand launch film captured at 8K, composited with CG inserts, and colour-finished internally — no external hand-offs, no pipeline seams.",
      metrics: [
        { value: "8K", label: "uncompressed capture" },
        { value: "0", label: "external hand-offs" },
        { value: "DI", label: "in-house grade" },
      ],
    },
  },
  {
    slug: "vfx",
    label: "VFX",
    title: "Zero-Imperfection VFX & Compositing",
    eyebrow: "Vertical 04",
    tone: "violet",
    summary: "8K rendering, CG integration, and compositing finished through a Maya-to-Octane pipeline.",
    intro:
      "Uncompressed 8K rendering, seamless CG integration, and compositing handled through our in-house Maya-to-Octane finishing pipeline. A zero-imperfection mandate governs every frame that leaves the building.",
    capabilities: [
      { name: "CG Integration", detail: "Photoreal assets tracked and lit to sit inside real plates." },
      { name: "Compositing & Finishing", detail: "Node-based compositing to a zero-artifact standard." },
      { name: "Simulation & FX", detail: "Volumetrics, dynamics, and destruction at render scale." },
      { name: "8K Rendering", detail: "A 15-server farm with dual 96GB VRAM nodes." },
    ],
    caseStudy: {
      label: "Representative engagement",
      title: "Invisible effects across a full sequence.",
      body: "A sequence of CG-augmented shots composited to be indistinguishable from photography, rendered at 8K on the in-house farm and delivered on a fixed milestone schedule.",
      metrics: [
        { value: "96GB", label: "VRAM per node" },
        { value: "15", label: "render-farm servers" },
        { value: "8K", label: "final resolution" },
      ],
    },
  },
  {
    slug: "animation",
    label: "Animation",
    title: "High-Fidelity 2D / 3D Animation",
    eyebrow: "Vertical 05",
    tone: "gold",
    summary: "Motion systems, explainer films, and brand animation built for clarity and craft.",
    intro:
      "High-fidelity 2D and 3D motion systems — from investor-grade explainer films to brand idents and product animation. Abstract ideas made legible, and legible ideas made beautiful.",
    capabilities: [
      { name: "Explainer & Pitch Films", detail: "Complex propositions distilled into a watchable minute." },
      { name: "Motion Systems & Idents", detail: "Reusable brand motion built as a system, not a one-off." },
      { name: "Product Animation", detail: "Feature storytelling for launch and lifecycle content." },
      { name: "2D / 3D Hybrid", detail: "The right technique per shot, unified in finish." },
    ],
    caseStudy: {
      label: "Representative engagement",
      title: "A funding-round film that carried the pitch.",
      body: "An 80-second explainer built for a Series A raise — script, design system, and animation delivered as a single package the founders led every meeting with.",
      metrics: [
        { value: "80s", label: "hero explainer" },
        { value: "2D+3D", label: "hybrid technique" },
        { value: "1", label: "reusable motion system" },
      ],
    },
  },
  {
    slug: "graphics",
    label: "Graphics",
    title: "Design Systems & Marketing Graphics",
    eyebrow: "Vertical 06",
    tone: "sky",
    summary: "Marketing collateral, design systems, and a daily-ready social presence.",
    intro:
      "The connective tissue: marketing collateral, design systems, and a continuous stream of premium social and campaign assets — so the studio-grade look extends from the hero film all the way to the last post.",
    capabilities: [
      { name: "Design Systems", detail: "Token-driven brand systems that scale across teams." },
      { name: "Campaign Collateral", detail: "Decks, key art, and launch assets at studio finish." },
      { name: "Social Content", detail: "A daily-ready pipeline of on-brand social assets." },
      { name: "Art Direction", detail: "A single visual language across every touchpoint." },
    ],
    caseStudy: {
      label: "Representative engagement",
      title: "One system, every surface.",
      body: "A complete design system plus a launch-campaign collateral set and an ongoing social pipeline — one visual language from the website hero to the smallest ad unit.",
      metrics: [
        { value: "1", label: "unified system" },
        { value: "30d", label: "content-ready pipeline" },
        { value: "∞", label: "on-brand output" },
      ],
    },
  },
];

export function getVertical(slug: string): Vertical | undefined {
  return verticals.find((v) => v.slug === slug);
}
