"use client";

import Image from "next/image";
import { Container } from "@/components/common/container";
import { Reveal } from "@/components/common/reveal";
import { LoopVideo } from "@/components/pharma/loop-video";
import { NaturalMedia } from "@/components/pharma/natural-media";
import { TiltCard } from "@/components/pharma/tilt-card";
import { pharmaAtlas, type MotionClip, type OrganPlate } from "@/data/pharma";
import { ratioOf } from "@/lib/pharma-media-dims";
import { cn } from "@/lib/utils";

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
/** Organs shown full-width, one to a row (everything not called out for the grid). */
const FULL_WIDTH_PLATES = new Set(["brain", "lung", "liver"]);

export function OrganAtlas() {
  const { motion } = pharmaAtlas;
  const keptPlates = pharmaAtlas.plates.filter((p) => !FULL_WIDTH_PLATES.has(p.slug));
  const brainPlate = pharmaAtlas.plates.find((p) => p.slug === "brain")!;
  const lungPlate = pharmaAtlas.plates.find((p) => p.slug === "lung")!;
  const liverPlate = pharmaAtlas.plates.find((p) => p.slug === "liver");

  return (
    <section id="atlas" className="scroll-mt-36 bg-white py-24 md:py-32">
      <Container size="xl">
        <div className="mb-14 max-w-2xl">
          <Reveal x={-40}>
            <p className="type-label mb-5 text-[color:var(--brand-blue)]">{pharmaAtlas.eyebrow}</p>
          </Reveal>
          <Reveal mask delay={0.06}>
            <h2 className="type-h2 text-balance text-[#15141a]">{pharmaAtlas.title}</h2>
          </Reveal>
          <Reveal delay={0.16} y={16}>
            <p className="type-body-lg mt-5 text-[#55555f]">{pharmaAtlas.body}</p>
          </Reveal>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:gap-7">
          {keptPlates.map((plate, i) => (
            <Reveal key={plate.slug} delay={(i % 2) * 0.08} y={0} scale={0.9} className="h-full">
              <Plate plate={plate} priority={i < 2} />
            </Reveal>
          ))}
        </div>

        {/* The remaining organs — cropped to the render, sized to their own shape.
            They enter from alternating sides; point at one and the frame morphs
            into the mark and turns to a card. */}
        <div className="mt-6 space-y-6 lg:space-y-7">
          <Reveal y={0} scale={0.94} duration={0.85}>
            <MorphPlate plate={brainPlate} corner="3rem" />
          </Reveal>
          <Reveal y={0} scale={0.94} duration={0.85}>
            <MorphPlate plate={lungPlate} corner="3rem" />
          </Reveal>
          {liverPlate ? (
            <Reveal y={0} scale={0.94} duration={0.85}>
              <MorphPlate plate={liverPlate} corner="3rem" />
            </Reveal>
          ) : null}
        </div>

        {/* The atlas in motion — the animation loops, structured, playing in view. */}
        <div className="mt-24 md:mt-28">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
            <Reveal x={-40} className="max-w-2xl">
              <h3 className="type-h3 text-balance text-[#15141a]">{motion.title}</h3>
              <p className="type-body mt-3 text-[#55555f]">{motion.body}</p>
            </Reveal>
            <Reveal x={40}>
              <span className="type-label flex items-center gap-2 text-[color:var(--brand-blue)]">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--brand-blue)] opacity-70" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--brand-blue)]" />
                </span>
                Live loops
              </span>
            </Reveal>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {motion.squares.map((clip, i) => (
              <Reveal key={clip.slug} delay={(i % 4) * 0.07} y={0} scale={0.9} className="h-full">
                <MotionClipCard clip={clip} ratio={1} />
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.05} y={0} scale={0.95} duration={0.85}>
            <div className="mt-6">
              <MotionClipCard clip={motion.wide} />
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

function Plate({ plate, priority = false }: { plate: OrganPlate; priority?: boolean }) {
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

/**
 * A cropped organ render that morphs into the mark on hover.
 *
 * At rest it is just the render (the baked slide text is already cropped away).
 * Point at it and the frame's corners sweep into the logo silhouette
 * (`.brand-shape-morph`, `--corner`), the render fades, and a card naming the
 * organ turns over in its place — the same gesture as the home-page discipline
 * wall. The box takes the crop's own aspect, so nothing is cropped again here.
 */
function MorphPlate({
  plate,
  corner,
  className,
}: {
  plate: OrganPlate;
  corner: string;
  className?: string;
}) {
  const ratio = ratioOf(plate.image);

  return (
    <div
      className={cn("group relative", className)}
      style={{ "--corner": corner } as React.CSSProperties}
    >
      <div
        className="brand-shape-morph relative w-full overflow-hidden border border-black/[0.08] bg-white shadow-[0_28px_70px_-48px_rgba(21,20,26,0.45)]"
        style={{ aspectRatio: String(ratio) }}
      >
        <Image
          src={plate.image}
          alt={plate.name}
          fill
          sizes="(min-width: 1024px) 90vw, 96vw"
          className="object-cover transition-[transform,opacity] duration-700 ease-out group-hover:scale-[1.04] group-hover:opacity-0"
        />

        {/* Hovered state: the card, clipped to the same morphing box. */}
        <div className="absolute inset-0 flex flex-col justify-center bg-white p-7 opacity-0 transition-opacity duration-500 group-hover:opacity-100 md:p-10">
          <p className="type-label text-[color:var(--brand-blue)]">The atlas</p>
          <h3 className="type-h3 mt-3 text-balance text-[#15141a]">{plate.title ?? plate.name}</h3>
          {plate.blurb ? (
            <p className="type-body mt-4 max-w-xl text-[#55555f]">{plate.blurb}</p>
          ) : null}
        </div>
      </div>

      {/* The rule that traces the silhouette the frame morphs into. */}
      <span
        className="brand-shape-morph pointer-events-none absolute inset-0 border-2 border-transparent transition-colors duration-500 group-hover:border-[rgba(21,20,26,0.4)]"
        aria-hidden="true"
      />
    </div>
  );
}

function MotionClipCard({ clip, ratio }: { clip: MotionClip; ratio?: number }) {
  const r = ratio ?? ratioOf(clip.poster);

  return (
    <TiltCard
      max={5}
      className="group flex h-full flex-col overflow-hidden rounded-[1.3rem] border border-black/[0.08] bg-[#05070d] shadow-[0_28px_70px_-48px_rgba(21,20,26,0.5)]"
    >
      <figure className="flex h-full flex-col">
        <div className="relative w-full overflow-hidden" style={{ aspectRatio: String(r) }}>
          <LoopVideo
            src={clip.video}
            poster={clip.poster}
            className="transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
          />
        </div>
        <figcaption className="flex flex-1 items-baseline gap-3 px-5 py-4">
          <h4 className="type-h4 text-[1.02rem] text-[var(--ink-frame-foreground)]">{clip.name}</h4>
          <p className="type-caption text-[color:var(--brand-ice)]/55">{clip.note}</p>
        </figcaption>
      </figure>
    </TiltCard>
  );
}
