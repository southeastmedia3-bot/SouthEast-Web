"use client";

import { Container } from "@/components/common/container";
import { Reveal } from "@/components/common/reveal";
import { NaturalMedia } from "@/components/pharma/natural-media";
import { pharmaAtlas, type OrganPlate } from "@/data/pharma";

/**
 * The atlas — deck slides 8–21, the organ-by-organ disease-state library.
 *
 * Every organ is one full source slide (uniform 16:9), shown whole at one shared
 * size: nothing cropped, nothing letterboxed. Because each slide already carries
 * its own title, description and render, the page just frames it — a clean, even
 * grid of specimen plates. Set on pure white, so the medical renders (mostly dark)
 * read as framed plates on a gallery wall.
 */
export function OrganAtlas() {
  return (
    <section id="atlas" className="scroll-mt-36 bg-white py-24 md:py-32">
      <Container size="xl">
        <div className="mb-14 max-w-2xl">
          <Reveal>
            <p className="type-label mb-5 text-[color:var(--brand-blue)]">{pharmaAtlas.eyebrow}</p>
            <h2 className="type-h2 text-balance text-[#15141a]">{pharmaAtlas.title}</h2>
            <p className="type-body-lg mt-5 text-[#55555f]">{pharmaAtlas.body}</p>
          </Reveal>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:gap-7">
          {pharmaAtlas.plates.map((plate, i) => (
            <Plate key={plate.slug} plate={plate} priority={i < 2} />
          ))}
        </div>
      </Container>
    </section>
  );
}

function Plate({ plate, priority }: { plate: OrganPlate; priority: boolean }) {
  return (
    <Reveal>
      <figure className="group overflow-hidden rounded-[1.4rem] border border-black/[0.08] bg-white shadow-[0_28px_70px_-48px_rgba(21,20,26,0.45)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_40px_90px_-46px_rgba(21,20,26,0.55)]">
        <NaturalMedia
          image={plate.image}
          alt={plate.name}
          priority={priority}
          sizes="(min-width: 1024px) 46vw, (min-width: 640px) 48vw, 96vw"
          imgClassName="transition-transform duration-[900ms] ease-out group-hover:scale-[1.02]"
        />
      </figure>
    </Reveal>
  );
}
