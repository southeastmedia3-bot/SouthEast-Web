"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * A filmic hand-off between two differently-grounded sections.
 *
 * Instead of a hard rule where a light section meets a dark one, the seam bleeds
 * the outgoing ground into the incoming one over a short band, and a hairline
 * draws itself across the centre as the seam enters view — the page changes key
 * on purpose rather than cutting. Purely decorative (`aria-hidden`,
 * `pointer-events-none`), so it never intercepts a scroll or a tap.
 *
 * `from`/`to` are any CSS colour (hex or `var(--…)`) — pass the exact grounds of
 * the sections above and below so the gradient meets each seamlessly. `accent`
 * tints the hairline and its bloom to the incoming section's tone.
 */
export function SectionSeam({
  from,
  to,
  accent = "rgba(130,185,255,0.55)",
  height = "clamp(56px, 8vh, 108px)",
}: {
  from: string;
  to: string;
  accent?: string;
  height?: string;
}) {
  const reducedMotion = useReducedMotion();

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none relative w-full overflow-hidden"
      style={{ height, background: `linear-gradient(to bottom, ${from}, ${to})` }}
    >
      {/* Soft bloom pooled on the seam line. */}
      <div
        className="absolute inset-x-0 top-1/2 h-24 -translate-y-1/2"
        style={{
          background: `radial-gradient(60% 100% at 50% 50%, ${accent}, transparent 70%)`,
          opacity: 0.35,
        }}
      />
      {/* The hairline, drawn from the centre out. */}
      <motion.span
        className="absolute left-1/2 top-1/2 h-px w-[min(64%,42rem)] -translate-x-1/2 -translate-y-1/2 origin-center will-change-transform"
        style={{ background: `linear-gradient(to right, transparent, ${accent}, transparent)` }}
        initial={reducedMotion ? undefined : { scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true, amount: 0.7 }}
        transition={{ duration: 1.1, ease: EASE }}
      />
    </div>
  );
}
