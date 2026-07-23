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
import { Reveal } from "@/components/common/reveal";
import { FrameStrip } from "@/components/verticals/frame-strip";
import { filmsAssets } from "@/data/media";
import type { VerticalSection } from "@/data/verticals";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const FRAMES = filmsAssets.serumProgression;
const N = FRAMES.length;
/** vh of scroll spent per frame. N frames -> the track height below. */
const PER_FRAME_VH = 11;
/** The run's shared aspect. Every frame in a cut is the same shape by definition. */
const RATIO = FRAMES[0]!.w / FRAMES[0]!.h;
/**
 * Strip geometry, in px. `THUMB + GAP` is exactly how far the strip travels per
 * frame, which is what keeps the frame you are on under the playhead — so these
 * three numbers have to stay in step with the classes that use them below.
 */
const THUMB = 104;
const GAP = 6;
const STEP = THUMB + GAP;

/**
 * The gate — the page's set-piece, and the argument for uncompressed capture made
 * in the only currency that settles it: frames.
 *
 * Fifteen consecutive frames of the beauty film run through a gate as the section
 * is scrolled, with the strip sliding beneath and the frame you are on always at
 * the playhead. A cut is the one thing about a film a still cannot show; this is
 * the closest the page gets to running the film without playing it, and it is
 * where a visitor sees that the light holds from one frame to the next — which is
 * the part that takes the time.
 *
 * NOT THE ANIMATION PAGE'S LIGHT TABLE. That stacks square cels in a column
 * beside a held argument and is about a house style surviving twelve unrelated
 * worlds. This runs one continuous cut edge to edge, at the frame's own shape,
 * with a technical read-out rather than an essay — a grading suite, not a
 * light box. The mechanics are shared on purpose: a tall track, a `position:
 * sticky` stage (never a GSAP pin — see the note in `page-transition-layer`) and
 * every opacity and offset a `useTransform` off one scroll progress. Nothing is
 * timed, so a fast scroll cannot outrun it and a slow one cannot stall it.
 *
 * NARROW SCREENS AND REDUCED MOTION GET THE STRIP, NOT THE STAGE. The pinned
 * layout has to hold a gate, a read-out and a filmstrip inside one viewport
 * height; below the desktop breakpoint it cannot, and the same fifteen frames are
 * already reachable as a tapped, keyboard-driven strip. Same content, same order,
 * no mechanism hanging off the bottom of a phone.
 *
 * COST: all fifteen frames are mounted so they can cross-fade under the scrub.
 * That is deliberate and it is the reason `sizes` is capped well under the
 * source width — the set-piece is worth one contact sheet of decode, and nothing
 * else on the page pays it.
 */
export function FilmsGate({
  id,
  rule,
  section,
}: {
  id?: string;
  rule: string;
  section?: VerticalSection;
}) {
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

  return (
    <section id={id} className="scroll-mt-36 bg-[#050506]">
      {/* The argument, read before the frames are scrubbed. */}
      {section ? (
        <Container size="xl" className="pt-20 md:pt-28">
          <div className="max-w-3xl">
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
                <p className="type-body-lg mt-6 text-[color:var(--brand-ice)]/75">{section.lead}</p>
              </Reveal>
            ) : null}
          </div>

          {section.body?.length ? (
            <div className="mt-12 grid gap-x-14 gap-y-6 lg:grid-cols-2">
              {section.body.map((para, i) => (
                <Reveal key={para.slice(0, 40)} delay={i * 0.06}>
                  <p className="type-body border-t border-white/12 pt-6 text-[color:var(--brand-ice)]/65">
                    {para}
                  </p>
                </Reveal>
              ))}
            </div>
          ) : null}
        </Container>
      ) : null}

      {reducedMotion || compact ? (
        <FrameStrip
          rule={rule}
          frames={FRAMES}
          heading="Fifteen frames, in cut order"
          lead="Scrub it. Holding the light steady across a cut is the part that takes the time."
          dark
        />
      ) : (
        /* The tall track. Its height is what the sticky stage scrubs against. */
        <div
          ref={trackRef}
          style={{ height: `${N * PER_FRAME_VH + 70}vh` }}
          className="relative mt-20"
        >
          {/* `pt-[8.5rem]` is structural: the site header and the in-page rail
              are both sticky and together own the top 8.5rem of the viewport.
              Without it the gate's read-out is pinned underneath them. */}
          <div className="sticky top-0 flex h-dvh flex-col justify-center overflow-hidden pt-[8.5rem]">
            {/* The lamp behind the gate. */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(62% 50% at 50% 42%, rgba(198,150,59,0.14), transparent 72%)",
              }}
              aria-hidden="true"
            />

            <Container size="xl" className="relative">
              <div className="mb-5 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
                <p className="type-label text-[color:var(--brand-ice)]/55">
                  The cut · beauty film · 15 frames
                </p>
                <p className="type-caption text-[color:var(--brand-ice)]/35">Scroll to advance</p>
              </div>

              {/* The gate. Sized off the viewport's height as well as its width —
                  a window sized only by `vw` pushes the strip off the bottom of a
                  laptop screen. Takes the frames' own aspect: this run is one
                  film, and a film's frames are not re-cropped to fit a fashion. */}
              <div
                className="relative mx-auto w-full overflow-hidden bg-black ring-1 ring-white/10"
                style={{ aspectRatio: String(RATIO), maxWidth: `calc(50vh * ${RATIO})` }}
              >
                {FRAMES.map((frame, i) => (
                  <Cel key={frame.key} index={i} p={p} src={frame.src} alt={frame.alt} />
                ))}

                {/* Gate marks — the frame the studio is looking through. */}
                {(
                  [
                    "left-4 top-4 border-l border-t",
                    "right-4 top-4 border-r border-t",
                    "left-4 bottom-4 border-b border-l",
                    "right-4 bottom-4 border-b border-r",
                  ] as const
                ).map((pos) => (
                  <span
                    key={pos}
                    className={`pointer-events-none absolute size-6 border-white/25 ${pos}`}
                    aria-hidden="true"
                  />
                ))}
              </div>

              {/* The read-out. Deliberately a frame count and not a timecode:
                  these are fifteen frames in cut order, not fifteen consecutive
                  frames of a 24fps master, and a timecode would be asserting a
                  duration nobody measured. */}
              <div
                className="mx-auto mt-4 flex w-full flex-wrap items-baseline justify-between gap-x-8 gap-y-1"
                style={{ maxWidth: `calc(50vh * ${RATIO})` }}
              >
                <p className="type-caption text-[color:var(--brand-ice)]/55">
                  {FRAMES[active]!.label ?? FRAMES[active]!.alt}
                </p>
                <p className="type-index tabular-nums text-[color:var(--brand-ice)]/45">
                  FRAME {String(active + 1).padStart(2, "0")}
                  <span className="text-[color:var(--brand-ice)]/25">
                    {" "}
                    / {String(N).padStart(2, "0")}
                  </span>
                </p>
              </div>
            </Container>

            {/* The strip, full-bleed along the foot of the room. Perforated top
                and bottom, with a fixed playhead the run slides under. */}
            <div className="relative mt-8 shrink-0">
              <Perforations />

              <div className="overflow-hidden py-2">
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
                      className="relative block shrink-0 overflow-hidden bg-black"
                      style={{ width: THUMB, height: Math.round(THUMB / RATIO) }}
                    >
                      <Image
                        src={frame.src}
                        alt=""
                        fill
                        sizes="104px"
                        loading="lazy"
                        className="object-cover"
                      />
                      <StripVeil index={i} p={p} />
                    </span>
                  ))}
                </motion.div>
              </div>

              <Perforations />

              <div
                className="pointer-events-none absolute inset-y-0 left-1/2 z-10 -translate-x-1/2"
                aria-hidden="true"
              >
                <span
                  className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2"
                  style={{ background: rule, opacity: 0.85 }}
                />
                <span
                  className="absolute -top-1 left-1/2 size-1.5 -translate-x-1/2 rotate-45"
                  style={{ background: rule }}
                />
                <span
                  className="absolute -bottom-1 left-1/2 size-1.5 -translate-x-1/2 rotate-45"
                  style={{ background: rule }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

/** The strip's sprocket run. Drawn, not an image — it is a hairline, not art. */
function Perforations() {
  return (
    <span
      className="block h-[7px] w-full"
      style={{
        background:
          "repeating-linear-gradient(to right, rgba(255,255,255,0.16) 0 10px, transparent 10px 24px)",
      }}
      aria-hidden="true"
    />
  );
}

/**
 * One frame in the gate.
 *
 * A DISSOLVE, NOT A DIP. Each frame fades *up* over the one before it and then
 * stays opaque — it is covered by the next frame rather than fading back out.
 * The obvious alternative (opacity peaking at the frame and falling away on both
 * sides) is what the Animation page's light table does, and it is right there,
 * where seeing through to the cels either side is the point. Here it is wrong:
 * two frames at 10% over a black ground is a black ground, so the gate went dark
 * every time the scroll sat between two frames. Stacked in DOM order and ramped
 * one way, adjacent frames always sum to a full picture.
 *
 * The hair of scale on the incoming frame is the strip settling into the gate.
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
  const opacity = useTransform(p, [index - 1, index], [0, 1], { clamp: true });
  const scale = useTransform(p, [index - 1, index], [1.04, 1], { clamp: true });

  return (
    <motion.div className="absolute inset-0" style={index === 0 ? undefined : { opacity, scale }}>
      <Image
        src={src}
        alt={index === 0 ? alt : ""}
        fill
        sizes="(min-width: 1024px) 62vw, 94vw"
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
  const opacity = useTransform(p, [index - 1, index, index + 1], [0.7, 0, 0.7], { clamp: true });
  return (
    <motion.span className="absolute inset-0 bg-[#050506]" style={{ opacity }} aria-hidden="true" />
  );
}
