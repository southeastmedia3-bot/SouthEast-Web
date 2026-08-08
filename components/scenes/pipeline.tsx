"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Container } from "@/components/common/container";
import { pipeline } from "@/data/home";
import { setupGsap } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import { useMotionEffect } from "@/hooks/use-motion-effect";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const STEPS = pipeline.steps;

/**
 * Scroll distance, in vh, that advances the stage by one step.
 *
 * The section used to be `STEPS.length * 100vh` tall. With the stage pinned from
 * "top top" to "bottom bottom", the actual scrubbed distance is (height - 100vh)
 * — so seven steps over 700vh meant ~86vh of scrolling to advance a single step,
 * which is most of a screen per stage and read as the section being stuck.
 * At 40vh a step advances in roughly one comfortable scroll gesture.
 */
const SCROLL_PER_STEP_VH = 40;
/** 100vh of the height is consumed holding the pin; the rest is the scrub. */
const STAGE_HEIGHT_VH = STEPS.length * SCROLL_PER_STEP_VH + 100;

/**
 * The side of the notional square every stage's frame is sized against.
 *
 * EVERY FRAME IS ITS OWN SHAPE, AND NOTHING IS MATTED. The box was fixed at 3:2
 * with the artifact `object-contain`ed inside it, which kept all seven the same
 * size — at the cost of a band of pale ground around six of them, since only one
 * file is anywhere near 3:2. On a section this light those bands read as a white
 * card printed around each photograph. So the box now takes the artifact's own
 * aspect ratio and the picture fills it corner to corner: no mat, no crop, no
 * stretch.
 *
 * What holds the seven together instead is AREA, not height and not width. Given
 * a ratio r, the box is `FRAME_SIDE * sqrt(r)` wide and `FRAME_SIDE / sqrt(r)`
 * tall — so every stage covers the same number of square pixels whatever its
 * shape, and the 0.93 storyboard and the 2.35 delivery frame carry equal visual
 * weight. Sizing by height alone would make the delivery frame two and a half
 * times the storyboard's width and overflow the column; sizing by width alone
 * would reduce it to a strip. The dimensions come from `w`/`h` in `data/home.ts`.
 */
const FRAME_SIDE = "clamp(13rem, 40vh, 24rem)";

/** The box for an artifact of aspect ratio `w / h`, at constant area. */
function frameBox(w: number, h: number) {
  const root = Math.sqrt(w / h);
  return {
    width: `min(100%, calc(${FRAME_SIDE} * ${root.toFixed(4)}))`,
    aspectRatio: `${w} / ${h}`,
  };
}

/**
 * The tallest box the set can produce, as a multiple of FRAME_SIDE.
 *
 * The pinned stage reserves this height up front and centres the current frame
 * inside it, so changing shape between steps moves nothing else on the stage —
 * the detail paragraph under the frame and the list beside it hold still while
 * the box itself eases from one artifact's proportions to the next.
 */
const TALLEST = Math.max(...STEPS.map((s) => Math.sqrt(s.h / s.w)));

/**
 * Scene — the pipeline. A pinned stage the visitor scrolls through: the index
 * ticks up, the frame for that stage cross-reveals, and the stage list beside it
 * marks the active step. The image alternates sides so the eye keeps moving.
 * Reduced motion collapses it to a plain ordered list.
 */
export function Pipeline() {
  const reducedMotion = useReducedMotion();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [index, setIndex] = useState(0);

  useMotionEffect(() => {
    if (!rootRef.current || !stageRef.current) return;

    const { ScrollTrigger } = setupGsap();

    const trigger = ScrollTrigger.create({
      trigger: rootRef.current,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      pin: stageRef.current,
      onUpdate: (self) => {
        const next = Math.min(STEPS.length - 1, Math.floor(self.progress * STEPS.length));
        setIndex((cur) => (cur === next ? cur : next));
      },
    });

    return () => trigger.kill();
  });

  if (reducedMotion) {
    return (
      <section aria-label={pipeline.heading} className="bg-[#f8f6f1] py-28">
        <Container>
          <p className="type-label mb-5 text-accent-ink">{pipeline.eyebrow}</p>
          <h2 className="type-h2 mb-14 text-foreground">{pipeline.heading}</h2>
          <ol className="flex flex-col gap-16">
            {STEPS.map((step, i) => (
              <li key={step.title} className="grid gap-6 md:grid-cols-2 md:items-center">
                {/* Each artifact at its own shape, same as the pinned stage —
                    the box is the picture's, so `cover` crops nothing. */}
                <div
                  className="relative overflow-hidden rounded-lg"
                  style={frameBox(step.w, step.h)}
                >
                  <Image
                    src={step.media}
                    alt={step.title}
                    fill
                    className="object-cover"
                    sizes="(min-width: 768px) 45vw, 92vw"
                  />
                </div>
                <div>
                  <span className="type-index text-muted">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="type-h3 mt-2 text-foreground">{step.title}</h3>
                  <p className="type-body mt-3 text-muted">{step.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </section>
    );
  }

  const active = STEPS[index]!;
  const flip = index % 2 === 1; // alternate the image side

  return (
    <section aria-label={pipeline.heading}>
      <div ref={rootRef} className="relative" style={{ height: `${STAGE_HEIGHT_VH}vh` }}>
        <div
          ref={stageRef}
          className="relative flex h-dvh w-full items-center overflow-hidden bg-[#f8f6f1]"
        >
          <Container size="xl">
            <p className="type-label absolute left-6 top-10 text-accent-ink sm:left-10 lg:left-16">
              {pipeline.eyebrow}
            </p>

            <div
              className={cn(
                // The frame column gets the larger share — the artifacts are
                // mostly wide now, and a 16:9 turnaround needs the width to
                // still read as a frame rather than a strip.
                "grid items-center gap-8 md:grid-cols-[auto_1.35fr_1fr] md:gap-12",
                flip && "md:grid-cols-[1.35fr_auto_1fr]",
              )}
            >
              {/* Index */}
              <span
                className={cn(
                  "type-display-xl leading-none text-foreground/10 tabular-nums",
                  flip && "md:order-2",
                )}
              >
                {String(index + 1).padStart(2, "0")}
              </span>

              {/* The frame. It takes the current artifact's own proportions —
                  see FRAME_SIDE — inside a slot tall enough for the tallest of
                  them, so the box eases from shape to shape while nothing around
                  it moves. Settled, the picture reaches all four edges. */}
              <div className={cn("relative", flip && "md:order-1")}>
                <div
                  className="flex items-center"
                  style={{ height: `calc(${FRAME_SIDE} * ${TALLEST.toFixed(4)})` }}
                >
                  <div
                    className="relative overflow-hidden rounded-lg transition-[width,aspect-ratio] duration-700 ease-out"
                    style={frameBox(active.w, active.h)}
                  >
                    {STEPS.map((step, i) => (
                      <Image
                        key={step.title}
                        src={step.media}
                        alt={step.title}
                        fill
                        sizes="(min-width: 768px) 36vw, 84vw"
                        className={cn(
                          // contain, not cover. The box is the *active* frame's
                          // shape, so for the active image the two are identical
                          // and it fills the box exactly — but the six fading
                          // underneath it are not that shape, and covering would
                          // stretch them across the crossfade.
                          "object-contain transition-opacity duration-700 ease-out",
                          i === index ? "opacity-100" : "opacity-0",
                        )}
                        priority={i === 0}
                      />
                    ))}
                  </div>
                </div>
                <p className="type-body mt-5 max-w-md text-muted">{active.detail}</p>
              </div>

              {/* The stage list */}
              <ol className={cn("flex flex-col gap-3", flip && "md:order-3")}>
                {STEPS.map((step, i) => (
                  <li key={step.title} className="flex items-center gap-3">
                    <span
                      className={cn(
                        "block size-1.5 shrink-0 rounded-full transition-all duration-500",
                        i === index ? "scale-100 bg-accent" : "scale-0 bg-transparent",
                      )}
                      aria-hidden="true"
                    />
                    <span
                      className={cn(
                        "type-h4 transition-all duration-500",
                        i === index
                          ? "translate-x-0 text-foreground"
                          : "-translate-x-3 text-foreground/25",
                      )}
                    >
                      {step.title}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </Container>
        </div>
      </div>
    </section>
  );
}
