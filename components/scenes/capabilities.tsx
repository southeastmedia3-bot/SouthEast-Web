"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { ShapeParticles, type ShapeKey } from "@/components/effects/shape-particles";
import { Container } from "@/components/common/container";
import { capabilities } from "@/data/home";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Scene — Capabilities. Set on black, because a point cloud only reads as
 * volume against darkness. Each card holds a 3D model of its discipline —
 * skeleton, tower, camera, icosahedron, head, bezier — built from real
 * primitives and turning on its axis. Idle it hangs as a loose cloud; point at
 * it and the particles snap onto the model and follow it round.
 *
 * Six cards in a 2 x 3 matrix, deliberately large: the models need the room.
 */
export function Capabilities() {
  const [active, setActive] = useState<number | null>(null);
  const reducedMotion = useReducedMotion();

  return (
    <section
      id="capabilities"
      aria-label="What we build"
      className="relative overflow-hidden bg-black py-28 md:py-36"
    >
      {/* a single soft pool of brand light so the black isn't dead */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 70% at 50% 0%, rgba(25,81,168,0.22), transparent 60%)",
        }}
        aria-hidden="true"
      />

      <Container size="xl" className="relative">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <p className="type-label mb-5 text-[color:var(--brand-sky)]">{capabilities.eyebrow}</p>
          <h2 className="type-h2 text-balance text-[var(--ink-frame-foreground)]">
            {capabilities.heading}
          </h2>
          <p className="type-body-lg mt-5 text-[color:var(--brand-ice)]/60">{capabilities.intro}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {capabilities.items.map((item, i) => (
            <motion.div
              key={item.title}
              initial={reducedMotion ? undefined : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, ease: EASE, delay: (i % 2) * 0.08 }}
            >
              <Link
                href={item.href}
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive((cur) => (cur === i ? null : cur))}
                onFocus={() => setActive(i)}
                onBlur={() => setActive((cur) => (cur === i ? null : cur))}
                className={cn(
                  "group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.02] p-8 transition-all duration-500",
                  "hover:-translate-y-1 hover:border-[color:var(--brand-sky)]/45 hover:bg-white/[0.04]",
                  "hover:shadow-[0_40px_90px_-40px_rgba(54,161,223,0.45)]",
                  "focus-visible:border-[color:var(--brand-sky)] focus-visible:outline-none",
                )}
              >
                {/* the 3D stage — large, because the model needs the room */}
                <div className="relative mb-7 h-[26rem] w-full">
                  <ShapeParticles
                    shape={item.shape as ShapeKey}
                    active={active === i}
                    className="absolute inset-0"
                  />
                </div>

                <div className="mt-auto flex items-start justify-between gap-5">
                  <div>
                    <h3 className="type-h3 text-[var(--ink-frame-foreground)]">{item.title}</h3>
                    <p className="type-body mt-3 max-w-md text-[color:var(--brand-ice)]/55">
                      {item.blurb}
                    </p>
                  </div>
                  <ArrowUpRight
                    className="mt-2 size-6 shrink-0 text-[color:var(--brand-ice)]/40 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[color:var(--brand-sky)]"
                    aria-hidden="true"
                  />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
