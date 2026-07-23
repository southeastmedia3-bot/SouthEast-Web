"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useMotionValue } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Container } from "@/components/common/container";
import { Reveal } from "@/components/common/reveal";
import { filmsAssets } from "@/data/media";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

const PROGRAMME = filmsAssets.programme;

/**
 * The screening room — one projector, one programme, one film at a time.
 *
 * Same economics as the Animation page's reel theater and a deliberately
 * different room. There, the playlist is a contents column beside the stage and
 * the section reads as a studio's showreel index. Here the stage is the whole
 * width of the page with the programme laid out beneath it as a printed running
 * order — a cinema listing, not a sidebar — because this is the division that
 * shoots for a screen rather than a player.
 *
 * ONLY ONE FILM IS EVER MOUNTED. The `<video>` is keyed on the selection, so a
 * visitor who watches four films has downloaded four rather than all eight at
 * once — which is what a wall of autoplaying tiles costs whether or not anyone
 * watches them. An observer pauses the stage the moment it leaves the viewport,
 * so nothing runs off-screen or in a background tab.
 *
 * The film is contained inside the stage, never cropped to fill it. The
 * programme mixes masters that were framed differently, and a player that crops
 * to its own shape would cut the top and bottom off half the work. Pillarbox on
 * black is what a projector does; cropping is what a frame must never do.
 *
 * Under reduced motion nothing autoplays: the poster stands and the stage carries
 * native controls, so every film in the programme is still reachable.
 */
export function FilmsScreeningRoom({ id, rule }: { id?: string; rule: string }) {
  const reducedMotion = useReducedMotion();
  const [active, setActive] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const railRef = useRef<HTMLDivElement | null>(null);
  const progress = useMotionValue(0);

  const count = PROGRAMME.length;
  const film = PROGRAMME[active]!;

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

  // The playhead, driven off `timeupdate` into a motion value rather than state,
  // so a bar that moves four times a second never re-renders the section.
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
   * Keep the selected entry in the running order when the transport moves past
   * the fold — and only then. An entry already fully visible is left where it is,
   * because centring unconditionally scrolls the list on first paint, before
   * anyone has touched anything.
   *
   * MEASURED WITH RECTS, NOT `offsetLeft`: `offsetLeft` is relative to the
   * nearest *positioned* ancestor, and this rail is not positioned. Rect deltas
   * fed to `scrollBy` are relative by construction.
   */
  useEffect(() => {
    const rail = railRef.current;
    const item = rail?.children[active] as HTMLElement | undefined;
    if (!rail || !item) return;
    if (rail.scrollWidth <= rail.clientWidth + 1) return;

    const railBox = rail.getBoundingClientRect();
    const itemBox = item.getBoundingClientRect();
    if (itemBox.left >= railBox.left && itemBox.right <= railBox.right) return;

    rail.scrollBy({
      left: itemBox.left - railBox.left - (railBox.width - itemBox.width) / 2,
      behavior: "smooth",
    });
  }, [active]);

  return (
    <section id={id} className="relative scroll-mt-36 overflow-hidden bg-[#050506] py-20 md:py-28">
      {/* The beam the projector throws into the room, pooled above the stage. */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[42rem]"
        style={{
          background: "radial-gradient(52% 44% at 50% 8%, rgba(198,150,59,0.16), transparent 72%)",
        }}
        aria-hidden="true"
      />

      <Container size="xl" className="relative">
        <Reveal>
          <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="block h-[2px] w-10" style={{ background: rule }} aria-hidden="true" />
            <h2 className="type-h3 text-[var(--ink-frame-foreground)]">The programme</h2>
            <span className="type-index text-[color:var(--brand-ice)]/60">{count} films</span>
          </div>
          <p className="type-body mb-12 max-w-2xl text-[color:var(--brand-ice)]/60">
            Ad films, brand films and tabletop work — playing, not described. One projector: pick a
            title and the rest wait their turn.
          </p>
        </Reveal>

        <div
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
          {/* The stage. */}
          <div className="relative aspect-video w-full overflow-hidden bg-black ring-1 ring-white/10">
            <video
              // Keyed, so selecting a title replaces the element rather than
              // reusing one that has already buffered a different film.
              key={film.key}
              ref={videoRef}
              className="absolute inset-0 h-full w-full object-contain"
              muted
              loop
              playsInline
              preload="metadata"
              poster={film.src}
              controls={reducedMotion}
              aria-label={film.alt}
            >
              <source src={film.video} type="video/mp4" />
            </video>

            {/* The room's own masking, so the picture always sits inside a
                format rather than against a bare edge. */}
            <span
              className="pointer-events-none absolute inset-x-0 top-0 h-[7%] bg-[#050506]"
              aria-hidden="true"
            />
            <span
              className="pointer-events-none absolute inset-x-0 bottom-0 h-[7%] bg-[#050506]"
              aria-hidden="true"
            />

            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/80 to-transparent"
              aria-hidden="true"
            />

            <div className="pointer-events-none absolute inset-x-0 top-[7%] flex items-start justify-between p-5">
              <span className="type-caption flex items-center gap-2 rounded-full bg-black/55 px-3 py-1.5 text-[color:var(--brand-ice)]/80 backdrop-blur-sm">
                {/* The tally. Red is the one colour a camera crew reads without
                    thinking, and it appears exactly here on the whole site. */}
                <span
                  className="block size-1.5 rounded-full bg-[color:var(--brand-red)]"
                  aria-hidden="true"
                />
                NOW SHOWING
              </span>
              <span className="type-caption rounded-full bg-black/55 px-3 py-1.5 text-[color:var(--brand-ice)]/80 backdrop-blur-sm">
                {film.note}
              </span>
            </div>

            <div className="pointer-events-none absolute inset-x-0 bottom-[7%] p-5">
              <p className="type-h4 text-[1.15rem] text-[var(--ink-frame-foreground)]">
                {film.label}
              </p>
            </div>
          </div>

          {/* The transport. A strip under the stage rather than chrome floating
              over the picture — the film is never covered by its own controls. */}
          <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-white/15 pt-4">
            <span className="type-index shrink-0 text-[color:var(--brand-ice)]/70">
              {String(active + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
            </span>

            {/* The playhead. A scaleX on a line already on the page. */}
            <span
              className="order-last h-px w-full bg-white/15 sm:order-none sm:flex-1"
              aria-hidden="true"
            >
              <motion.span
                className="block h-px w-full origin-left"
                style={{ background: rule, scaleX: progress }}
              />
            </span>

            <div className="flex shrink-0 items-center gap-2">
              {[
                { dir: -1, Icon: ChevronLeft, label: "Previous film" },
                { dir: 1, Icon: ChevronRight, label: "Next film" },
              ].map(({ dir, Icon, label }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => go(active + dir)}
                  aria-label={label}
                  className="rounded-full border border-white/20 p-2.5 text-[color:var(--brand-ice)]/80 transition hover:border-white/60 hover:text-[var(--ink-frame-foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                >
                  <Icon className="size-4" aria-hidden="true" />
                </button>
              ))}
            </div>
          </div>

          {/* The running order. */}
          <div
            ref={railRef}
            role="listbox"
            aria-label="Programme"
            className="mt-8 flex gap-4 overflow-x-auto pb-2 [scrollbar-width:thin]"
          >
            {PROGRAMME.map((item, i) => (
              <button
                key={item.key}
                type="button"
                role="option"
                aria-selected={i === active}
                onClick={() => setActive(i)}
                className={cn(
                  "group/entry w-[15rem] shrink-0 border-t pt-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60",
                  i === active ? "border-transparent" : "border-white/15",
                )}
                style={i === active ? { borderColor: rule } : undefined}
              >
                <span className="flex items-baseline justify-between gap-3">
                  <span className="type-index text-[color:var(--brand-ice)]/40">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="type-caption text-[color:var(--brand-ice)]/40">{item.note}</span>
                </span>

                <span
                  className={cn(
                    "relative mt-3 block aspect-video w-full overflow-hidden bg-black transition",
                    i === active ? "opacity-100" : "opacity-50 group-hover/entry:opacity-85",
                  )}
                >
                  <Image
                    src={item.src}
                    alt=""
                    fill
                    sizes="240px"
                    loading="lazy"
                    className="object-cover"
                  />
                </span>

                <span
                  className={cn(
                    "mt-3 block truncate text-sm font-medium transition-colors",
                    i === active
                      ? "text-[var(--ink-frame-foreground)]"
                      : "text-[color:var(--brand-ice)]/60",
                  )}
                >
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
