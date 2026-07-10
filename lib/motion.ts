import type { Variants } from "framer-motion";
import { designTokens } from "@/constants/design";

const transition = {
  duration: designTokens.motion.slow,
  ease: designTokens.motion.ease,
};

export const pageFadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition },
  exit: { opacity: 0, transition: { duration: designTokens.motion.fast } },
};

export const pageRevealVariants: Variants = {
  hidden: { opacity: 0, y: 18, filter: "blur(12px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition },
  exit: {
    opacity: 0,
    y: -10,
    filter: "blur(8px)",
    transition: { duration: designTokens.motion.fast },
  },
};

export const revealVariants: Variants = {
  hidden: { opacity: 0, y: 24, filter: "blur(10px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition },
};

export const slideVariants: Variants = {
  hidden: { opacity: 0, x: -24 },
  visible: { opacity: 1, x: 0, transition },
};

export const scaleInVariants: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: designTokens.motion.base, ease: designTokens.motion.ease },
  },
};

export const blurInVariants: Variants = {
  hidden: { opacity: 0, filter: "blur(16px)" },
  visible: { opacity: 1, filter: "blur(0px)", transition },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.08,
    },
  },
};

export const textRevealVariants: Variants = {
  hidden: { y: "100%", opacity: 0 },
  visible: {
    y: "0%",
    opacity: 1,
    transition: { duration: designTokens.motion.slow, ease: designTokens.motion.ease },
  },
};

export const hoverLift = {
  y: -4,
  transition: { duration: designTokens.motion.fast, ease: designTokens.motion.ease },
};
