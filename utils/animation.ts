import { designTokens } from "@/constants/design";

export function getTransition(duration = designTokens.motion.base, delay = 0) {
  return {
    duration,
    delay,
    ease: designTokens.motion.ease,
  };
}

export function getStagger(index: number, step = 0.08) {
  return Math.max(0, index) * step;
}
