import { Container } from "@/components/common/container";
import { Reveal } from "@/components/common/reveal";
import { NaturalMedia } from "@/components/pharma/natural-media";
import type { MediaSlot } from "@/data/media";
import { cn } from "@/lib/utils";

/**
 * The side of the notional square each plate is sized against.
 *
 * NOT a row height and not a column width — an AREA. Given a render of ratio r,
 * its plate is `PLATE * sqrt(r)` wide and `PLATE / sqrt(r)` tall, so a 0.45
 * standing figure and a 3.4 thyroid comparison cover the same number of square
 * pixels and land on the page with the same weight. This is the only sizing rule
 * that survives a set spanning that range. Sizing by height turns the wide ones
 * into billboards three times the width of the tall ones; sizing by width turns
 * the tall ones into towers you scroll past in sections.
 *
 * It is deliberately large — a 16:9 frame comes out around 1000px wide on a
 * desktop, which is the full useful width of the container and about the largest
 * these files can be shown before they soften (the deck masters top out at
 * 1280px on the long edge). The page is long as a result. That is the trade this
 * section exists to make: this is the studio's medical work, and a visitor who
 * scrolls this far came to look at it, not to skim thumbnails of it.
 */
const PLATE = "clamp(17rem, 62vw, 47rem)";

/** Width and shape of the plate for a render of `w x h`, at constant area. */
function plate(w: number, h: number) {
  return {
    width: `min(100%, calc(${PLATE} * ${Math.sqrt(w / h).toFixed(4)}))`,
  };
}

/**
 * The complete medical library, shown as plates rather than as a contact sheet.
 *
 * WHY THIS IS NOT `FrameLibrary`. That component mats every frame into one
 * repeated cell, which is right for the five verticals whose sets are broadly
 * one shape and wrong for this one. These renders run from a 0.45:1 standing
 * figure to a 3.4:1 gland comparison, and no cell holds that range: square it up
 * and most frames sit in a wide margin of empty ground, justify it into rows and
 * the thin ones come out as slivers. Neither shows the work — and on this page
 * the work is the entire argument.
 *
 * So each render gets a band of its own, at its own proportions, as large as its
 * master will carry. The plates alternate left and right of the column so the
 * eye keeps moving down a long page instead of tracking one centred stack, and
 * the caption sits in the margin the alternation opens up.
 *
 * The ground is near-black on purpose. These renders were shot on two different
 * grounds — most on black, a handful (the body types, the lung comparison, the
 * brain, the protein) on white — and there is no single page colour that lets
 * both sit flush. On black the black-ground renders float free with no visible
 * frame edge at all, and the white-ground ones read as lit plates. Inverted, the
 * white ones would dissolve into the page and the black ones would look boxed.
 */
export function AnatomyLibrary({
  frames,
  id,
  heading,
  lead,
}: {
  frames: MediaSlot[];
  id?: string;
  heading: string;
  lead?: string;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-36 border-t border-white/10 bg-[#06070a] py-24 md:py-32"
      aria-label={heading}
    >
      <Container size="xl">
        <Reveal>
          <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2">
            <span
              className="block h-[2px] w-10"
              style={{ background: "var(--brand-blue)" }}
              aria-hidden="true"
            />
            <h2 className="type-h3 text-[var(--ink-frame-foreground)]">{heading}</h2>
            <span className="type-index text-[color:var(--brand-ice)]/70">
              {frames.length} frames
            </span>
          </div>
          {lead ? (
            <p className="type-body max-w-2xl text-[color:var(--brand-ice)]/60">{lead}</p>
          ) : null}
        </Reveal>

        <ol className="mt-16 flex flex-col gap-20 md:mt-24 md:gap-32">
          {frames.map((frame, i) => {
            const flip = i % 2 === 1;
            return (
              <li
                key={frame.key}
                className={cn("flex flex-col gap-5", flip ? "md:items-end" : "md:items-start")}
              >
                {/* The plate. The width lives on a plain wrapper and the reveal
                    inside it, so the band holds its shape from the first paint —
                    a frame that arrives late leaves an empty plate, never a
                    collapsed row that shifts everything under it. */}
                <div style={plate(frame.w, frame.h)}>
                  <Reveal y={28} amount={0.15}>
                    <NaturalMedia
                      image={frame.src}
                      alt={frame.alt}
                      ratio={frame.w / frame.h}
                      // The plates run close to container width, so on any screen
                      // the frame is most of the viewport. Two eager: the first
                      // band is usually in view as the section arrives.
                      sizes="(min-width: 1280px) 70vw, (min-width: 768px) 85vw, 100vw"
                      eager={i < 2}
                    />
                  </Reveal>
                </div>

                <figcaption
                  className={cn(
                    "flex items-baseline gap-4",
                    flip ? "md:flex-row-reverse md:text-right" : "",
                  )}
                >
                  <span className="type-index shrink-0 text-[color:var(--brand-ice)]/40 tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="type-h4 text-[var(--ink-frame-foreground)]">{frame.label}</span>
                </figcaption>
              </li>
            );
          })}
        </ol>
      </Container>
    </section>
  );
}
