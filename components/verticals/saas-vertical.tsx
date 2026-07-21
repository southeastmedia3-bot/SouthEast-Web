import { ContrastBlock } from "@/components/verticals/contrast-block";
import { FaqList } from "@/components/verticals/faq-list";
import { ItemLedger } from "@/components/verticals/item-ledger";
import { NaturalGallery, type GalleryEntry } from "@/components/verticals/natural-gallery";
import { ProcessRail } from "@/components/verticals/process-rail";
import { ProofBand } from "@/components/verticals/proof-band";
import { SaasFormatGrid } from "@/components/verticals/saas-format-grid";
import { SaasIoPanel } from "@/components/verticals/saas-io-panel";
import { SaasPrivacyScene } from "@/components/verticals/saas-privacy-scene";
import { SaasProvocation } from "@/components/verticals/saas-provocation";
import { SaasRoleMarquee } from "@/components/verticals/saas-role-marquee";
import { VerticalHero } from "@/components/verticals/vertical-hero";
import { VerticalNav, type NavSection } from "@/components/verticals/vertical-nav";
import { SectionSeam } from "@/components/pharma/section-seam";
import { saasAssets } from "@/data/media";
import type { Vertical } from "@/data/verticals";

const RULE = "var(--brand-violet)";

const NAV: NavSection[] = [
  { id: "capabilities", label: "Capabilities" },
  { id: "approach", label: "The squad" },
  { id: "formats", label: "Formats" },
  { id: "why", label: "Why us" },
  { id: "process", label: "Process" },
  { id: "work", label: "Work" },
  { id: "faq", label: "FAQ" },
];

/**
 * The SaaS vertical — its own page, not the shared template.
 *
 * The architecture is modelled on the reference this vertical is selling against
 * (Agent Opus): statement headline, then the input → output device before a word
 * of argument, then the squad as a moving run, then the named formats as example
 * tiles, then the one hard claim in a room of its own, closing on a single line.
 * The skeleton is theirs. Nothing else is: no dark chrome, no neon, no product-UI
 * styling — the whole thing is ink on paper with one deliberate dark scene, and
 * every reveal is a named primitive from the motion language.
 *
 * All copy comes from `data/verticals.ts`; every frame resolves through
 * `data/media.ts`. Section order maps to that data as:
 *   sections[0] squad · [1] formats · [2] AI privacy · [3] where it earns ·
 *   [4] the closing provocation.
 */
export function SaasVertical({ vertical }: { vertical: Vertical }) {
  const [squad, formats, privacy, moments, provocation] = vertical.sections ?? [];

  // The gallery's captions are content and live with the copy; its frames are
  // placeholders and live in the media manifest. Zipped by index so that
  // swapping a picture never touches what the page says about it.
  const gallery: GalleryEntry[] = saasAssets.galleryFrames.map((slot, i) => ({
    slot,
    title: vertical.gallery?.[i]?.title ?? slot.alt,
    note: vertical.gallery?.[i]?.note,
  }));

  return (
    <main id="main-content">
      <VerticalHero
        vertical={vertical}
        accent="launch film."
        primary={{ href: "/contact", label: "Send the brief" }}
        secondary={{ href: "#formats", label: "See the formats" }}
      />

      <VerticalNav label={vertical.label} sections={NAV} />

      {/* The signature device: what goes in, what comes out. */}
      <SaasIoPanel
        script={vertical.summary}
        outputCount={formats?.items?.length ?? 0}
        rule={RULE}
      />

      <ItemLedger
        id="capabilities"
        heading="Capabilities"
        items={vertical.capabilities}
        rule={RULE}
        columns={4}
      />

      {squad ? <SaasRoleMarquee id="approach" section={squad} rule={RULE} /> : null}

      {formats ? <SaasFormatGrid id="formats" section={formats} rule={RULE} /> : null}

      {/* The page changes key here and back again. Grounds are matched to the
          sections either side so the seams meet them without a visible edge. */}
      <SectionSeam from="#ffffff" to="#05070d" accent="rgba(54,161,223,0.5)" />

      {privacy ? <SaasPrivacyScene id="privacy" section={privacy} /> : null}

      <SectionSeam from="#05070d" to="var(--surface)" accent="rgba(54,43,90,0.55)" />

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

      <NaturalGallery entries={gallery} rule={RULE} />

      {provocation ? <SaasProvocation section={provocation} /> : null}

      <ProofBand proof={vertical.proof} />

      {vertical.faqs?.length ? <FaqList faqs={vertical.faqs} rule={RULE} /> : null}
    </main>
  );
}
