import { AnimationAiRoom } from "@/components/verticals/animation-ai-room";
import { AnimationAnamorphic } from "@/components/verticals/animation-anamorphic";
import { AnimationFormatGrid } from "@/components/verticals/animation-format-grid";
import { AnimationLadder } from "@/components/verticals/animation-ladder";
import { AnimationLightTable } from "@/components/verticals/animation-light-table";
import { AnimationReelTheater } from "@/components/verticals/animation-reel-theater";
import { ContrastBlock } from "@/components/verticals/contrast-block";
import { FaqList } from "@/components/verticals/faq-list";
import { FrameLibrary } from "@/components/verticals/frame-library";
import { ItemLedger } from "@/components/verticals/item-ledger";
import { NaturalGallery, type GalleryEntry } from "@/components/verticals/natural-gallery";
import { ProcessRail } from "@/components/verticals/process-rail";
import { ProofBand } from "@/components/verticals/proof-band";
import { VerticalHero } from "@/components/verticals/vertical-hero";
import { VerticalNav, type NavSection } from "@/components/verticals/vertical-nav";
import { SectionSeam } from "@/components/pharma/section-seam";
import { animationAssets } from "@/data/media";
import type { Vertical } from "@/data/verticals";

const RULE = "var(--brand-gold)";

const NAV: NavSection[] = [
  { id: "reel", label: "The reel" },
  { id: "frames", label: "House style" },
  { id: "capabilities", label: "Capabilities" },
  { id: "formats", label: "Formats" },
  { id: "beyond", label: "Beyond the screen" },
  { id: "ai", label: "AI" },
  { id: "why", label: "Why us" },
  { id: "process", label: "Process" },
  { id: "craft", label: "Craft" },
  { id: "work", label: "Work" },
  { id: "library", label: "Library" },
  { id: "faq", label: "FAQ" },
];

/**
 * The Animation vertical — its own page, not the shared template.
 *
 * The reference this vertical is sold against (3dlabz) is the most direct
 * competitor on the site: an animation studio whose whole homepage is a grid of
 * YouTube embeds, a numbered service list, a logo wall and an FAQ. We took the
 * one structural idea worth taking — lead with the work, before a word of
 * argument — and rebuilt every mechanism underneath it.
 *
 * Where they put six embedded players in a grid, this has one theater with a
 * playlist, so a single film is ever downloading and a visitor always knows where
 * to look. Where they list services as text, this gives every named format the
 * frame that shows what it means. Where they claim experiential work in a
 * paragraph, this folds two planes into an actual corner and runs a different
 * build on each. And where nobody has anything, this has the light table: twelve
 * finished frames scrubbed one at a time by the scroll itself — an animation page
 * that makes you advance frames to read it.
 *
 * The page keeps the house discipline throughout: ink on paper, gold as a
 * hairline, three deliberate dark rooms (the reel, the light table, and the
 * corner into the AI room), each entered and left through a seam rather than a
 * hard rule. All copy comes from `data/verticals.ts`; every frame resolves
 * through `data/media.ts`.
 *
 * Section order maps to that data as:
 *   sections[0] formats · [1] beyond the screen · [2] AI acceleration ·
 *   [3] where it earns.
 */
export function AnimationVertical({ vertical }: { vertical: Vertical }) {
  const [formats, experiential, ai, moments] = vertical.sections ?? [];

  // Captions are content and live with the copy; frames are media and live in
  // the manifest. Zipped by index, so swapping a picture never touches what the
  // page says about it.
  const gallery: GalleryEntry[] = animationAssets.galleryFrames.map((slot, i) => ({
    slot,
    title: vertical.gallery?.[i]?.title ?? slot.alt,
    note: vertical.gallery?.[i]?.note,
  }));

  return (
    <main id="main-content">
      <VerticalHero
        vertical={vertical}
        accent="Experiential Media"
        primary={{ href: "/contact", label: "Start a project" }}
        secondary={{ href: "#reel", label: "Watch the reel" }}
      />

      {/* The work, before the argument. */}
      <AnimationReelTheater id="reel" rule={RULE} />

      <VerticalNav label={vertical.label} sections={NAV} />

      {/* The set-piece. Stays on the dark ground the theater established, so the
          two read as one room the page is still standing in. */}
      <AnimationLightTable id="frames" rule={RULE} />

      <SectionSeam from="#050506" to="var(--surface)" accent="rgba(198,150,59,0.5)" />

      <ItemLedger
        id="capabilities"
        heading="Capabilities"
        items={vertical.capabilities}
        rule={RULE}
        columns={4}
        className="border-t-0"
      />

      {formats ? <AnimationFormatGrid id="formats" section={formats} rule={RULE} /> : null}

      {/* The page changes key here and holds it for two sections — the corner and
          the room the corner is rendered in. Grounds are matched to the sections
          either side so the seams meet them without a visible edge. */}
      <SectionSeam from="#ffffff" to="#05070d" accent="rgba(198,150,59,0.5)" />

      {experiential ? <AnimationAnamorphic id="beyond" section={experiential} rule={RULE} /> : null}

      {ai ? <AnimationAiRoom id="ai" section={ai} rule={RULE} /> : null}

      <SectionSeam from="#05070d" to="var(--surface)" accent="rgba(25,81,168,0.4)" />

      {moments ? (
        <ItemLedger
          eyebrow={moments.eyebrow}
          heading={moments.heading}
          lead={moments.lead}
          items={moments.items ?? []}
          rule={RULE}
          columns={4}
          className="border-t-0"
        />
      ) : null}

      {vertical.contrast ? <ContrastBlock contrast={vertical.contrast} rule={RULE} /> : null}

      {vertical.process?.length ? <ProcessRail steps={vertical.process} rule={RULE} /> : null}

      {/* The rail says the stages. This is the evidence they happened here. */}
      <AnimationLadder id="craft" rule={RULE} />

      <NaturalGallery entries={gallery} rule={RULE} heading="Selected work" />

      {/* Everything else this discipline has, as one sheet. */}
      <FrameLibrary
        id="library"
        rule={RULE}
        frames={[...animationAssets.characterFrames, ...animationAssets.brandBuilds]}
        heading="The full animation library"
        lead="Character frames and brand builds — every finished still the discipline can show, at its own shape."
      />

      {vertical.faqs?.length ? <FaqList faqs={vertical.faqs} rule={RULE} /> : null}

      <ProofBand proof={vertical.proof} cta={{ href: "/contact", label: "Start a project" }} />
    </main>
  );
}
