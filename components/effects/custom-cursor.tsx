"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

/** Fraction of the gap to the pointer the ring closes each 1/60s. */
const FOLLOW = 0.34;

/**
 * A site-wide custom cursor: a small brand dot that tracks the pointer exactly,
 * and a ring that eases in behind it and swells over interactive elements. The
 * native cursor is hidden while active. Disabled on touch/coarse pointers and
 * under reduced motion, so it never traps those users.
 */
export function CustomCursor() {
  const reducedMotion = useReducedMotion();
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (reducedMotion) return;
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    // Gated on a browser-only capability check (matchMedia) that cannot run
    // during SSR — an effect-gated initial set is correct here, not a
    // subscription. Same pattern as Threshold's sessionStorage gate.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEnabled(true);
    const root = document.documentElement;
    root.classList.add("has-custom-cursor");

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let raf = 0;
    let last = performance.now();

    const onMove = (event: PointerEvent) => {
      // The browser can tell us where the pointer is *heading*. Using the last
      // predicted sample instead of the last delivered one buys back most of the
      // frame of latency a JS-drawn cursor otherwise carries, which is what makes
      // a custom cursor feel like it's dragging behind the real one on a fast
      // flick. Falls back to the event itself where prediction isn't supported.
      const predicted = event.getPredictedEvents?.() ?? [];
      const point = predicted.length > 0 ? predicted[predicted.length - 1]! : event;
      mouseX = point.clientX;
      mouseY = point.clientY;
      root.classList.remove("cursor-hidden");
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }
    };

    const onOver = (event: MouseEvent) => {
      const target = event.target as Element | null;
      const interactive = Boolean(
        target?.closest?.("a, button, input, textarea, select, label, [role='button']"),
      );
      root.classList.toggle("cursor-active", interactive);
    };

    const onLeave = () => root.classList.add("cursor-hidden");
    const onEnter = () => root.classList.remove("cursor-hidden");

    const loop = (now: number) => {
      // Frame-rate independent easing. The old fixed 0.18-per-frame lerp settled
      // roughly 70px behind the pointer on a fast sweep — that trail is what read
      // as lag. FOLLOW is the fraction closed per 1/60s; normalising by dt also
      // stops the ring behaving differently on 60Hz and 144Hz displays.
      const dt = Math.min(64, now - last);
      last = now;
      const t = 1 - Math.pow(1 - FOLLOW, dt / (1000 / 60));

      ringX += (mouseX - ringX) * t;
      ringY += (mouseY - ringY) * t;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      }
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      root.classList.remove("has-custom-cursor", "cursor-active", "cursor-hidden");
    };
  }, [reducedMotion]);

  if (!enabled) return null;

  return (
    <>
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
    </>
  );
}
