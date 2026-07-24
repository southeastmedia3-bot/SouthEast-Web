"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LinkButton } from "@/components/ui/link-button";
import { heroContent } from "@/data/home";
import { homeShowreel } from "@/data/media";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const EASE = [0.16, 1, 0.3, 1] as const;
// A firm in-out for the wipe — slow at the seam's edges, quick through the
// middle, so the uncovering reads as a deliberate gesture rather than a fade.
const WIPE_EASE = [0.76, 0, 0.24, 1] as const;

/**
 * Scene 01 — the opening. The studio's showreel, played through (not scrubbed),
 * uncovered on load by a left-to-right clip-path wipe — the aadhyaanimatics
 * reveal, mirrored (they wipe right-to-left). The reel plays underneath the
 * whole time; the wipe only decides when you see it. The statement and the two
 * ways in sit over it on a legibility scrim.
 *
 * Every entrance is driven by a post-mount `revealed` flip rather than framer's
 * own mount animation. The whole tree is wrapped in `<AnimatePresence
 * initial={false}>` (page-transition-layer), whose presence context suppresses
 * child *mount* animations on the very first load — which is exactly why the
 * headline used to snap in on a cold open yet reveal correctly when navigated to
 * from another page. A state flip after mount is an ordinary prop change, so it
 * animates every time, cold open included.
 */
export function Hero() {
  const reducedMotion = useReducedMotion();

  const [revealed, setRevealed] = useState(false);
  useEffect(() => {
    // Flip on the next frame, not synchronously — this both lets the hidden
    // state paint once before it animates and keeps the setState out of the
    // effect body (react-hooks/set-state-in-effect).
    const id = requestAnimationFrame(() => setRevealed(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // Under reduced motion everything is simply present: no wipe, no travel.
  const shown = revealed || reducedMotion;

  const words = heroContent.headline.split(" ");

  return (
    <section
      id="hero"
      aria-label="Southeast Media — opening"
      className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-[#0a0a0f] px-6 pb-24 pt-32 text-center"
    >
      {/* The showreel, uncovered left-to-right. The clip lives on the wrapper;
          the slow push-in lives on the video, so neither transform fights the
          other. */}
      <motion.div
        className="absolute inset-0 z-0"
        aria-hidden="true"
        initial={reducedMotion ? false : { clipPath: "inset(0 100% 0 0)" }}
        animate={{ clipPath: shown ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)" }}
        transition={{ duration: reducedMotion ? 0 : 1.5, ease: WIPE_EASE, delay: reducedMotion ? 0 : 0.2 }}
      >
        <motion.video
          className="h-full w-full object-cover"
          initial={reducedMotion ? false : { scale: 1.12 }}
          animate={{ scale: shown ? 1 : 1.12 }}
          transition={{ duration: reducedMotion ? 0 : 2.6, ease: EASE, delay: reducedMotion ? 0 : 0.2 }}
          autoPlay={!reducedMotion}
          loop={!reducedMotion}
          muted
          playsInline
          preload={reducedMotion ? "metadata" : "auto"}
          poster={homeShowreel.poster}
        >
          <source src={homeShowreel.video} type="video/mp4" />
        </motion.video>
      </motion.div>

      {/* Legibility scrim: a top/bottom darkening for the type and the scroll
          cue, plus a soft centre vignette that follows the statement regardless
          of what frame the reel is on. */}
      <div
        className="absolute inset-0 z-[1]"
        aria-hidden="true"
        style={{
          background:
            "linear-gradient(180deg, rgba(8,8,14,0.58) 0%, rgba(8,8,14,0.32) 34%, rgba(8,8,14,0.5) 68%, rgba(8,8,14,0.88) 100%)",
        }}
      />
      <div
        className="absolute inset-0 z-[1]"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 62% 52% at 50% 46%, rgba(6,6,12,0.55) 0%, rgba(6,6,12,0) 70%)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center">
        <motion.p
          className="type-label mb-10 text-white/70"
          initial={reducedMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: shown ? 1 : 0, y: shown ? 0 : 8 }}
          transition={{ duration: 0.6, ease: EASE, delay: reducedMotion ? 0 : 0.55 }}
        >
          {heroContent.eyebrow}
        </motion.p>

        <h1 className="mx-auto max-w-[20ch] text-balance type-hero text-white">
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
                initial={reducedMotion ? false : { y: "110%" }}
                animate={{ y: shown ? "0%" : "110%" }}
                transition={{
                  duration: 0.8,
                  ease: [0.65, 0, 0.35, 1],
                  delay: reducedMotion ? 0 : 0.6 + i * 0.05,
                }}
              >
                {word}
              </motion.span>
              {i < words.length - 1 ? <span>&nbsp;</span> : null}
            </span>
          ))}
        </h1>

        <motion.p
          className="type-body-lg mx-auto mt-8 max-w-xl text-white/75"
          initial={reducedMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: shown ? 1 : 0, y: shown ? 0 : 10 }}
          transition={{ duration: 0.6, ease: EASE, delay: reducedMotion ? 0 : 0.95 }}
        >
          {heroContent.body}
        </motion.p>

        <motion.div
          className="mt-11 flex flex-wrap items-center justify-center gap-3"
          initial={reducedMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: shown ? 1 : 0, y: shown ? 0 : 10 }}
          transition={{ duration: 0.6, ease: EASE, delay: reducedMotion ? 0 : 1.1 }}
        >
          <LinkButton href={heroContent.primaryCta.href} variant="primary" size="lg">
            {heroContent.primaryCta.label}
          </LinkButton>
          <LinkButton
            href={heroContent.secondaryCta.href}
            variant="outline"
            size="lg"
            className="border-white/30 bg-white/[0.06] text-white backdrop-blur-md hover:border-white/70 hover:text-white"
          >
            {heroContent.secondaryCta.label}
          </LinkButton>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2"
        initial={reducedMotion ? false : { opacity: 0 }}
        animate={{ opacity: shown ? 1 : 0 }}
        transition={{ duration: 0.8, delay: reducedMotion ? 0 : 1.4 }}
      >
        <span className="type-caption uppercase tracking-[0.14em] text-white/60">Scroll</span>
        <span className="relative h-8 w-px overflow-hidden bg-white/25" aria-hidden="true">
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
