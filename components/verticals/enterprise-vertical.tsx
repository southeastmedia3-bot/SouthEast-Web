import { ContrastBlock } from "@/components/verticals/contrast-block";
import { EnterpriseEngagementBand } from "@/components/verticals/enterprise-engagement-band";
import { EnterpriseGovernance } from "@/components/verticals/enterprise-governance";
import { EnterpriseSegmentTabs } from "@/components/verticals/enterprise-segment-tabs";
import { EnterpriseWorkMarquee } from "@/components/verticals/enterprise-work-marquee";
import { FaqList } from "@/components/verticals/faq-list";
import { ItemLedger } from "@/components/verticals/item-ledger";
import { ProcessRail } from "@/components/verticals/process-rail";
import { ProofBand } from "@/components/verticals/proof-band";
import { StatBand } from "@/components/verticals/stat-band";
import { VerticalHero } from "@/components/verticals/vertical-hero";
import { VerticalNav, type NavSection } from "@/components/verticals/vertical-nav";
import type { Vertical } from "@/data/verticals";

const RULE = "var(--brand-gold)";

const NAV: NavSection[] = [
  { id: "work", label: "Work" },
  { id: "infrastructure", label: "Infrastructure" },
  { id: "capabilities", label: "Capabilities" },
  { id: "approach", label: "Who it's for" },
  { id: "governance", label: "AI governance" },
  { id: "why", label: "Why us" },
  { id: "process", label: "Process" },
  { id: "faq", label: "FAQ" },
];

/**
 * The Enterprise vertical — its own page, not the shared template.
 *
 * Modelled on the architecture of the studio this vertical competes with
 * (Maverick Frame): hero, then the work drifting past before a word of argument,
 * then the trust band where a reference site drops its client logos, then the
 * buyer segments behind category tabs, then the ask in the middle of the page,
 * then governance, and out through the objections onto a closing band. We took
 * the skeleton and nothing else — no blue theme, no widget chrome, no stock
 * badges. Ink on paper, gold as a hairline, one dark band at the very end.
 *
 * Section order maps to `data/verticals.ts` as:
 *   sections[0] infrastructure · [1] buyer segments · [2] AI governance ·
 *   [3] the engagement.
 */
export function EnterpriseVertical({ vertical }: { vertical: Vertical }) {
  const [infrastructure, segments, governance, engagement] = vertical.sections ?? [];

  return (
    <main id="main-content">
      <VerticalHero
        vertical={vertical}
        accent="Embedded Media Partner"
        primary={{ href: "/contact", label: "Start a conversation" }}
        secondary={{ href: "#work", label: "See the work" }}
      />

      {/* The work, before the argument. */}
      <EnterpriseWorkMarquee id="work" />

      <VerticalNav label={vertical.label} sections={NAV} />

      {/* The logo-wall position. We have no logos; we have hardware. */}
      {infrastructure ? <StatBand id="infrastructure" section={infrastructure} /> : null}

      <ItemLedger
        id="capabilities"
        heading="Capabilities"
        items={vertical.capabilities}
        rule={RULE}
        columns={4}
      />

      {segments ? <EnterpriseSegmentTabs id="approach" section={segments} rule={RULE} /> : null}

      {engagement ? <EnterpriseEngagementBand section={engagement} rule={RULE} /> : null}

      {/* The rest of the engagement — how it is scoped, allocated, reported and
          reviewed — sits under the band it belongs to. */}
      {engagement?.items?.length ? (
        <ItemLedger
          heading={engagement.heading}
          items={engagement.items}
          rule={RULE}
          columns={4}
          className="border-t-0"
        />
      ) : null}

      {governance ? (
        <EnterpriseGovernance id="governance" section={governance} rule={RULE} />
      ) : null}

      {vertical.contrast ? <ContrastBlock contrast={vertical.contrast} rule={RULE} /> : null}

      {vertical.process?.length ? <ProcessRail steps={vertical.process} rule={RULE} /> : null}

      {vertical.faqs?.length ? <FaqList faqs={vertical.faqs} rule={RULE} /> : null}

      {/* The closing band doubles as the closing ask — which is where the
          reference puts its last call to action too. */}
      <ProofBand proof={vertical.proof} cta={{ href: "/contact", label: "Start a conversation" }} />
    </main>
  );
}
