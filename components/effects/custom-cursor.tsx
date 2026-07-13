"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

/** Fraction of the gap the halo closes per frame. It is *meant* to trail. */
const FOLLOW = 0.18;
/** How fast it swells/settles when it crosses something interactive. */
const SCALE_FOLLOW = 0.16;
const SCALE_IDLE = 1;
const SCALE_ACTIVE = 1.6;

/**
 * A brand halo that eases along behind the pointer and swells over anything
 * interactive.
 *
 * ## Why there is no longer a dot, and why the native cursor is visible
 *
 * This used to hide the OS cursor (`cursor: none`) and draw a dot in its place.
 * That is the one thing a custom cursor can do that is unfixable: the hardware
 * cursor is composited by the OS with zero latency, while anything we draw has to
 * go input -> JS -> style -> composite -> display. Even with the position written
 * straight from the event (measured: 0px of positional error, ever), the *painted*
 * dot is a frame or more behind the real pointer — tens of pixels on a fast flick.
 * No amount of tuning removes that; it is the floor for a DOM cursor, and it is
 * what read as lag.
 *
 * So the pointer is the real pointer again. The halo is unmistakably a decorative
 * follower rather than the thing you are aiming with, which is exactly why a trail
 * on it reads as intent rather than as lag.
 *
 * Everything here is `transform` and `opacity` only — no width/height/margin
 * animation (those are layout properties: animating them re-rasterises the layer
 * every frame and cancels out the `will-change` promotion). Portalled onto
 * `document.body` so no ancestor can wrap it in a transform and quietly break
 * `position: fixed`.
 *
 * Disabled on touch/coarse pointers and under reduced motion.
 */
export function CustomCursor() {
  const reducedMotion = useReducedMotion();
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

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let scale = SCALE_IDLE;
    let targetScale = SCALE_IDLE;
    let raf = 0;

    // Mirrored locally so we only touch the DOM on a real transition: a class
    // change on <html> restyles the whole document.
    let hidden = true;
    let active = false;

    const setHidden = (next: boolean) => {
      if (next === hidden) return;
      hidden = next;
      root.classList.toggle("cursor-hidden", next);
    };

    const onMove = (event: MouseEvent) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
      setHidden(false);
    };

    const onOver = (event: MouseEvent) => {
      const target = event.target as Element | null;
      const interactive = Boolean(
        target?.closest?.("a, button, input, textarea, select, label, [role='button']"),
      );
      if (interactive === active) return;
      active = interactive;
      targetScale = interactive ? SCALE_ACTIVE : SCALE_IDLE;
      root.classList.toggle("cursor-active", interactive);
    };

    const onLeave = () => setHidden(true);
    const onEnter = () => setHidden(false);

    const loop = () => {
      ringX += (mouseX - ringX) * FOLLOW;
      ringY += (mouseY - ringY) * FOLLOW;
      scale += (targetScale - scale) * SCALE_FOLLOW;

      if (ringRef.current) {
        ringRef.current.style.transform =
          `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%) scale(${scale.toFixed(3)})`;
      }
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      root.classList.remove("cursor-active", "cursor-hidden");
    };
  }, [reducedMotion]);

  if (!enabled) return null;

  return createPortal(
    <div ref={ringRef} className="cursor-ring" aria-hidden="true">
      {/* The hover fill cross-fades on its own node, so the ring's own background
          never changes and its layer never needs repainting. */}
      <span className="cursor-ring-fill" />
    </div>,
    document.body,
  );
}
