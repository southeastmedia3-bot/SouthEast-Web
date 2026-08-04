import { Container } from "@/components/common/container";
import { Reveal } from "@/components/common/reveal";
import { NaturalMedia } from "@/components/pharma/natural-media";
import type { MediaSlot } from "@/data/media";
import { cn } from "@/lib/utils";

/**
 * How tall a plate is allowed to run.
 *
 * EQUAL AREA WAS THE WRONG RULE. It was the second attempt here and it read as
 * fair — every render covering the same number of square pixels, so no shape
 * dominated — but "fair" is not what this section is for. Averaging the area
 * across a set that spans 0.34:1 to 3.4:1 means nothing is ever shown at the
 * size it needs, and the whole library came out small enough that you had to
 * lean at the screen to tell a kidney from a pancreas.
 *
 * So the rule now is simply: AS LARGE AS IT GOES. Each plate takes the largest
 * of the three sizes it is allowed — the column's full width, this much height,
 * or a soft ceiling on how far its own file can be enlarged — whichever binds
 * first. In practice a wide render fills the column and a tall one fills the
 * screen, which is what each of them needed all along.
 *
 * Tracking the viewport keeps a tall render to about a screenful, so it is taken
 * in as one image rather than scrolled through in pieces; the rem cap stops it
 * from outrunning the file on a tall display.
 */
const PLATE_H = "clamp(26rem, 105vh, 80rem)";

/**
 * How far past its own pixels a file may be enlarged.
 *
 * The deck masters top out at 1280px on the long edge, and several of the frames
 * cut from the slides are smaller than that. Without a ceiling the widest of
 * them would be stretched over a 1376px column from a 657px original. At 1.75
 * the softest frame on the page is still sharp at reading distance, which is the
 * distance this section is composed for.
 */
const MAX_ZOOM = 1.75;

/** The plate for a render of `w x h`: the largest size all three limits allow. */
function plate(w: number, h: number) {
  return {
    width: `min(100%, ${Math.round(w * MAX_ZOOM)}px, calc(${PLATE_H} * ${(w / h).toFixed(4)}))`,
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
 * master will carry — see PLATE_H. The plates alternate left and right of the
 * column so the eye keeps moving down a long page instead of tracking one
 * centred stack, and the caption sits in the margin the alternation opens up.
 *
 * THE FILES ARE CROPPED TO THEIR SUBJECT, which is half of why this reads at a
 * distance. The deck exports carry a lot of ground: the kidney and pancreas sat
 * in a frame they filled 44% of, the liver 55%, the heart 63%. Enlarging those
 * only enlarges the margin. They are trimmed to the render plus a hair of
 * breathing room, so the plate is the work rather than a field with the work
 * somewhere in it — the kidney frame alone more than doubled on the page without
 * being shown a pixel wider.
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
