import { designTokens } from "@/constants/design";

export function getBreakpointQuery(breakpoint: keyof typeof designTokens.breakpoints) {
  return `(min-width: ${designTokens.breakpoints[breakpoint]}px)`;
}
