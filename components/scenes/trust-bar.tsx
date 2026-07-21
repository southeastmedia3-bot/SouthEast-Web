"use client";

import { motion } from "framer-motion";
import { PhysicsBlocks } from "@/components/effects/physics-blocks";
import { Container } from "@/components/common/container";
import { trustBar } from "@/data/home";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Scene — Trust. The claim is stated plainly, then the proof is dropped into the
 * room as physical objects: shove them, stack them, knock them over.
 */
export function TrustBar() {
  const reducedMotion = useReducedMotion();

  return (
    <section
      id="trust"
      aria-label="Why institutions trust Southeast Media"
      className="relative overflow-hidden bg-white py-28 md:py-36"
    >
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <motion.p
            className="type-label mb-6 text-accent-ink"
            initial={reducedMotion ? undefined : { opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            {trustBar.eyebrow}
          </motion.p>
          <motion.h2
            className="type-h3 text-balance text-foreground"
            initial={reducedMotion ? undefined : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.08 }}
          >
            {trustBar.statement}
          </motion.h2>
        </div>
      </Container>

      {/* Each block holds a fixed slot in the row. Run the cursor through them and
          they scatter out of the way; take it away and they settle straight back
          into place. */}
      <Container size="xl" className="mt-16">
        {/* Taller than the row needs: the headroom is what a shoved block flies
            into before the spring reels it back. */}
        <PhysicsBlocks blocks={trustBar.blocks} className="h-[24rem] md:h-[26rem]" />
        {/* mx-auto is load-bearing: the global `p { max-width: 68ch }` shrinks the
            box, so text-center alone would only centre the text *within* a box
            still hugging the left margin. */}
        <p className="type-caption mx-auto mt-6 text-center text-muted">
          Run your cursor through them — they always find their way back.
        </p>
      </Container>
    </section>
  );
}
