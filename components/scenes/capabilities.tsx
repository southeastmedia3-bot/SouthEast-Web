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
 * Scene — Capabilities. Six cards on a bright field. The particles in each card
 * idle as a loose cloud and snap into the discipline's silhouette when you point
 * at it: a body, a tower, a camera, a wireframe, a character, a bezier path.
 */
export function Capabilities() {
  const [active, setActive] = useState<number | null>(null);
  const reducedMotion = useReducedMotion();

  return (
    <section
      id="capabilities"
      aria-label="What we build"
      className="relative overflow-hidden bg-white py-28 md:py-36"
    >
      <Container>
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <p className="type-label mb-5 text-accent">{capabilities.eyebrow}</p>
          <h2 className="type-h2 text-balance text-foreground">{capabilities.heading}</h2>
          <p className="type-body-lg mt-5 text-muted">{capabilities.intro}</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {capabilities.items.map((item, i) => (
            <motion.div
              key={item.title}
              initial={reducedMotion ? undefined : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, ease: EASE, delay: (i % 3) * 0.08 }}
            >
              <Link
                href={item.href}
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive((cur) => (cur === i ? null : cur))}
                onFocus={() => setActive(i)}
                onBlur={() => setActive((cur) => (cur === i ? null : cur))}
                className={cn(
                  "group relative flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-border bg-white p-7 transition-all duration-500",
                  "hover:-translate-y-1 hover:border-accent/40 hover:shadow-[0_28px_60px_-30px_rgba(25,81,168,0.35)]",
                  "focus-visible:outline-none focus-visible:border-accent",
                )}
              >
                {/* The particle stage */}
                <div className="relative mb-6 h-52 w-full">
                  <ShapeParticles
                    shape={item.shape as ShapeKey}
                    active={active === i}
                    className="absolute inset-0"
                  />
                </div>

                <div className="mt-auto flex items-start justify-between gap-4">
                  <div>
                    <h3 className="type-h4 text-foreground">{item.title}</h3>
                    <p className="type-body mt-2 text-muted">{item.blurb}</p>
                  </div>
                  <ArrowUpRight
                    className="mt-1 size-5 shrink-0 text-muted transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent-ink"
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
