import { SectionSeam } from "@/components/pharma/section-seam";
import { ContrastBlock } from "@/components/verticals/contrast-block";
import { FaqList } from "@/components/verticals/faq-list";
import { FilmsCallSheet } from "@/components/verticals/films-call-sheet";
import { FilmsFormatWall } from "@/components/verticals/films-format-wall";
import { FilmsGate } from "@/components/verticals/films-gate";
import { FilmsLocationBand } from "@/components/verticals/films-location-band";
import { FilmsScreeningRoom } from "@/components/verticals/films-screening-room";
import { FilmsTitleCard } from "@/components/verticals/films-title-card";
import { FrameLibrary } from "@/components/verticals/frame-library";
import { ItemLedger } from "@/components/verticals/item-ledger";
import { NaturalGallery, type GalleryEntry } from "@/components/verticals/natural-gallery";
import { ProcessRail } from "@/components/verticals/process-rail";
import { ProofBand } from "@/components/verticals/proof-band";
import { VerticalNav, type NavSection } from "@/components/verticals/vertical-nav";
import { filmsAssets } from "@/data/media";
import type { Vertical } from "@/data/verticals";

/** Tungsten. The colour of the lamp in every room this page is set in. */
const RULE = "var(--brand-gold)";

const NAV: NavSection[] = [
  { id: "screening", label: "The programme" },
  { id: "units", label: "Units" },
  { id: "formats", label: "Formats" },
  { id: "cut", label: "The cut" },
  { id: "locations", label: "Locations" },
  { id: "why", label: "Why us" },
  { id: "process", label: "Schedule" },
  { id: "work", label: "Work" },
  { id: "library", label: "Library" },
  { id: "faq", label: "FAQ" },
];

/**
 * The Films vertical — its own page, not the shared template.
 *
 * It used to run the shared `VerticalTemplate`: a CSS-gradient hero, four
 * capability paragraphs, the CGI pipeline borrowed from another vertical, a
 * six-tile wall of simultaneous loops, and a frame strip bolted on the end. Every
 * piece of that was defensible in isolation and the sum of it read like a
 * services page for a rendering studio that also owns a camera — on the one page
 * whose entire product is a moving picture.
 *
 * So the page is now built the way a film is presented. It opens on the film
 * itself, full-bleed, behind a gate that pulls back to an anamorphic format. It
 * shows the programme before it makes a single claim. Its capabilities are a call
 * sheet, its formats are slates, its set-piece is a cut scrubbed frame by frame
 * through a gate, and its process is a shooting schedule rather than a render
 * pipeline.
 *
 * THREE DARK ROOMS, DELIBERATE AND ADJACENT TO NOTHING BY ACCIDENT: the title
 * card and screening room (one continuous room, entered together), the gate, and
 * the location band. Every one is entered and left through a seam rather than a
 * hard rule, and the grounds either side of each seam are matched exactly so the
 * page changes key rather than cutting. The paper sections between them carry the
 * argument; the house discipline is unchanged — ink on paper, gold as a hairline,
 * media at its own shape.
 *
 * Section order maps to `vertical.sections` as:
 *   [0] what we shoot · [1] where the unit goes · [2] why uncompressed ·
 *   [3] where it earns.
 */
export function FilmsVertical({ vertical }: { vertical: Vertical }) {
  const [formats, locations, plate, moments] = vertical.sections ?? [];

  // Captions are content and live with the copy; frames are media and live in
  // the manifest. Zipped by index, so swapping a picture never touches what the
  // page says about it.
  const gallery: GalleryEntry[] = filmsAssets.galleryFrames.map((slot, i) => ({
    slot,
    title: vertical.gallery?.[i]?.title ?? slot.alt,
    note: vertical.gallery?.[i]?.note,
  }));

  return (
    <main id="main-content">
      <FilmsTitleCard vertical={vertical} />

      {/* The work, before the argument. Same ground as the title card, so the two
          read as one room the visitor has not left yet. */}
      <FilmsScreeningRoom id="screening" rule={RULE} />

      <VerticalNav label={vertical.label} sections={NAV} />

      <SectionSeam from="#050506" to="var(--surface)" accent="rgba(198,150,59,0.5)" />

      <FilmsCallSheet id="units" units={vertical.capabilities} rule={RULE} />

      {formats ? <FilmsFormatWall id="formats" section={formats} rule={RULE} /> : null}

      <SectionSeam from="var(--surface-elevated)" to="#050506" accent="rgba(198,150,59,0.5)" />

      {/* The set-piece, and the argument it exists to settle. */}
      <FilmsGate id="cut" rule={RULE} section={plate} />

      <SectionSeam from="#050506" to="#05070d" accent="rgba(198,150,59,0.35)" />

      {locations ? <FilmsLocationBand id="locations" section={locations} rule={RULE} /> : null}

      <SectionSeam from="#05070d" to="var(--surface)" accent="rgba(198,150,59,0.5)" />

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

      <NaturalGallery entries={gallery} rule={RULE} heading="Selected work" />

      {/* Everything this division has, as one sheet. */}
      <FrameLibrary
        id="library"
        rule={RULE}
        frames={filmsAssets.library}
        heading="The full film library"
        lead="Every finished frame the division can show — the beauty cut in full, plus the brand, product and social work either side of it."
      />

      {vertical.faqs?.length ? <FaqList faqs={vertical.faqs} rule={RULE} /> : null}

      <ProofBand proof={vertical.proof} cta={{ href: "/contact", label: "Book the unit" }} />
    </main>
  );
}
