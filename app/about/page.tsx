import { CinematicBackdrop } from "@/components/media/cinematic-backdrop";
import { MediaFrame } from "@/components/common/media-frame";
import { Container } from "@/components/common/container";
import { AnimatedCounter } from "@/components/common/animated-counter";
import { StudioFlow } from "@/components/scenes/studio-flow";
import { LinkButton } from "@/components/ui/link-button";
import { aboutClose, aboutHero, aboutMetrics, aboutPrinciples, aboutStory } from "@/data/about";
import { aboutAssets } from "@/data/media";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Who We Are",
  description: aboutHero.body,
  path: "/about",
});

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative flex min-h-[80vh] items-end overflow-hidden bg-[#05070d] pb-16 pt-40">
        <CinematicBackdrop tone="blue" scan />
        <Container>
          <p className="type-label mb-6 text-[color:var(--brand-ice)]/70">{aboutHero.eyebrow}</p>
          <h1 className="type-h1 max-w-4xl text-balance text-[var(--ink-frame-foreground)]">
            {aboutHero.headline}
          </h1>
          <p className="type-body-lg mt-8 max-w-2xl text-[color:var(--brand-ice)]/75">
            {aboutHero.body}
          </p>
        </Container>
      </section>

      {/* Story */}
      <Container className="py-24 md:py-32">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <div>
            <p className="type-label mb-6 text-accent">{aboutStory.eyebrow}</p>
            <h2 className="type-h2 text-balance text-foreground">{aboutStory.title}</h2>
          </div>
          <div className="space-y-6">
            {aboutStory.paragraphs.map((p, i) => (
              <p key={i} className="type-body-lg text-muted">
                {p}
              </p>
            ))}
          </div>
        </div>

        {/* Atmosphere strip */}
        <div className="mt-20 grid grid-cols-2 gap-5 md:grid-cols-3">
          {aboutAssets.map((asset, i) => (
            <MediaFrame
              key={i}
              tone={asset.tone}
              ratio={asset.ratio ?? "portrait"}
              src={asset.src}
              alt={asset.alt}
              className={i === 1 ? "md:mt-10" : undefined}
              sizes="(min-width: 768px) 30vw, 46vw"
            />
          ))}
        </div>
      </Container>

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
              <div key={principle.label} className="flex gap-6 border-t border-border pt-6">
                <span className="type-index text-accent">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="type-h4 text-foreground">{principle.label}</h3>
                  <p className="type-body mt-2 text-muted">{principle.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Metrics */}
      <Container className="py-24 md:py-32">
        <dl className="grid grid-cols-2 gap-x-8 gap-y-12 lg:grid-cols-4">
          {aboutMetrics.map((m) => (
            <div key={m.label} className="border-t border-border pt-5">
              <dt className="type-display text-foreground">
                <AnimatedCounter value={m.value} suffix={m.suffix} />
              </dt>
              <dd className="type-caption mt-3 uppercase tracking-[0.1em] text-muted">{m.label}</dd>
            </div>
          ))}
        </dl>
      </Container>

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
    </div>
  );
}
