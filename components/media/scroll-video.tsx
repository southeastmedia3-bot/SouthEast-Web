"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { CinematicBackdrop } from "@/components/media/cinematic-backdrop";
import { setupGsap } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

type Cta = { label: string; href: string };

type ScrollVideoProps = {
  eyebrow?: string;
  headline: string;
  sublines?: string[];
  body?: string;
  primaryCta?: Cta;
  secondaryCta?: Cta;
  /** Compressed, scrub-ready mp4 under /public. When absent, the cinematic
   *  backdrop + title sequence stand in — no visual gap. */
  video?: string;
  poster?: string;
  tone?: "blue" | "sky" | "violet" | "mixed";
  /** Total scroll distance the pinned stage occupies, in viewport heights. */
  scrollLength?: number;
};

/**
 * The "scroll film". A pinned cinematic stage whose progress is tied to scroll:
 * when a `video` is supplied its frames scrub with the scroll gesture (the
 * aadhyaanimatics effect); otherwise a drifting brand-light field carries a
 * title card that assembles, holds, and releases across the pin. Mirrors the
 * pinned-scrub pattern already proven in `the-reel.tsx`. Fully static and
 * unpinned under reduced motion.
 */
export function ScrollVideo({
  eyebrow,
  headline,
  sublines = [],
  body,
  primaryCta,
  secondaryCta,
  video,
  poster,
  tone = "blue",
  scrollLength = 2.4,
}: ScrollVideoProps) {
  const reducedMotion = useReducedMotion();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const mediaRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const hintRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (reducedMotion || !rootRef.current || !stageRef.current) {
      return;
    }

    const { gsap, ScrollTrigger } = setupGsap();
    const videoEl = videoRef.current;
    let duration = 0;
    let frameQueued = false;

    const onMeta = () => {
      duration = videoEl?.duration ?? 0;
    };
    if (videoEl) {
      videoEl.addEventListener("loadedmetadata", onMeta);
      if (videoEl.readyState >= 1) onMeta();
    }

    const trigger = ScrollTrigger.create({
      trigger: rootRef.current,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      pin: stageRef.current,
      onUpdate: (self) => {
        const p = self.progress;

        // Frame-scrub the video (throttled to one seek per animation frame).
        if (videoEl && duration && !frameQueued) {
          frameQueued = true;
          requestAnimationFrame(() => {
            if (videoEl.readyState >= 2) {
              videoEl.currentTime = Math.min(duration - 0.05, p * duration);
            }
            frameQueued = false;
          });
        }

        // Slow push-in on the stage.
        if (mediaRef.current) {
          gsap.set(mediaRef.current, { scale: 1 + p * 0.14, force3D: true });
        }

        // Title card: assemble (0–0.32), hold (0.32–0.68), release (0.68–1).
        if (overlayRef.current) {
          let opacity = 1;
          let y = 0;
          let blur = 0;
          if (p < 0.32) {
            const t = p / 0.32;
            opacity = t;
            y = (1 - t) * 40;
            blur = (1 - t) * 12;
          } else if (p > 0.68) {
            const t = (p - 0.68) / 0.32;
            opacity = 1 - t;
            y = -t * 40;
            blur = t * 10;
          }
          overlayRef.current.style.opacity = String(opacity);
          overlayRef.current.style.transform = `translateY(${y}px)`;
          overlayRef.current.style.filter = `blur(${blur}px)`;
        }

        if (hintRef.current) {
          hintRef.current.style.opacity = String(Math.max(0, 1 - p * 6));
        }
      },
    });

    return () => {
      videoEl?.removeEventListener("loadedmetadata", onMeta);
      trigger.kill();
    };
  }, [reducedMotion]);

  const overlay = (
    <div className="relative z-20 mx-auto flex max-w-4xl flex-col items-center px-6 text-center">
      {eyebrow ? (
        <p className="type-label mb-6 text-[color:var(--brand-ice)]/80">{eyebrow}</p>
      ) : null}
      <h2 className="type-display text-balance text-[var(--ink-frame-foreground)]">{headline}</h2>
      {sublines.length ? (
        <p className="voice-quiet mt-5 text-[1.5rem] leading-tight text-[color:var(--brand-ice)]/85 sm:text-[2rem]">
          {sublines.join(" ")}
        </p>
      ) : null}
      {body ? (
        <p className="type-body-lg mt-7 max-w-2xl text-[color:var(--brand-ice)]/70">{body}</p>
      ) : null}
      {primaryCta || secondaryCta ? (
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          {primaryCta ? (
            <Link href={primaryCta.href} className={cn(buttonVariants({ variant: "primary", size: "lg" }))}>
              {primaryCta.label}
            </Link>
          ) : null}
          {secondaryCta ? (
            <Link
              href={secondaryCta.href}
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "border-white/25 text-[var(--ink-frame-foreground)] hover:border-white/60 hover:text-[var(--ink-frame-foreground)]",
              )}
            >
              {secondaryCta.label}
            </Link>
          ) : null}
        </div>
      ) : null}
    </div>
  );

  // Static, unpinned fallback.
  if (reducedMotion) {
    return (
      <section
        aria-label={headline}
        className="relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-[#05070d] py-32"
      >
        <CinematicBackdrop tone={tone} scan />
        {overlay}
      </section>
    );
  }

  return (
    <section aria-label={headline}>
      <div
        ref={rootRef}
        className="relative bg-[#05070d]"
        style={{ height: `${scrollLength * 100}vh` }}
      >
        <div
          ref={stageRef}
          className="relative flex h-dvh w-full items-center justify-center overflow-hidden bg-[#05070d]"
        >
          <div ref={mediaRef} className="absolute inset-0 will-change-transform">
            {video ? (
              <>
                <video
                  ref={videoRef}
                  className="absolute inset-0 h-full w-full object-cover"
                  muted
                  playsInline
                  preload="auto"
                  poster={poster}
                >
                  <source src={video} type="video/mp4" />
                </video>
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(5,7,13,0.5) 0%, rgba(5,7,13,0.15) 40%, rgba(5,7,13,0.72) 100%)",
                  }}
                />
              </>
            ) : (
              <CinematicBackdrop tone={tone} scan className="-z-0" />
            )}
          </div>

          <div ref={overlayRef} className="relative z-20 w-full will-change-transform">
            {overlay}
          </div>

          <div
            ref={hintRef}
            className="absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2"
          >
            <span className="type-caption uppercase tracking-[0.14em] text-[color:var(--brand-ice)]/60">
              Scroll
            </span>
            <span className="relative h-9 w-px overflow-hidden bg-white/20" aria-hidden="true">
              <span className="absolute inset-x-0 top-0 h-1/2 w-full animate-[sm-scan_2.2s_ease-in-out_infinite] bg-[color:var(--brand-ice)]/70" />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
