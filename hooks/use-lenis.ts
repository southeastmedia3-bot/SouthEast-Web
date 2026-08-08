"use client";

import Lenis from "lenis";
import { useEffect } from "react";
import { setupGsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

/**
 * The one live Lenis instance, or null.
 *
 * A module-level handle rather than a context because the things that need to
 * suspend smooth scrolling — the mobile navigation's body-scroll lock, for one
 * — are not reliably descendants of <LenisProvider>, and a hook that throws
 * outside a provider would be a worse failure than a null.
 *
 * There is exactly one instance by construction: <LenisProvider> is mounted
 * once in the root layout. Under reduced motion none is created at all, and
 * `getLenis()` correctly returns null — native scrolling is all there is, so
 * `overflow: hidden` alone already locks it.
 */
let activeLenis: Lenis | null = null;

export function getLenis(): Lenis | null {
  return activeLenis;
}

export function useLenis() {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      return;
    }

    const { gsap, ScrollTrigger } = setupGsap();

    const lenis = new Lenis({
      duration: 1.15,
      easing: (time) => Math.min(1, 1.001 - Math.pow(2, -10 * time)),
      smoothWheel: true,
      wheelMultiplier: 0.85,
    });

    activeLenis = lenis;
    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      if (activeLenis === lenis) {
        activeLenis = null;
      }
      gsap.ticker.remove(tick);
      lenis.destroy();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [reducedMotion]);
}
