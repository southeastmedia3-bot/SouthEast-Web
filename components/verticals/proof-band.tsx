import { Container } from "@/components/common/container";
import { Reveal } from "@/components/common/reveal";
import { LinkButton } from "@/components/ui/link-button";
import type { Vertical } from "@/data/verticals";

/**
 * The dark band near the foot of the page: capability and terms, never a
 * fabricated client story.
 *
 * Identical in substance to the block the shared template renders — lifted into
 * its own component so the two bespoke pages can carry it without either of them
 * re-implementing it, and so Enterprise can fold the closing ask into it (its
 * reference closes on this band rather than on a separate CTA screen).
 */
export function ProofBand({
  proof,
  cta,
}: {
  proof: Vertical["proof"];
  cta?: { href: string; label: string };
}) {
  return (
    <section className="relative overflow-hidden bg-[#0a0a0d] py-24 md:py-32">
      <Container>
        <Reveal>
          <p className="type-label mb-6 text-[color:var(--brand-ice)]/60">{proof.label}</p>
          <h2 className="type-h2 max-w-3xl text-balance text-[var(--ink-frame-foreground)]">
            {proof.title}
          </h2>
          <p className="type-body-lg mt-6 max-w-2xl text-[color:var(--brand-ice)]/70">
            {proof.body}
          </p>
        </Reveal>

        <dl className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-3">
          {proof.metrics.map((m, i) => (
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

        {cta ? (
          <Reveal delay={0.12}>
            <div className="mt-14">
              <LinkButton href={cta.href} variant="primary" size="lg">
                {cta.label}
              </LinkButton>
            </div>
          </Reveal>
        ) : null}
      </Container>
    </section>
  );
}
