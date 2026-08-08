"use client";

import { useInViewPlay } from "@/hooks/use-in-view-play";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

/**
 * A muted background loop that does not download until it is on screen.
 *
 * The lazy behaviour lives here rather than in each caller so there is one place
 * that gets it right: no `autoPlay`, `preload="none"`, and play driven by an
 * IntersectionObserver. `MediaFrame` is a server component and cannot hold the
 * observer itself, which is why this exists as a separate client leaf.
 *
 * Under reduced motion the hook never starts it, so the poster stands in. Where
 * the film is the content, that alone would put it out of reach, so native
 * `controls` appear and the visitor chooses when to watch. A `decorative` loop —
 * background texture behind a link, a plate under a title — opts out: it is
 * scenery, and scenery must not hand a visitor a play button, still less a
 * focusable one inside an `aria-hidden` subtree.
 *
 * `priority` is the deliberate exception to all of the above, for the one film
 * per page that carries the pitch: it fetches its header up front and starts a
 * screen early, so the hero is already running when it is scrolled to instead of
 * holding on a poster while it fetches. Deliberately `metadata` and not `auto` —
 * `auto` is an element attribute, so it would pull the whole film at page load
 * regardless of the observer, and these masters run to 16MB. With the file
 * written `+faststart`, header-then-play is near enough instant anyway. Spend it
 * once per page; used widely it puts back exactly the eager-download problem
 * this component exists to solve.
 */
export function LazyLoopVideo({
  src,
  poster,
  className,
  decorative = false,
  priority = false,
  "aria-label": ariaLabel,
}: {
  src: string;
  poster?: string;
  className?: string;
  /** Scenery rather than content: hidden from assistive tech, never given controls. */
  decorative?: boolean;
  /** Fetch the header up front and start early. For a page's signature film only. */
  priority?: boolean;
  /** Accessible name for the film. Supplied by the caller — never invented here. */
  "aria-label"?: string;
}) {
  const reducedMotion = useReducedMotion();
  const ref = useInViewPlay(true, priority ? "900px" : "100px");

  return (
    <video
      ref={ref}
      className={cn("absolute inset-0 h-full w-full object-cover", className)}
      muted
      loop
      playsInline
      preload={priority ? "metadata" : "none"}
      poster={poster}
      controls={reducedMotion && !decorative}
      aria-label={ariaLabel}
      aria-hidden={decorative ? "true" : undefined}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
