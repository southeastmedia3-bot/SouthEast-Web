"use client";

import { useInViewPlay } from "@/hooks/use-in-view-play";
import { cn } from "@/lib/utils";

/**
 * A muted background loop that does not download until it is on screen.
 *
 * The lazy behaviour lives here rather than in each caller so there is one place
 * that gets it right: no `autoPlay`, `preload="none"`, and play driven by an
 * IntersectionObserver. `MediaFrame` is a server component and cannot hold the
 * observer itself, which is why this exists as a separate client leaf.
 *
 * Under reduced motion the hook never starts it, so the poster stands in — and
 * `controls` appear so a visitor can still choose to watch.
 */
export function LazyLoopVideo({
  src,
  poster,
  className,
  controlsWhenStill = false,
}: {
  src: string;
  poster?: string;
  className?: string;
  /** Offer controls when autoplay is suppressed, so the film is still reachable. */
  controlsWhenStill?: boolean;
}) {
  const ref = useInViewPlay();

  return (
    <video
      ref={ref}
      className={cn("absolute inset-0 h-full w-full object-cover", className)}
      muted
      loop
      playsInline
      preload="none"
      poster={poster}
      controls={controlsWhenStill || undefined}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
