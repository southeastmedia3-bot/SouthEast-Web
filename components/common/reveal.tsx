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
 * A few optional flavours let each section reveal its media differently:
 *   `x`     — enter from the side (positive = from the right)
 *   `scale` — settle in from a hair over/under size (bloom from <1, settle from >1)
 *   `blur`  — a focus-pull (starts blurred by N px, resolves sharp)
 *   `clip`  — a curtain wipe from one edge (up/down/left/right)
 *   `rotateY` — a 3D swing-in from N degrees (shadow-safe, unlike `clip`)
 * All default to off, so every existing caller keeps the plain rise. `body` is
 * `overflow-x: clip`, so a horizontal enter never spills a scrollbar.
 */
const CLIP: Record<"up" | "down" | "left" | "right", [string, string]> = {
  up: ["inset(100% 0 0 0)", "inset(0 0 0 0)"],
  down: ["inset(0 0 100% 0)", "inset(0 0 0 0)"],
  left: ["inset(0 0 0 100%)", "inset(0 0 0 0)"],
  right: ["inset(0 100% 0 0)", "inset(0 0 0 0)"],
};

export function Reveal({
  children,
  delay = 0,
  y = 20,
  x = 0,
  scale,
  blur,
  clip,
  rotateY,
  amount = 0.25,
  duration = 0.7,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  x?: number;
  scale?: number;
  blur?: number;
  clip?: "up" | "down" | "left" | "right";
  rotateY?: number;
  amount?: number;
  duration?: number;
  className?: string;
}) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      style={rotateY !== undefined ? { transformPerspective: 1200 } : undefined}
      initial={{
        opacity: 0,
        y,
        x,
        ...(scale !== undefined ? { scale } : {}),
        ...(rotateY !== undefined ? { rotateY } : {}),
        ...(blur !== undefined ? { filter: `blur(${blur}px)` } : {}),
        ...(clip ? { clipPath: CLIP[clip][0] } : {}),
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        x: 0,
        ...(scale !== undefined ? { scale: 1 } : {}),
        ...(rotateY !== undefined ? { rotateY: 0 } : {}),
        ...(blur !== undefined ? { filter: "blur(0px)" } : {}),
        ...(clip ? { clipPath: CLIP[clip][1] } : {}),
      }}
      viewport={{ once: true, amount }}
      transition={{ duration, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}
