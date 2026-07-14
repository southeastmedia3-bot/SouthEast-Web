"use client";

import { useRef } from "react";
import { motion, useMotionTemplate, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { BrandMark } from "@/components/brand/brand-mark";
import { enterpriseClose } from "@/data/home";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

/**
 * Scene 06 — Enterprise Close. The page's only button lives here, and only here —
 * framed as vendor onboarding, not a pitch.
 *
 * ## The unveil
 *
 * The old close was a 230vh scroll-scrubbed hard cut: hold on cream, cut to
 * black, resolve the line. It cost ~750px of a genuinely empty screen to set the
 * cut up, because a cut needs an empty frame to cut *from* — that emptiness was
 * the mechanism, not an oversight, which is why it had to go rather than be
 * shortened.
 *
 * This replaces it with a reveal that costs nothing. The black panel enters as a
 * card cut to the silhouette of our own mark — top-left and bottom-right swept
 * away, the other corners square — and as the section rises into view it expands
 * to full bleed and squares off, the line resolving inside it. The whole thing is
 * driven off the section's natural entry (its top travelling from the bottom of
 * the viewport to the top), so it adds not one pixel of scroll: the transition
 * happens in the distance the page was going to travel anyway.
 *
 * Under reduced motion it is simply the finished frame.
 */
export function Invitation() {
  const reducedMotion = useReducedMotion();
  const ref = useRef<HTMLElement | null>(null);

  // 0 -> the section's top is at the bottom of the viewport (just arriving)
  // 1 -> the section's top is at the top of the viewport (fully arrived)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start start"],
  });

  // The panel opens out of the mark's shape into a full-bleed field.
  const insetX = useTransform(scrollYProgress, [0, 0.62], [9, 0]);
  const insetY = useTransform(scrollYProgress, [0, 0.62], [7, 0]);
  const corner = useTransform(scrollYProgress, [0, 0.62], [160, 0]);
  const clipPath = useMotionTemplate`inset(${insetY}% ${insetX}% ${insetY}% ${insetX}% round ${corner}px 0px ${corner}px 0px)`;

  // The line only resolves once it has a field to sit on.
  const textOpacity = useTransform(scrollYProgress, [0.34, 0.68], [0, 1]);
  const textY = useTransform(scrollYProgress, [0.34, 0.68], [22, 0]);
  const ctaOpacity = useTransform(scrollYProgress, [0.58, 0.85], [0, 1]);
  const markOpacity = useTransform(scrollYProgress, [0.72, 0.95], [0, 0.7]);

  const still = reducedMotion;

  return (
    <section
      ref={ref}
      id="invitation"
      // White ground: it is what the mark-shaped panel is revealed *against*.
      className="relative flex min-h-dvh flex-col items-center justify-center gap-10 overflow-hidden bg-white px-6 py-32 text-center"
    >
      <motion.div
        className="absolute inset-0 bg-[var(--ink-frame)]"
        style={still ? undefined : { clipPath }}
        aria-hidden="true"
      />

      <motion.span
        className="absolute left-6 top-8 z-10 type-label text-[rgba(243,240,232,0.4)] sm:left-10 lg:left-14"
        style={still ? undefined : { opacity: ctaOpacity }}
      >
        06 — Enterprise Close
      </motion.span>

      <motion.p
        className="relative z-10 type-label text-[rgba(243,240,232,0.55)]"
        style={still ? undefined : { opacity: textOpacity, y: textY }}
      >
        {enterpriseClose.eyebrow}
      </motion.p>

      <motion.h2
        className="relative z-10 voice-quiet max-w-4xl text-balance text-[clamp(2.4rem,7vw,5.75rem)] leading-[1.0] text-[var(--ink-frame-foreground)]"
        style={still ? undefined : { opacity: textOpacity, y: textY }}
      >
        {enterpriseClose.headline}
      </motion.h2>

      <motion.a
        href="/contact"
        className="group relative z-10 inline-flex items-center gap-3 border-b border-[rgba(243,240,232,0.35)] pb-2 text-[var(--ink-frame-foreground)] transition-colors hover:border-[var(--ink-frame-foreground)]"
        style={still ? undefined : { opacity: ctaOpacity }}
      >
        <span className="type-h4">{enterpriseClose.cta}</span>
        <ArrowRight
          className="size-5 transition-transform duration-300 group-hover:translate-x-1.5"
          aria-hidden="true"
        />
      </motion.a>

      <motion.div
        className="relative z-10 mt-2"
        style={still ? undefined : { opacity: markOpacity }}
      >
        <BrandMark compact showWordmark={false} className={still ? "opacity-70" : undefined} />
      </motion.div>
    </section>
  );
}
