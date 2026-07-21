"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform, useMotionValue } from "framer-motion";
import { Container } from "@/components/common/container";
import { Reveal } from "@/components/common/reveal";
import { LazyLoopVideo } from "@/components/media/lazy-loop-video";
import { animationAssets } from "@/data/media";
import type { VerticalSection } from "@/data/verticals";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const [LEFT, RIGHT] = animationAssets.anamorphic;
/**
 * How far each plane is folded away from the viewer, in degrees.
 *
 * Kept shallow on purpose, and paired with a long perspective below. A steeper
 * fold projects the near edge of each plane well past the box it is laid out in —
 * the geometry grows, the layout does not — and the caption underneath ends up
 * printed over the picture. The stage's vertical padding is the rest of that
 * allowance; do not remove it if you increase this.
 */
const FOLD = 30;
const SPRING = { stiffness: 90, damping: 22, mass: 0.6 } as const;

/**
 * Beyond the screen — the corner, built as a corner.
 *
 * This is the one section on the site that argues in the medium it is selling.
 * The page claims the studio builds forced-perspective content for screens that
 * are not rectangles, so rather than showing a photograph of an LED wall, it
 * folds two planes into an actual corner in CSS and runs a different build on
 * each. The stage answers the pointer and drifts with the scroll, so the illusion
 * only resolves from where you are looking from — which is precisely the thing
 * anamorphic content is: geometry first, frame second.
 *
 * The two films are deliberately different pieces. One file mirrored across the
 * seam would read as a reflection; two builds read as one continuous plate
 * wrapping the fold, which is what a corner screen actually plays.
 *
 * Cost is two decoders in one section, both lazy — nothing downloads until the
 * corner is on screen, and both pause when it leaves. Under reduced motion the
 * fold is abandoned entirely: the planes lie flat, side by side, and neither one
 * moves. The claim survives the loss of the demonstration.
 */
export function AnimationAnamorphic({
  section,
  id,
  rule,
}: {
  section: VerticalSection;
  id?: string;
  rule: string;
}) {
  const reducedMotion = useReducedMotion();
  // A touch device has no pointer to move, so it must not be told to move one.
  // The scroll drift is what keeps the fold alive there.
  const hasPointer = useMediaQuery("(hover: hover) and (pointer: fine)");
  const ref = useRef<HTMLDivElement | null>(null);

  // Scroll gives the stage a slow base drift, so it is alive on a touch screen
  // that will never send a pointer move.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const driftY = useTransform(scrollYProgress, [0, 1], [7, -7]);

  // Pointer parallax, damped. Raw pointer values on a 3D transform read as
  // twitchy; the spring is what makes it feel like a heavy object on a rig.
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const tiltY = useSpring(useTransform(pointerX, [-0.5, 0.5], [-9, 9]), SPRING);
  const tiltX = useSpring(useTransform(pointerY, [-0.5, 0.5], [5, -5]), SPRING);

  const planes = [
    { slot: LEFT!, rotate: FOLD, origin: "right center" },
    { slot: RIGHT!, rotate: -FOLD, origin: "left center" },
  ];

  return (
    <section id={id} className="scroll-mt-36 bg-[#05070d] py-20 md:py-28">
      <Container size="xl">
        <div className="max-w-3xl">
          {section.eyebrow ? (
            <p className="type-label mb-4" style={{ color: rule }}>
              {section.eyebrow}
            </p>
          ) : null}
          <Reveal mask>
            <h2 className="type-h2 text-balance text-[var(--ink-frame-foreground)]">
              {section.heading}
            </h2>
          </Reveal>
          {section.lead ? (
            <Reveal delay={0.08}>
              <p className="type-body-lg mt-6 text-[color:var(--brand-ice)]/75">{section.lead}</p>
            </Reveal>
          ) : null}
        </div>

        {/* The stage. No `overflow-hidden` anywhere on this subtree — it flattens
            a preserve-3d context and the fold collapses back into two rectangles. */}
        <div
          ref={ref}
          className="relative mt-16"
          onPointerMove={(e) => {
            if (reducedMotion) return;
            const box = e.currentTarget.getBoundingClientRect();
            pointerX.set((e.clientX - box.left) / box.width - 0.5);
            pointerY.set((e.clientY - box.top) / box.height - 0.5);
          }}
          onPointerLeave={() => {
            pointerX.set(0);
            pointerY.set(0);
          }}
        >
          {/* The light the installation throws on the room it is in. */}
          <div
            className="pointer-events-none absolute inset-x-0 -bottom-16 top-8"
            style={{
              background:
                "radial-gradient(50% 55% at 50% 60%, rgba(198,150,59,0.18), transparent 72%)",
            }}
            aria-hidden="true"
          />

          {/* The padding is structural, not decorative: it is the room the folded
              planes need to project into. See the note on FOLD. */}
          <div
            className="relative py-10 md:py-16"
            style={{ perspective: reducedMotion ? undefined : "1800px" }}
          >
            <motion.div
              className="mx-auto flex max-w-4xl justify-center"
              style={
                reducedMotion
                  ? undefined
                  : { transformStyle: "preserve-3d", rotateY: tiltY, rotateX: tiltX }
              }
            >
              {planes.map(({ slot, rotate, origin }) => (
                <motion.figure
                  key={slot.key}
                  className="relative aspect-[4/5] w-1/2 bg-black ring-1 ring-white/12"
                  style={
                    reducedMotion
                      ? undefined
                      : {
                          transformOrigin: origin,
                          transformStyle: "preserve-3d",
                          rotateY: rotate,
                          y: driftY,
                        }
                  }
                >
                  <LazyLoopVideo src={slot.video} poster={slot.src} />
                  {/* Panel falloff. It darkens toward the seam — the far edge of
                      each plane — because that is the edge turned away from the
                      light. Shaded the other way round it reads as two panels lit
                      from behind, which is the one thing the fold must not do. */}
                  <span
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background:
                        rotate > 0
                          ? "linear-gradient(270deg, rgba(0,0,0,0.45), transparent 68%)"
                          : "linear-gradient(90deg, rgba(0,0,0,0.45), transparent 68%)",
                    }}
                    aria-hidden="true"
                  />
                  <figcaption className="type-caption absolute bottom-3 left-3 rounded-full bg-black/60 px-2.5 py-1 text-[color:var(--brand-ice)]/70 backdrop-blur-sm">
                    {slot.note}
                  </figcaption>
                </motion.figure>
              ))}
            </motion.div>
          </div>

          {/* `mx-auto` is load-bearing: `globals.css` caps every `p` at 68ch, so
              a centred caption without it centres inside a 490px box parked at
              the left gutter rather than under the stage. */}
          <p className="type-caption relative mx-auto mt-4 text-center text-[color:var(--brand-ice)]/40">
            {reducedMotion || !hasPointer
              ? "Two planes, one continuous plate — built to the fold of the screen."
              : "Two planes, one continuous plate. Move the pointer: the illusion is the geometry, not the frame."}
          </p>
        </div>

        {section.body?.length ? (
          <div className="mt-16 grid gap-x-14 gap-y-6 lg:grid-cols-2">
            {section.body.map((para, i) => (
              <Reveal key={para.slice(0, 40)} delay={i * 0.06}>
                <p className="type-body border-t border-white/12 pt-6 text-[color:var(--brand-ice)]/70">
                  {para}
                </p>
              </Reveal>
            ))}
          </div>
        ) : null}

        {section.items?.length ? (
          <dl className="mt-14 grid gap-x-10 gap-y-10 sm:grid-cols-3">
            {section.items.map((item, i) => (
              <Reveal key={item.name} delay={i * 0.06}>
                <div className="border-t border-white/15 pt-6">
                  <span className="type-index text-[color:var(--brand-ice)]/40">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <dt className="type-h4 mt-3 text-[1.1rem] text-[var(--ink-frame-foreground)]">
                    {item.name}
                  </dt>
                  <dd className="type-body mt-2.5 text-[color:var(--brand-ice)]/65">
                    {item.detail}
                  </dd>
                </div>
              </Reveal>
            ))}
          </dl>
        ) : null}
      </Container>
    </section>
  );
}
