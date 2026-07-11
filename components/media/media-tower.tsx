"use client";

import { useEffect, useRef } from "react";
import { MediaFrame } from "@/components/common/media-frame";
import type { MediaAsset } from "@/data/media";
import { setupGsap } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

type MediaTowerProps = {
  items: MediaAsset[];
  eyebrow?: string;
  heading?: string;
  intro?: string;
};

const SPACING = 460; // z-distance between stacked frames (px)
const RISE = 66; // how much each deeper frame lifts (px)

/**
 * The image-library "tower". A pinned 3D stage the viewer scrolls *through*:
 * frames float up from depth, pass the camera, and release — a receding column
 * of work, inspired by aadhyaanimatics. Transforms are computed per frame from
 * a single scroll progress value, so it stays smooth under Lenis + GSAP.
 * Reduced motion collapses it to a clean static gallery.
 */
export function MediaTower({ items, eyebrow, heading, intro }: MediaTowerProps) {
  const reducedMotion = useReducedMotion();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const captionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (reducedMotion || !rootRef.current || !stageRef.current) {
      return;
    }

    const { ScrollTrigger } = setupGsap();
    const count = items.length;

    function render(progress: number) {
      const camera = progress * (count + 0.6);
      let nearestIndex = 0;
      let nearestDist = Infinity;

      cardRefs.current.forEach((card, i) => {
        if (!card) return;
        const distance = i - camera + 0.5; // frames ahead of camera are positive
        const z = -distance * SPACING;
        const y = -distance * RISE;

        // Fade in from depth, fade out once it passes the camera.
        let opacity = 1;
        if (distance > 4) opacity = Math.max(0, 1 - (distance - 4) / 1.6);
        if (distance < 0) opacity = Math.max(0, 1 + distance / 0.6);

        card.style.transform = `translate(-50%, -50%) translate3d(0, ${y}px, ${z}px) rotateX(5deg)`;
        card.style.opacity = String(opacity);
        card.style.zIndex = String(1000 - Math.round(Math.abs(distance) * 10));

        const absDist = Math.abs(distance - 0.4);
        if (absDist < nearestDist) {
          nearestDist = absDist;
          nearestIndex = i;
        }
      });

      const active = items[nearestIndex];
      if (captionRef.current && active) {
        const kicker = captionRef.current.querySelector<HTMLElement>("[data-kicker]");
        const label = captionRef.current.querySelector<HTMLElement>("[data-label]");
        const index = captionRef.current.querySelector<HTMLElement>("[data-index]");
        if (kicker) kicker.textContent = active.kicker ?? "";
        if (label) label.textContent = active.label ?? "";
        if (index)
          index.textContent = `${String(nearestIndex + 1).padStart(2, "0")} / ${String(count).padStart(2, "0")}`;
      }
    }

    render(0);

    const trigger = ScrollTrigger.create({
      trigger: rootRef.current,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      pin: stageRef.current,
      onUpdate: (self) => render(self.progress),
    });

    return () => trigger.kill();
  }, [items, reducedMotion]);

  // Static gallery fallback.
  if (reducedMotion) {
    return (
      <section aria-label={heading ?? "Selected work"} className="px-6 py-28 sm:px-10 lg:px-16">
        {(eyebrow || heading || intro) && (
          <div className="mx-auto mb-14 max-w-3xl text-center">
            {eyebrow ? <p className="type-label mb-5 text-accent">{eyebrow}</p> : null}
            {heading ? <h2 className="type-h2 text-balance text-foreground">{heading}</h2> : null}
            {intro ? <p className="type-body-lg mt-5 text-muted">{intro}</p> : null}
          </div>
        )}
        <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2">
          {items.map((item, i) => (
            <figure key={i}>
              <MediaFrame tone={item.tone} ratio={item.ratio ?? "wide"} src={item.src} alt={item.alt} />
              <figcaption className="mt-3">
                <span className="type-caption uppercase tracking-[0.1em] text-muted">{item.kicker}</span>
                <p className="type-h4 text-foreground">{item.label}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section aria-label={heading ?? "Selected work"}>
      <div
        ref={rootRef}
        className="relative bg-[#05070d]"
        style={{ height: `${(items.length + 2) * 60}vh` }}
      >
        <div
          ref={stageRef}
          className="tower-stage relative flex h-dvh w-full items-center justify-center overflow-hidden bg-[#05070d]"
        >
          {/* ambient light so the dark stage never reads as an empty void */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(120% 80% at 50% 30%, rgba(25,81,168,0.22), transparent 60%)",
            }}
            aria-hidden="true"
          />

          {(eyebrow || heading) && (
            <div className="absolute left-6 top-8 z-[1200] max-w-xs sm:left-10 lg:left-16">
              {eyebrow ? (
                <p className="type-label text-[color:var(--brand-ice)]/60">{eyebrow}</p>
              ) : null}
              {heading ? (
                <p className="type-h4 mt-2 text-[var(--ink-frame-foreground)]">{heading}</p>
              ) : null}
            </div>
          )}

          {items.map((item, i) => (
            <div
              key={i}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              className="tower-card absolute left-1/2 top-1/2 w-[min(78vw,640px)]"
              style={{ opacity: 0 }}
            >
              <MediaFrame
                tone={item.tone}
                ratio={item.ratio ?? "wide"}
                src={item.src}
                alt={item.alt}
                className="shadow-[0_40px_120px_rgba(0,0,0,0.55)] ring-1 ring-white/10"
              />
            </div>
          ))}

          <div
            ref={captionRef}
            className="absolute bottom-8 left-1/2 z-[1200] flex -translate-x-1/2 flex-col items-center gap-1 text-center"
          >
            <span data-index className="type-index text-[color:var(--brand-ice)]/55" />
            <span
              data-kicker
              className="type-caption uppercase tracking-[0.12em] text-[color:var(--brand-ice)]/70"
            />
            <span data-label className={cn("type-h4 text-[var(--ink-frame-foreground)]")} />
          </div>
        </div>
      </div>
    </section>
  );
}
