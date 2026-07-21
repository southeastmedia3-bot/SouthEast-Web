"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { setupGsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

type DriftRowProps = {
  children: ReactNode;
  /** Seconds for one full pass of the run. Higher = slower. */
  duration?: number;
  direction?: "left" | "right";
  /** Fade the run out at both edges rather than cutting it at the viewport. */
  mask?: boolean;
  className?: string;
  trackClassName?: string;
};

/**
 * A slow, continuous horizontal drift — the Dolly primitive, unbound from scroll.
 *
 * The run is rendered twice inside one track and the track is translated exactly
 * one copy's width, so the seam never arrives: what leaves the left edge is
 * already entering from the right. GSAP owns it because this is camera movement,
 * not interaction — a CSS keyframe would do the same thing but would sit outside
 * the motion system, and the timeline is what lets it be paused on hover.
 *
 * Under `prefers-reduced-motion` there is no drift at all: the run collapses to a
 * single static wrapped row, which is a legitimate reading of the same content
 * rather than a frozen animation.
 */
export function DriftRow({
  children,
  duration = 64,
  direction = "left",
  mask = true,
  className,
  trackClassName,
}: DriftRowProps) {
  const reducedMotion = useReducedMotion();
  const trackRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || reducedMotion) return;

    const { gsap } = setupGsap();
    // The track holds two identical copies; -50% is precisely one copy across.
    const from = direction === "left" ? 0 : -50;
    const to = direction === "left" ? -50 : 0;

    const tween = gsap.fromTo(
      track,
      { xPercent: from },
      { xPercent: to, duration, ease: "none", repeat: -1 },
    );

    const pause = () => tween.pause();
    const play = () => tween.play();
    track.addEventListener("pointerenter", pause);
    track.addEventListener("pointerleave", play);

    return () => {
      track.removeEventListener("pointerenter", pause);
      track.removeEventListener("pointerleave", play);
      tween.kill();
    };
  }, [direction, duration, reducedMotion]);

  if (reducedMotion) {
    return (
      <div className={className}>
        <div className={cn("flex flex-wrap", trackClassName)}>{children}</div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden",
        mask && "[mask-image:linear-gradient(90deg,transparent,black_6%,black_94%,transparent)]",
        className,
      )}
    >
      <div ref={trackRef} className="flex w-max will-change-transform">
        {/* Two copies. The second is decorative — a screen reader that walks the
            run should hear each item once. */}
        <div className={cn("flex shrink-0", trackClassName)}>{children}</div>
        <div className={cn("flex shrink-0", trackClassName)} aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
