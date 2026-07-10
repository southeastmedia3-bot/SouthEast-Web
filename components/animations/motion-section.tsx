"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { revealVariants } from "@/lib/motion";

export function MotionSection(props: HTMLMotionProps<"section">) {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-12%" }}
      variants={revealVariants}
      {...props}
    />
  );
}
