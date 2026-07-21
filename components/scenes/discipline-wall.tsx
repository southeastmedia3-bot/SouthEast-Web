"use client";

import Link from "next/link";
import Image from "next/image";
import { LazyLoopVideo } from "@/components/media/lazy-loop-video";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/common/container";
import { disciplineWall } from "@/data/home";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Scene 05 — the discipline wall.
 *
 * A mosaic of frames. Point at one and it does not merely highlight: the frame's
 * corners sweep away into the silhouette of our own mark — top-left and
 * bottom-right rounded, top-right and bottom-left square — and the picture turns
 * over to a card naming the discipline behind it.
 *
 * The shape is not a stylistic guess. It is measured off the master artwork (see
 * `.brand-shape` in globals.css): every panel of the four-band mark is exactly
 * this asymmetric shape, so a rectangle that morphs into it is, literally, a
 * rectangle turning into the logo.
 *
 * `--corner` scales the radius per tile. A single fixed radius would read as the
 * mark on a small tile and as a lozenge on the large one.
 */
export function DisciplineWall() {
  const reducedMotion = useReducedMotion();

  return (
    <section
      id="disciplines"
      aria-label={disciplineWall.heading}
      className="bg-white py-28 md:py-36"
    >
      <Container size="xl">
        <div className="mb-14 max-w-2xl">
          <p className="type-label mb-5 text-muted">{disciplineWall.eyebrow}</p>
          <h2 className="type-h2 text-balance text-foreground">{disciplineWall.heading}</h2>
          <p className="type-body-lg mt-5 text-muted">{disciplineWall.intro}</p>
        </div>

        <ul className="grid auto-rows-[14rem] grid-cols-1 gap-4 md:grid-cols-4 md:auto-rows-[13rem]">
          {disciplineWall.tiles.map((tile, i) => (
            <motion.li
              key={tile.slug}
              className={cn("relative", tile.span)}
              initial={reducedMotion ? undefined : { opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.6, ease: EASE, delay: (i % 3) * 0.06 }}
            >
              <Link
                href={tile.href}
                className="group relative block h-full w-full focus-visible:outline-none"
                style={{ "--corner": tile.corner } as React.CSSProperties}
              >
                {/* The frame. overflow-hidden + the morphing radius is what makes
                    the picture itself take the shape of the mark. A tile may carry
                    a looping video (the pharma tile plays the beating heart); it
                    falls back to the still as its poster. */}
                <div className="brand-shape-morph relative h-full w-full overflow-hidden bg-[#0a0a0d]">
                  {"video" in tile && tile.video ? (
                    <LazyLoopVideo
                      src={tile.video}
                      poster={tile.media}
                      className="transition-[transform,opacity] duration-700 ease-out group-hover:scale-[1.04] group-hover:opacity-0 group-focus-visible:opacity-0"
                    />
                  ) : (
                    <Image
                      src={tile.media}
                      alt=""
                      fill
                      sizes="(min-width: 768px) 50vw, 100vw"
                      className="object-cover transition-[transform,opacity] duration-700 ease-out group-hover:scale-[1.04] group-hover:opacity-0 group-focus-visible:opacity-0"
                    />
                  )}

                  {/* Resting state: just the name, over a soft scrim. */}
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent transition-opacity duration-500 group-hover:opacity-0 group-focus-visible:opacity-0"
                    aria-hidden="true"
                  />
                  <div className="absolute inset-x-0 bottom-0 p-6 transition-opacity duration-300 group-hover:opacity-0 group-focus-visible:opacity-0">
                    <p className="type-h4 text-[1.15rem] text-white">{tile.title}</p>
                  </div>

                  {/* Hovered state: the card. Sits inside the same clipped box, so
                      it inherits the mark's shape exactly. */}
                  <div className="absolute inset-0 flex flex-col justify-between bg-white p-6 opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100 md:p-8">
                    <div>
                      <p className="type-label text-[color:var(--brand-red)]">{tile.kicker}</p>
                      <h3 className="type-h4 mt-4 max-w-[16ch] text-balance text-foreground">
                        {tile.title}
                      </h3>
                      <p className="type-caption mt-3 text-muted">{tile.sub}</p>
                    </div>
                    <span className="type-label inline-flex items-center gap-2 text-foreground">
                      Explore
                      <ArrowRight
                        className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                        aria-hidden="true"
                      />
                    </span>
                  </div>
                </div>

                {/* The rule that traces the silhouette the frame just morphed into.
                    2px, not a hairline: at 1px against a white card the shape barely
                    registered, and the whole point is that you see the mark. */}
                <span
                  className="brand-shape-morph pointer-events-none absolute inset-0 border-2 border-transparent transition-colors duration-500 group-hover:border-[rgba(21,20,26,0.55)] group-focus-visible:border-[color:var(--brand-sky)]"
                  aria-hidden="true"
                />
              </Link>
            </motion.li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
