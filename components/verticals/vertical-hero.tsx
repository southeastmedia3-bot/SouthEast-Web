"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { CinematicBackdrop } from "@/components/media/cinematic-backdrop";
import { Container } from "@/components/common/container";
import { LinkButton } from "@/components/ui/link-button";
import type { Vertical } from "@/data/verticals";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * The vertical hero.
 *
 * The title sets a word at a time out of a clipped mask, the terms follow, and
 * the backdrop drifts at roughly half scroll speed behind it — depth, not
 * spectacle. All of it happens in the scroll the page was going to travel anyway;
 * nothing here is pinned and nothing adds height.
 *
 * NOTE the mask has to be padded for descenders. An `overflow-hidden` box sized to
 * the line-height shears the tail off a "g" or a "y" — it bit us on the homepage
 * headline. The padding is pulled back out with a negative margin so the line
 * spacing is untouched.
 */
export function VerticalHero({ vertical }: { vertical: Vertical }) {
  const reducedMotion = useReducedMotion();
  const ref = useRef<HTMLElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const backdropY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-8%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const words = vertical.title.split(" ");

  return (
    <section
      ref={ref}
      className="relative flex min-h-[88vh] items-end overflow-hidden bg-[#05070d] pb-20 pt-40"
    >
      <motion.div
        className="absolute inset-0"
        style={reducedMotion ? undefined : { y: backdropY }}
        aria-hidden="true"
      >
        <CinematicBackdrop tone={vertical.tone === "gold" ? "mixed" : vertical.tone} scan />
      </motion.div>

      <motion.div
        className="relative w-full"
        style={reducedMotion ? undefined : { y: contentY, opacity: contentOpacity }}
      >
        <Container>
          <motion.p
            className="type-label mb-6 text-[color:var(--brand-ice)]/70"
            initial={reducedMotion ? undefined : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            {vertical.eyebrow}
          </motion.p>

          <h1 className="type-h1 max-w-4xl text-balance text-[var(--ink-frame-foreground)]">
            {words.map((word, i) => (
              <span
                key={`${word}-${i}`}
                className="inline-block overflow-hidden pb-[0.18em] pt-[0.06em] -mb-[0.18em] -mt-[0.06em]"
              >
                <motion.span
                  className="inline-block"
                  initial={reducedMotion ? undefined : { y: "110%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: 0.8, ease: [0.65, 0, 0.35, 1], delay: 0.08 + i * 0.05 }}
                >
                  {word}
                </motion.span>
                {i < words.length - 1 ? <span>&nbsp;</span> : null}
              </span>
            ))}
          </h1>

          <motion.p
            className="type-body-lg mt-8 max-w-2xl text-[color:var(--brand-ice)]/75"
            initial={reducedMotion ? undefined : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.35 }}
          >
            {vertical.intro}
          </motion.p>

          <motion.div
            className="mt-10 flex flex-wrap gap-4"
            initial={reducedMotion ? undefined : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.5 }}
          >
            <LinkButton href="/contact" variant="primary" size="lg">
              Start a project
            </LinkButton>
            <LinkButton
              href="/verticals"
              variant="outline"
              size="lg"
              className="border-white/25 text-[var(--ink-frame-foreground)] hover:border-white/60 hover:text-[var(--ink-frame-foreground)]"
            >
              All verticals
            </LinkButton>
          </motion.div>

          {/* The terms, stated up front. A buyer shouldn't have to scroll for them. */}
          {vertical.headline?.length ? (
            <dl className="mt-14 flex flex-wrap gap-x-14 gap-y-6">
              {vertical.headline.map((m, i) => (
                <motion.div
                  key={m.label}
                  initial={reducedMotion ? undefined : { opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: EASE, delay: 0.65 + i * 0.08 }}
                >
                  <dt className="type-h3 text-[var(--ink-frame-foreground)]">{m.value}</dt>
                  <dd className="type-caption mt-1.5 uppercase tracking-[0.1em] text-[color:var(--brand-ice)]/55">
                    {m.label}
                  </dd>
                </motion.div>
              ))}
            </dl>
          ) : null}
        </Container>
      </motion.div>
    </section>
  );
}
