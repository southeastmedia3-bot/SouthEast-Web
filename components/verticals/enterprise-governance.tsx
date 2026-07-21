import { Container } from "@/components/common/container";
import { Reveal } from "@/components/common/reveal";
import { NaturalMedia } from "@/components/pharma/natural-media";
import { enterpriseAssets } from "@/data/media";
import type { VerticalSection } from "@/data/verticals";

/**
 * The AI operating model, as a document rather than a scene.
 *
 * The SaaS page makes the same argument in a dark room with one big frame,
 * because there the point is speed and secrecy and it should feel like being let
 * inside. Here the point is governance — the reader is a procurement board, and
 * what they want is a page they could paste into a risk assessment. So this one
 * stays on paper, runs its heading down the left in a held column, and ends with
 * the four questions answered as ruled rows: where it runs, what it is used for,
 * what it never does, why it matters. Same claim, opposite rhythm, so the two
 * pages never read as one another's copy.
 *
 * One frame carries the argument — the studio's own pipeline, which is the thing
 * the whole section is asserting control over. It sits *inside* the right-hand
 * column, under the body copy, rather than running full-bleed underneath both.
 * Full-bleed was the bug: the asset is square, so at 92vw it rendered close to
 * 1800px tall on a desktop — two screens of one picture, which read as the page
 * having simply stopped, and left the sticky heading holding against nothing.
 * In the column it is a plate beside an argument, and the section is a third
 * shorter.
 */
export function EnterpriseGovernance({
  section,
  rule,
  id,
}: {
  section: VerticalSection;
  rule: string;
  id?: string;
}) {
  const frame = enterpriseAssets.governanceFrame;

  return (
    <section id={id} className="scroll-mt-36 border-t border-border bg-white py-20 md:py-28">
      <Container size="xl">
        <div className="grid gap-x-16 gap-y-10 lg:grid-cols-[26rem_1fr]">
          <div className="lg:sticky lg:top-40 lg:self-start">
            {section.eyebrow ? (
              <p className="type-label mb-4" style={{ color: rule }}>
                {section.eyebrow}
              </p>
            ) : null}
            <Reveal mask>
              <h2 className="type-h3 text-balance text-foreground">{section.heading}</h2>
            </Reveal>
            {section.lead ? (
              <Reveal delay={0.08}>
                <p className="type-body mt-5 text-muted">{section.lead}</p>
              </Reveal>
            ) : null}
          </div>

          <div>
            {section.body?.map((para, i) => (
              <Reveal key={para.slice(0, 40)} delay={i * 0.06}>
                <p className="type-body-lg mt-6 max-w-2xl text-foreground first:mt-0">{para}</p>
              </Reveal>
            ))}

            <Reveal clip="right" y={0} duration={1.05} className="mt-10 max-w-2xl">
              <NaturalMedia
                image={frame.src}
                video={frame.video}
                ratio={frame.w / frame.h}
                alt={frame.alt}
                sizes="(min-width: 1024px) 42vw, 92vw"
                className="rounded-[1.5rem] bg-[#0a0a0d]"
              />
            </Reveal>
            {frame.label ? (
              <p className="type-caption mt-4 max-w-2xl text-muted">{frame.label}</p>
            ) : null}
          </div>
        </div>

        {/* The four questions, as rows. A procurement reader scans the left
            column for the one they came to check. */}
        <dl className="mt-16 border-t border-border-strong">
          {section.items?.map((item, i) => (
            <Reveal key={item.name} delay={i * 0.05}>
              <div className="grid gap-x-14 gap-y-2 border-b border-border py-7 md:grid-cols-[18rem_1fr]">
                <dt className="type-h4 text-[1.1rem] text-foreground">{item.name}</dt>
                <dd className="type-body max-w-2xl text-muted">{item.detail}</dd>
              </div>
            </Reveal>
          ))}
        </dl>
      </Container>
    </section>
  );
}
