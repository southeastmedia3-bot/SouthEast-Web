"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { revealVariants } from "@/lib/motion";

export function RevealWrapper(props: HTMLMotionProps<"div">) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10%" }}
      variants={revealVariants}
      {...props}
    />
  );
}

export const AnimatedWrapper = RevealWrapper;
