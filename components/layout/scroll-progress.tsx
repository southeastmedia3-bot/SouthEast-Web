"use client";

import { motion } from "framer-motion";
import { useScrollProgress } from "@/hooks/use-scroll-progress";

export function ScrollProgress() {
  const progress = useScrollProgress();

  return (
    <motion.div
      className="fixed inset-x-0 top-0 z-[80] h-px origin-left bg-accent"
      style={{ scaleX: progress }}
      aria-hidden="true"
    />
  );
}
