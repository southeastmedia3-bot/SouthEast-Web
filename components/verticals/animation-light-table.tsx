"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { Container } from "@/components/common/container";
import { animationAssets } from "@/data/media";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const FRAMES = animationAssets.characterFrames;
const N = FRAMES.length;
/** vh of scroll spent per frame. N frames -> the track height below. */
const PER_FRAME_VH = 15;
/**
 * Strip geometry, in px. `THUMB + GAP` is exactly how far the strip travels per
 * frame, which is what keeps the frame you are on under the playhead — so these
 * three numbers have to stay in step with the classes that use them below.
 */
const THUMB = 76;
const GAP = 8;
const STEP = THUMB + GAP;

/**
 * The light table — the page's set-piece scroll.
 *
 * Twelve finished frames, scrubbed one at a time as the section is scrolled, with
 * the frames either side of the current one held behind it as cels on a stack.
 * It is the one section on the site where the medium and the mechanism are the
 * same thing: an animation page that makes you advance frames to read it.
 *
 * WHAT IT CLAIMS IS NOT THAT THESE ARE A SEQUENCE. They are twelve separate
 * scenes that share a look — one key, one material language, one depth of field —
 * and the copy says exactly that, because a house style holding across twelve
 * unrelated worlds is a harder thing to do than twelve frames of one shot, and it
 * is the thing a series or a brand system is actually bought for.
 *
 * Mechanically it is the anatomy reveal's contract: a tall track, a `position:
 * sticky` stage (never a GSAP pin — see the note in `page-transition-layer`), and
 * every opacity and offset a `useTransform` off one scroll progress. Nothing is
 * timed, so a fast scroll cannot outrun it and a slow one cannot stall it.
 *
 * NARROW SCREENS GET THE SHEET, NOT THE STAGE, and so does reduced motion. The
 * pinned layout has to hold a heading, two paragraphs, a square and a filmstrip
 * inside one viewport height; below the desktop breakpoint it cannot, and what
 * that produced on a phone was a strip cut off past the bottom edge. A contact
 * sheet of the same twelve frames says the same thing, carries the same copy, and
 * costs a phone nothing — which is a better trade than a set-piece with its
 * mechanism hanging off the screen.
 */
export function AnimationLightTable({ id, rule }: { id?: string; rule: string }) {
  const reducedMotion = useReducedMotion();
  const compact = useMediaQuery("(max-width: 1023px)");
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  // Scroll 0..1 -> continuous frame position 0..N-1.
  const p = useTransform(scrollYProgress, [0, 1], [0, N - 1]);
  useMotionValueEvent(p, "change", (v) => {
    const i = Math.min(N - 1, Math.max(0, Math.round(v)));
    setActive((cur) => (cur === i ? cur : i));
  });

  // The strip slides so the frame you are on sits under the fixed playhead.
  const stripX = useTransform(p, (v) => -v * STEP);

  if (reducedMotion || compact) {
    return (
      <section id={id} className="scroll-mt-36 bg-[#050506] py-20 md:py-28">
        <Container size="xl">
          <Header rule={rule} />
          <Copy />
          <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {FRAMES.map((frame) => (
              <Image
                key={frame.key}
                src={frame.src}
                alt={frame.alt}
                width={frame.w}
                height={frame.h}
                sizes="(min-width: 640px) 30vw, 46vw"
                loading="lazy"
                className="h-auto w-full rounded-lg"
              />
            ))}
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section id={id} className="scroll-mt-36 bg-[#050506]">
      {/* The tall track. Its height is what the sticky stage scrubs against. */}
      <div ref={trackRef} style={{ height: `${N * PER_FRAME_VH + 70}vh` }} className="relative">
        <div className="sticky top-0 flex h-dvh flex-col overflow-hidden">
          {/* The table's own light, pooled under the stack. */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(58% 48% at 62% 46%, rgba(198,150,59,0.16), transparent 70%)",
            }}
            aria-hidden="true"
          />

          <Container size="xl" className="relative flex flex-1 flex-col pb-6 pt-24">
            <div className="grid flex-1 items-center gap-x-12 gap-y-8 lg:grid-cols-[22rem_minmax(0,1fr)]">
              {/* The argument, held still while the frames move. */}
              <div className="max-w-lg">
                <Header rule={rule} />
                <Copy />

                <div className="mt-8 flex items-baseline gap-4 border-t border-white/12 pt-6">
                  <span className="type-index tabular-nums text-[color:var(--brand-ice)]/40">
                    {String(active + 1).padStart(2, "0")}
                    <span className="text-[color:var(--brand-ice)]/20">
                      {" "}
                      / {String(N).padStart(2, "0")}
                    </span>
                  </span>
                  <p className="type-caption text-[color:var(--brand-ice)]/55">
                    {FRAMES[active]!.alt}
                  </p>
                </div>
              </div>

              {/* The stack. Every cel occupies the same square; the ones either
                  side of the current frame sit behind it, offset and dimmed.

                  SIZED OFF THE VIEWPORT'S HEIGHT, not just its width. The stage
                  is pinned inside one `h-dvh` screen that also has to hold the
                  header, the copy and the strip; a square sized only by `vw`
                  pushes the strip off the bottom of a laptop screen, which is
                  exactly what it did at 1440×900. */}
              <div className="relative mx-auto aspect-square w-[min(78vw,26rem)] lg:w-[min(42vw,46vh,32rem)]">
                {FRAMES.map((frame, i) => (
                  <Cel key={frame.key} index={i} p={p} src={frame.src} alt={frame.alt} />
                ))}
              </div>
            </div>

            {/* The strip. Sprocket ticks, a fixed playhead, and the run sliding
                under it — the frame you are on is always the one at the mark. */}
            <div className="relative mt-4 shrink-0">
              <div
                className="pointer-events-none absolute left-1/2 top-0 z-10 h-full -translate-x-1/2"
                aria-hidden="true"
              >
                <span
                  className="absolute -top-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rotate-45"
                  style={{ background: rule }}
                />
                <span
                  className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2"
                  style={{ background: rule, opacity: 0.7 }}
                />
              </div>

              <div className="overflow-hidden py-3">
                <motion.div
                  className="flex"
                  style={{
                    x: stripX,
                    gap: `${GAP}px`,
                    paddingLeft: `calc(50% - ${THUMB / 2}px)`,
                  }}
                >
                  {FRAMES.map((frame, i) => (
                    <span
                      key={frame.key}
                      className="relative block shrink-0 overflow-hidden rounded-[3px] bg-black"
                      style={{ width: THUMB, height: THUMB }}
                    >
                      <Image
                        src={frame.src}
                        alt=""
                        fill
                        sizes="76px"
                        loading="lazy"
                        className="object-cover"
                      />
                      <StripVeil index={i} p={p} />
                    </span>
                  ))}
                </motion.div>
              </div>

              {/* `mx-auto` because `globals.css` caps every `p` at 68ch — without
                  it this centres inside a 490px box at the left gutter. */}
              <p className="type-caption mx-auto text-center text-[color:var(--brand-ice)]/30">
                Scroll to advance
              </p>
            </div>
          </Container>
        </div>
      </div>
    </section>
  );
}

function Header({ rule }: { rule: string }) {
  return (
    <>
      <div className="mb-3 flex items-center gap-4">
        <span className="block h-[2px] w-10" style={{ background: rule }} aria-hidden="true" />
        <p className="type-label text-[color:var(--brand-ice)]/70">The house style</p>
      </div>
      <h2 className="type-h3 text-balance text-[var(--ink-frame-foreground)]">
        Twelve worlds. One light.
      </h2>
    </>
  );
}

/** The argument. Shared so the sheet and the stage cannot drift apart. */
function Copy() {
  return (
    <div className="max-w-lg">
      <p className="type-body mt-6 text-[color:var(--brand-ice)]/60">
        Not twelve frames of one shot — twelve separate worlds, built months apart, that hold the
        same key light, the same matte material language and the same shallow depth of field.
      </p>
      <p className="type-body mt-4 text-[color:var(--brand-ice)]/60">
        Holding a look across scenes nobody planned together is the whole job. It is what makes a
        series read as a series, and a brand system survive its second campaign.
      </p>
    </div>
  );
}

/**
 * One cel on the stack.
 *
 * Opacity is a trapezoid so the current frame holds clean and solo through the
 * middle of its band and cross-fades only at the edges. The neighbours keep a
 * residue of opacity and a small offset, which is what makes the stage read as
 * paper on a light table rather than a slideshow: you can see the frame you just
 * left and the one you are about to reach.
 */
function Cel({
  index,
  p,
  src,
  alt,
}: {
  index: number;
  p: MotionValue<number>;
  src: string;
  alt: string;
}) {
  const opacity = useTransform(
    p,
    [index - 1.1, index - 0.5, index, index + 0.5, index + 1.1],
    [0, 0.14, 1, 0.14, 0],
    {
      clamp: true,
    },
  );
  const x = useTransform(p, [index - 1, index, index + 1], [34, 0, -34], { clamp: true });
  const scale = useTransform(p, [index - 1, index, index + 1], [0.94, 1, 0.94], { clamp: true });
  const rotate = useTransform(p, [index - 1, index, index + 1], [1.6, 0, -1.6], { clamp: true });

  return (
    <motion.div
      className="absolute inset-0 overflow-hidden rounded-[1rem] bg-black ring-1 ring-white/10"
      style={{ opacity, x, scale, rotate }}
    >
      <Image
        src={src}
        alt={index === 0 ? alt : ""}
        fill
        sizes="(min-width: 1024px) 34rem, 78vw"
        priority={index === 0}
        loading={index === 0 ? undefined : "lazy"}
        className="object-cover"
        aria-hidden={index === 0 ? undefined : "true"}
      />
    </motion.div>
  );
}

/** Dims every strip thumb except the one under the playhead. */
function StripVeil({ index, p }: { index: number; p: MotionValue<number> }) {
  const opacity = useTransform(p, [index - 1, index, index + 1], [0.72, 0, 0.72], { clamp: true });
  return (
    <motion.span className="absolute inset-0 bg-[#050506]" style={{ opacity }} aria-hidden="true" />
  );
}
