"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useMotionValue } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Container } from "@/components/common/container";
import { Reveal } from "@/components/common/reveal";
import { animationAssets } from "@/data/media";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

const REELS = animationAssets.reels;

/**
 * The reel theater — one player, one playlist, one film at a time.
 *
 * The reference this page is measured against puts its showreels in a grid of
 * YouTube embeds, which is six players, six third-party requests and no idea
 * where a visitor should look. This is the opposite bet: a single stage that the
 * whole section is built around, and a rail that says what else there is.
 *
 * ONLY ONE FILM IS EVER MOUNTED. Selecting a reel remounts the `<video>` (it is
 * keyed on the index), so a visitor who watches four reels has downloaded four
 * films rather than all eight at once — which is what a wall of autoplaying tiles
 * costs whether or not anyone watches them. The observer pauses the stage the
 * moment it leaves the viewport, so nothing runs off-screen or in a background
 * tab either.
 *
 * The stage is a fixed 16:9 with the film contained inside it, not cropped to
 * fill: the playlist deliberately mixes square masters with widescreen ones, and
 * a player that crops to its own shape would cut the top and bottom off half the
 * work. Pillarbox on black is what a player does; cropping is what a frame must
 * never do.
 *
 * Under reduced motion nothing autoplays — the poster stands and the stage
 * carries native controls, so every film is still reachable.
 */
export function AnimationReelTheater({ id, rule }: { id?: string; rule: string }) {
  const reducedMotion = useReducedMotion();
  const [active, setActive] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const railRef = useRef<HTMLDivElement | null>(null);
  const progress = useMotionValue(0);

  const count = REELS.length;
  const reel = REELS[active]!;

  const go = useCallback((next: number) => setActive(((next % count) + count) % count), [count]);

  // Play only while the stage is on screen. Re-runs on every selection because
  // the element itself is replaced — observing the previous, detached node is
  // exactly how a swapped film ends up frozen on its poster.
  useEffect(() => {
    if (reducedMotion) return;
    const video = videoRef.current;
    if (!video) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.2, rootMargin: "200px" },
    );
    io.observe(video);
    return () => io.disconnect();
  }, [active, reducedMotion]);

  // The playhead. Driven off `timeupdate` into a motion value rather than state,
  // so a bar that moves four times a second does not re-render the section.
  useEffect(() => {
    progress.set(0);
    const video = videoRef.current;
    if (!video) return;

    const onTime = () => {
      if (video.duration > 0) progress.set(video.currentTime / video.duration);
    };
    video.addEventListener("timeupdate", onTime);
    return () => video.removeEventListener("timeupdate", onTime);
  }, [active, progress]);

  /**
   * Keep the selected reel in the rail when the arrows or keys move past the
   * fold — and only then. A reel already fully visible is left where it is,
   * because centring unconditionally scrolls the top of the list away on first
   * paint, before anyone has touched anything.
   *
   * MEASURED WITH RECTS, NOT `offsetTop`. `offsetTop` is relative to the nearest
   * *positioned* ancestor, and this rail is not positioned — so it reported the
   * item's distance from somewhere up the page, every reel looked out of view,
   * and the rail scrolled itself to the bottom on mount. Rect deltas fed to
   * `scrollBy` are relative by construction and cannot be wrong about which
   * element they are relative to.
   */
  useEffect(() => {
    const rail = railRef.current;
    const item = rail?.children[active] as HTMLElement | undefined;
    if (!rail || !item) return;

    const railBox = rail.getBoundingClientRect();
    const itemBox = item.getBoundingClientRect();
    const horizontal = rail.scrollWidth > rail.clientWidth + 1;

    if (horizontal) {
      if (itemBox.left >= railBox.left && itemBox.right <= railBox.right) return;
      const left = itemBox.left - railBox.left - (railBox.width - itemBox.width) / 2;
      rail.scrollBy({ left, behavior: "smooth" });
      return;
    }

    if (rail.scrollHeight <= rail.clientHeight + 1) return;
    if (itemBox.top >= railBox.top && itemBox.bottom <= railBox.bottom) return;
    const top = itemBox.top - railBox.top - (railBox.height - itemBox.height) / 2;
    rail.scrollBy({ top, behavior: "smooth" });
  }, [active]);

  return (
    <section id={id} className="scroll-mt-36 bg-[#08080b] py-20 md:py-28">
      <Container size="xl">
        <Reveal>
          <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="block h-[2px] w-10" style={{ background: rule }} aria-hidden="true" />
            <h2 className="type-h3 text-[var(--ink-frame-foreground)]">The reel</h2>
            <span className="type-index text-[color:var(--brand-ice)]/60">{count} films</span>
          </div>
          <p className="type-body mb-12 max-w-2xl text-[color:var(--brand-ice)]/60">
            Character work, explainers, brand builds and abstract motion — playing, not described.
            Pick one; the rest wait their turn.
          </p>
        </Reveal>

        <div
          className="grid gap-x-8 gap-y-6 lg:grid-cols-[minmax(0,1fr)_21rem]"
          onKeyDown={(e) => {
            if (e.key === "ArrowRight" || e.key === "ArrowDown") {
              e.preventDefault();
              go(active + 1);
            }
            if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
              e.preventDefault();
              go(active - 1);
            }
          }}
        >
          {/* Stage */}
          <div className="group/stage relative">
            <div className="relative aspect-video w-full overflow-hidden rounded-[1.25rem] bg-black ring-1 ring-white/12">
              <video
                // Keyed, so selecting a reel replaces the element rather than
                // reusing one that has already buffered a different film.
                key={reel.key}
                ref={videoRef}
                className="absolute inset-0 h-full w-full object-contain"
                muted
                loop
                playsInline
                preload="metadata"
                poster={reel.src}
                controls={reducedMotion}
                aria-label={reel.alt}
              >
                <source src={reel.video} type="video/mp4" />
              </video>

              {/* Gate marks. The frame the studio is looking through, not chrome. */}
              {(
                [
                  "left-4 top-4 border-l border-t",
                  "right-4 top-4 border-r border-t",
                  "left-4 bottom-4 border-b border-l",
                  "right-4 bottom-4 border-b border-r",
                ] as const
              ).map((pos) => (
                <span
                  key={pos}
                  className={cn("pointer-events-none absolute size-5 border-white/25", pos)}
                  aria-hidden="true"
                />
              ))}

              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/75 to-transparent"
                aria-hidden="true"
              />

              <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-5">
                <span className="type-caption rounded-full bg-black/55 px-3 py-1.5 text-[color:var(--brand-ice)]/80 backdrop-blur-sm">
                  REEL {String(active + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
                </span>
                <span className="type-caption rounded-full bg-black/55 px-3 py-1.5 text-[color:var(--brand-ice)]/80 backdrop-blur-sm">
                  {reel.note}
                </span>
              </div>

              <div className="pointer-events-none absolute inset-x-0 bottom-0 p-5">
                <p className="type-h4 text-[1.15rem] text-[var(--ink-frame-foreground)]">
                  {reel.label}
                </p>
                {/* The playhead. A scaleX on a line already on the page. */}
                <span className="mt-3 block h-px w-full bg-white/20" aria-hidden="true">
                  <motion.span
                    className="block h-px w-full origin-left"
                    style={{ background: rule, scaleX: progress }}
                  />
                </span>
              </div>
            </div>

            {[
              { dir: -1, Icon: ChevronLeft, label: "Previous reel", side: "left-3" },
              { dir: 1, Icon: ChevronRight, label: "Next reel", side: "right-3" },
            ].map(({ dir, Icon, label, side }) => (
              <button
                key={label}
                type="button"
                onClick={() => go(active + dir)}
                aria-label={label}
                className={cn(
                  "absolute top-1/2 -translate-y-1/2 rounded-full border border-white/25 bg-black/45 p-3 text-white backdrop-blur-sm transition",
                  "hover:border-white/60 hover:bg-black/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70",
                  "opacity-100 md:opacity-0 md:group-hover/stage:opacity-100 md:group-focus-within/stage:opacity-100",
                  side,
                )}
              >
                <Icon className="size-5" aria-hidden="true" />
              </button>
            ))}
          </div>

          {/* Playlist. A column beside the stage on desktop, a scroller under it
              on anything narrower — the rail is a contents page, not a grid. */}
          <div
            ref={railRef}
            role="listbox"
            aria-label="Reels"
            className="flex gap-3 overflow-x-auto pb-2 lg:max-h-[34rem] lg:flex-col lg:gap-1.5 lg:overflow-y-auto lg:overflow-x-hidden lg:pb-0 lg:pr-1 [scrollbar-width:thin]"
          >
            {REELS.map((item, i) => (
              <button
                key={item.key}
                type="button"
                role="option"
                aria-selected={i === active}
                onClick={() => setActive(i)}
                className={cn(
                  "group/reel flex w-56 shrink-0 flex-col gap-2.5 rounded-xl p-2 text-left transition lg:w-full lg:flex-row lg:items-center lg:gap-3.5",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60",
                  i === active ? "bg-white/[0.07]" : "hover:bg-white/[0.04]",
                )}
              >
                <span
                  className={cn(
                    "relative aspect-video w-full shrink-0 overflow-hidden rounded-md bg-black transition lg:w-24",
                    i === active ? "opacity-100" : "opacity-55 group-hover/reel:opacity-90",
                  )}
                >
                  <Image
                    src={item.src}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 96px, 224px"
                    loading="lazy"
                    className="object-cover"
                  />
                  {i === active ? (
                    <span
                      className="absolute inset-y-0 left-0 w-[3px]"
                      style={{ background: rule }}
                      aria-hidden="true"
                    />
                  ) : null}
                </span>

                <span className="min-w-0">
                  <span className="type-index block text-[color:var(--brand-ice)]/35">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={cn(
                      "mt-1 block truncate text-sm font-medium transition-colors",
                      i === active
                        ? "text-[var(--ink-frame-foreground)]"
                        : "text-[color:var(--brand-ice)]/65",
                    )}
                  >
                    {item.label}
                  </span>
                  <span className="type-caption mt-0.5 block truncate text-[color:var(--brand-ice)]/40">
                    {item.note}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
