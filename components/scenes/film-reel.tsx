"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { LinkButton } from "@/components/ui/link-button";
import { filmReel } from "@/data/home";
import { setupGsap } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

/* Drum geometry. The cards butt together around each ring, so the ring reads as
   one continuous strip of film wrapped into a cylinder. */
const RINGS = 3;
const PER_RING = 12;
const CARD_W = 232;
const CARD_H = 132;
const RING_GAP = 176;
// circumference = PER_RING * CARD_W  ->  radius that makes the strip meet itself
const RADIUS = Math.round((PER_RING * CARD_W) / (2 * Math.PI));
const TWIST = 15; // degrees each ring is offset -> the strip spirals

type Cell = { src: string; ring: number; slot: number };

/* One frame per cell, no wrap-around. The images list is authored to be exactly
   RINGS * PER_RING long — a modulo here would quietly repeat frames the moment
   the list and the geometry drift apart, which is what the drum must never do. */
if (process.env.NODE_ENV !== "production" && filmReel.images.length !== RINGS * PER_RING) {
  console.warn(
    `film-reel: ${filmReel.images.length} images for ${RINGS * PER_RING} cells — frames will repeat.`,
  );
}

const CELLS: Cell[] = Array.from({ length: RINGS * PER_RING }, (_, i) => ({
  src: filmReel.images[i % filmReel.images.length]!,
  ring: Math.floor(i / PER_RING),
  slot: i % PER_RING,
}));

/** The perforated edge that makes it read as film rather than a photo strip. */
function Sprockets({ className }: { className?: string }) {
  return (
    <span
      className={cn("pointer-events-none absolute inset-x-0 flex justify-around px-1", className)}
      aria-hidden="true"
    >
      {Array.from({ length: 7 }, (_, i) => (
        <span key={i} className="h-[5px] w-[7px] rounded-[1px] bg-white/25" />
      ))}
    </span>
  );
}

/**
 * Scene — the reel. Thirty-six frames wrapped around a rotating drum: three
 * rings, twelve frames each, offset so the strip spirals like film on a spool.
 * Scroll turns the drum and pulls it away; it also idles with a slow rotation of
 * its own. Depth is shaded per frame from its angle to the camera, so the far
 * side of the drum falls back into the dark. Any frame opens the verticals page.
 *
 * Reduced motion collapses it to a plain grid of frames.
 */
export function FilmReel() {
  const reducedMotion = useReducedMotion();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const drumRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<Array<HTMLAnchorElement | null>>([]);

  useEffect(() => {
    if (reducedMotion || !rootRef.current || !stageRef.current || !drumRef.current) return;

    const { ScrollTrigger } = setupGsap();

    let auto = 0; // idle rotation
    let scrollAngle = 0;
    let scale = 1;
    let raf = 0;

    const trigger = ScrollTrigger.create({
      trigger: rootRef.current,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      pin: stageRef.current,
      onUpdate: (self) => {
        const p = self.progress;
        scrollAngle = p * 300; // the drum turns as you scroll
        scale = 1 - p * 0.22; // and recedes toward the end
      },
    });

    const loop = () => {
      auto += 0.06;
      const rot = auto + scrollAngle;

      if (drumRef.current) {
        drumRef.current.style.transform = `translateZ(-${RADIUS}px) rotateX(-10deg) rotateY(${rot}deg) scale(${scale})`;
      }

      // Shade each frame by how far it has turned away from the camera.
      for (let i = 0; i < CELLS.length; i++) {
        const cell = CELLS[i]!;
        const node = cardRefs.current[i];
        if (!node) continue;
        const theta = ((cell.slot * 360) / PER_RING + cell.ring * TWIST + rot) * (Math.PI / 180);
        const facing = Math.cos(theta); // 1 = toward camera, -1 = away
        const t = (facing + 1) / 2;
        node.style.opacity = String(0.18 + t * 0.82);
        node.style.filter = `brightness(${0.45 + t * 0.75})`;
        node.style.zIndex = String(Math.round(t * 100));
      }

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      trigger.kill();
    };
  }, [reducedMotion]);

  if (reducedMotion) {
    return (
      <section aria-label={filmReel.heading} className="bg-black py-28">
        <div className="mx-auto max-w-6xl px-6">
          <p className="type-label mb-5 text-[color:var(--brand-sky)]">{filmReel.eyebrow}</p>
          <h2 className="type-h2 mb-10 text-[var(--ink-frame-foreground)]">{filmReel.heading}</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {filmReel.images.slice(0, 12).map((src) => (
              <Link key={src} href={filmReel.href} className="block overflow-hidden rounded-md">
                <Image
                  src={src}
                  alt="Selected frame"
                  width={CARD_W * 2}
                  height={CARD_H * 2}
                  className="h-auto w-full object-cover"
                />
              </Link>
            ))}
          </div>
          <div className="mt-10">
            <LinkButton href={filmReel.cta.href} variant="primary" size="lg">
              {filmReel.cta.label}
            </LinkButton>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section aria-label={filmReel.heading}>
      <div ref={rootRef} className="relative bg-black" style={{ height: "260vh" }}>
        <div
          ref={stageRef}
          className="relative flex h-dvh w-full flex-col items-center justify-center overflow-hidden bg-black"
        >
          {/* the light the drum turns in */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(60% 55% at 50% 50%, rgba(25,81,168,0.28), transparent 70%)",
            }}
            aria-hidden="true"
          />

          <div className="pointer-events-none absolute left-6 top-10 z-30 sm:left-10 lg:left-16">
            <p className="type-label text-[color:var(--brand-sky)]">{filmReel.eyebrow}</p>
            <h2 className="type-h3 mt-2 max-w-md text-[var(--ink-frame-foreground)]">
              {filmReel.heading}
            </h2>
            <p className="type-body mt-3 max-w-sm text-[color:var(--brand-ice)]/55">
              {filmReel.intro}
            </p>
          </div>

          {/* the drum */}
          <div
            className="relative z-10 flex h-full w-full items-center justify-center"
            style={{ perspective: "1500px" }}
          >
            <div
              ref={drumRef}
              className="relative"
              style={{ transformStyle: "preserve-3d", willChange: "transform" }}
            >
              {CELLS.map((cell, i) => {
                const theta = (cell.slot * 360) / PER_RING + cell.ring * TWIST;
                const y = (cell.ring - (RINGS - 1) / 2) * RING_GAP;
                return (
                  <Link
                    key={i}
                    href={filmReel.href}
                    ref={(el) => {
                      cardRefs.current[i] = el;
                    }}
                    aria-label="Open our verticals"
                    className="group absolute left-0 top-0 block overflow-hidden rounded-[6px] border border-white/15 bg-black shadow-[0_20px_50px_-20px_rgba(0,0,0,0.9)] transition-[border-color] duration-300 hover:border-[color:var(--brand-sky)]"
                    style={{
                      width: CARD_W,
                      height: CARD_H,
                      marginLeft: -CARD_W / 2,
                      marginTop: -CARD_H / 2,
                      transform: `rotateY(${theta}deg) translateZ(${RADIUS}px) translateY(${y}px)`,
                      backfaceVisibility: "hidden",
                    }}
                  >
                    <Image
                      src={cell.src}
                      alt=""
                      fill
                      sizes="240px"
                      className="object-cover opacity-90 transition-opacity duration-300 group-hover:opacity-100"
                    />
                    <Sprockets className="top-[3px]" />
                    <Sprockets className="bottom-[3px]" />
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="absolute bottom-12 z-30">
            <LinkButton href={filmReel.cta.href} variant="primary" size="lg">
              {filmReel.cta.label}
            </LinkButton>
          </div>
        </div>
      </div>
    </section>
  );
}
