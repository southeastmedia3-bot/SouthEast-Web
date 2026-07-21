"use client";

import { useEffect, useRef, useState } from "react";
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
  const hostRef = useRef<HTMLDivElement | null>(null);
  const ref = useRef<HTMLVideoElement | null>(null);
  const reducedMotion = useReducedMotion();
  const playable = Boolean(src) && !reducedMotion;

  // Visibility is React state, not a CSS attribute selector and not a classList
  // mutation. An earlier version used `[&:not([paused])]` — `paused` is a DOM
  // property and never a rendered attribute, so that selector always matched and
  // the video sat permanently opaque over the poster.
  const [showing, setShowing] = useState(false);

  /**
   * Native listeners, not React's `onPointerEnter`.
   *
   * `pointerenter` does not bubble, so React synthesises it from bubbling
   * pointer events — and on these cards it never fired: hovering played nothing
   * while a direct `play()` on the same element worked immediately. Binding the
   * real events removes the guesswork. `focusin`/`focusout` are used rather than
   * focus/blur for the same reason: they bubble, so tabbing to the link inside
   * this container reaches us.
   */
  useEffect(() => {
    const host = hostRef.current;
    if (!host || !playable) return;

    const play = () => ref.current?.play().catch(() => {});
    const stop = () => {
      const v = ref.current;
      if (!v) return;
      v.pause();
      v.currentTime = 0;
      setShowing(false);
    };

    host.addEventListener("pointerenter", play);
    host.addEventListener("pointerleave", stop);
    host.addEventListener("focusin", play);
    host.addEventListener("focusout", stop);
    return () => {
      host.removeEventListener("pointerenter", play);
      host.removeEventListener("pointerleave", stop);
      host.removeEventListener("focusin", play);
      host.removeEventListener("focusout", stop);
    };
  }, [playable]);

  return (
    <div ref={hostRef} className={cn("relative overflow-hidden", className)}>
      <Image src={poster} alt={alt} fill sizes={sizes} className="object-cover" />
      {playable ? (
        <video
          ref={ref}
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-500",
            showing ? "opacity-100" : "opacity-0",
          )}
          muted
          loop
          playsInline
          // Nothing is fetched until a visitor points at the card. Seven films on
          // an index page would otherwise be seven downloads nobody asked for.
          preload="none"
          aria-hidden="true"
          // Only reveal once frames are actually decoding, so the card never
          // cuts to an empty box while the file is still opening.
          onPlaying={() => setShowing(true)}
        >
          <source src={src} type="video/mp4" />
        </video>
      ) : null}
    </div>
  );
}
