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
  /**
   * Total scroll distance the pinned stage occupies, in viewport heights.
   *
   * The stage itself is 100vh and pinned, so the pin holds for
   * `scrollLength - 1` screens: at 1.8 the section releases after 0.8 of a
   * screen of scrolling. It was 2.4 (1.4 screens pinned), which is a long time
   * to hold a visitor on one card and was the bulk of why the section felt like
   * it would not let go.
   */
  scrollLength?: number;
};

/**
 * The "scroll film". A pinned cinematic stage whose progress is tied to scroll:
 * when a `video` is supplied its frames scrub with the scroll gesture (the
 * aadhyaanimatics effect); otherwise a drifting brand-light field carries a
 * title card that assembles, holds, and releases across the pin. Mirrors the
 * pinned-scrub pattern used across the site. Fully static and
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
  scrollLength = 1.8,
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

    /** One frame of the scrub master (24fps). Below this there is nothing new
     *  to show, so a seek would be a decode the visitor cannot perceive. */
    const FRAME = 1 / 24;

    /**
     * The newest scroll position we owe the video, or -1 for "nothing pending".
     *
     * The seek is deliberately NOT issued from its own requestAnimationFrame.
     * `write` already runs inside one, so the old nested rAF meant every frame
     * was painted one frame after the scroll that asked for it — a fixed,
     * permanent lag behind the gesture. Worse, the `seekQueued` flag it guarded
     * discarded any scroll that arrived while it was pending, so a fast flick
     * threw away everything between its first and last position.
     *
     * Recording only the latest target and applying it as soon as the decoder is
     * free gives both properties we want: never more than one seek in flight,
     * and the position we converge on is always the newest one.
     */
    let pendingSeek = -1;

    const applySeek = () => {
      if (!videoEl || pendingSeek < 0 || duration === 0) return;
      // Not decodable yet, or still retiring the previous seek. `seeked` and
      // `loadeddata` both call back in here, so nothing is lost by returning.
      if (videoEl.readyState < 2 || videoEl.seeking) return;

      const target = pendingSeek;
      pendingSeek = -1;
      if (Math.abs(target - videoEl.currentTime) < FRAME) return;
      videoEl.currentTime = target;
    };

    const onMeta = () => {
      duration = videoEl?.duration ?? 0;
    };

    if (videoEl) {
      videoEl.addEventListener("loadedmetadata", onMeta);
      videoEl.addEventListener("loadeddata", applySeek);
      videoEl.addEventListener("seeked", applySeek);
      if (videoEl.readyState >= 1) onMeta();
    }

    /*
     * Everything below is written from one rAF rather than from the scroll
     * callback itself. ScrollTrigger's `onUpdate` can fire more than once per
     * frame — Lenis drives it off its own ticker as well as native scroll — and
     * every one of those was previously seeking the video, setting a transform
     * and writing a `filter` on the title card. Coalescing to a single write per
     * frame is most of the difference on this section.
     */
    let progress = 0;
    let writeQueued = false;

    // gsap's setters cache the target's style object; over a pinned scrub that
    // is meaningfully cheaper than going through `gsap.set` each time.
    const setMediaScale = mediaRef.current
      ? gsap.quickSetter(mediaRef.current, "scale")
      : undefined;

    /* The title card's blur, quantized to whole pixels and dropped entirely
       below 1px. A blur filter re-rasterizes the whole card — the headline, the
       sublines, the body and both buttons — and it was being handed a new
       fractional radius on every scroll event, so the browser could never reuse
       a rasterization. Whole-pixel steps mean it re-blurs about a dozen times
       across the section instead of hundreds, and the `none` below 1px is what
       lets the held middle of the card be a plain composited layer. */
    let lastBlur = -1;

    const write = () => {
      writeQueued = false;
      const p = progress;

      if (videoEl && duration) {
        pendingSeek = Math.min(duration - 0.05, Math.max(0, p * duration));
        applySeek();
      }

      // Slow push-in on the stage.
      setMediaScale?.(1 + p * 0.14);

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
        overlayRef.current.style.opacity = opacity.toFixed(3);
        overlayRef.current.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`;

        const blurStep = Math.round(blur);
        if (blurStep !== lastBlur) {
          lastBlur = blurStep;
          overlayRef.current.style.filter = blurStep < 1 ? "none" : `blur(${blurStep}px)`;
        }
      }

      if (hintRef.current) {
        hintRef.current.style.opacity = Math.max(0, 1 - p * 6).toFixed(3);
      }
    };

    const trigger = ScrollTrigger.create({
      trigger: rootRef.current,
      start: "top top",
      end: "bottom bottom",
      /*
       * `true`, not a number. A numeric scrub adds GSAP's own catch-up tween,
       * and Lenis is already smoothing this page with `duration: 1.15` — the
       * two compose into a floaty double lag, which is the opposite of the fix.
       * Lenis owns the smoothing; ScrollTrigger tracks its output exactly.
       */
      scrub: true,
      // Measure the pin a frame early so the switch to `position: fixed` never
      // lands in the same frame as the gesture that caused it.
      anticipatePin: 1,
      pin: stageRef.current,
      onUpdate: (self) => {
        progress = self.progress;
        if (!writeQueued) {
          writeQueued = true;
          requestAnimationFrame(write);
        }
      },
    });

    return () => {
      videoEl?.removeEventListener("loadedmetadata", onMeta);
      videoEl?.removeEventListener("loadeddata", applySeek);
      videoEl?.removeEventListener("seeked", applySeek);
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
            <Link
              href={primaryCta.href}
              className={cn(buttonVariants({ variant: "primary", size: "lg" }))}
            >
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
