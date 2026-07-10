"use client";

import { useEffect, useRef } from "react";
import { AnimatedCounter } from "@/components/common/animated-counter";
import { trustBar } from "@/data/home";
import { setupGsap } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { splitWords } from "@/utils/split-text";

const words = splitWords(trustBar.statement);

/**
 * Scene 02 — Institutional Trust Bar. The patience beat: a held institutional
 * statement (word-by-word, scroll-scrubbed, vignette on hold), followed by a
 * spec-sheet row of quantified proof — a rule that draws itself in, figures
 * that land in a stagger, never louder than the statement itself.
 */
export function TrustBar() {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const wordRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const vignetteRef = useRef<HTMLDivElement | null>(null);
  const ruleRef = useRef<HTMLDivElement | null>(null);
  const statRefs = useRef<Array<HTMLDivElement | null>>([]);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !wrapperRef.current) {
      return;
    }

    const { ScrollTrigger } = setupGsap();
    const trigger = ScrollTrigger.create({
      trigger: wrapperRef.current,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        const revealProgress = Math.min(1, self.progress / 0.55);
        const revealCount = Math.floor(revealProgress * words.length);

        wordRefs.current.forEach((el, index) => {
          if (!el) return;
          el.style.opacity = index < revealCount ? "1" : "0.14";
        });

        let vignette = 0;
        const p = self.progress;
        if (p > 0.55 && p <= 0.7) {
          vignette = (p - 0.55) / 0.15;
        } else if (p > 0.7 && p <= 0.85) {
          vignette = 1;
        } else if (p > 0.85) {
          vignette = Math.max(0, 1 - (p - 0.85) / 0.15);
        }

        if (vignetteRef.current) {
          vignetteRef.current.style.opacity = String(vignette);
        }
      },
    });

    return () => trigger.kill();
  }, [reducedMotion]);

  useEffect(() => {
    if (reducedMotion || !ruleRef.current) {
      return;
    }

    const { gsap } = setupGsap();
    const stats = statRefs.current.filter((el): el is HTMLDivElement => Boolean(el));

    gsap.set(ruleRef.current, { scaleX: 0, transformOrigin: "left center" });
    gsap.set(stats, { opacity: 0, y: 22 });

    // Scrubbed (not onEnter/once) so the reveal is tied to the scroll
    // gesture itself — a fast scroll can't outrun a fixed-duration tween.
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: ruleRef.current,
        start: "top 90%",
        end: "top 45%",
        scrub: 0.4,
      },
    });
    timeline
      .to(ruleRef.current, { scaleX: 1, ease: "none" }, 0)
      .to(stats, { opacity: 1, y: 0, stagger: 0.12, ease: "none" }, 0.08);

    return () => {
      timeline.kill();
    };
  }, [reducedMotion]);

  const metrics = (
    <div className="mx-auto max-w-6xl px-6 sm:px-10 lg:px-16">
      <div
        ref={ruleRef}
        className={cn("h-px w-full origin-left bg-border", !reducedMotion && "scale-x-0")}
        aria-hidden="true"
      />
      <div className="grid grid-cols-2 sm:grid-cols-4">
        {trustBar.metrics.map((metric, index) => (
          <div
            key={metric.label}
            ref={(el) => {
              statRefs.current[index] = el;
            }}
            className={cn(
              "border-border py-10 sm:py-14",
              index % 2 === 1 ? "border-l pl-6" : "pr-6",
              index >= 2 ? "border-t pt-8" : "",
              "sm:border-t-0 sm:border-l sm:pl-8 sm:pr-0 sm:pt-14 sm:first:border-l-0 sm:first:pl-0",
              !reducedMotion && "opacity-0",
            )}
          >
            <p className="font-mono text-[clamp(2.25rem,4.6vw,3.75rem)] font-medium tabular-nums leading-none text-foreground">
              <AnimatedCounter value={metric.value} suffix={metric.suffix} />
            </p>
            <p className="type-index mt-4 text-muted">{metric.label}</p>
          </div>
        ))}
      </div>
    </div>
  );

  if (reducedMotion) {
    return (
      <section
        id="trust-bar"
        className="flex min-h-dvh flex-col items-center justify-center gap-20 px-6 py-32"
      >
        <p className="type-h2 mx-auto max-w-3xl text-balance text-center text-foreground">
          {trustBar.statement}
        </p>
        {metrics}
      </section>
    );
  }

  return (
    <section id="trust-bar">
      <div ref={wrapperRef} className="relative" style={{ height: "220vh" }}>
        <div className="sticky top-0 flex h-dvh items-center justify-center overflow-hidden px-6">
          <div
            ref={vignetteRef}
            className="pointer-events-none absolute inset-0 opacity-0"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, transparent 34%, rgba(21,20,26,0.4) 100%)",
            }}
            aria-hidden="true"
          />
          <p className="type-h2 relative mx-auto max-w-2xl text-balance text-center text-foreground">
            {words.map((word, index) => (
              <span key={`${word}-${index}`}>
                <span
                  ref={(el) => {
                    wordRefs.current[index] = el;
                  }}
                  style={{ opacity: 0.14 }}
                >
                  {word}
                </span>{" "}
              </span>
            ))}
          </p>
        </div>
      </div>

      <div className="pb-32">{metrics}</div>
    </section>
  );
}
