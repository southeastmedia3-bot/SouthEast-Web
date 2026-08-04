import { Container } from "@/components/common/container";
import { Reveal } from "@/components/common/reveal";
import { NaturalMedia } from "@/components/pharma/natural-media";
import type { MediaSlot } from "@/data/media";

/**
 * The complete medical library, laid out in columns.
 *
 * WHY COLUMNS AND NOT A GRID OF CELLS. A repeated cell is right for the five
 * verticals whose sets are broadly one shape and wrong for this one: these
 * renders run from a 0.45:1 standing figure to a 3.4:1 gland comparison, and no
 * single cell holds that range. Square it up and most frames sit in a wide margin
 * of empty ground; justify it into rows of a common height and a row that happens
 * to catch two tall frames balloons to fill the width, because filling the width
 * is what justification does. Columns have neither problem. Every frame is the
 * width of its column and as tall as its own proportions make it — nothing
 * cropped, nothing matted, nothing stretched to square off a row.
 *
 * THE SIZE IS THE POINT OF THIS VERSION. The previous one gave each render a band
 * to itself at up to 1376px wide, which ran the section to twenty thousand pixels
 * and was rejected as too big. Three columns puts each frame at about 450px on a
 * desktop — large enough to read a kidney from a pancreas at arm's length, small
 * enough that a screenful is a set of work rather than one picture. The section
 * comes out around 3,400px, a sixth of what it was.
 *
 * Column count steps 1 → 2 → 3 rather than going to 4: at four columns the frames
 * are ~330px, which is back to thumbnails, and the tallest ones (the leg, the
 * knee) stop being legible.
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

        {/*
          One reveal for the whole set, not one per frame. A `Reveal` renders a
          transformed div, and a transform inside a multi-column flow is what
          fragments a column badly in some engines — a frame gets split across the
          gutter, or the balancing gives up and one column runs long. The frames
          lazy-load as they come into view anyway, so the motion buys nothing that
          is worth that risk.
        */}
        <Reveal y={24} amount={0.05} className="mt-14 md:mt-16">
          <div className="gap-4 [column-fill:balance] columns-1 sm:columns-2 xl:columns-3">
            {frames.map((frame, i) => (
              // `break-inside-avoid` is load-bearing: without it a tall frame is
              // sliced in half at the foot of a column and continues at the head
              // of the next one.
              <figure key={frame.key} className="mb-9 break-inside-avoid">
                <NaturalMedia
                  image={frame.src}
                  alt={frame.alt}
                  ratio={frame.w / frame.h}
                  sizes="(min-width: 1280px) 32vw, (min-width: 640px) 46vw, 92vw"
                  eager={i < 3}
                />
                <figcaption className="mt-3 flex items-baseline gap-3">
                  <span className="type-index shrink-0 text-[color:var(--brand-ice)]/40 tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="type-caption text-[color:var(--brand-ice)]/75">
                    {frame.label}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
