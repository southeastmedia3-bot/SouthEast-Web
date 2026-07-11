"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { pageFadeVariants } from "@/lib/motion";
import type { WithChildren } from "@/types/global";

export function PageTransitionLayer({ children }: WithChildren) {
  const pathname = usePathname();

  // IMPORTANT: opacity-only. A lingering `transform`/`filter` on this wrapper
  // (e.g. blur) creates a containing block that reparents GSAP's `position:
  // fixed` pinned stages, breaking scroll pinning and flashing the page
  // background. Opacity does not create a containing block.
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={pageFadeVariants}
        style={{ willChange: "opacity" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
