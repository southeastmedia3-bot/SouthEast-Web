import { CinematicBackdrop } from "@/components/media/cinematic-backdrop";
import { MediaFrame } from "@/components/common/media-frame";
import { Container } from "@/components/common/container";
import { LinkButton } from "@/components/ui/link-button";
import type { Vertical } from "@/data/verticals";
import { verticalHeroes } from "@/data/media";
import { cn } from "@/lib/utils";

const toneRule: Record<string, string> = {
  blue: "var(--brand-blue)",
  sky: "var(--brand-sky)",
  gold: "var(--brand-gold)",
  violet: "var(--brand-violet)",
};

/**
 * The shared layout every vertical subpage renders — hero, capabilities, a
 * representative case study, and a close. Fed by a single `Vertical` record so
 * the six pages stay identical in structure and never drift.
 */
export function VerticalTemplate({ vertical }: { vertical: Vertical }) {
  const hero = verticalHeroes[vertical.slug];
  const rule = toneRule[vertical.tone] ?? "var(--brand-sky)";

  return (
    <div>
      {/* Hero */}
      <section className="relative flex min-h-[86vh] items-end overflow-hidden bg-[#05070d] pb-16 pt-40">
        <CinematicBackdrop tone={vertical.tone === "gold" ? "mixed" : vertical.tone} scan />
        <Container>
          <p className="type-label mb-6 text-[color:var(--brand-ice)]/70">{vertical.eyebrow}</p>
          <h1 className="type-h1 max-w-4xl text-balance text-[var(--ink-frame-foreground)]">
            {vertical.title}
          </h1>
          <p className="type-body-lg mt-8 max-w-2xl text-[color:var(--brand-ice)]/75">
            {vertical.intro}
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <LinkButton href="/contact" variant="primary" size="lg">
              Start a project
            </LinkButton>
            <LinkButton
              href="/verticals"
              variant="outline"
              size="lg"
              className="border-white/25 text-[var(--ink-frame-foreground)] hover:border-white/60 hover:text-[var(--ink-frame-foreground)]"
            >
              All verticals
            </LinkButton>
          </div>
        </Container>
      </section>

      {/* Signature frame */}
      <Container className="py-16 md:py-20">
        <MediaFrame
          tone={hero?.tone ?? vertical.tone}
          ratio="wide"
          src={hero?.src}
          video={hero?.video}
          poster={hero?.poster}
          alt={hero?.alt ?? vertical.title}
          className="w-full"
          sizes="(min-width: 1024px) 80vw, 92vw"
        />
      </Container>

      {/* Capabilities */}
      <Container className="py-16 md:py-24">
        <div className="mb-12 flex items-center gap-4">
          <span className="block h-[2px] w-10" style={{ background: rule }} aria-hidden="true" />
          <h2 className="type-h3 text-foreground">Capabilities</h2>
        </div>
        <div className="grid gap-x-10 gap-y-12 md:grid-cols-2">
          {vertical.capabilities.map((cap, i) => (
            <div key={cap.name} className="border-t border-border pt-6">
              <span className="type-index text-muted">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="type-h4 mt-3 text-foreground">{cap.name}</h3>
              <p className="type-body mt-2 text-muted">{cap.detail}</p>
            </div>
          ))}
        </div>
      </Container>

      {/* Case study */}
      <section className="relative overflow-hidden bg-[#0a0a0d] py-24 md:py-32">
        <Container>
          <p className="type-label mb-6 text-[color:var(--brand-ice)]/60">
            {vertical.caseStudy.label}
          </p>
          <h2 className="type-h2 max-w-3xl text-balance text-[var(--ink-frame-foreground)]">
            {vertical.caseStudy.title}
          </h2>
          <p className="type-body-lg mt-6 max-w-2xl text-[color:var(--brand-ice)]/70">
            {vertical.caseStudy.body}
          </p>
          <dl className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-3">
            {vertical.caseStudy.metrics.map((m) => (
              <div key={m.label} className="border-t border-white/15 pt-5">
                <dt className="type-display text-[var(--ink-frame-foreground)]">{m.value}</dt>
                <dd className="type-caption mt-2 uppercase tracking-[0.1em] text-[color:var(--brand-ice)]/55">
                  {m.label}
                </dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      {/* Close */}
      <Container className="py-24 text-center md:py-32">
        <h2 className={cn("type-h2 mx-auto max-w-3xl text-balance text-foreground")}>
          Bring us the frame that has to be right.
        </h2>
        <div className="mt-10">
          <LinkButton href="/contact" variant="primary" size="lg">
            Initiate Vendor Protocol
          </LinkButton>
        </div>
      </Container>
    </div>
  );
}
