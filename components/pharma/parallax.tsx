"use client";

import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

/**
 * A gentle counter-scroll drift for a block of media.
 *
 * As the wrapped element travels through the viewport it slides from `+distance`
 * to `-distance`, so it reads as floating at a slightly different depth than the
 * text beside it — the small "expensive" tell of a graded page. The travel is a
 * pure function of the element's own scroll position (no pin, no added scroll),
 * and the whole thing collapses to a static block under reduced motion.
 *
 * Keep `distance` modest (the default 22px = 44px total travel). The sections
 * carry enough vertical padding that this never overlaps a neighbour.
 */
export function Parallax({
  children,
  distance = 22,
  className,
}: {
  children: ReactNode;
  distance?: number;
  className?: string;
}) {
  const reducedMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [distance, -distance]);

  if (reducedMotion) return <div className={className}>{children}</div>;

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y }} className="will-change-transform">
        {children}
      </motion.div>
    </div>
  );
}
