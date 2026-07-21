import { AnatomyReveal } from "@/components/verticals/anatomy-reveal";
import { FaqList } from "@/components/verticals/faq-list";
import { FrameLibrary } from "@/components/verticals/frame-library";
import { SignatureFrame } from "@/components/verticals/signature-frame";
import { VerticalHero } from "@/components/verticals/vertical-hero";
import { VerticalNav, type NavSection } from "@/components/verticals/vertical-nav";
import { ClosingManifesto } from "@/components/pharma/closing-manifesto";
import { FeatureRow } from "@/components/pharma/feature-row";
import { MolecularSection } from "@/components/pharma/molecular-section";
import { OrganAtlas } from "@/components/pharma/organ-atlas";
import { PharmaInclusive } from "@/components/pharma/pharma-inclusive";
import { PharmaIntro } from "@/components/pharma/pharma-intro";
import { SectionSeam } from "@/components/pharma/section-seam";
import { Container } from "@/components/common/container";
import { Reveal } from "@/components/common/reveal";
import { LinkButton } from "@/components/ui/link-button";
import type { Vertical } from "@/data/verticals";
import { pharmaLibrary, pharmaSkin } from "@/data/pharma";
import { pharmaExtraFrames, verticalHeroes } from "@/data/media";

const NAV: NavSection[] = [
  { id: "overview", label: "Overview" },
  { id: "anatomy", label: "Anatomy" },
  { id: "atlas", label: "Atlas" },
  { id: "molecular", label: "Molecular" },
  { id: "library", label: "Library" },
  { id: "faq", label: "FAQ" },
];

/**
 * The pharma vertical — rebuilt from the source deck, not the shared template.
 *
 * Everything below the hero + Mechanism-of-Action signature film is a view over
 * `data/pharma.ts`, which carries all 29 slides. Every deck image and all eight
 * animation loops appear here: the opening statement and credibility, the anatomy
 * library, the scroll-assembled body, inclusive body types and head studies, the
 * organ atlas (disease-state library), dermatology, the molecular / MoA core, and
 * the closing manifesto — then the page's own conversion tail (FAQ, proof, CTA).
 *
 * The hero and the signature film are deliberately unchanged; the brief was to
 * rebuild from after that video down.
 */
export function PharmaVertical({ vertical }: { vertical: Vertical }) {
  const hero = verticalHeroes[vertical.slug];

  return (
    <main id="main-content">
      <VerticalHero vertical={vertical} />
      <VerticalNav label={vertical.label} sections={NAV} />

      {/* The Mechanism-of-Action signature film — kept from the top. */}
      <SignatureFrame
        tone={hero?.tone ?? vertical.tone}
        src={hero?.src}
        video={hero?.video}
        poster={hero?.poster}
        alt={hero?.alt ?? vertical.title}
      />

      {/* Each section change of key is bridged by a seam rather than a hard cut —
          the page shifts light↔dark on purpose. Grounds match each section's own. */}
      <SectionSeam from="var(--background)" to="#1b1710" accent="rgba(54,161,223,0.5)" />

      {/* Slide 1 + credibility (4, 6, 7) */}
      <PharmaIntro />

      <SectionSeam from="#1b1710" to="#ffffff" accent="rgba(25,81,168,0.4)" />

      {/* Slide 2 — the anatomy library */}
      <FeatureRow
        eyebrow={pharmaLibrary.eyebrow}
        title={pharmaLibrary.title}
        body={pharmaLibrary.body}
        points={pharmaLibrary.points}
        image={pharmaLibrary.image}
        imageAlt={pharmaLibrary.imageAlt}
        side="right"
        seamAbove
      />

      <SectionSeam from="#ffffff" to="#000000" accent="rgba(54,161,223,0.5)" />

      {/* Slide 3 — the rigged model assembles itself */}
      <AnatomyReveal />

      <SectionSeam from="#000000" to="var(--surface-elevated)" accent="rgba(25,81,168,0.4)" />

      {/* Slides 4–8 — inclusive anatomy + head studies */}
      <PharmaInclusive />

      {/* Slides 9–22 — the organ atlas */}
      <OrganAtlas />

      <SectionSeam from="#ffffff" to="#05070d" accent="rgba(54,161,223,0.5)" />

      {/* Slide 24 — dermatology */}
      <FeatureRow
        eyebrow={pharmaSkin.eyebrow}
        title={pharmaSkin.title}
        body={pharmaSkin.body}
        image={pharmaSkin.image}
        video={pharmaSkin.video}
        poster={pharmaSkin.poster}
        side="left"
        dark
        seamAbove
      />

      <SectionSeam from="#05070d" to="var(--surface)" accent="rgba(25,81,168,0.4)" />

      {/* Slides 23, 25, 26, 27, 28 — molecular & Mechanism of Action */}
      <MolecularSection />

      <SectionSeam from="var(--surface)" to="#000000" accent="rgba(54,161,223,0.5)" />

      {/* Slide 29 — closing manifesto */}
      <ClosingManifesto />

      {/* The remaining deck cutouts the set-pieces above do not already carry —
          orbital, musculoskeletal, the lung comparison and the body-type range. */}
      <FrameLibrary
        id="library"
        rule="var(--brand-blue)"
        frames={pharmaExtraFrames}
        heading="More from the anatomy library"
        lead="Orbital, musculoskeletal, disease comparison and the body-type range — all expert-reviewed, all built to be posed and sectioned."
      />

      {/* Conversion tail */}
      {vertical.faqs?.length ? <FaqList faqs={vertical.faqs} rule="var(--brand-blue)" /> : null}

      <section className="relative overflow-hidden bg-[#0a0a0d] py-24 md:py-32">
        <Container>
          <Reveal>
            <p className="type-label mb-6 text-[color:var(--brand-ice)]/60">
              {vertical.proof.label}
            </p>
            <h2 className="type-h2 max-w-3xl text-balance text-[var(--ink-frame-foreground)]">
              {vertical.proof.title}
            </h2>
            <p className="type-body-lg mt-6 max-w-2xl text-[color:var(--brand-ice)]/70">
              {vertical.proof.body}
            </p>
          </Reveal>
          <dl className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-3">
            {vertical.proof.metrics.map((m, i) => (
              <Reveal key={m.label} delay={i * 0.08}>
                <div className="border-t border-white/15 pt-5">
                  <dt className="type-h3 text-balance text-[var(--ink-frame-foreground)]">
                    {m.value}
                  </dt>
                  <dd className="type-caption mt-2 uppercase tracking-[0.1em] text-[color:var(--brand-ice)]/55">
                    {m.label}
                  </dd>
                </div>
              </Reveal>
            ))}
          </dl>
        </Container>
      </section>

      <Container className="py-24 text-center md:py-32">
        <Reveal>
          <h2 className="type-h2 mx-auto max-w-3xl text-balance text-foreground">
            Bring us the frame that has to be right.
          </h2>
          <div className="mt-10">
            <LinkButton href="/contact" variant="primary" size="lg">
              Initiate Vendor Protocol
            </LinkButton>
          </div>
        </Reveal>
      </Container>
    </main>
  );
}
