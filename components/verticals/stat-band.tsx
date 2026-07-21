import { Container } from "@/components/common/container";
import { Reveal } from "@/components/common/reveal";
import type { VerticalSection } from "@/data/verticals";

/**
 * The trust signal that stands where a reference site drops its client-logo wall.
 *
 * We have no logos to drop, so the proof is hardware: six figures, each with a
 * one-line attribution. Ink on paper, gold used only as a hairline rule — the
 * band earns its weight from the size of the numerals and the space around them,
 * not from a coloured ground.
 *
 * The figures do NOT count up. A count-up animation reads as a dashboard widget
 * and, worse, it makes a hard commercial fact perform — the number is either true
 * or it isn't, and animating it invites the reader to watch rather than believe
 * it. They arrive line by line instead (Subtitle), which is the whole permitted
 * motion here.
 */
export function StatBand({ section, id }: { section: VerticalSection; id?: string }) {
  return (
    <section
      id={id}
      className="scroll-mt-36 border-y border-border bg-[var(--surface)] py-20 md:py-28"
    >
      <Container size="xl">
        <div className="grid gap-x-16 gap-y-8 lg:grid-cols-[26rem_1fr]">
          <div>
            {section.eyebrow ? (
              <p className="type-label mb-4 text-[color:var(--brand-gold)]">{section.eyebrow}</p>
            ) : null}
            <Reveal mask>
              <h2 className="type-h3 text-balance text-foreground">{section.heading}</h2>
            </Reveal>
          </div>
          <div>
            {section.lead ? (
              <Reveal delay={0.06}>
                <p className="type-body-lg max-w-2xl text-foreground">{section.lead}</p>
              </Reveal>
            ) : null}
            {section.body?.map((para, i) => (
              <Reveal key={para.slice(0, 40)} delay={0.12 + i * 0.06}>
                <p className="type-body mt-5 max-w-2xl text-muted">{para}</p>
              </Reveal>
            ))}
          </div>
        </div>

        <dl className="mt-16 grid grid-cols-1 gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {section.items?.map((item, i) => (
            <Reveal key={item.name} delay={(i % 3) * 0.07}>
              <div className="border-t-2 border-[color:var(--brand-gold)]/45 pt-6">
                <dt className="text-[clamp(2.1rem,3.6vw,3.1rem)] font-bold leading-[0.95] tracking-[-0.03em] text-foreground [font-variant-numeric:tabular-nums]">
                  {item.name}
                </dt>
                <dd className="type-body mt-3 max-w-sm text-muted">{item.detail}</dd>
              </div>
            </Reveal>
          ))}
        </dl>
      </Container>
    </section>
  );
}
