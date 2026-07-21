"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

/**
 * Play a looping video only while it is on screen.
 *
 * Pair it with `preload="none"` and *no* `autoPlay` attribute. That combination
 * is the whole point: `autoPlay` makes a browser fetch the file the moment the
 * element exists, so a page with a dozen loops downloads a dozen films before a
 * visitor has scrolled to any of them. Calling `play()` on intersection is what
 * turns that into a download per film actually seen.
 *
 * Under reduced motion nothing is observed and nothing plays — the poster is the
 * whole experience, which is the correct outcome rather than a degraded one.
 *
 * `rootMargin` widens the trigger for the one film on a page that must already
 * be running when it arrives — a signature hero, which a visitor reaches within
 * a screen of landing and judges the studio on. Everything else keeps the narrow
 * default, because the margin is exactly what decides how early a file downloads.
 *
 * Returns a ref to attach to the `<video>`.
 */
export function useInViewPlay(enabled = true, rootMargin = "100px") {
  const ref = useRef<HTMLVideoElement | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!enabled || reducedMotion) return;
    const video = ref.current;
    if (!video) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      // A little margin so a loop is already running by the time it is properly
      // in view, without reaching so far that offscreen films start downloading.
      { threshold: 0.1, rootMargin },
    );

    io.observe(video);
    return () => io.disconnect();
  }, [enabled, reducedMotion, rootMargin]);

  return ref;
}
