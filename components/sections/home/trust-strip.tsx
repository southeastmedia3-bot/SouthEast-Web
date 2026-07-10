"use client";

import { motion } from "framer-motion";
import { AnimatedCounter } from "@/components/common/animated-counter";
import { Container } from "@/components/common/container";
import { trustLogos } from "@/data/home";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export function TrustStrip() {
  const reducedMotion = useReducedMotion();
  const logos = [...trustLogos, ...trustLogos];

  return (
    <section
      className="border-y border-border bg-[rgba(235,246,255,0.035)] py-8 backdrop-blur-xl"
      aria-label="Trusted creative systems"
    >
      <Container className="grid gap-7 lg:grid-cols-[0.74fr_1fr] lg:items-center">
        <div className="grid grid-cols-3 gap-3 text-center lg:max-w-xl">
          {[
            [24, "+", "launch loops"],
            [6, "", "disciplines"],
            [95, "+", "quality target"],
          ].map(([value, suffix, label]) => (
            <div
              key={label}
              className="rounded-[1.25rem] border border-border bg-background/45 p-5 shadow-[inset_0_1px_0_rgba(235,246,255,0.07)]"
            >
              <p className="text-3xl font-black tracking-[-0.04em] text-foreground">
                <AnimatedCounter value={Number(value)} suffix={String(suffix)} />
              </p>
              <p className="mt-2 type-caption text-muted">{label}</p>
            </div>
          ))}
        </div>
        <div className="overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_18%,black_82%,transparent)]">
          <motion.div
            className="flex w-max gap-3"
            animate={reducedMotion ? undefined : { x: [0, -420] }}
            transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
          >
            {logos.map((logo, index) => (
              <div
                key={`${logo}-${index}`}
                className="grid h-16 w-44 place-items-center rounded-full border border-border bg-background/35 text-xs font-semibold uppercase tracking-[0.2em] text-muted shadow-[inset_0_1px_0_rgba(235,246,255,0.06)]"
              >
                {logo}
              </div>
            ))}
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
