"use client";

import { motion } from "framer-motion";
import { CursorSparkles } from "@/components/effects/cursor-sparkles";
import { LinkButton } from "@/components/ui/link-button";
import { heroContent } from "@/data/home";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Scene 01 — the opening. Deliberately spare: a bright field, a centred
 * statement, two ways in. All the motion lives in the speck field behind it,
 * which answers the cursor. Restraint is the point — the work is the spectacle,
 * not the homepage.
 */
export function Hero() {
  const reducedMotion = useReducedMotion();

  const words = heroContent.headline.split(" ");

  return (
    <section
      id="hero"
      aria-label="Southeast Media — opening"
      className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-white px-6 pb-24 pt-32 text-center"
    >
      <CursorSparkles className="pointer-events-none absolute inset-0 z-0" />

      <div className="relative z-10 flex flex-col items-center">
        <motion.p
          className="type-label mb-10 text-muted"
          initial={reducedMotion ? undefined : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          {heroContent.eyebrow}
        </motion.p>

        <h1 className="mx-auto max-w-[20ch] text-balance type-hero text-foreground">
          {words.map((word, i) => (
            // The mask must be tall enough for descenders (the "g" in
            // "engineered" was being sheared off). Pad the clip box, then pull
            // the extra height back out with a negative margin so line spacing
            // is untouched.
            <span
              key={`${word}-${i}`}
              className="inline-block overflow-hidden pb-[0.22em] pt-[0.08em] -mb-[0.22em] -mt-[0.08em]"
            >
              <motion.span
                className="inline-block"
                initial={reducedMotion ? undefined : { y: "110%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 0.8, ease: [0.65, 0, 0.35, 1], delay: 0.1 + i * 0.05 }}
              >
                {word}
              </motion.span>
              {i < words.length - 1 ? <span>&nbsp;</span> : null}
            </span>
          ))}
        </h1>

        <motion.p
          className="type-body-lg mx-auto mt-8 max-w-xl text-muted"
          initial={reducedMotion ? undefined : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.5 }}
        >
          {heroContent.body}
        </motion.p>

        <motion.div
          className="mt-11 flex flex-wrap items-center justify-center gap-3"
          initial={reducedMotion ? undefined : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.65 }}
        >
          <LinkButton href={heroContent.primaryCta.href} variant="primary" size="lg">
            {heroContent.primaryCta.label}
          </LinkButton>
          <LinkButton href={heroContent.secondaryCta.href} variant="ghost" size="lg">
            {heroContent.secondaryCta.label}
          </LinkButton>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2"
        initial={reducedMotion ? undefined : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.1 }}
      >
        <span className="type-caption uppercase tracking-[0.14em] text-muted">Scroll</span>
        <span className="relative h-8 w-px overflow-hidden bg-border" aria-hidden="true">
          <motion.span
            className="absolute inset-x-0 top-0 h-1/2 bg-accent"
            animate={reducedMotion ? undefined : { y: ["-100%", "200%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </motion.div>
    </section>
  );
}
