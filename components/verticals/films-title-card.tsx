"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Container } from "@/components/common/container";
import { LazyLoopVideo } from "@/components/media/lazy-loop-video";
import { LinkButton } from "@/components/ui/link-button";
import { filmsAssets } from "@/data/media";
import type { Vertical } from "@/data/verticals";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;
const SHUTTER = [0.65, 0, 0.35, 1] as const;

/** The studio's signature commercial — the beauty master, first in the programme. */
const HERO = filmsAssets.programme[0]!;

/**
 * The phrase in `vertical.title` set in Instrument Serif — the studio's quiet
 * aside. Must match the title word for word, punctuation included, or it is
 * ignored rather than half-applied. See `data/verticals.ts`.
 */
const ACCENT = "in the same building.";

/**
 * The title card — the Films page's opening, and the reason it does not use the
 * shared `VerticalHero`.
 *
 * Every other vertical opens on `CinematicBackdrop`: drifting CSS light standing
 * in for footage. That is the right call on a page selling renders. It is the
 * wrong call on the one page whose whole product is a moving picture, so this
 * opens on the film itself, full-bleed, at the size a projector would give it.
 *
 * THE GATE OPENS. Two black bands start closed over the middle of the frame and
 * pull back to an anamorphic 2.39-ish letterbox in the first second and a half —
 * a projector gate opening, not a fade-in. It is the page's single most
 * describable moment and it costs one animated property per band. The bands stay
 * for the life of the hero: they are the format the division shoots in, and they
 * are what keeps the title legible over a moving plate without a scrim over the
 * whole picture.
 *
 * Everything else is the house language: the title sets a word at a time out of a
 * clipped mask, the film dollies at half scroll speed behind it, and the slate
 * line along the foot states the format in the same mono the rest of the site
 * uses for technical fact. Under reduced motion the gate is simply open, the film
 * holds on its poster with controls, and nothing moves.
 */
export function FilmsTitleCard({ vertical }: { vertical: Vertical }) {
  const reducedMotion = useReducedMotion();
  const ref = useRef<HTMLElement | null>(null);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const filmY = useTransform(scrollYProgress, [0, 1], ["0%", "16%"]);
  const filmScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-9%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  const words = vertical.title.split(" ");
  const accentWords = ACCENT.split(" ");
  const accentStart = words.findIndex(
    (_, i) => words.slice(i, i + accentWords.length).join(" ") === ACCENT,
  );
  const isAccent = (i: number) =>
    accentStart >= 0 && i >= accentStart && i < accentStart + accentWords.length;

  // The gate. Closed to the middle of the frame, then pulled back to the format.
  const gate = reducedMotion
    ? { style: { height: "8.5%" } }
    : {
        initial: { height: "50%" },
        animate: { height: "8.5%" },
        transition: { duration: 1.5, ease: SHUTTER, delay: 0.2 },
      };

  return (
    <section
      ref={ref}
      className="relative flex min-h-[100svh] items-end overflow-hidden bg-[#050506] pb-[15svh] pt-32"
    >
      {/* The plate. `priority` is spent here — this is the page's signature film,
          and a hero that holds on a poster while it fetches is a hero that has
          already lost the argument the page is making. */}
      <motion.div
        className="grain absolute inset-0"
        style={reducedMotion ? undefined : { y: filmY, scale: filmScale }}
        aria-hidden="true"
      >
        <LazyLoopVideo src={HERO.video} poster={HERO.src} priority />
      </motion.div>

      {/* Two graded veils, not one flat scrim: the picture keeps its light in the
          upper half and the type gets a ground to sit on in the lower. */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(5,5,6,0.94) 8%, rgba(5,5,6,0.72) 38%, rgba(5,5,6,0.15) 68%, rgba(5,5,6,0.45) 100%)",
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(78% 62% at 50% 44%, transparent 40%, rgba(0,0,0,0.55) 100%)",
        }}
        aria-hidden="true"
      />

      {/* The gate itself. */}
      <motion.span
        className="pointer-events-none absolute inset-x-0 top-0 z-20 bg-[#050506]"
        aria-hidden="true"
        {...gate}
      />
      <motion.span
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-[#050506]"
        aria-hidden="true"
        {...gate}
      />

      <motion.div
        className="relative z-10 w-full"
        style={reducedMotion ? undefined : { y: contentY, opacity: contentOpacity }}
      >
        <Container>
          <motion.div
            className="mb-5 flex items-center gap-4"
            initial={reducedMotion ? undefined : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: EASE, delay: 1.1 }}
          >
            <span className="block h-[2px] w-10 bg-[color:var(--brand-gold)]" aria-hidden="true" />
            <p className="type-label text-[color:var(--brand-ice)]/70">{vertical.eyebrow}</p>
          </motion.div>

          <h1 className="max-w-[22ch] text-balance text-[clamp(2.15rem,4.4vw,3.9rem)] font-bold leading-[1.06] tracking-[-0.02em] text-[var(--ink-frame-foreground)]">
            {words.map((word, i) => (
              <span
                key={`${word}-${i}`}
                className={cn(
                  // Padded for descenders, pulled back out so line spacing is
                  // untouched — an unpadded mask shears the tail off a "g".
                  "inline-block overflow-hidden pb-[0.18em] pt-[0.06em] -mb-[0.18em] -mt-[0.06em]",
                  // The italic's tail overhangs the box that clips it.
                  isAccent(i) && "pr-[0.07em] -mr-[0.07em]",
                )}
              >
                <motion.span
                  className="inline-block"
                  initial={reducedMotion ? undefined : { y: "110%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: 0.85, ease: SHUTTER, delay: 0.9 + i * 0.055 }}
                >
                  {isAccent(i) ? <span className="voice-quiet">{word}</span> : word}
                </motion.span>
                {i < words.length - 1 ? <span>&nbsp;</span> : null}
              </span>
            ))}
          </h1>

          <motion.p
            className="type-body-lg mt-6 max-w-2xl text-[color:var(--brand-ice)]/75"
            initial={reducedMotion ? undefined : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 1.35 }}
          >
            {vertical.intro}
          </motion.p>

          <motion.div
            className="mt-8 flex flex-wrap gap-4"
            initial={reducedMotion ? undefined : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 1.5 }}
          >
            <LinkButton href="/contact" variant="primary" size="lg">
              Book the unit
            </LinkButton>
            <LinkButton
              href="#screening"
              variant="outline"
              size="lg"
              className="border-white/25 text-[var(--ink-frame-foreground)] hover:border-white/60 hover:text-[var(--ink-frame-foreground)]"
            >
              Watch the programme
            </LinkButton>
          </motion.div>

          {/* The slate. The terms a buyer would otherwise scroll for, set the way
              a leader states the format. */}
          {vertical.headline?.length ? (
            <motion.dl
              className="mt-10 flex flex-wrap items-end gap-x-12 gap-y-5 border-t border-white/15 pt-6"
              initial={reducedMotion ? undefined : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, ease: EASE, delay: 1.65 }}
            >
              {vertical.headline.map((m) => (
                <div key={m.label}>
                  <dt className="type-h4 text-[1.6rem] text-[var(--ink-frame-foreground)]">
                    {m.value}
                  </dt>
                  <dd className="type-caption mt-1.5 uppercase tracking-[0.1em] text-[color:var(--brand-ice)]/55">
                    {m.label}
                  </dd>
                </div>
              ))}
            </motion.dl>
          ) : null}
        </Container>
      </motion.div>
    </section>
  );
}
