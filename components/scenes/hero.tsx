"use client";

import { motion } from "framer-motion";
import { HeroParticles } from "@/components/effects/hero-particles";
import { LinkButton } from "@/components/ui/link-button";
import { heroContent } from "@/data/home";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Scene 01 — the opening. A near-black field, a centred statement, two ways in.
 * The particles mass into the top-right and bottom-left and thin to nothing
 * through the middle, so the headline sits in clear air. Restraint is the point:
 * the work is the spectacle, not the homepage.
 */
export function Hero() {
  const reducedMotion = useReducedMotion();

  const words = heroContent.headline.split(" ");

  return (
    <section
      id="hero"
      aria-label="Southeast Media — opening"
      className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-[#0a0a0a] px-6 pb-24 pt-32 text-center"
    >
      <HeroParticles className="pointer-events-none absolute inset-0 z-0" />

      <div className="relative z-10 flex flex-col items-center">
        <motion.p
          className="type-label mb-10 text-[color:var(--brand-ice)]/55"
          initial={reducedMotion ? undefined : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          {heroContent.eyebrow}
        </motion.p>

        <h1 className="mx-auto max-w-[20ch] text-balance type-hero text-[var(--ink-frame-foreground)]">
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
          className="type-body-lg mx-auto mt-8 max-w-xl text-[color:var(--brand-ice)]/65"
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
          <LinkButton
            href={heroContent.secondaryCta.href}
            variant="outline"
            size="lg"
            className="border-white/25 text-[var(--ink-frame-foreground)] hover:border-white/60 hover:text-[var(--ink-frame-foreground)]"
          >
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
        <span className="type-caption uppercase tracking-[0.14em] text-[color:var(--brand-ice)]/50">
          Scroll
        </span>
        <span className="relative h-8 w-px overflow-hidden bg-white/20" aria-hidden="true">
          <motion.span
            className="absolute inset-x-0 top-0 h-1/2 bg-[color:var(--brand-sky)]"
            animate={reducedMotion ? undefined : { y: ["-100%", "200%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </motion.div>
    </section>
  );
}
