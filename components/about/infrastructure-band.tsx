import { AnimatedCounter } from "@/components/common/animated-counter";
import { Container } from "@/components/common/container";
import { Reveal } from "@/components/common/reveal";
import { LazyLoopVideo } from "@/components/media/lazy-loop-video";
import { aboutInfrastructure, aboutMetrics } from "@/data/about";
import { aboutInfrastructureBed } from "@/data/media";

/**
 * The four numbers, given a room of their own.
 *
 * They used to sit on the white ground between two other white sections as a
 * plain four-column row — the page's hardest evidence, presented as its quietest
 * moment. Here they are full-bleed black over a live simulation loop, which is
 * the one piece of footage on the site that shows the farm doing the thing the
 * figures describe.
 *
 * THE SENTENCE UNDER THEM IS NOT A CAPTION. A figure and a label sitting near
 * each other is not a claim an answer engine can lift — there is no subject and
 * no verb in "100TB / secure RAID-configured storage". `aboutInfrastructure
 * .statement` says the same thing as one declarative sentence with the studio as
 * its subject, which is quotable verbatim. See docs/SEO_GEO_AEO.md §3.2; it is
 * also simply the clearer way to tell a reader what they are looking at.
 *
 * The film is scenery: `decorative`, so it is never announced and never handed
 * controls, and scrimmed to near-black so the numerals stay the brightest thing
 * in the section.
 */
export function InfrastructureBand() {
  return (
    <section className="relative isolate overflow-hidden bg-[#05060b] py-24 md:py-32">
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <LazyLoopVideo
          src={aboutInfrastructureBed.video as string}
          poster={aboutInfrastructureBed.poster}
          decorative
          className="opacity-40"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(5,6,11,0.94) 0%, rgba(5,6,11,0.72) 40%, rgba(5,6,11,0.9) 100%)",
          }}
        />
        <div className="grain absolute inset-0 opacity-70" />
      </div>

      <Container>
        <div className="max-w-3xl">
          <Reveal>
            <p className="type-label mb-5 text-[color:var(--brand-ice)]/60">
              {aboutInfrastructure.eyebrow}
            </p>
            <h2 className="type-h2 text-balance text-[var(--ink-frame-foreground)]">
              {aboutInfrastructure.title}
            </h2>
          </Reveal>
        </div>

        <dl className="mt-16 grid grid-cols-2 gap-x-8 gap-y-12 lg:grid-cols-4">
          {aboutMetrics.map((metric, i) => (
            // min-w-0: a grid column's default `min-width: auto` refuses to be
            // narrower than its content, so an oversized figure runs out over its
            // neighbour instead of being contained.
            <div key={metric.label} className="min-w-0 border-t border-white/15 pt-5">
              <Reveal delay={i * 0.06}>
                {/* `type-h2`, and do not raise it. The figures are five glyphs
                    wide at their longest ("100TB") and this is a four-column
                    grid: at `type-h1` the widest figure is wider than the column
                    it sits in on a desktop, and wider than half a phone at the
                    clamp's floor. It ran over its neighbour once already. The
                    drama here comes from the black ground and the film behind
                    it, not from another two rem of type. */}
                <dt className="type-h2 tabular-nums text-[var(--ink-frame-foreground)]">
                  <AnimatedCounter value={metric.value} suffix={metric.suffix} />
                </dt>
                <dd className="type-caption mt-3 uppercase tracking-[0.1em] text-[color:var(--brand-ice)]/55">
                  {metric.label}
                </dd>
              </Reveal>
            </div>
          ))}
        </dl>

        <Reveal delay={0.1}>
          <p className="type-body-lg mt-16 max-w-4xl border-t border-white/10 pt-8 text-[color:var(--brand-ice)]/75">
            {aboutInfrastructure.statement}
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
