"use client";

import { useEffect, useRef } from "react";

/**
 * Run a per-frame loop only while an element is actually on screen.
 *
 * Several scenes drive themselves from a `requestAnimationFrame` loop rather
 * than from scroll — the film drum's idle rotation, the metric blocks' physics
 * readout, the preview frame that trails the cursor. Written the obvious way,
 * each of those starts on mount and never stops, so a visitor sitting on the
 * hero is paying for the drum shading thirty-six DOM nodes and the blocks
 * writing six every frame, for scenes several screens below them. Four such
 * loops share one 16ms budget with the hero's own video decode and the pinned
 * scrub, and the frame stops fitting — which is what reads as the page being
 * laggy from the very first gesture.
 *
 * This gates the loop on two things: an IntersectionObserver on the scene, and
 * the document being visible at all (a backgrounded tab should not be running
 * animation). The callback receives the frame timestamp.
 *
 * `rootMargin` starts the loop slightly before the scene arrives so it is never
 * caught mid-jump on entry.
 */
export function useVisibleRaf(
  targetRef: React.RefObject<HTMLElement | null>,
  callback: (time: number) => void,
  enabled = true,
  rootMargin = "200px",
) {
  // Held in a ref so a re-render with a new closure never restarts the observer.
  // Written in an effect rather than during render — a ref mutated in the render
  // body is not safe under concurrent rendering, and nothing reads this until a
  // frame has already been scheduled.
  const callbackRef = useRef(callback);
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const target = targetRef.current;
    if (!enabled || !target) return;

    let raf = 0;
    let onScreen = false;

    const running = () => onScreen && document.visibilityState === "visible";

    const frame = (time: number) => {
      callbackRef.current(time);
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (!raf && running()) raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen = Boolean(entry?.isIntersecting);
        if (onScreen) start();
        else stop();
      },
      { rootMargin },
    );
    io.observe(target);

    const onVisibility = () => (running() ? start() : stop());
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      stop();
    };
  }, [targetRef, enabled, rootMargin]);
}
