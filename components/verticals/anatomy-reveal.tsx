"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { Container } from "@/components/common/container";
import { anatomyLayers } from "@/data/media";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const N = anatomyLayers.length;
/** vh of scroll spent on each layer. N layers -> the tall track below. */
const PER_LAYER_VH = 26;

/**
 * The anatomy reveal — the pharma page's set-piece scroll.
 *
 * One rigged figure, rendered as ten anatomical layers (all cut from a single
 * deck slide, registered so they occupy the same space). A tall track holds a
 * pinned stage; as you scroll it, the layers cross-dissolve in order — a lone
 * kidney, then the lungs, the viscera, the nervous and circulatory systems, the
 * skeleton, muscle, and finally the complete body. The figure assembles itself
 * out of a single organ.
 *
 * The stage is pinned with `position: sticky` rather than a GSAP pin, and every
 * layer's opacity is a `useTransform` off the same scroll progress, so there is
 * no per-layer timer a fast scroll can outrun — the whole thing is a pure
 * function of scroll position. The images are black-ground JPGs on a black
 * section, so a cross-fade never shows a seam.
 *
 * Reduced motion collapses it to the finished figure with its caption; nothing
 * animates and nothing is pinned.
 */
export function AnatomyReveal() {
  const reducedMotion = useReducedMotion();
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  // Scroll 0..1 -> continuous layer position 0..N-1.
  const p = useTransform(scrollYProgress, [0, 1], [0, N - 1]);
  useMotionValueEvent(p, "change", (v) => {
    const i = Math.round(v);
    setActive((cur) => (cur === i ? cur : i));
  });

  if (reducedMotion) {
    const last = anatomyLayers[N - 1]!;
    return (
      <section id="anatomy" className="scroll-mt-36 bg-black py-20">
        <Container>
          <p className="type-label mb-4 text-[color:var(--brand-sky)]">Fully rigged anatomy</p>
          <h2 className="type-h3 mb-8 text-[var(--ink-frame-foreground)]">
            One model. Every system.
          </h2>
          <div className="relative mx-auto aspect-[7/8] w-full max-w-sm">
            <Image
              src={last.src}
              alt="Fully rigged human anatomy model"
              fill
              className="object-contain"
              sizes="24rem"
            />
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section id="anatomy" className="bg-black">
      {/* Tall track: its height is what the pinned stage scrubs against. */}
      <div ref={trackRef} style={{ height: `${N * PER_LAYER_VH + 60}vh` }} className="relative">
        <div className="sticky top-0 flex h-dvh flex-col overflow-hidden">
          <Container size="xl" className="flex flex-1 flex-col pb-10 pt-28">
            <div className="mb-4">
              <p className="type-label mb-3 text-[color:var(--brand-sky)]">Fully rigged anatomy</p>
              <h2 className="type-h3 max-w-xl text-balance text-[var(--ink-frame-foreground)]">
                One model. Every system.
              </h2>
            </div>

            <div className="relative flex flex-1 items-center justify-center">
              {/* The stacked, registered layers. Only the ones near the current
                  scroll position carry any opacity. */}
              <div className="relative h-full w-full max-w-2xl">
                {anatomyLayers.map((layer, i) => (
                  <AnatomyLayer key={layer.src} src={layer.src} index={i} p={p} />
                ))}
              </div>

              {/* Depth rail — where you are in the build. */}
              <ol className="absolute right-0 top-1/2 hidden -translate-y-1/2 flex-col gap-2.5 md:flex">
                {anatomyLayers.map((layer, i) => (
                  <li key={layer.src} className="flex items-center justify-end gap-3">
                    <span
                      className={
                        "type-caption transition-colors duration-300 " +
                        (i === active
                          ? "text-[var(--ink-frame-foreground)]"
                          : "text-[color:var(--brand-ice)]/25")
                      }
                    >
                      {layer.label}
                    </span>
                    <span
                      className={
                        "h-px transition-all duration-300 " +
                        (i === active ? "w-8 bg-[color:var(--brand-sky)]" : "w-4 bg-white/20")
                      }
                      aria-hidden="true"
                    />
                  </li>
                ))}
              </ol>
            </div>

            {/* The caption for the layer you're on. */}
            <div className="flex items-baseline gap-4">
              <span className="type-index tabular-nums text-[color:var(--brand-ice)]/40">
                {String(active + 1).padStart(2, "0")}
                <span className="text-[color:var(--brand-ice)]/20">
                  {" "}
                  / {String(N).padStart(2, "0")}
                </span>
              </span>
              <div>
                <p className="type-h4 text-[1.15rem] text-[var(--ink-frame-foreground)]">
                  {anatomyLayers[active]!.label}
                </p>
                <p className="type-caption text-[color:var(--brand-ice)]/55">
                  {anatomyLayers[active]!.detail}
                </p>
              </div>
            </div>
          </Container>
        </div>
      </div>
    </section>
  );
}

/** One cross-fading layer. A trapezoid: the layer holds at full opacity for a
 *  band around its index (so it reads cleanly, solo), then cross-fades quickly to
 *  its neighbour at the edges rather than ghosting through the whole range. First
 *  and last hold at the ends. */
function AnatomyLayer({
  src,
  index,
  p,
}: {
  src: string;
  index: number;
  p: import("framer-motion").MotionValue<number>;
}) {
  const opacity = useTransform(
    p,
    [index - 0.5, index - 0.28, index + 0.28, index + 0.5],
    [0, 1, 1, 0],
    { clamp: true },
  );
  return (
    <motion.div className="absolute inset-0" style={{ opacity }}>
      <Image
        src={src}
        alt=""
        fill
        priority={index === 0}
        sizes="(min-width: 768px) 42rem, 90vw"
        className="object-contain"
      />
    </motion.div>
  );
}
