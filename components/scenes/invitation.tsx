"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { BrandMark } from "@/components/brand/brand-mark";
import { enterpriseClose } from "@/data/home";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Scene 06 — Enterprise Close. The page's only button lives here, and only here —
 * framed as vendor onboarding, not a pitch.
 *
 * This used to be a 230vh scroll-scrubbed "hard cut": a cream stage that held,
 * cut to black, and then resolved the line. The problem was structural — a cut
 * needs an empty frame to cut *from*, and that empty frame was 750px of screen
 * with nothing on it that you had to drag through, followed by another ~1,100px
 * of holding an already-finished frame. Two and a half screens of scroll for one
 * sentence.
 *
 * So the cut is gone and the close simply arrives: black, full-bleed, resolving
 * as it comes into view. It costs one screen instead of two and a half, and there
 * is no point at which the visitor is looking at nothing.
 */
export function Invitation() {
  const reducedMotion = useReducedMotion();

  const rise = (delay: number) =>
    reducedMotion
      ? undefined
      : {
          initial: { opacity: 0, y: 18 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, amount: 0.4 },
          transition: { duration: 0.8, ease: EASE, delay },
        };

  return (
    <section
      id="invitation"
      className="relative flex min-h-dvh flex-col items-center justify-center gap-10 overflow-hidden bg-[var(--ink-frame)] px-6 py-32 text-center"
    >
      <span className="absolute left-6 top-8 type-label text-[rgba(243,240,232,0.4)] sm:left-10 lg:left-14">
        06 — Enterprise Close
      </span>

      <motion.p className="type-label text-[rgba(243,240,232,0.55)]" {...rise(0)}>
        {enterpriseClose.eyebrow}
      </motion.p>

      <motion.h2
        className="voice-quiet max-w-4xl text-balance text-[clamp(2.4rem,7vw,5.75rem)] leading-[1.0] text-[var(--ink-frame-foreground)]"
        {...rise(0.1)}
      >
        {enterpriseClose.headline}
      </motion.h2>

      <motion.a
        href="/contact"
        className="group inline-flex items-center gap-3 border-b border-[rgba(243,240,232,0.35)] pb-2 text-[var(--ink-frame-foreground)] transition-colors hover:border-[var(--ink-frame-foreground)]"
        {...rise(0.28)}
      >
        <span className="type-h4">{enterpriseClose.cta}</span>
        <ArrowRight
          className="size-5 transition-transform duration-300 group-hover:translate-x-1.5"
          aria-hidden="true"
        />
      </motion.a>

      <motion.div {...rise(0.42)} className="mt-2">
        <BrandMark compact showWordmark={false} className="opacity-70" />
      </motion.div>
    </section>
  );
}
