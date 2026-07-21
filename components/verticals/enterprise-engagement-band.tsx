import { Check } from "lucide-react";
import { Container } from "@/components/common/container";
import { Reveal } from "@/components/common/reveal";
import { LinkButton } from "@/components/ui/link-button";
import type { VerticalSection } from "@/data/verticals";

/**
 * The mid-page ask — the reference's "ready to start without hiring, chasing
 * freelancers, or managing a vendor chain?" band, in the same position.
 *
 * A full-width band with one question, the four things you get instead, and the
 * button. It sits in the middle of the page on purpose: an enterprise buyer who
 * has read this far has already decided, and making them scroll another five
 * screens to find the ask is how that decision cools off.
 *
 * The four points are the honest ones from the engagement data — no guarantee,
 * no turnaround promise, nothing the rest of the page cannot back up.
 */
export function EnterpriseEngagementBand({
  section,
  rule,
}: {
  section: VerticalSection;
  rule: string;
}) {
  return (
    <section className="border-y border-border bg-[var(--surface-elevated)] py-20 md:py-24">
      <Container size="xl">
        <div className="grid gap-x-16 gap-y-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            {section.eyebrow ? (
              <p className="type-label mb-5" style={{ color: rule }}>
                {section.eyebrow}
              </p>
            ) : null}
            <Reveal mask>
              <h2 className="type-h3 max-w-3xl text-balance text-foreground">
                {section.lead ?? section.heading}
              </h2>
            </Reveal>

            {section.bullets?.length ? (
              <ul className="mt-10 grid gap-x-10 gap-y-4 sm:grid-cols-2">
                {section.bullets.map((bullet, i) => (
                  <Reveal key={bullet} delay={(i % 2) * 0.06}>
                    <li className="flex gap-3.5">
                      <Check
                        className="mt-0.5 size-5 shrink-0"
                        style={{ color: rule }}
                        aria-hidden="true"
                      />
                      <span className="type-body text-foreground">{bullet}</span>
                    </li>
                  </Reveal>
                ))}
              </ul>
            ) : null}
          </div>

          <Reveal delay={0.16} className="lg:justify-self-end">
            <LinkButton href="/contact" variant="primary" size="lg">
              Start a conversation
            </LinkButton>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
