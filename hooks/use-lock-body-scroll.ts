"use client";

import { useEffect } from "react";
import { getLenis } from "@/hooks/use-lenis";

/**
 * Hold the page still behind an overlay.
 *
 * `overflow: hidden` on its own is not a lock on this site. Lenis does
 * not scroll by letting the browser scroll — it listens for wheel and touch,
 * runs its own eased animation and *writes* the position with `scrollTo` on
 * every ticker frame. A programmatic scroll is unaffected by the overflow of
 * any element, so with the mobile menu open a trackpad flick still moved the
 * page behind it, and closing the menu dropped the visitor somewhere else in
 * the document.
 *
 * So both halves are needed and neither is redundant: `lenis.stop()` ends the
 * smooth-scroll loop (it keeps consuming wheel/touch events, so the gesture
 * does nothing at all rather than falling through), and `overflow: hidden` is
 * what still holds a visitor whose Lenis never started — anyone on reduced
 * motion, where no instance exists.
 *
 * The overflow goes on <html>, never <body>. A stopped Lenis already hides
 * <html>'s overflow (`.lenis-stopped` in globals.css), and once the root's
 * overflow is not `visible` the browser stops handing <body>'s up to the
 * viewport, so a hidden <body> becomes a scroll container of its own. Every
 * `position: sticky` stage then sticks to <body>, which never scrolls, instead
 * of the viewport: the homepage reel dropped back to its place in the document
 * behind the open menu, leaving a black band where the bottom of the film was.
 */
export function useLockBodyScroll(locked: boolean) {
  useEffect(() => {
    if (!locked) {
      return;
    }

    const lenis = getLenis();
    const root = document.documentElement;
    const originalOverflow = root.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - root.clientWidth;

    lenis?.stop();
    root.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      root.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
      // Only if it is still the live instance — a reduced-motion flip while the
      // overlay is open destroys it, and starting a destroyed Lenis would
      // re-arm a ticker that no longer has anything to drive.
      if (getLenis() === lenis) {
        lenis?.start();
      }
    };
  }, [locked]);
}
