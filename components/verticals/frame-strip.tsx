"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Container } from "@/components/common/container";
import { Reveal } from "@/components/common/reveal";
import type { MediaSlot } from "@/data/media";
import { cn } from "@/lib/utils";

/**
 * A run of consecutive frames from one film, scrubbable.
 *
 * These sequences are the closest thing to showing the film without playing it —
 * fifteen frames in cut order say more about lighting continuity and pacing than
 * any single hero still. Presented as a strip rather than a grid because the
 * order is the content: frame 04 follows frame 03 for a reason.
 *
 * Driven by the thumbnail rail, the arrows, or the left/right keys once the strip
 * has focus. Deliberately not auto-advancing — an animation that moves on its own
 * competes with the video walls elsewhere on these pages, and a visitor scrubbing
 * a film strip is doing so because they want to stop on something.
 *
 * All frames in a run share one aspect, so the stage never resizes between them.
 */
export function FrameStrip({
  frames,
  heading,
  lead,
  rule,
  id,
  dark = false,
}: {
  frames: MediaSlot[];
  heading: string;
  lead?: string;
  rule: string;
  id?: string;
  /** Sit on the near-black ground instead of the page surface. */
  dark?: boolean;
}) {
  const [active, setActive] = useState(0);
  const railRef = useRef<HTMLDivElement | null>(null);
  const count = frames.length;

  const go = useCallback((next: number) => setActive(((next % count) + count) % count), [count]);

  // Keep the selected thumbnail in view when the arrows move past the fold.
  useEffect(() => {
    const rail = railRef.current;
    const thumb = rail?.children[active] as HTMLElement | undefined;
    if (!rail || !thumb) return;
    const left = thumb.offsetLeft - rail.clientWidth / 2 + thumb.clientWidth / 2;
    rail.scrollTo({ left, behavior: "smooth" });
  }, [active]);

  const current = frames[active]!;

  return (
    <section
      id={id}
      className={cn(
        "scroll-mt-36 border-t py-20 md:py-28",
        dark ? "border-white/10 bg-[#0a0a0d]" : "border-border bg-[var(--surface)]",
      )}
    >
      <Container size="xl">
        <Reveal>
          <div className="mb-3 flex items-center gap-4">
            <span className="block h-[2px] w-10" style={{ background: rule }} aria-hidden="true" />
            <h2
              className={cn(
                "type-h3",
                dark ? "text-[var(--ink-frame-foreground)]" : "text-foreground",
              )}
            >
              {heading}
            </h2>
          </div>
          {lead ? (
            <p
              className={cn(
                "type-body mb-12 max-w-2xl",
                dark ? "text-[color:var(--brand-ice)]/60" : "text-muted",
              )}
            >
              {lead}
            </p>
          ) : null}
        </Reveal>

        <div
          className="group/strip outline-none"
          tabIndex={0}
          role="group"
          aria-roledescription="film strip"
          aria-label={heading}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") {
              e.preventDefault();
              go(active + 1);
            }
            if (e.key === "ArrowLeft") {
              e.preventDefault();
              go(active - 1);
            }
          }}
        >
          {/* Stage */}
          <div className="relative">
            <div
              className="relative w-full overflow-hidden bg-[#0a0a0d]"
              style={{ aspectRatio: String(current.w / current.h) }}
            >
              {frames.map((frame, i) => (
                // Every frame stays mounted and cross-fades. Swapping `src` on one
                // <Image> would flash the empty box on each step.
                <Image
                  key={frame.key}
                  src={frame.src}
                  alt={frame.alt}
                  fill
                  sizes="(min-width: 1024px) 88vw, 94vw"
                  loading={i === 0 ? "eager" : "lazy"}
                  className={cn(
                    "object-cover transition-opacity duration-500",
                    i === active ? "opacity-100" : "opacity-0",
                  )}
                  aria-hidden={i === active ? undefined : "true"}
                />
              ))}
            </div>

            {[
              { dir: -1, Icon: ChevronLeft, label: "Previous frame", side: "left-3" },
              { dir: 1, Icon: ChevronRight, label: "Next frame", side: "right-3" },
            ].map(({ dir, Icon, label, side }) => (
              <button
                key={label}
                type="button"
                onClick={() => go(active + dir)}
                aria-label={label}
                className={cn(
                  "absolute top-1/2 -translate-y-1/2 rounded-full border border-white/25 bg-black/45 p-3 text-white backdrop-blur-sm transition",
                  "hover:border-white/60 hover:bg-black/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70",
                  // Visible on touch, and on hover or keyboard focus at desktop.
                  "opacity-100 md:opacity-0 md:group-hover/strip:opacity-100 md:group-focus-within/strip:opacity-100",
                  side,
                )}
              >
                <Icon className="size-5" aria-hidden="true" />
              </button>
            ))}
          </div>

          {/* Caption + counter */}
          <div
            className={cn(
              "mt-4 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-t pt-4",
              dark ? "border-white/15" : "border-border",
            )}
          >
            <span
              className={cn("type-body", dark ? "text-[color:var(--brand-ice)]/70" : "text-muted")}
            >
              {current.label ?? current.alt}
            </span>
            <span className="type-index shrink-0" style={{ color: rule }}>
              {String(active + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
            </span>
          </div>

          {/* Thumbnail rail */}
          <div
            ref={railRef}
            className="mt-6 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:thin]"
          >
            {frames.map((frame, i) => (
              <button
                key={frame.key}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Frame ${i + 1}`}
                aria-current={i === active}
                className={cn(
                  "relative aspect-video w-24 shrink-0 overflow-hidden bg-[#0a0a0d] transition",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                  i === active ? "opacity-100" : "opacity-40 hover:opacity-80",
                )}
                style={
                  i === active ? { outline: `2px solid ${rule}`, outlineOffset: "1px" } : undefined
                }
              >
                <Image
                  src={frame.src}
                  alt=""
                  fill
                  sizes="96px"
                  loading="lazy"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
