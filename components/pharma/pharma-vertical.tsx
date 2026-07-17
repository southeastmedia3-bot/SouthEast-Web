import { AnatomyReveal } from "@/components/verticals/anatomy-reveal";
import { FaqList } from "@/components/verticals/faq-list";
import { SignatureFrame } from "@/components/verticals/signature-frame";
import { VerticalHero } from "@/components/verticals/vertical-hero";
import { VerticalNav, type NavSection } from "@/components/verticals/vertical-nav";
import { ClosingManifesto } from "@/components/pharma/closing-manifesto";
import { FeatureRow } from "@/components/pharma/feature-row";
import { MolecularSection } from "@/components/pharma/molecular-section";
import { OrganAtlas } from "@/components/pharma/organ-atlas";
import { PharmaInclusive } from "@/components/pharma/pharma-inclusive";
import { PharmaIntro } from "@/components/pharma/pharma-intro";
import { Container } from "@/components/common/container";
import { Reveal } from "@/components/common/reveal";
import { LinkButton } from "@/components/ui/link-button";
import type { Vertical } from "@/data/verticals";
import { pharmaLibrary, pharmaSkin } from "@/data/pharma";
import { verticalHeroes } from "@/data/media";

const NAV: NavSection[] = [
  { id: "overview", label: "Overview" },
  { id: "anatomy", label: "Anatomy" },
  { id: "atlas", label: "Atlas" },
  { id: "molecular", label: "Molecular" },
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

      {/* Slide 1 + credibility (4, 6, 7) */}
      <PharmaIntro />

      {/* Slide 2 — the anatomy library */}
      <FeatureRow
        eyebrow={pharmaLibrary.eyebrow}
        title={pharmaLibrary.title}
        body={pharmaLibrary.body}
        points={pharmaLibrary.points}
        image={pharmaLibrary.image}
        imageAlt={pharmaLibrary.imageAlt}
        imageContain
        side="right"
      />

      {/* Slide 3 — the rigged model assembles itself */}
      <AnatomyReveal />

      {/* Slides 4–8 — inclusive anatomy + head studies */}
      <PharmaInclusive />

      {/* Slides 9–22 — the organ atlas */}
      <OrganAtlas />

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
      />

      {/* Slides 23, 25, 26, 27, 28 — molecular & Mechanism of Action */}
      <MolecularSection />

      {/* Slide 29 — closing manifesto */}
      <ClosingManifesto />

      {/* Conversion tail */}
      {vertical.faqs?.length ? <FaqList faqs={vertical.faqs} rule="var(--brand-blue)" /> : null}

      <section className="relative overflow-hidden bg-[#0a0a0d] py-24 md:py-32">
        <Container>
          <Reveal>
            <p className="type-label mb-6 text-[color:var(--brand-ice)]/60">{vertical.proof.label}</p>
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
