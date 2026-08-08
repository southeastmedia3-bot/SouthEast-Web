"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const QUERY = "(prefers-reduced-motion: reduce)";

/**
 * Set up a scene that may only exist while the visitor allows motion — a GSAP
 * timeline, a scrubbed ScrollTrigger, a pinned stage. Return a cleanup from the
 * callback exactly as you would from `useEffect`.
 *
 * Two things this does that `useEffect(() => { if (reducedMotion) return; … })`
 * cannot, both of which matter the moment a scene *pins*:
 *
 * 1. **It reads the preference live, at effect time, not at render time.**
 *    `useReducedMotion` starts at `false` and only reaches its real value from
 *    an effect of its own — and that effect belongs to the same commit as this
 *    one, so a scene gated on the rendered value builds itself once even for a
 *    visitor who asked for no motion: the `false` it closed over is a render
 *    behind. For a pinned ScrollTrigger that is not a wasted frame, it is a
 *    crash. Pinning wraps the stage in a `.pin-spacer`, so the stage's real
 *    parent stops being the one React recorded; the re-render that swaps in the
 *    static branch a tick later asks React to remove the stage from that
 *    recorded parent, the browser refuses — "The node to be removed is not a
 *    child of this node" — and the page goes to the error boundary.
 *
 * 2. **It tears the scene down synchronously when the preference flips on**,
 *    ahead of the re-render that swaps in the static branch. React batches the
 *    state update behind the media-query event, so every listener for that
 *    change runs before React re-renders — whereas a cleanup handed to React
 *    runs in the passive flush, which is *after* the mutation phase that
 *    removes the nodes. Disposing from the listener is what puts GSAP's DOM
 *    back before React goes looking for it.
 *
 * Turning the preference back off re-arms the scene: the rendered value is the
 * effect's dependency, so the setup re-runs on the commit that brings the
 * animated branch — and its refs — back.
 */
export function useMotionEffect(setup: () => (() => void) | void) {
  // Held in a ref so a re-render with a new closure never rebuilds the scene;
  // written from an effect rather than the render body, which is not safe to
  // mutate under concurrent rendering. Declared first, so it is current by the
  // time the effect below runs in the same commit.
  const setupRef = useRef(setup);
  useEffect(() => {
    setupRef.current = setup;
  });

  const allowed = !useReducedMotion();

  useEffect(() => {
    const query = window.matchMedia(QUERY);
    // The live read, not `allowed` — see (1). On the first commit `allowed` is
    // still the `true` every visitor renders with.
    if (query.matches) return;

    const cleanup = setupRef.current();

    let disposed = false;
    const dispose = () => {
      if (disposed) return;
      disposed = true;
      cleanup?.();
    };

    const onChange = () => {
      if (query.matches) dispose();
    };

    query.addEventListener("change", onChange);

    return () => {
      query.removeEventListener("change", onChange);
      dispose();
    };
  }, [allowed]);
}
