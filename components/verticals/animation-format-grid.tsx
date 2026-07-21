import { Container } from "@/components/common/container";
import { Reveal } from "@/components/common/reveal";
import { NaturalMedia } from "@/components/pharma/natural-media";
import { animationAssets } from "@/data/media";
import type { VerticalSection } from "@/data/verticals";

/**
 * The named formats, each with the frame that shows what it means.
 *
 * Columns rather than a grid, for the reason documented on `FrameLibrary`: the
 * aspects here are deliberately mixed — a 3.6:1 LED strip sits in the same run as
 * a 1:1 character master — and a two-column *grid* would give every row the
 * height of its tallest cell and leave a screen of dead white under the shorter
 * one. Columns let each card end where it ends.
 *
 * The caption sits above its frame here, not below. Reading order in a column
 * layout is down-then-across rather than across-then-down, so leading with the
 * name is what makes a card scannable when a visitor is hunting for the one
 * format they came to buy; every card carries its index for the same reason.
 *
 * The curtain is held inside `NaturalMedia` rather than wrapped around it — a
 * `Reveal clip` on the outside takes the frame's dark plate behind the curtain
 * too, and a dropped animation then leaves a permanent hole in the page.
 */
export function AnimationFormatGrid({
  section,
  rule,
  id,
}: {
  section: VerticalSection;
  rule: string;
  id?: string;
}) {
  const formats = section.items ?? [];

  return (
    <section id={id} className="scroll-mt-36 border-t border-border bg-white py-20 md:py-28">
      <Container size="xl">
        <div className="mb-16 max-w-3xl">
          {section.eyebrow ? (
            <p className="type-label mb-4" style={{ color: rule }}>
              {section.eyebrow}
            </p>
          ) : null}
          <Reveal mask>
            <h2 className="type-h2 text-balance text-foreground">{section.heading}</h2>
          </Reveal>
          {section.lead ? (
            <Reveal delay={0.08}>
              <p className="type-body-lg mt-6 text-foreground">{section.lead}</p>
            </Reveal>
          ) : null}
        </div>

        <div className="lg:columns-2 lg:gap-10">
          {formats.map((format, i) => {
            const slot = animationAssets.formatFrames[i];
            if (!slot) return null;

            return (
              <article key={format.name} className="mb-14 break-inside-avoid last:mb-0">
                <div className="mb-5 flex items-baseline gap-4 border-t border-[color:var(--border-strong)] pt-5">
                  <span className="type-index shrink-0 text-muted">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="type-h4 text-[1.25rem] text-foreground">{format.name}</h3>
                </div>

                <NaturalMedia
                  image={slot.src}
                  video={slot.video}
                  ratio={slot.w / slot.h}
                  alt={slot.alt}
                  sizes="(min-width: 1024px) 45vw, 92vw"
                  className="rounded-[1.25rem] bg-[#0a0a0d]"
                  reveal={i % 2 === 0 ? "up" : "left"}
                />

                <p className="type-body mt-5 max-w-xl text-muted">{format.detail}</p>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
