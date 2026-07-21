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
                <Image
                  src={step.media}
                  alt={step.title}
                  width={800}
                  height={1000}
                  className="w-full rounded-lg object-cover"
                  sizes="(min-width: 768px) 45vw, 92vw"
                />
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
                "grid items-center gap-8 md:grid-cols-[auto_1fr_1fr] md:gap-12",
                flip && "md:grid-cols-[1fr_auto_1fr]",
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

              {/* The frame — keyed so each step re-runs the reveal */}
              <div className={cn("relative", flip && "md:order-1")}>
                <div className="relative aspect-[4/5] w-full max-w-sm overflow-hidden rounded-lg">
                  {STEPS.map((step, i) => (
                    <Image
                      key={step.title}
                      src={step.media}
                      alt={step.title}
                      fill
                      sizes="(min-width: 768px) 30vw, 80vw"
                      className={cn(
                        "object-cover transition-all duration-700 ease-out",
                        i === index
                          ? "scale-100 opacity-100 blur-0"
                          : "scale-105 opacity-0 blur-sm",
                      )}
                      priority={i === 0}
                    />
                  ))}
                </div>
                <p className="type-body mt-5 max-w-sm text-muted">{active.detail}</p>
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
