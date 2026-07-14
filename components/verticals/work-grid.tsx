"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { Container } from "@/components/common/container";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

/**
 * Selected work.
 *
 * Two things carry it. The columns drift against each other as you scroll — the
 * middle one lags, the outer two lead — which gives the grid depth without a
 * single pixel of extra page height (a pinned horizontal rail would have cost
 * more than a screen of scroll, and this page is long enough). And each frame
 * morphs into the silhouette of our own mark on hover: top-left and bottom-right
 * swept away, the other corners square. Same language as the homepage wall.
 */
export function WorkGrid({ images, rule }: { images: readonly string[]; rule: string }) {
  const reducedMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Small offsets. Enough to feel alive, not enough to look like a fairground.
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
              {column.map((src, i) => (
                <div
                  key={src + i}
                  className="group relative aspect-[4/3] w-full"
                  style={{ "--corner": "3rem" } as React.CSSProperties}
                >
                  <div className="brand-shape-morph relative h-full w-full overflow-hidden bg-[#0a0a0d]">
                    <Image
                      src={src}
                      alt=""
                      fill
                      sizes="(min-width: 768px) 30vw, 45vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                    />
                  </div>
                  <span
                    className="brand-shape-morph pointer-events-none absolute inset-0 border-2 border-transparent transition-colors duration-500 group-hover:border-[rgba(21,20,26,0.55)]"
                    aria-hidden="true"
                  />
                </div>
              ))}
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
