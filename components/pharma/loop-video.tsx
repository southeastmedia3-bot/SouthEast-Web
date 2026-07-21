"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

/**
 * A muted animation loop that only plays while it is on screen — so a page with
 * a dozen medical clips never decodes them all at once. Under reduced motion it
 * shows the poster with native controls instead of autoplaying.
 */
export function LoopVideo({
  src,
  poster,
  className,
}: {
  src: string;
  poster: string;
  className?: string;
}) {
  const reducedMotion = useReducedMotion();
  const ref = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (reducedMotion) return;
    const v = ref.current;
    if (!v) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.2 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, [reducedMotion]);

  return (
    <video
      ref={ref}
      className={cn("h-full w-full object-cover", className)}
      muted
      loop
      playsInline
      // `none`: the pharma page carries a lot of loops, and a metadata fetch per
      // film is a request for something a visitor may never reach. The observer
      // above calls play(), which is what starts the download.
      preload="none"
      poster={poster}
      controls={reducedMotion}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
