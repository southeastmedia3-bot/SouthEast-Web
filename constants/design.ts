export const designTokens = {
  containers: {
    xs: "max-w-2xl",
    sm: "max-w-3xl",
    md: "max-w-5xl",
    lg: "max-w-7xl",
    xl: "max-w-[92rem]",
    full: "max-w-none",
  },
  spacing: {
    section: "py-28 md:py-36 lg:py-44",
    sectionCompact: "py-18 md:py-24",
    gutter: "px-5 sm:px-7 lg:px-10",
    safeTop: "pt-[max(5rem,env(safe-area-inset-top))]",
    safeBottom: "pb-[max(2rem,env(safe-area-inset-bottom))]",
  },
  radius: {
    sm: "rounded-[0.625rem]",
    md: "rounded-[0.875rem]",
    lg: "rounded-[1.25rem]",
    xl: "rounded-[1.75rem]",
    full: "rounded-full",
  },
  shadows: {
    soft: "shadow-[0_22px_70px_rgba(0,0,0,0.24)]",
    glow: "shadow-[0_0_42px_rgba(54,161,223,0.12)]",
    line: "shadow-[inset_0_1px_0_rgba(255,255,255,0.055)]",
  },
  blur: {
    nav: "backdrop-blur-xl",
    panel: "backdrop-blur-2xl",
  },
  motion: {
    fast: 0.18,
    base: 0.42,
    slow: 0.82,
    ease: [0.16, 1, 0.3, 1],
  },
  breakpoints: {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    xxl: 1536,
  },
} as const;
