"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * The house reveal: a short rise out of nothing as the element enters view.
 *
 * Deliberately modest. Every reference studio we looked at earns its "premium"
 * from restraint and from *content* arriving cleanly, not from choreography —
 * SciePro in particular is almost still. One motion, once, and never again
 * (`once: true`), so scrolling back up does not re-trigger a light show.
 *
 * `x` lets an element enter from the side (positive = from the right); `scale`
 * lets media settle in from a hair oversize. Both default to off, so every
 * existing caller keeps the plain rise. `body` is `overflow-x: clip`, so a
 * horizontal enter never spills a scrollbar.
 */
export function Reveal({
  children,
  delay = 0,
  y = 20,
  x = 0,
  scale,
  amount = 0.25,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  x?: number;
  scale?: number;
  amount?: number;
  className?: string;
}) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) return <div className={className}>{children}</div>;

  const hasScale = scale !== undefined;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, x, ...(hasScale ? { scale } : {}) }}
      whileInView={{ opacity: 1, y: 0, x: 0, ...(hasScale ? { scale: 1 } : {}) }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.7, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}
