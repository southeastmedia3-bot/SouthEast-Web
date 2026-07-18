"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/common/container";
import { Reveal } from "@/components/common/reveal";
import { NaturalMedia } from "@/components/pharma/natural-media";
import { pharmaIntro } from "@/data/pharma";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * The opening statement of the rebuilt page (deck slide 1).
 *
 * A compact editorial masthead: the statement sits beside the orbital-eye render,
 * and the section is set on the render's own dark ground so the image blends into
 * the field rather than floating on a card. The credibility the deck leads on
 * (slides 4, 6, 7) lands beneath as a ruled stat row.
 */
export function PharmaIntro() {
  const reducedMotion = useReducedMotion();

  return (
    <section
      id="overview"
      className="scroll-mt-36 border-t border-white/10 bg-[#1b1710] py-16 md:py-20"
    >
      <Container>
        <Reveal>
          <div className="flex items-center gap-4">
            <span className="type-index text-[color:var(--brand-blue)]">01</span>
            <span className="type-label text-[color:var(--brand-blue)]">{pharmaIntro.eyebrow}</span>
            <motion.span
              className="h-px flex-1 origin-left bg-white/15"
              initial={reducedMotion ? undefined : { scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, amount: 1 }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.15 }}
            />
          </div>
        </Reveal>

        <div className="mt-8 grid items-end gap-8 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7">
            <Reveal x={-48} y={24}>
              <h2 className="type-h2 text-balance text-white">{pharmaIntro.title}</h2>
            </Reveal>
            <Reveal delay={0.12} x={-32}>
              <p className="type-body-lg mt-5 max-w-xl text-white/70">{pharmaIntro.body}</p>
            </Reveal>
          </div>
          <div className="lg:col-span-5">
            <Reveal delay={0.08} y={28} x={56} scale={1.04}>
              <figure className="overflow-hidden rounded-[1.4rem] ring-1 ring-white/10">
                <NaturalMedia
                  image={pharmaIntro.image}
                  alt={pharmaIntro.imageAlt}
                  priority
                  sizes="(min-width: 1024px) 40vw, 92vw"
                />
              </figure>
            </Reveal>
          </div>
        </div>

        <dl className="mt-12 grid grid-cols-2 gap-x-8 gap-y-10 border-t border-white/15 pt-10 md:mt-14 md:grid-cols-4">
          {pharmaIntro.stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="md:border-l md:border-white/15 md:pl-8 md:first:border-l-0 md:first:pl-0"
              initial={reducedMotion ? undefined : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, ease: EASE, delay: (i % 4) * 0.08 }}
            >
              <span className="mb-5 block h-[3px] w-9 bg-[color:var(--brand-blue)]" aria-hidden="true" />
              <dt className="type-h3 text-balance text-white">{stat.value}</dt>
              <dd className="type-caption mt-2 uppercase tracking-[0.1em] text-white/55">
                {stat.label}
              </dd>
            </motion.div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
