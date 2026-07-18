"use client";

import { Container } from "@/components/common/container";
import { Reveal } from "@/components/common/reveal";
import { LoopVideo } from "@/components/pharma/loop-video";
import { NaturalMedia } from "@/components/pharma/natural-media";
import { TiltCard } from "@/components/pharma/tilt-card";
import { pharmaAtlas, type MotionClip, type OrganPlate } from "@/data/pharma";
import { ratioOf } from "@/lib/pharma-media-dims";

/**
 * The atlas — deck slides 8–21, the organ-by-organ disease-state library.
 *
 * Every organ is one full source slide (uniform 16:9), shown whole at one shared
 * size: nothing cropped, nothing letterboxed. Each plate answers the pointer —
 * it tilts toward the cursor and lifts under a soft spotlight — so the gallery
 * reads as lit objects on a wall, not slides pasted flat. Below the plates the
 * atlas comes alive: the animation loops, structured, playing as they enter view.
 * Set on pure white, the medical renders read as framed specimen plates.
 */
export function OrganAtlas() {
  const { motion } = pharmaAtlas;

  return (
    <section id="atlas" className="scroll-mt-36 bg-white py-24 md:py-32">
      <Container size="xl">
        <div className="mb-14 max-w-2xl">
          <Reveal>
            <p className="type-label mb-5 text-[color:var(--brand-blue)]">{pharmaAtlas.eyebrow}</p>
            <h2 className="type-h2 text-balance text-[#15141a]">{pharmaAtlas.title}</h2>
            <p className="type-body-lg mt-5 text-[#55555f]">{pharmaAtlas.body}</p>
          </Reveal>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:gap-7">
          {pharmaAtlas.plates.map((plate, i) => (
            <Reveal key={plate.slug} delay={(i % 2) * 0.08} y={28}>
              <Plate plate={plate} priority={i < 2} />
            </Reveal>
          ))}
        </div>

        {/* The atlas in motion — the animation loops, structured, playing in view. */}
        <div className="mt-24 md:mt-28">
          <Reveal>
            <div className="mb-10 flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
              <div className="max-w-2xl">
                <h3 className="type-h3 text-balance text-[#15141a]">{motion.title}</h3>
                <p className="type-body mt-3 text-[#55555f]">{motion.body}</p>
              </div>
              <span className="type-label flex items-center gap-2 text-[color:var(--brand-blue)]">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--brand-blue)] opacity-70" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--brand-blue)]" />
                </span>
                Live loops
              </span>
            </div>
          </Reveal>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {motion.squares.map((clip, i) => (
              <Reveal key={clip.slug} delay={(i % 4) * 0.07} y={28}>
                <MotionClipCard clip={clip} />
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.05} y={28}>
            <div className="mt-6">
              <MotionClipCard clip={motion.wide} />
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

function Plate({ plate, priority }: { plate: OrganPlate; priority: boolean }) {
  return (
    <TiltCard className="group overflow-hidden rounded-[1.4rem] border border-black/[0.08] bg-white shadow-[0_28px_70px_-48px_rgba(21,20,26,0.45)]">
      <figure>
        <NaturalMedia
          image={plate.image}
          alt={plate.name}
          priority={priority}
          sizes="(min-width: 1024px) 46vw, (min-width: 640px) 48vw, 96vw"
          imgClassName="transition-transform duration-[900ms] ease-out group-hover:scale-[1.03]"
        />
      </figure>
    </TiltCard>
  );
}

function MotionClipCard({ clip }: { clip: MotionClip }) {
  const ratio = ratioOf(clip.poster);

  return (
    <TiltCard
      max={5}
      className="group overflow-hidden rounded-[1.3rem] border border-black/[0.08] bg-[#05070d] shadow-[0_28px_70px_-48px_rgba(21,20,26,0.5)]"
    >
      <figure>
        <div className="relative w-full overflow-hidden" style={{ aspectRatio: String(ratio) }}>
          <LoopVideo
            src={clip.video}
            poster={clip.poster}
            className="transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
          />
        </div>
        <figcaption className="flex items-baseline gap-3 px-5 py-4">
          <h4 className="type-h4 text-[1.02rem] text-[var(--ink-frame-foreground)]">{clip.name}</h4>
          <p className="type-caption text-[color:var(--brand-ice)]/55">{clip.note}</p>
        </figcaption>
      </figure>
    </TiltCard>
  );
}
