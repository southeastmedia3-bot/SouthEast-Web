"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/common/container";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

type GalleryItem = { src: string; title: string; note?: string };

/**
 * Selected work.
 *
 * Each frame behaves like the discipline-wall tiles on the homepage: point at it
 * and its corners sweep away into the silhouette of our own mark while the picture
 * turns over to a card naming the piece. The shape here is deliberately *heavier*
 * than the homepage's — a larger corner radius and a 3px rule — because these
 * tiles are smaller and the mark needs the extra weight to read.
 *
 * The columns also drift against each other on scroll (middle lags, outer lead),
 * which gives the grid depth without a pinned rail — this page is long enough.
 */
export function WorkGrid({ images, rule }: { images: readonly GalleryItem[]; rule: string }) {
  const reducedMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const lead = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const lag = useTransform(scrollYProgress, [0, 1], [-30, 30]);

  const columns = [0, 1, 2].map((c) => images.filter((_, i) => i % 3 === c));

  return (
    <section
      id="work"
      className="scroll-mt-36 border-t border-border bg-[var(--surface)] py-20 md:py-28"
    >
      <Container size="xl">
        <div className="mb-12 flex items-center gap-4">
          <span className="block h-[2px] w-10" style={{ background: rule }} aria-hidden="true" />
          <h2 className="type-h3 text-foreground">Selected work</h2>
        </div>

        <div ref={ref} className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {columns.map((column, c) => (
            <motion.div
              key={c}
              className="flex flex-col gap-4"
              style={reducedMotion ? undefined : { y: c === 1 ? lag : lead }}
            >
              {column.map((item) => (
                <article
                  key={item.src}
                  className="group relative aspect-[4/3] w-full"
                  // Heavier than the homepage wall's 3rem: smaller tiles need a
                  // bigger radius for the mark's shape to register.
                  style={{ "--corner": "4rem" } as React.CSSProperties}
                >
                  <div className="brand-shape-morph relative h-full w-full overflow-hidden bg-[#0a0a0d]">
                    <Image
                      src={item.src}
                      alt=""
                      fill
                      sizes="(min-width: 768px) 30vw, 45vw"
                      className="object-cover transition-[transform,opacity] duration-700 ease-out group-hover:scale-[1.05] group-hover:opacity-0 group-focus-within:opacity-0"
                    />

                    {/* Resting: the title, over a soft scrim at the foot. */}
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent transition-opacity duration-500 group-hover:opacity-0 group-focus-within:opacity-0"
                      aria-hidden="true"
                    />
                    <div className="absolute inset-x-0 bottom-0 p-5 transition-opacity duration-300 group-hover:opacity-0 group-focus-within:opacity-0">
                      <p className="type-h4 text-[1.05rem] text-white">{item.title}</p>
                    </div>

                    {/* Hover: the card. Inside the clipped box, so it inherits the
                        mark's shape. */}
                    <div className="absolute inset-0 flex flex-col justify-between bg-white p-6 opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-within:opacity-100">
                      <ArrowUpRight
                        className="size-6 self-end transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        style={{ color: rule }}
                        aria-hidden="true"
                      />
                      <div>
                        <h3 className="type-h4 text-[1.15rem] text-foreground">{item.title}</h3>
                        {item.note ? (
                          <p className="type-caption mt-2 text-muted">{item.note}</p>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  {/* The rule that traces the mark. 3px — the "thicker" the tile
                      was asked to carry. */}
                  <span
                    className="brand-shape-morph pointer-events-none absolute inset-0 border-[3px] border-transparent transition-colors duration-500 group-hover:border-[rgba(21,20,26,0.6)]"
                    aria-hidden="true"
                  />
                </article>
              ))}
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
