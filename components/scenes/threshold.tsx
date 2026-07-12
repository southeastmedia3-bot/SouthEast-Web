"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const SESSION_KEY = "sem-threshold-seen";

const panels = [
  { color: "var(--brand-violet)", width: "4.2rem", from: -48 },
  { color: "var(--brand-blue)", width: "3.4rem", from: 48 },
  { color: "var(--brand-sky)", width: "2.7rem", from: -34 },
  { color: "var(--brand-ice)", width: "2rem", from: 34 },
] as const;

/**
 * The Assembly — a ritual, not a loader. Panels converge from alternating
 * directions and hold before clearing to Arrival. Fixed duration, independent
 * of actual load time; skips instantly under reduced motion or on repeat visits.
 */
export function Threshold() {
  const reducedMotion = useReducedMotion();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || window.sessionStorage.getItem(SESSION_KEY)) {
      return;
    }
    // One-time read of a browser-only API (sessionStorage) unavailable during
    // SSR — an effect-gated initial set is correct here, not a subscription.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVisible(true);
  }, []);

  useEffect(() => {
    if (!visible) {
      return;
    }
    if (reducedMotion) {
      dismiss();
      return;
    }
    const timer = window.setTimeout(dismiss, 1250);
    return () => window.clearTimeout(timer);
  }, [visible, reducedMotion]);

  function dismiss() {
    setVisible(false);
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(SESSION_KEY, "1");
    }
  }

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-white"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          role="presentation"
          aria-hidden="true"
        >
          <div className="flex flex-col gap-[5px]">
            {panels.map((panel, index) => (
              <motion.span
                key={panel.color}
                className="h-[11px] rounded-l-full rounded-r-[3px]"
                style={{ background: panel.color, width: panel.width }}
                initial={{ scaleX: 0, x: panel.from }}
                animate={{ scaleX: 1, x: 0 }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: index * 0.09 }}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={dismiss}
            className="type-caption absolute bottom-8 right-8 rounded-full border border-border px-4 py-2 uppercase tracking-[0.1em] text-muted transition hover:text-foreground"
          >
            Skip intro
          </button>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
