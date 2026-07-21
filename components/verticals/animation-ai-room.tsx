import { Container } from "@/components/common/container";
import { Reveal } from "@/components/common/reveal";
import { NaturalMedia } from "@/components/pharma/natural-media";
import { animationAssets } from "@/data/media";
import type { VerticalSection } from "@/data/verticals";

/**
 * The models the studio runs, named. Kept here rather than in the copy because
 * they are a roster, not a sentence — the prose beside them makes the argument
 * and this says what the argument is about.
 */
const MODELS = ["Kling", "Google Veo", "Luma Dream Machine", "Seedance", "Higgsfield", "Runway"];

/**
 * The page's one deliberate dark room.
 *
 * Everything either side is paper-white, and the key change is the point: the
 * claim is that nothing about a project leaves this building, so the page goes
 * inside the building to make it. Bridged by seams rather than a hard rule, so it
 * reads as a cut in grade.
 *
 * One frame, not a grid — a simulation running on the studio's own farm, which is
 * the literal subject rather than a stock photograph of a server rack.
 */
export function AnimationAiRoom({
  section,
  id,
  rule,
}: {
  section: VerticalSection;
  id?: string;
  rule: string;
}) {
  const frame = animationAssets.aiFrame;

  return (
    <section id={id} className="scroll-mt-36 bg-[#05070d] py-20 md:py-28">
      <Container size="xl">
        <div className="max-w-4xl">
          {section.eyebrow ? (
            <p className="type-label mb-4" style={{ color: rule }}>
              {section.eyebrow}
            </p>
          ) : null}
          <Reveal mask>
            <h2 className="type-h2 text-balance text-[var(--ink-frame-foreground)]">
              {section.heading}
            </h2>
          </Reveal>
          {section.lead ? (
            <Reveal delay={0.08}>
              <p className="type-body-lg mt-6 max-w-2xl text-[color:var(--brand-ice)]/75">
                {section.lead}
              </p>
            </Reveal>
          ) : null}
        </div>

        <div className="mt-16 grid gap-x-14 gap-y-12 lg:grid-cols-[1fr_26rem]">
          <div className="order-2 lg:order-1">
            {section.body?.map((para, i) => (
              <Reveal key={para.slice(0, 40)} delay={i * 0.06}>
                <p className="type-body mt-6 border-t border-white/12 pt-6 text-[color:var(--brand-ice)]/70 first:mt-0">
                  {para}
                </p>
              </Reveal>
            ))}

            <Reveal delay={0.12}>
              <ul className="mt-10 flex flex-wrap gap-2.5">
                {MODELS.map((model) => (
                  <li
                    key={model}
                    className="type-caption rounded-full border border-white/15 px-3.5 py-2 text-[color:var(--brand-ice)]/70"
                  >
                    {model}
                  </li>
                ))}
              </ul>
              <p className="type-caption mt-4 text-[color:var(--brand-ice)]/40">
                All six, on hardware in this building.
              </p>
            </Reveal>
          </div>

          <div className="order-1 lg:order-2">
            <Reveal blur={16} scale={0.97} y={0} duration={1.1}>
              <NaturalMedia
                image={frame.src}
                video={frame.video}
                ratio={frame.w / frame.h}
                alt={frame.alt}
                sizes="(min-width: 1024px) 26rem, 92vw"
                className="rounded-[1.25rem] bg-[#0a0c11]"
              />
            </Reveal>
            <p className="type-caption mt-4 text-[color:var(--brand-ice)]/45">{frame.label}</p>
          </div>
        </div>
      </Container>
    </section>
  );
}
