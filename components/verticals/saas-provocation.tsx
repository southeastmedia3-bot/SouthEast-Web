import { Container } from "@/components/common/container";
import { Reveal } from "@/components/common/reveal";
import { LinkButton } from "@/components/ui/link-button";
import type { VerticalSection } from "@/data/verticals";

/**
 * The closing statement — the reference's one-line CTA band, in our voice.
 *
 * One sentence, set at display scale, with more empty page around it than any
 * other section on the site. That emptiness is the section: the argument has
 * already been made eight screens above, and this is the page declining to make
 * it again. The only thing competing with the line is the single button under it.
 *
 * The heading breaks where a director would cut, not where the measure runs out,
 * which is why it carries no `max-w` and is allowed to run wide.
 */
export function SaasProvocation({ section }: { section: VerticalSection }) {
  return (
    <section className="border-t border-border bg-white py-32 md:py-44">
      <Container size="xl">
        {section.eyebrow ? <p className="type-label mb-10 text-muted">{section.eyebrow}</p> : null}

        <Reveal mask duration={1.1}>
          <h2 className="max-w-5xl text-balance text-[clamp(2.4rem,6.2vw,5rem)] font-bold leading-[0.98] tracking-[-0.03em] text-foreground">
            {section.heading}
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-x-16 gap-y-8 lg:grid-cols-[1fr_20rem]">
          <div>
            {section.lead ? (
              <Reveal delay={0.1}>
                <p className="type-body-lg max-w-2xl text-foreground">{section.lead}</p>
              </Reveal>
            ) : null}
            {section.body?.map((para, i) => (
              <Reveal key={para.slice(0, 40)} delay={0.16 + i * 0.05}>
                <p className="type-body mt-5 max-w-2xl text-muted">{para}</p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.22} className="lg:justify-self-end lg:self-end">
            <LinkButton href="/contact" variant="primary" size="lg">
              Send the brief
            </LinkButton>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
