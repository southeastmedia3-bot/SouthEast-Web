"use client";

import { useRef } from "react";
import Image from "next/image";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

/**
 * A poster that becomes its film when you point at it.
 *
 * Used on the verticals index, where seven cards each have a real film behind
 * them. Autoplaying all seven would mean seven concurrent decodes on a page
 * whose job is just to route people onward — so nothing plays until a visitor
 * actually shows interest in one card, and it stops the moment they leave.
 *
 * The poster stays mounted underneath rather than being swapped for the video:
 * that way the card never flashes empty while the first frame decodes.
 *
 * Under reduced motion the video is never mounted at all — the poster is the
 * whole card, which is the correct outcome rather than a degraded one.
 */
export function HoverVideo({
  src,
  poster,
  alt,
  sizes = "(min-width: 768px) 46vw, 92vw",
  className,
}: {
  src?: string;
  poster: string;
  alt: string;
  sizes?: string;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement | null>(null);
  const reducedMotion = useReducedMotion();
  const playable = Boolean(src) && !reducedMotion;

  const play = () => {
    const v = ref.current;
    if (!v) return;
    v.play().catch(() => {});
  };
  const stop = () => {
    const v = ref.current;
    if (!v) return;
    v.pause();
    v.currentTime = 0;
  };

  return (
    <div
      className={cn("relative overflow-hidden", className)}
      onPointerEnter={playable ? play : undefined}
      onPointerLeave={playable ? stop : undefined}
      // Keyboard users get the same behaviour: the card is inside a link, so
      // focus lands here on tab and the film starts.
      onFocus={playable ? play : undefined}
      onBlur={playable ? stop : undefined}
    >
      <Image src={poster} alt={alt} fill sizes={sizes} className="object-cover" />
      {playable ? (
        <video
          ref={ref}
          className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 [&:not([paused])]:opacity-100"
          muted
          loop
          playsInline
          preload="none"
          aria-hidden="true"
          onPlaying={(e) => e.currentTarget.classList.add("opacity-100")}
          onPause={(e) => e.currentTarget.classList.remove("opacity-100")}
        >
          <source src={src} type="video/mp4" />
        </video>
      ) : null}
    </div>
  );
}
