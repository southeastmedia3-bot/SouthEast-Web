"use client";

import Image from "next/image";
import { Container } from "@/components/common/container";
import { Reveal } from "@/components/common/reveal";
import { LoopVideo } from "@/components/pharma/loop-video";
import { pharmaMolecular } from "@/data/pharma";
import { cn } from "@/lib/utils";

/**
 * The pharma core — deck slides 23, 25, 26, 27, 28. Molecular science and
 * Mechanism of Action, built as a sequence: the protein, the animation, the
 * pipeline that makes it, the structure model, the interaction. The first item
 * is featured full-width; the rest alternate. Videos play in view.
 */
export function MolecularSection() {
  const { eyebrow, title, body, items } = pharmaMolecular;
  const [lead, ...rest] = items;

  return (
    <section id="molecular" className="scroll-mt-36 border-t border-border bg-[var(--surface)] py-24 md:py-32">
      <Container size="xl">
        <div className="mb-14 max-w-2xl">
          <Reveal>
            <p className="type-label mb-5 text-[color:var(--brand-blue)]">{eyebrow}</p>
            <h2 className="type-h2 text-balance text-foreground">{title}</h2>
            <p className="type-body-lg mt-5 text-muted">{body}</p>
          </Reveal>
        </div>

        {/* Lead item — full width, media on top. */}
        {lead ? (
          <Reveal>
            <div className="overflow-hidden rounded-[1.75rem] border border-border bg-black">
              <div className="relative aspect-[21/9] w-full">
                {lead.video && lead.poster ? (
                  <LoopVideo src={lead.video} poster={lead.poster} />
                ) : (
                  <Image src={lead.image} alt={lead.title} fill sizes="90vw" className="object-cover" />
                )}
              </div>
              <div className="bg-white p-7 md:p-9">
                <h3 className="type-h4 text-foreground">{lead.title}</h3>
                <p className="type-body mt-3 max-w-3xl text-muted">{lead.body}</p>
              </div>
            </div>
          </Reveal>
        ) : null}

        {/* The rest — a two-up grid of cards. */}
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {rest.map((item, i) => (
            <Reveal key={item.slug} delay={(i % 2) * 0.08}>
              <article
                className={cn(
                  "flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-border bg-black",
                )}
              >
                <div className="relative aspect-[16/9] w-full">
                  {item.video && item.poster ? (
                    <LoopVideo src={item.video} poster={item.poster} />
                  ) : (
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(min-width: 768px) 45vw, 92vw"
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="flex flex-1 flex-col bg-white p-6 md:p-7">
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
