"use client";

import { Container } from "@/components/common/container";
import { Reveal } from "@/components/common/reveal";
import { NaturalMedia } from "@/components/pharma/natural-media";
import { pharmaBodyTypes } from "@/data/pharma";

/**
 * Inclusive anatomy — deck slides 7 & 8 (body types and ethnicities), with the
 * head studies from slides 4–6 riding along beneath. Every render is shown in
 * full, at its own shape: the body-type sets on clean plates (they carry a white
 * ground), the head studies on dark cards. Nothing is cropped.
 */
export function PharmaInclusive() {
  const { eyebrow, title, body, images, studies } = pharmaBodyTypes;

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
            <Reveal key={img.src} delay={i * 0.08}>
              <figure className="overflow-hidden rounded-[1.4rem] border border-border bg-white shadow-[0_30px_70px_-50px_rgba(21,20,26,0.4)]">
                <NaturalMedia
                  image={img.src}
                  alt={img.alt}
                  sizes="(min-width: 640px) 46vw, 92vw"
                />
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
            </Reveal>
          ))}
        </div>

        {/* Head studies — dark cards. */}
        <div className="mt-5 grid items-start gap-5 sm:grid-cols-3">
          {studies.map((study, i) => (
            <Reveal key={study.src} delay={i * 0.07}>
              <figure className="group overflow-hidden rounded-[1.4rem] border border-white/10 bg-[#0a0c11]">
                <NaturalMedia
                  image={study.src}
                  alt={study.alt}
                  sizes="(min-width: 640px) 30vw, 92vw"
                  imgClassName="transition-transform duration-[900ms] ease-out group-hover:scale-[1.03]"
                />
                <figcaption className="p-5">
                  <h3 className="type-h4 text-[1.05rem] text-[var(--ink-frame-foreground)]">
                    {study.title}
                  </h3>
                  <p className="type-caption mt-2 text-[color:var(--brand-ice)]/55">{study.sub}</p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
