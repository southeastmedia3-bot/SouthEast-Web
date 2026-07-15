"use client";

import { useEffect, useRef } from "react";
import { Container } from "@/components/common/container";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

type WallVideo = { src: string; poster: string; label: string };

/**
 * The library, in motion.
 *
 * A wall of medical animation loops that play together — the point being that
 * this studio does not just render stills, it animates. Six clips at once is a
 * real decode cost, so an IntersectionObserver only lets a tile play while it is
 * actually on screen and pauses it otherwise; nothing runs in a background tab or
 * far up the page.
 *
 * Under reduced motion the videos never autoplay — each tile shows its poster and
 * a control the visitor can trigger themselves.
 */
export function VideoWall({ videos, rule }: { videos: readonly WallVideo[]; rule: string }) {
  const reducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (reducedMotion) return;
    const root = containerRef.current;
    if (!root) return;

    const vids = Array.from(root.querySelectorAll<HTMLVideoElement>("video"));
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const v = entry.target as HTMLVideoElement;
          if (entry.isIntersecting) {
            v.play().catch(() => {});
          } else {
            v.pause();
          }
        }
      },
      { threshold: 0.25 },
    );
    for (const v of vids) io.observe(v);
    return () => io.disconnect();
  }, [reducedMotion]);

  return (
    <section
      id="motion"
      className="scroll-mt-36 border-t border-border bg-[#0a0a0d] py-20 md:py-28"
    >
      <Container size="xl">
        <div className="mb-4 flex items-center gap-4">
          <span className="block h-[2px] w-10" style={{ background: rule }} aria-hidden="true" />
          <h2 className="type-h3 text-[var(--ink-frame-foreground)]">The library, in motion</h2>
        </div>
        <p className="type-body mb-12 max-w-2xl text-[color:var(--brand-ice)]/60">
          Not stills — animation. Rigged anatomy and mechanism-of-action sequences,
          built in Cinema 4D and Octane and running the way they ship.
        </p>

        <div ref={containerRef} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((video) => (
            <figure
              key={video.src}
              className="group relative aspect-video overflow-hidden rounded-2xl border border-white/10 bg-black"
            >
              <video
                className="absolute inset-0 h-full w-full object-cover"
                muted
                loop
                playsInline
                preload="metadata"
                poster={video.poster}
                controls={reducedMotion}
              >
                <source src={video.src} type="video/mp4" />
              </video>

              <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"
                aria-hidden="true"
              />
              <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center gap-2.5 p-5">
                <span
                  className="size-1.5 shrink-0 rounded-full"
                  style={{ background: rule }}
                  aria-hidden="true"
                />
                <span className="type-caption text-[var(--ink-frame-foreground)]">
                  {video.label}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}
