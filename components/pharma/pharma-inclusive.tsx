"use client";

import Image from "next/image";
import { Container } from "@/components/common/container";
import { Reveal } from "@/components/common/reveal";
import { TiltCard } from "@/components/pharma/tilt-card";
import { pharmaBodyTypes } from "@/data/pharma";

/**
 * Inclusive anatomy — deck slides 7 & 8 (body types and ethnicities), with the
 * head studies from slides 4–6 riding along beneath. Every render is shown in
 * full, at its own shape: the body-type sets on clean plates (they carry a white
 * ground), the head studies on dark cards. Nothing is cropped. Each frame answers
 * the pointer — a slight tilt toward the cursor under a soft spotlight — so the
 * section reads as lit specimens, not stills pasted flat.
 */
export function PharmaInclusive() {
  const { eyebrow, title, body, images, studies, orbitalSlide } = pharmaBodyTypes;

  return (
    <section
      id="inclusive"
      className="scroll-mt-36 border-t border-border bg-[var(--surface-elevated)] py-20 md:py-28"
    >
      <Container>
        <div className="mb-12 max-w-2xl">
          <Reveal>
            <p className="type-label mb-5 text-[color:var(--brand-blue)]">{eyebrow}</p>
            <h2 className="type-h3 text-balance text-foreground">{title}</h2>
            <p className="type-body-lg mt-5 text-muted">{body}</p>
          </Reveal>
        </div>

        {/* Body-type sets — white-ground plates. */}
        <div className="grid items-start gap-5 sm:grid-cols-2">
          {images.map((img, i) => (
            <Reveal key={img.src} delay={i * 0.08} y={28}>
              <TiltCard
                max={5}
                glow="rgba(130,185,255,0.14)"
                className="group overflow-hidden rounded-[1.4rem] border border-border bg-white shadow-[0_30px_70px_-50px_rgba(21,20,26,0.4)]"
              >
                <figure>
                  <div className="relative aspect-square w-full bg-white">
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      sizes="(min-width: 640px) 46vw, 92vw"
                      className="object-contain transition-transform duration-[900ms] ease-out group-hover:scale-[1.03]"
                    />
                  </div>
                  <figcaption className="flex items-center gap-3 px-6 py-4">
                    <span className="type-index text-[color:var(--brand-blue)]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="type-label text-[color:var(--muted-foreground)]">
                      {i === 0 ? "Body-type set A" : "Body-type set B"}
                    </span>
                    <span className="ml-auto type-caption text-muted">Full-body variants</span>
                  </figcaption>
                </figure>
              </TiltCard>
            </Reveal>
          ))}
        </div>

        {/* Head studies — cutaway and cross-section, side by side, enlarged and whole. */}
        <div className="mt-5 grid items-start gap-5 sm:grid-cols-2">
          {studies.map((study, i) => (
            <Reveal key={study.src} delay={i * 0.07} y={28}>
              <TiltCard className="group overflow-hidden rounded-[1.4rem] border border-white/10 bg-[#0a0c11]">
                <figure>
                  <div className="relative aspect-square w-full bg-white">
                    <Image
                      src={study.src}
                      alt={study.alt}
                      fill
                      sizes="(min-width: 640px) 46vw, 92vw"
                      className="object-contain transition-transform duration-[900ms] ease-out group-hover:scale-[1.03]"
                    />
                  </div>
                  <figcaption className="flex items-baseline gap-3 p-6">
                    <h3 className="type-h4 text-[1.15rem] text-[var(--ink-frame-foreground)]">
                      {study.title}
                    </h3>
                    <p className="type-caption text-[color:var(--brand-ice)]/55">{study.sub}</p>
                  </figcaption>
                </figure>
              </TiltCard>
            </Reveal>
          ))}
        </div>

        {/* Orbital & eye — the full source slide, shown whole at a comfortable size. */}
        <Reveal delay={0.05} y={28} className="mx-auto mt-12 max-w-3xl md:mt-16">
          <figure className="group relative aspect-[16/9] w-full overflow-hidden rounded-[1.4rem] border border-white/10 bg-black shadow-[0_40px_90px_-60px_rgba(21,20,26,0.6)]">
            <Image
              src={orbitalSlide.src}
              alt={orbitalSlide.alt}
              fill
              sizes="(min-width: 768px) 768px, 92vw"
              className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.02]"
            />
          </figure>
        </Reveal>
      </Container>
    </section>
  );
}
