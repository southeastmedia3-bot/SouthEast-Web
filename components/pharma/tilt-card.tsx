"use client";

import { useRef, type ReactNode } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

/**
 * A card that answers the pointer.
 *
 * As the cursor crosses it the card tilts a few degrees toward the pointer and a
 * soft spotlight tracks underneath — enough to make a flat plate feel like a lit
 * object, never so much that it reads as a gimmick. Springs smooth every move and
 * the whole thing settles back to rest on leave. Under reduced motion it is an
 * ordinary div: no tilt, no glow.
 *
 * `className` styles the card face itself (rounding, border, background, shadow),
 * so the spotlight — pinned to the same box and clipped to its radius — sits over
 * the media but under anything you layer after it.
 */
export function TiltCard({
  children,
  className,
  max = 6,
  glow = "rgba(130,185,255,0.18)",
  lift = 6,
}: {
  children: ReactNode;
  className?: string;
  /** Peak tilt in degrees at the card's edge. */
  max?: number;
  /** Spotlight colour, or `false` to omit it. */
  glow?: string | false;
  /** How far the card rises on hover, in px. */
  lift?: number;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const gx = useMotionValue(50);
  const gy = useMotionValue(50);
  const glowOpacity = useMotionValue(0);

  const springCfg = { stiffness: 150, damping: 18, mass: 0.3 };
  const sRotateX = useSpring(rotateX, springCfg);
  const sRotateY = useSpring(rotateY, springCfg);
  const sGlow = useSpring(glowOpacity, { stiffness: 120, damping: 20 });

  const spotlight = useMotionTemplate`radial-gradient(60% 60% at ${gx}% ${gy}%, ${glow || "transparent"} 0%, transparent 70%)`;

  if (reduced) return <div className={className}>{children}</div>;

  function onMove(e: React.PointerEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    rotateY.set((x - 0.5) * 2 * max);
    rotateX.set(-(y - 0.5) * 2 * max);
    gx.set(x * 100);
    gy.set(y * 100);
  }

  function onEnter() {
    glowOpacity.set(1);
  }

  function onLeave() {
    rotateX.set(0);
    rotateY.set(0);
    glowOpacity.set(0);
  }

  return (
    <motion.div
      ref={ref}
      className={cn("relative", className)}
      style={{
        rotateX: sRotateX,
        rotateY: sRotateY,
        transformPerspective: 1100,
        transformStyle: "preserve-3d",
      }}
      whileHover={{ y: -lift }}
      transition={{ type: "spring", stiffness: 200, damping: 22 }}
      onPointerMove={onMove}
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
    >
      {children}
      {glow ? (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] mix-blend-screen"
          style={{ background: spotlight, opacity: sGlow }}
        />
      ) : null}
    </motion.div>
  );
}
