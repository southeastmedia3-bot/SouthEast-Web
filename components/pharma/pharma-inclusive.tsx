"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Container } from "@/components/common/container";
import { Reveal } from "@/components/common/reveal";
import { MorphTile } from "@/components/pharma/morph-tile";
import { SpecimenPlate } from "@/components/pharma/specimen-plate";
import { pharmaBodyTypes } from "@/data/pharma";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Inclusive anatomy — deck slides 7 & 8 (body types and ethnicities), with the
 * head studies from slides 4–6 riding along as supporting frames so none of that
 * imagery is dropped. Two large variant frames lead; the three head studies form
 * a strip beneath.
 */
export function PharmaInclusive() {
  const reducedMotion = useReducedMotion();
  const { eyebrow, title, body, images, studies } = pharmaBodyTypes;

  return (
    <section id="inclusive" className="scroll-mt-36 border-t border-border bg-[var(--surface-elevated)] py-20 md:py-28">
      <Container>
        <div className="mb-12 max-w-2xl">
          <Reveal>
            <p className="type-label mb-5 text-[color:var(--brand-blue)]">{eyebrow}</p>
            <h2 className="type-h3 text-balance text-foreground">{title}</h2>
            <p className="type-body-lg mt-5 text-muted">{body}</p>
          </Reveal>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {images.map((img, i) => (
            <Reveal key={img.src} delay={i * 0.08}>
              <SpecimenPlate
                index={String(i + 1).padStart(2, "0")}
                label={i === 0 ? "Body-type set A" : "Body-type set B"}
                meta="FULL-BODY VARIANTS"
                className="aspect-[16/10]"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(min-width: 640px) 45vw, 92vw"
                  className="object-contain px-6 pb-6 pt-14"
                />
              </SpecimenPlate>
            </Reveal>
          ))}
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {studies.map((study, i) => (
            <motion.div
              key={study.src}
              initial={reducedMotion ? undefined : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, ease: EASE, delay: (i % 3) * 0.07 }}
            >
              <MorphTile
                title={study.title}
                kicker="Head study"
                sub={study.sub}
                image={study.src}
                corner="3.25rem"
                sizes="(min-width: 640px) 30vw, 92vw"
                className="aspect-[4/3]"
              />
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
