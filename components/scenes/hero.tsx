"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { LinkButton } from "@/components/ui/link-button";
import { heroContent } from "@/data/home";
import { homeShowreel } from "@/data/media";
import { setupGsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const EASE = [0.16, 1, 0.3, 1] as const;
// A firm in-out for the wipe — slow at the seam's edges, quick through the
// middle, so the uncovering reads as a deliberate gesture rather than a fade.
const WIPE_EASE = [0.76, 0, 0.24, 1] as const;

/**
 * Total height of the scene. 100vh of it is spent holding the sticky frame, so
 * the scrubbed distance is (this - 100vh) — a full screen of scroll for the
 * statement to arrive, hold, and clear again.
 */
const SCENE_HEIGHT_VH = 200;

/** Scroll progress (0-1) at which each beat starts and finishes. */
const CUE_OUT = 0.07; // the scroll cue retires the moment you take it
const LINE_IN = 0.1; // the statement resolves over the reel
const LINE_FULL = 0.34;
const CTA_IN = 0.26; // the two ways in follow the line
const CTA_FULL = 0.44;
const CLEAR_IN = 0.6; // everything clears — the reel plays uncovered again
const CLEAR_OUT = 0.8;

/** Fraction of the in-window spent staggering the words against each other. */
const WORD_SPREAD = 0.45;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

/**
 * Scene 01 — the opening. The studio's showreel, played through (not scrubbed),
 * uncovered on load by a left-to-right clip-path wipe — the aadhyaanimatics
 * reveal, mirrored (they wipe right-to-left).
 *
 * The page now opens on the work and nothing else: no headline, no paragraph,
 * no buttons over the first frame. The statement is a scroll beat — it resolves
 * a short way in, holds, and clears again before the scene releases, so the last
 * thing you see here is the reel playing full-bleed rather than type sitting on
 * top of it. A hero is the studio's one chance to show rather than tell, and it
 * was spending it on a sentence.
 *
 * The load reveal (wipe + push-in) is driven by a post-mount `revealed` flip
 * rather than framer's own mount animation. The whole tree is wrapped in
 * `<AnimatePresence initial={false}>` (page-transition-layer), whose presence
 * context suppresses child *mount* animations on the very first load — which is
 * exactly why the reveal used to snap on a cold open yet play correctly when
 * navigated to from another page. A state flip after mount is an ordinary prop
 * change, so it animates every time, cold open included.
 */
export function Hero() {
  const reducedMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const scrimRef = useRef<HTMLDivElement | null>(null);
  const copyRef = useRef<HTMLDivElement | null>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const ctaRef = useRef<HTMLDivElement | null>(null);
  const cueRef = useRef<HTMLDivElement | null>(null);

  const [revealed, setRevealed] = useState(false);
  useEffect(() => {
    // Flip on the next frame, not synchronously — this both lets the hidden
    // state paint once before it animates and keeps the setState out of the
    // effect body (react-hooks/set-state-in-effect).
    const id = requestAnimationFrame(() => setRevealed(true));
    return () => cancelAnimationFrame(id);
  }, []);

  /*
   * Stop decoding the reel once it is off screen.
   *
   * A plain `autoPlay loop` keeps an eighty-second film decoding for the whole
   * visit — the visitor is five sections down, watching a pinned scrub, and the
   * hero is still handing the compositor twenty-four frames a second of video it
   * is painting nowhere. That decode is competing for exactly the budget the
   * scrub needs.
   */
  useEffect(() => {
    const video = videoRef.current;
    if (reducedMotion || !video) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.01 },
    );
    io.observe(video);
    return () => io.disconnect();
  }, [reducedMotion]);

  /* The statement's arrival and departure, tied to the scroll gesture. */
  useEffect(() => {
    if (reducedMotion || !wrapperRef.current) return;

    const { ScrollTrigger } = setupGsap();

    const words = wordRefs.current.filter(Boolean) as HTMLSpanElement[];
    const step = words.length > 1 ? WORD_SPREAD / (words.length - 1) : 0;
    // Each word gets the whole in-window minus the stagger ahead of it, so the
    // last one still finishes exactly at LINE_FULL.
    const wordSpan = 1 - step * (words.length - 1);

    const trigger = ScrollTrigger.create({
      trigger: wrapperRef.current,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        const p = self.progress;

        const arrive = clamp((p - LINE_IN) / (LINE_FULL - LINE_IN), 0, 1);
        const leave = clamp((p - CLEAR_IN) / (CLEAR_OUT - CLEAR_IN), 0, 1);
        const present = arrive * (1 - leave);

        if (copyRef.current) {
          copyRef.current.style.opacity = String(present);
          // Drifts up on the way in, and keeps drifting on the way out, so the
          // exit reads as a departure rather than a dimmer switch.
          const y = (1 - arrive) * 26 - leave * 26;
          copyRef.current.style.transform = `translate3d(0, ${y}px, 0)`;
        }

        // The legibility scrim only exists while there is type to make legible.
        if (scrimRef.current) scrimRef.current.style.opacity = String(present);

        words.forEach((word, i) => {
          const local = clamp((arrive - i * step) / wordSpan, 0, 1);
          word.style.transform = `translate3d(0, ${(1 - local) * 110}%, 0)`;
        });

        const cta = clamp((p - CTA_IN) / (CTA_FULL - CTA_IN), 0, 1);
        if (ctaRef.current) ctaRef.current.style.opacity = String(cta * (1 - leave));

        if (cueRef.current) {
          cueRef.current.style.opacity = String(1 - clamp(p / CUE_OUT, 0, 1));
        }
      },
    });

    return () => trigger.kill();
  }, [reducedMotion]);

  // Under reduced motion everything is simply present: no wipe, no travel, and
  // the statement sits on the reel from the first frame.
  const shown = revealed || reducedMotion;

  const words = heroContent.headline.split(" ");

  const reel = (
    <>
      {/* The showreel, uncovered left-to-right.

          The uncovering is a panel sliding off, not a `clip-path: inset()` on the
          reel. Both read identically — the panel is the section's own background,
          so what is behind the seam is the same colour either way — but a clip
          path is recomputed and repainted against a full-viewport, playing video
          on every frame of the animation, and this arrives during hydration,
          while the film drum's images decode. Transforming an opaque panel is
          compositor-only, so the wipe now costs nothing on the frame budget it
          was previously blowing.

          The slow push-in stays on the video itself, so neither transform fights
          the other. */}
      <div className="absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
        <motion.video
          ref={videoRef}
          className="h-full w-full object-cover"
          initial={reducedMotion ? false : { scale: 1.12 }}
          animate={{ scale: shown ? 1 : 1.12 }}
          transition={{ duration: reducedMotion ? 0 : 2.6, ease: EASE, delay: reducedMotion ? 0 : 0.2 }}
          autoPlay={!reducedMotion}
          loop={!reducedMotion}
          muted
          playsInline
          // `auto` told the browser to pull all four megabytes down as fast as it
          // could, against the first paint. `metadata` still streams the reel the
          // moment it plays — it just stops it racing the page for bandwidth.
          preload="metadata"
          poster={homeShowreel.poster}
        >
          <source src={homeShowreel.video} type="video/mp4" />
        </motion.video>
        <motion.div
          className="absolute inset-0 bg-[#0a0a0f]"
          initial={reducedMotion ? false : { x: "0%" }}
          animate={{ x: shown ? "100%" : "0%" }}
          transition={{
            duration: reducedMotion ? 0 : 1.5,
            ease: WIPE_EASE,
            delay: reducedMotion ? 0 : 0.2,
          }}
          style={{ willChange: "transform" }}
        />
      </div>

      {/* Always on, and light: it seats the header at the top, carries the
          scroll cue at the bottom, and hands the eye off to the dark section
          below — none of which should cost the frame its clarity. */}
      <div
        className="absolute inset-0 z-[1]"
        aria-hidden="true"
        style={{
          background:
            "linear-gradient(180deg, rgba(8,8,14,0.34) 0%, rgba(8,8,14,0) 24%, rgba(8,8,14,0) 62%, rgba(8,8,14,0.62) 100%)",
        }}
      />

      {/* Legibility scrim for the statement only — faded in and out with it. */}
      <div
        ref={scrimRef}
        className="absolute inset-0 z-[1]"
        aria-hidden="true"
        style={{
          opacity: reducedMotion ? 1 : 0,
          background:
            "radial-gradient(ellipse 74% 58% at 50% 50%, rgba(6,6,12,0.72) 0%, rgba(6,6,12,0.28) 62%, rgba(6,6,12,0) 100%)",
        }}
      />
    </>
  );

  const statement = (
    <div
      ref={copyRef}
      className="relative z-10 flex flex-col items-center"
      style={reducedMotion ? undefined : { opacity: 0 }}
    >
      {/* One line, and the two ways in. The eyebrow and the paragraph that used
          to sit around it are gone: over a playing reel they were a wall of type
          on top of the work, and both say what the sections below say properly. */}
      <h1 className="mx-auto max-w-[18ch] text-balance type-hero text-white">
        {words.map((word, i) => (
          // The mask must be tall enough for descenders (the "g" in
          // "engineered" was being sheared off). Pad the clip box, then pull
          // the extra height back out with a negative margin so line spacing
          // is untouched.
          <span
            key={`${word}-${i}`}
            className="inline-block overflow-hidden pb-[0.22em] pt-[0.08em] -mb-[0.22em] -mt-[0.08em]"
          >
            <span
              ref={(node) => {
                wordRefs.current[i] = node;
              }}
              className="inline-block"
              style={reducedMotion ? undefined : { transform: "translate3d(0, 110%, 0)" }}
            >
              {word}
            </span>
            {i < words.length - 1 ? <span>&nbsp;</span> : null}
          </span>
        ))}
      </h1>

      <div
        ref={ctaRef}
        className="mt-11 flex flex-wrap items-center justify-center gap-3"
        style={reducedMotion ? undefined : { opacity: 0 }}
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
      </div>
    </div>
  );

  const cue = (
    // Two elements, one job each: framer owns the outer opacity (the load fade),
    // the scrub owns the inner one. Sharing a single `style.opacity` between
    // them means whichever wrote last wins, and they interleave.
    <motion.div
      className="absolute bottom-10 left-1/2 z-10 -translate-x-1/2"
      initial={reducedMotion ? false : { opacity: 0 }}
      animate={{ opacity: shown ? 1 : 0 }}
      transition={{ duration: 0.8, delay: reducedMotion ? 0 : 1.4 }}
    >
      <div ref={cueRef} className="flex flex-col items-center gap-2">
        <span className="type-caption uppercase tracking-[0.14em] text-white/70">Scroll</span>
        <span className="relative h-8 w-px overflow-hidden bg-white/25" aria-hidden="true">
          <motion.span
            className="absolute inset-x-0 top-0 h-1/2 bg-accent"
            animate={reducedMotion ? undefined : { y: ["-100%", "200%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </div>
    </motion.div>
  );

  if (reducedMotion) {
    return (
      <section
        id="hero"
        aria-label="Southeast Media — opening"
        className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-[#0a0a0f] px-6 pb-24 pt-32 text-center"
      >
        {reel}
        {statement}
      </section>
    );
  }

  return (
    <section
      id="hero"
      aria-label="Southeast Media — opening"
      ref={wrapperRef}
      className="relative bg-[#0a0a0f]"
      style={{ height: `${SCENE_HEIGHT_VH}vh` }}
    >
      <div className="sticky top-0 flex h-dvh flex-col items-center justify-center overflow-hidden px-6 text-center">
        {reel}
        {statement}
        {cue}
      </div>
    </section>
  );
}
