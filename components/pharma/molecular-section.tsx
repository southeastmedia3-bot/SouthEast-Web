"use client";

import { Container } from "@/components/common/container";
import { Reveal } from "@/components/common/reveal";
import { NaturalMedia } from "@/components/pharma/natural-media";
import { pharmaMolecular } from "@/data/pharma";

/**
 * The pharma core — deck slides 23, 25, 26, 27, 28. Molecular science and
 * Mechanism of Action: the protein, the animation, the pipeline, the structure,
 * the interaction. Each render is shown whole at its own shape in a masonry;
 * videos play in view.
 */
export function MolecularSection() {
  const { eyebrow, title, body, items } = pharmaMolecular;

  return (
    <section
      id="molecular"
      className="scroll-mt-36 border-t border-border bg-[var(--surface)] py-24 md:py-32"
    >
      <Container size="xl">
        <div className="mb-14 max-w-2xl">
          <Reveal>
            <p className="type-label mb-5 text-[color:var(--brand-blue)]">{eyebrow}</p>
            <h2 className="type-h2 text-balance text-foreground">{title}</h2>
            <p className="type-body-lg mt-5 text-muted">{body}</p>
          </Reveal>
        </div>

        <div className="gap-5 [column-fill:_balance] md:columns-2">
          {items.map((item, i) => (
            <Reveal key={item.slug} className="mb-5 break-inside-avoid">
              <article className="overflow-hidden rounded-[1.4rem] border border-border bg-white shadow-[0_30px_70px_-55px_rgba(21,20,26,0.35)]">
                <NaturalMedia
                  image={item.image}
                  video={item.video}
                  poster={item.poster}
                  alt={item.title}
                  priority={i === 0}
                  sizes="(min-width: 768px) 46vw, 92vw"
                />
                <div className="p-6 md:p-7">
                  <h3 className="type-h4 text-[1.15rem] text-foreground">{item.title}</h3>
                  <p className="type-body mt-2.5 text-muted">{item.body}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
