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
 * No image — the statement carries the section on its own. The headline is set
 * large and full-measure, the intro rides in beside it at the baseline for an
 * editorial masthead, and the credibility the deck leads on (slides 4, 6, 7)
 * lands as a ruled stat row. Type is the entire composition here, so it is given
 * the room to be the thing you look at.
 */
export function PharmaIntro() {
  const reducedMotion = useReducedMotion();

  return (
    <section id="overview" className="scroll-mt-36 border-t border-border bg-white py-24 md:py-32">
      <Container>
        <Reveal>
          <div className="flex items-center gap-4">
            <span className="type-index text-[color:var(--brand-blue)]">01</span>
            <span className="type-label text-[color:var(--brand-blue)]">{pharmaIntro.eyebrow}</span>
            <span className="h-px flex-1 bg-border" />
          </div>
        </Reveal>

        <div className="mt-10 grid items-end gap-8 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <Reveal>
              <h2 className="type-h1 text-balance text-foreground">{pharmaIntro.title}</h2>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="type-body-lg mt-6 max-w-xl text-muted">{pharmaIntro.body}</p>
            </Reveal>
          </div>
          <div className="lg:col-span-5">
            <Reveal delay={0.08} y={28}>
              <figure className="overflow-hidden rounded-[1.4rem] border border-border bg-white shadow-[0_30px_70px_-50px_rgba(21,20,26,0.4)]">
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

        <dl className="mt-16 grid grid-cols-2 gap-x-8 gap-y-12 border-t border-border pt-14 md:mt-20 md:grid-cols-4">
          {pharmaIntro.stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="md:border-l md:border-border md:pl-8 md:first:border-l-0 md:first:pl-0"
              initial={reducedMotion ? undefined : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, ease: EASE, delay: (i % 4) * 0.08 }}
            >
              <span className="mb-5 block h-[3px] w-9 bg-[color:var(--brand-blue)]" aria-hidden="true" />
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
