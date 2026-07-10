"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { pageRevealVariants } from "@/lib/motion";
import type { WithChildren } from "@/types/global";

export function PageTransitionLayer({ children }: WithChildren) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={pageRevealVariants}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
