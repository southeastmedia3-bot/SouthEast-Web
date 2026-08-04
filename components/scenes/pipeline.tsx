"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Container } from "@/components/common/container";
import { pipeline } from "@/data/home";
import { setupGsap } from "@/lib/gsap";
import { cn } from "@/lib/utils";
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
 * The one frame shape every stage is shown in.
 *
 * The frame used to take each artifact's own aspect ratio, so the box resized on
 * every step — a portrait storyboard, then a 2.3:1 delivery frame — and the
 * stage visibly reflowed underneath it. Seven artifacts of seven different sizes
 * read as seven unrelated pictures rather than one pipeline.
 *
 * So the box is fixed at 3:2 and every artifact is `object-contain`ed inside it.
 * Same size for all seven, and no image is cropped or stretched to get there:
 * 3:2 sits in the middle of the range these files actually span (0.93 for the
 * portrait storyboard up to 2.35 for the delivery frame), so nothing is matted
 * heavily on either axis. The source files are untouched — this is purely how
 * they are framed.
 */
const FRAME_RATIO = "3 / 2";

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

  useEffect(() => {
    if (reducedMotion || !rootRef.current || !stageRef.current) return;

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
  }, [reducedMotion]);

  if (reducedMotion) {
    return (
      <section aria-label={pipeline.heading} className="bg-[#f8f6f1] py-28">
        <Container>
          <p className="type-label mb-5 text-accent-ink">{pipeline.eyebrow}</p>
          <h2 className="type-h2 mb-14 text-foreground">{pipeline.heading}</h2>
          <ol className="flex flex-col gap-16">
            {STEPS.map((step, i) => (
              <li key={step.title} className="grid gap-6 md:grid-cols-2 md:items-center">
                {/* Same fixed frame as the pinned stage, for the same reason:
                    seven artifacts at seven different heights read as seven
                    unrelated pictures. Contained, so none of them is cropped. */}
                <div
                  className="relative w-full overflow-hidden rounded-lg bg-foreground/[0.04]"
                  style={{ aspectRatio: FRAME_RATIO }}
                >
                  <Image
                    src={step.media}
                    alt={step.title}
                    fill
                    className="object-contain"
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

              {/* The frame. One fixed box, identical on every step — see
                  FRAME_RATIO. Each artifact is contained inside it, so the brief
                  document, the portrait storyboard and the 2.3:1 delivery frame
                  are all shown whole at the same frame size; a step change is now
                  only a crossfade, with no reflow underneath it. */}
              <div className={cn("relative", flip && "md:order-1")}>
                <div
                  className="relative overflow-hidden rounded-lg bg-foreground/[0.04]"
                  style={{
                    aspectRatio: FRAME_RATIO,
                    width: "min(100%, calc(clamp(14rem, 46vh, 28rem) * 1.5))",
                  }}
                >
                  {STEPS.map((step, i) => (
                    <Image
                      key={step.title}
                      src={step.media}
                      alt={step.title}
                      fill
                      sizes="(min-width: 768px) 36vw, 84vw"
                      className={cn(
                        // contain, not cover: the box is one shared shape now, so
                        // covering it would crop every artifact that isn't 3:2 —
                        // which is all but none of them.
                        "object-contain transition-opacity duration-700 ease-out",
                        i === index ? "opacity-100" : "opacity-0",
                      )}
                      priority={i === 0}
                    />
                  ))}
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
