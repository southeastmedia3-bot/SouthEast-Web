"use client";

import { Container } from "@/components/common/container";
import { Reveal } from "@/components/common/reveal";
import { NaturalMedia } from "@/components/pharma/natural-media";
import { pharmaAtlas, type Organ } from "@/data/pharma";

/**
 * The atlas — deck slides 9–22, the organ-by-organ disease-state library.
 *
 * A specimen gallery: every organ is shown in full, at the exact shape it was
 * rendered in — nothing cropped, nothing letterboxed. A masonry keeps the mixed
 * shapes (wide panoramas, tall strips, squares) sitting together without forcing a
 * common frame. The animated organs play in view; each card carries its name and
 * the pathology it documents. Set on black, because a medical render reads as
 * volume against darkness.
 */
export function OrganAtlas() {
  const organs: Organ[] = [...pharmaAtlas.featured, ...pharmaAtlas.grid];

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

        <div className="gap-5 [column-fill:_balance] sm:columns-2 lg:columns-3">
          {organs.map((organ, i) => (
            <OrganCard key={organ.slug} organ={organ} priority={i < 3} />
          ))}
        </div>
      </Container>
    </section>
  );
}

function OrganCard({ organ, priority }: { organ: Organ; priority: boolean }) {
  return (
    <Reveal className="mb-5 break-inside-avoid">
      <figure className="group overflow-hidden rounded-[1.4rem] border border-white/10 bg-[#0a0c11] transition-colors duration-500 hover:border-white/25">
        <NaturalMedia
          image={organ.image}
          video={organ.video}
          poster={organ.poster}
          alt={organ.name}
          priority={priority}
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 46vw, 92vw"
          imgClassName="transition-transform duration-[900ms] ease-out group-hover:scale-[1.03]"
        />
        <figcaption className="p-5 md:p-6">
          <h3 className="type-h4 text-[1.15rem] text-[var(--ink-frame-foreground)]">{organ.name}</h3>
          <p className="type-caption mt-2.5 text-[color:var(--brand-ice)]/55">{organ.detail}</p>
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
  );
}
