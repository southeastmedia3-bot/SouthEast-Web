import { Container } from "@/components/common/container";
import { Reveal } from "@/components/common/reveal";
import { NaturalMedia } from "@/components/pharma/natural-media";
import { saasAssets } from "@/data/media";
import type { VerticalSection } from "@/data/verticals";

/**
 * The named formats, as example tiles — the reference's template gallery.
 *
 * Two columns, not four. The reference runs its examples four-up, which at this
 * page width would put every frame under a third of the viewport and turn the
 * section into the thumbnail wall the media rule exists to prevent. Two columns
 * keeps each frame around 45vw, which is the same composition read at a scale
 * where the picture is still the subject.
 *
 * Frames take their own shape rather than a shared tile, and the aspects are
 * sequenced in `data/media.ts` so no card sits next to — or above — a card
 * cropped the same way. The curtain opens upward; nothing fades in.
 *
 * Columns, not a grid — the same reason `FrameLibrary` uses them. A two-column
 * grid gives every row the height of its tallest cell, so the moment a square
 * render sits beside a 16:9 one (which the alternating aspects guarantee), the
 * shorter card leaves a screen of dead white under its caption. Columns let each
 * card end where it ends. Reading order becomes down-then-across, which is why
 * every card carries its own index.
 */
export function SaasFormatGrid({
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

        <div className="lg:columns-2 lg:gap-8">
          {formats.map((format, i) => {
            const slot = saasAssets.formatFrames[i];
            if (!slot) return null;

            return (
              // `break-inside-avoid` keeps a card from being torn across the
              // column split; `mb-16` is the vertical gutter (columns ignore
              // `gap-y`).
              <article key={format.name} className="mb-16 break-inside-avoid last:mb-0">
                {/* No index-derived delay any more. Columns lay these out
                    down-then-across, so `i` no longer tells you which side of
                    the page a card is on and a stagger keyed to it reads as
                    random. Each curtain opens on its own arrival instead. */}
                <Reveal clip="up" y={0} duration={0.9}>
                  <NaturalMedia
                    image={slot.src}
                    video={slot.video}
                    ratio={slot.w / slot.h}
                    alt={slot.alt}
                    sizes="(min-width: 1024px) 45vw, 92vw"
                    className="rounded-[1.25rem] bg-[#0a0a0d]"
                  />
                </Reveal>

                <div className="mt-6 flex items-start gap-5">
                  <span className="type-index mt-1.5 shrink-0 text-muted">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="type-h4 text-[1.25rem] text-foreground">{format.name}</h3>
                    <p className="type-body mt-2.5 max-w-xl text-muted">{format.detail}</p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
