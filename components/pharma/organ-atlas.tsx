"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Container } from "@/components/common/container";
import { Reveal } from "@/components/common/reveal";
import { LoopVideo } from "@/components/pharma/loop-video";
import { pharmaAtlas, type Organ } from "@/data/pharma";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * The atlas — deck slides 9–22, the organ-by-organ disease-state library.
 *
 * The three organs with animation loops (heart, lung, fetal) are featured large
 * and play in view; the remaining eleven form a specimen grid, each a still with
 * a caption that rises on hover. Set on black, because a medical render reads as
 * volume against darkness.
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
              <figure className="group relative flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-white/10 bg-black">
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  {organ.video && organ.poster ? (
                    <LoopVideo src={organ.video} poster={organ.poster} />
                  ) : (
                    <Image src={organ.image} alt={organ.name} fill sizes="33vw" className="object-cover" />
                  )}
                </div>
                <figcaption className="flex flex-1 flex-col p-6">
                  <h3 className="type-h4 text-[1.15rem] text-[var(--ink-frame-foreground)]">
                    {organ.name}
                  </h3>
                  <p className="type-caption mt-2.5 text-[color:var(--brand-ice)]/55">
                    {organ.detail}
                  </p>
                  {organ.states?.length ? (
                    <ul className="mt-4 flex flex-wrap gap-2">
                      {organ.states.map((s) => (
                        <li
                          key={s}
                          className="rounded-full border border-white/15 px-2.5 py-1 text-xs font-medium text-[color:var(--brand-ice)]/70"
                        >
                          {s}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </figcaption>
              </figure>
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
    <motion.article
      className="group relative aspect-[4/5] overflow-hidden rounded-[1.25rem] border border-white/10 bg-black"
      initial={reduced ? undefined : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.55, ease: EASE, delay: (index % 4) * 0.05 }}
    >
      {organ.video && organ.poster ? (
        <LoopVideo src={organ.video} poster={organ.poster} className="transition-transform duration-700 ease-out group-hover:scale-105" />
      ) : (
        <Image
          src={organ.image}
          alt={organ.name}
          fill
          sizes="(min-width: 1024px) 22vw, 45vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
      )}
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent"
        aria-hidden="true"
      />
      <div className="absolute inset-x-0 bottom-0 p-5">
        <h3 className="type-h4 text-[1rem] text-[var(--ink-frame-foreground)]">{organ.name}</h3>
        {/* Detail rises in on hover so the grid stays clean at rest. */}
        <p className="type-caption mt-1 max-h-0 overflow-hidden text-[color:var(--brand-ice)]/70 opacity-0 transition-all duration-500 group-hover:max-h-24 group-hover:opacity-100">
          {organ.detail}
        </p>
      </div>
    </motion.article>
  );
}
