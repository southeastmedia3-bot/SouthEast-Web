"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { MediaFrame } from "@/components/common/media-frame";
import { ParticleField } from "@/components/effects/particle-field";
import { heroContent, reelMoments } from "@/data/home";
import { setupGsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const railMoments = reelMoments.slice(0, 3);

const headlineWords = heroContent.headlineLines.reduce<
  { line: string; words: string[]; startIndex: number }[]
>((acc, line) => {
  const previous = acc[acc.length - 1];
  const startIndex = previous ? previous.startIndex + previous.words.length : 0;
  return [...acc, { line, words: line.split(" "), startIndex }];
}, []);

/**
 * Scene 01 — Arrival. An asymmetric opening frame: the headline carries the
 * statement, a slim rail of the verticals to come carries the promise of
 * media. The First Cut ties a subtle dolly/rack-focus — and a slower
 * counter-drift on the rail — to the visitor's very first scroll gesture.
 */
export function Arrival() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const headlineRef = useRef<HTMLHeadingElement | null>(null);
  const railRef = useRef<HTMLDivElement | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !headlineRef.current || !sectionRef.current) {
      return;
    }

    const { gsap, ScrollTrigger } = setupGsap();
    let trigger: ReturnType<typeof ScrollTrigger.create> | undefined;

    // Held off until the load-in word reveal has settled — starting the
    // scroll-scrub immediately would fight the still-animating headline if
    // the visitor scrolls within the first beat.
    const armTrigger = gsap.delayedCall(1.3, () => {
      const timeline = gsap
        .timeline()
        .fromTo(
          headlineRef.current,
          { scale: 1, filter: "blur(0px)" },
          { scale: 1.03, filter: "blur(1.2px)", ease: "none" },
          0,
        )
        .fromTo(railRef.current, { y: 0 }, { y: -56, ease: "none" }, 0);

      trigger = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "+=260",
        scrub: 0.4,
        animation: timeline,
      });
    });

    return () => {
      armTrigger.kill();
      trigger?.kill();
    };
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      id="arrival"
      className="relative flex min-h-dvh flex-col justify-center overflow-hidden bg-[#05070d] px-6 pb-20 pt-32 sm:px-10 lg:px-16"
      aria-label="Southeast Media — opening scene"
    >
      {/* The flow field paints its own opaque stage, so it sits at z-0 above the
          section background (a negative z-index would fall behind it) and all
          content is lifted to z-10. */}
      <ParticleField className="pointer-events-none absolute inset-0 z-0" />

      <div className="relative z-10 grid items-start gap-10 xl:grid-cols-[1fr_auto] xl:gap-14">
        <div>
          <p className="type-label mb-8 text-[color:var(--brand-ice)]/60 lg:mb-10">
            {heroContent.eyebrow}
          </p>

          <h1
            ref={headlineRef}
            className="max-w-[94vw] text-balance type-hero text-[var(--ink-frame-foreground)] will-change-transform xl:max-w-[54rem]"
          >
            {headlineWords.map(({ line, words, startIndex }, lineIndex) => (
              <span key={line} className="block overflow-hidden py-[0.06em]">
                <span className="block">
                  {words.flatMap((word, i) => {
                    const delay = 0.12 + (startIndex + i) * 0.055;
                    const wrapped = (
                      <span
                        key={`${word}-${lineIndex}-${i}`}
                        className="inline-block overflow-hidden"
                      >
                        <motion.span
                          className="inline-block"
                          initial={reducedMotion ? undefined : { y: "115%", rotate: 2 }}
                          animate={{ y: "0%", rotate: 0 }}
                          transition={{ duration: 0.85, ease: [0.65, 0, 0.35, 1], delay }}
                        >
                          {word}
                        </motion.span>
                      </span>
                    );
                    // The space must live outside the overflow-hidden mask —
                    // nested inside it, browsers collapse trailing whitespace
                    // at the inline-block edge and the words run together.
                    return i < words.length - 1 ? [wrapped, " "] : [wrapped];
                  })}
                </span>
              </span>
            ))}
          </h1>

          <motion.p
            className="type-body-lg mt-10 max-w-xl text-[color:var(--brand-ice)]/70"
            initial={reducedMotion ? undefined : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.75 }}
          >
            {heroContent.body}
          </motion.p>
        </div>

        <div ref={railRef} className="hidden w-[12rem] flex-col gap-5 pt-2 xl:flex">
          {railMoments.map((moment, index) => (
            <motion.div
              key={moment.discipline}
              initial={reducedMotion ? undefined : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 1 + index * 0.14 }}
              className={index === 1 ? "self-end" : undefined}
            >
              <MediaFrame
                tone={moment.tone}
                ratio="portrait"
                src={moment.mediaSrc}
                alt={moment.discipline}
                className="w-[10.5rem]"
              />
              <p className="type-index mt-3 text-[color:var(--brand-ice)]/55">
                0{index + 1} — {moment.discipline}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-10 left-6 z-10 flex items-center gap-3 sm:left-10 lg:left-16">
        <span className="relative h-9 w-px overflow-hidden bg-white/20" aria-hidden="true">
          <motion.span
            className="absolute inset-x-0 top-0 h-full bg-[color:var(--brand-sky)]"
            animate={reducedMotion ? undefined : { y: ["-100%", "100%"] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
        <span className="type-caption uppercase tracking-[0.14em] text-[color:var(--brand-ice)]/60">
          Scroll
        </span>
      </div>
    </section>
  );
}
