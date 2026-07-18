"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/common/container";
import { Reveal } from "@/components/common/reveal";
import { MorphTile } from "@/components/pharma/morph-tile";
import { pharmaAtlas, type Organ } from "@/data/pharma";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * The atlas — deck slides 9–22, the organ-by-organ disease-state library.
 *
 * The three organs with animation loops (heart, lung, fetal) are featured large;
 * the rest form a specimen grid. Every tile is a MorphTile: point at it and the
 * frame turns into the studio's mark and a card explains the subject — the same
 * interaction the homepage discipline wall uses, applied to stills and loops
 * alike. Set on black, because a medical render reads as volume against darkness.
 */
export function OrganAtlas() {
  const reducedMotion = useReducedMotion();

  return (
    <section id="atlas" className="scroll-mt-36 bg-[#05070d] py-24 md:py-32">
      <Container size="xl">
        <div className="mb-14 max-w-2xl">
          <Reveal>
            <p className="type-label mb-5 text-[color:var(--brand-sky)]">{pharmaAtlas.eyebrow}</p>
            <h2 className="type-h2 text-balance text-[var(--ink-frame-foreground)]">
              {pharmaAtlas.title}
            </h2>
            <p className="type-body-lg mt-5 text-[color:var(--brand-ice)]/60">{pharmaAtlas.body}</p>
          </Reveal>
        </div>

        {/* Featured — the animated organs. */}
        <div className="grid gap-4 lg:grid-cols-3">
          {pharmaAtlas.featured.map((organ, i) => (
            <Reveal key={organ.slug} delay={(i % 3) * 0.08}>
              <MorphTile
                title={organ.name}
                kicker="Animated study"
                sub={organ.detail}
                image={organ.image}
                video={organ.video}
                poster={organ.poster}
                states={organ.states}
                corner="4.5rem"
                sizes="(min-width: 1024px) 32vw, 92vw"
                className="aspect-[4/3]"
              />
            </Reveal>
          ))}
        </div>

        {/* The specimen grid — every remaining organ. */}
        <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {pharmaAtlas.grid.map((organ, i) => (
            <SpecimenCard key={organ.slug} organ={organ} index={i} reduced={reducedMotion} />
          ))}
        </div>
      </Container>
    </section>
  );
}

function SpecimenCard({ organ, index, reduced }: { organ: Organ; index: number; reduced: boolean }) {
  return (
    <motion.div
      initial={reduced ? undefined : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.55, ease: EASE, delay: (index % 4) * 0.05 }}
    >
      <MorphTile
        title={organ.name}
        kicker="Specimen"
        sub={organ.detail}
        image={organ.image}
        video={organ.video}
        poster={organ.poster}
        corner="3rem"
        sizes="(min-width: 1024px) 22vw, 45vw"
        className="aspect-[4/5]"
      />
    </motion.div>
  );
}
