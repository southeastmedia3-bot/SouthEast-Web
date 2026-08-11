import { CinematicBackdrop } from "@/components/media/cinematic-backdrop";
import { Container } from "@/components/common/container";
import { Reveal } from "@/components/common/reveal";
import { FrameWall } from "@/components/about/frame-wall";
import { InfrastructureBand } from "@/components/about/infrastructure-band";
import { RangeBand } from "@/components/about/range-band";
import { StageTriptych } from "@/components/about/stage-triptych";
import { StudioFlow } from "@/components/scenes/studio-flow";
import { LinkButton } from "@/components/ui/link-button";
import { aboutClose, aboutHero, aboutPrinciples, aboutStory } from "@/data/about";
import { PageWrapper } from "@/components/layout/page-wrapper";
import { JsonLd } from "@/components/seo/json-ld";
import { pageSchema } from "@/lib/schema";
import { metadataFor } from "@/lib/seo";

export const metadata = metadataFor("/about");

/**
 * The page runs dark → light → dark → light → dark, and every dark beat now
 * carries real footage rather than a gradient standing in for it.
 *
 *   1  Hero              the studio's own frames, drifting
 *   2  Story + stages    one job, sketch to render
 *   3  Range             seven disciplines, one band
 *   4  Infrastructure    the four numbers, and the sentence that states them
 *   5  Studio flow       the two charts jobs are actually routed against
 *   6  Principles        the standards underneath
 *   7  Close             the invitation
 *
 * The metrics used to sit between 5 and 7 as a plain row on white — the hardest
 * evidence on the page in its quietest possible setting. They are now beat 4, on
 * black, immediately after the range band has shown what the machines produce.
 */
export default function AboutPage() {
  return (
    // PageWrapper renders <main id="main-content"> — the skip link's target and
    // the landmark this page's content belongs inside.
    <PageWrapper>
      <JsonLd schema={pageSchema("/about")} />

      {/* Hero — the wall of work, with the studio named on top of it. */}
      <section className="relative flex min-h-[88vh] items-end overflow-hidden bg-[#05070d] pb-20 pt-[calc(var(--header-h)+7rem)] md:min-h-[92vh]">
        <FrameWall />
        {/* Lifted above the wall. The wall is a positioned child at the default
            level, and non-positioned in-flow content paints below positioned
            siblings — without this the headline would be behind the frames. */}
        <Container className="relative z-10">
          <Reveal>
            <p className="type-label mb-6 text-[color:var(--brand-ice)]/70">{aboutHero.eyebrow}</p>
          </Reveal>
          <Reveal delay={0.06}>
            <h1 className="type-h1 max-w-4xl text-balance text-[var(--ink-frame-foreground)]">
              {aboutHero.headline}
            </h1>
          </Reveal>
          <Reveal delay={0.14}>
            <p className="type-body-lg mt-8 max-w-2xl text-[color:var(--brand-ice)]/80">
              {aboutHero.body}
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Story, and the three stages of one job underneath it. */}
      <Container className="py-24 md:py-32">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <Reveal>
            <p className="type-label mb-6 text-accent-ink">{aboutStory.eyebrow}</p>
            <h2 className="type-h2 text-balance text-foreground">{aboutStory.title}</h2>
          </Reveal>
          <div className="space-y-6">
            {aboutStory.paragraphs.map((paragraph, i) => (
              <Reveal key={i} delay={i * 0.06}>
                <p className="type-body-lg text-muted">{paragraph}</p>
              </Reveal>
            ))}
          </div>
        </div>

        <StageTriptych />
      </Container>

      {/* The claim the story ends on — "seven disciplines" — shown. */}
      <RangeBand />

      {/* The machines, and the sentence that states what they are. */}
      <InfrastructureBand />

      {/* The org chart and the pipeline chart, published as-is. */}
      <StudioFlow />

      {/* Principles */}
      <section className="border-y border-border bg-surface-elevated/50 py-24 md:py-32">
        <Container>
          <h2 className="type-h3 mb-14 max-w-2xl text-foreground">
            The standards underneath every frame.
          </h2>
          <div className="grid gap-x-12 gap-y-12 md:grid-cols-2">
            {aboutPrinciples.map((principle, i) => (
              <Reveal key={principle.label} delay={(i % 2) * 0.08}>
                <div className="flex gap-6 border-t border-border pt-6">
                  <span className="type-index text-accent-ink" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="type-h4 text-foreground">{principle.label}</h3>
                    <p className="type-body mt-2 text-muted">{principle.detail}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Close */}
      <section className="relative overflow-hidden bg-[#0a0a0d] py-28 text-center md:py-36">
        <CinematicBackdrop tone="violet" />
        <Container>
          <p className="type-label mb-6 text-[color:var(--brand-ice)]/60">{aboutClose.eyebrow}</p>
          <h2 className="type-h2 mx-auto max-w-3xl text-balance text-[var(--ink-frame-foreground)]">
            {aboutClose.headline}
          </h2>
          <p className="type-body-lg mx-auto mt-6 max-w-xl text-[color:var(--brand-ice)]/70">
            {aboutClose.body}
          </p>
          <div className="mt-10">
            <LinkButton href={aboutClose.cta.href} variant="primary" size="lg">
              {aboutClose.cta.label}
            </LinkButton>
          </div>
        </Container>
      </section>
    </PageWrapper>
  );
}
