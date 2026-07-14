"use client";

import { useRef } from "react";
import { motion, useMotionTemplate, useScroll, useTransform } from "framer-motion";
import { MediaFrame } from "@/components/common/media-frame";
import { Container } from "@/components/common/container";
import type { MediaTone } from "@/data/media";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

/**
 * The signature frame — the one full-bleed image on a vertical page.
 *
 * It does not simply appear: as the section rises, the frame unmasks from its own
 * centre and settles out of a slight over-scale, so the image arrives rather than
 * pops. The mask is a `clip-path: inset()`, which unlike a scale-on-the-image
 * reveal never crops the subject — the picture stays put and the window opens over
 * it.
 *
 * Scrubbed off the section's natural entry, so it costs no scroll.
 */
export function SignatureFrame({
  tone,
  src,
  video,
  poster,
  alt,
}: {
  tone: MediaTone;
  src?: string;
  video?: string;
  poster?: string;
  alt: string;
}) {
  const reducedMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });

  const inset = useTransform(scrollYProgress, [0, 1], [12, 0]);
  const radius = useTransform(scrollYProgress, [0, 1], [40, 0]);
  const clipPath = useMotionTemplate`inset(${inset}% ${inset}% ${inset}% ${inset}% round ${radius}px)`;
  const scale = useTransform(scrollYProgress, [0, 1], [1.08, 1]);

  return (
    <Container className="py-16 md:py-20">
      <div ref={ref}>
        <motion.div style={reducedMotion ? undefined : { clipPath, scale }}>
          <MediaFrame
            tone={tone}
            ratio="wide"
            src={src}
            video={video}
            poster={poster}
            alt={alt}
            className="w-full"
            sizes="(min-width: 1024px) 80vw, 92vw"
          />
        </motion.div>
      </div>
    </Container>
  );
}
