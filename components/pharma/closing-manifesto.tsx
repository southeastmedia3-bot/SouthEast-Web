"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { Container } from "@/components/common/container";
import { pharmaClosing } from "@/data/pharma";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

/**
 * Deck slide 29 — the closing manifesto. The molecular still drifts up behind the
 * statement as the section enters (parallax, no added scroll), then the line
 * resolves over it.
 */
export function ClosingManifesto() {
  const reducedMotion = useReducedMotion();
  const ref = useRef<HTMLElement | null>(null);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["8%", "-8%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.1, 1.2]);

  return (
    <section ref={ref} className="relative overflow-hidden bg-black py-32 md:py-44">
      <motion.div
        className="absolute inset-0"
        style={reducedMotion ? undefined : { y, scale }}
        aria-hidden="true"
      >
        <Image
          src={pharmaClosing.image}
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black" />
      </motion.div>

      <Container className="relative text-center">
        <motion.p
          className="type-label mb-6 text-[color:var(--brand-sky)]"
          initial={reducedMotion ? undefined : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          {pharmaClosing.eyebrow}
        </motion.p>
        <motion.h2
          className="voice-quiet mx-auto max-w-4xl text-balance text-[clamp(2.2rem,5.4vw,4.25rem)] leading-[1.05] text-[var(--ink-frame-foreground)]"
          initial={reducedMotion ? undefined : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        >
          {pharmaClosing.title}
        </motion.h2>
        <motion.p
          className="type-body-lg mx-auto mt-7 max-w-2xl text-[color:var(--brand-ice)]/70"
          initial={reducedMotion ? undefined : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
        >
          {pharmaClosing.body}
        </motion.p>
      </Container>
    </section>
  );
}
