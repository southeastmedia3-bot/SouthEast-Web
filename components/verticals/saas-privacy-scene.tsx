import { Container } from "@/components/common/container";
import { Reveal } from "@/components/common/reveal";
import { NaturalMedia } from "@/components/pharma/natural-media";
import { saasAssets } from "@/data/media";
import type { VerticalSection } from "@/data/verticals";

/**
 * The page's one deliberate dark room.
 *
 * Everything either side of this section is paper-white, which is exactly what
 * makes the key change land: the argument here is that your unreleased product
 * never leaves the building, and the page physically goes inside the building to
 * make it. It is the only section on the page that changes ground, and it is
 * bridged by seams rather than a hard rule so the shift reads as a cut in grade.
 *
 * The media is a single large frame — no grid, no supporting tiles. One room, one
 * light source, one claim.
 */
export function SaasPrivacyScene({ section, id }: { section: VerticalSection; id?: string }) {
  const frame = saasAssets.aiPrivacyFrame;

  return (
    <section id={id} className="scroll-mt-36 bg-[#05070d] py-20 md:py-28">
      <Container size="xl">
        <div className="max-w-4xl">
          {section.eyebrow ? (
            <p className="type-label mb-4 text-[color:var(--brand-sky)]">{section.eyebrow}</p>
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

        <div className="mt-16 grid gap-x-14 gap-y-12 lg:grid-cols-[24rem_1fr]">
          <div className="order-2 lg:order-1">
            {section.body?.map((para, i) => (
              <Reveal key={para.slice(0, 40)} delay={i * 0.06}>
                <p className="type-body mt-6 border-t border-white/12 pt-6 text-[color:var(--brand-ice)]/70 first:mt-0">
                  {para}
                </p>
              </Reveal>
            ))}
          </div>

          <div className="order-1 lg:order-2">
            <Reveal blur={16} scale={0.97} y={0} duration={1.1} amount={0.25}>
              <NaturalMedia
                image={frame.src}
                video={frame.video}
                ratio={frame.w / frame.h}
                alt={frame.alt}
                sizes="(min-width: 1024px) 58vw, 92vw"
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
