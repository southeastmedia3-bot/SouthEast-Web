"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Container } from "@/components/common/container";
import { Reveal } from "@/components/common/reveal";
import { pharmaIntro } from "@/data/pharma";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * The opening statement of the rebuilt page (deck slide 1), with the credibility
 * the deck leads on (slides 4, 6, 7) as a stat row. The family render sits beside
 * the statement; the numbers anchor it in fact.
 */
export function PharmaIntro() {
  const reducedMotion = useReducedMotion();

  return (
    <section id="overview" className="scroll-mt-36 border-t border-border bg-white py-20 md:py-28">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div>
            <Reveal>
              <p className="type-label mb-5 text-[color:var(--brand-blue)]">{pharmaIntro.eyebrow}</p>
              <h2 className="type-h2 text-balance text-foreground">{pharmaIntro.title}</h2>
              <p className="type-body-lg mt-6 max-w-xl text-muted">{pharmaIntro.body}</p>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <div className="relative aspect-[5/4] w-full overflow-hidden rounded-[1.75rem] bg-[#f3f0e8]">
              <Image
                src={pharmaIntro.image}
                alt={pharmaIntro.imageAlt}
                fill
                sizes="(min-width: 1024px) 45vw, 92vw"
                className="object-contain"
              />
            </div>
          </Reveal>
        </div>

        <dl className="mt-16 grid grid-cols-2 gap-x-8 gap-y-10 border-t border-border pt-12 md:grid-cols-4">
          {pharmaIntro.stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={reducedMotion ? undefined : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, ease: EASE, delay: (i % 4) * 0.08 }}
            >
              <dt className="type-h3 text-balance text-foreground">{stat.value}</dt>
              <dd className="type-caption mt-2 uppercase tracking-[0.1em] text-muted">
                {stat.label}
              </dd>
            </motion.div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
