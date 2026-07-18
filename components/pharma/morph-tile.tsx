"use client";

import { MediaFill } from "@/components/pharma/media-fill";
import { cn } from "@/lib/utils";

type MorphTileProps = {
  /** Resting label, and the card heading on hover. */
  title: string;
  /** Small category eyebrow on the hover card. */
  kicker: string;
  /** Short line explaining the subject, shown on the hover card. */
  sub: string;
  image: string;
  video?: string;
  poster?: string;
  /** Optional disease-state chips (the multi-state atlas subjects). */
  states?: readonly string[];
  /** Morph radius — scaled to the tile so it reads as the mark, not a lozenge. */
  corner?: string;
  sizes?: string;
  /** Sizing / aspect / grid-span for the tile. */
  className?: string;
  priority?: boolean;
};

/**
 * A frame that turns into the mark. The pharma page's shared tile: point at it and
 * the rectangle's corners sweep into the studio's own logo silhouette
 * (`.brand-shape-morph`), the render scales and fades, and a white card turns over
 * with a short line explaining the subject — the homepage discipline-wall
 * interaction, applied to stills and loops alike.
 *
 * The renders are a mixed bag — landscape, portrait and square, some on white and
 * some on black ground. So the subject is shown **contained** (never cropped, per
 * the brief) and the tile is filled behind it with a blurred, darkened copy of the
 * same frame. Every tile then reads as one cohesive object regardless of the
 * source's shape or ground — no letterbox bars, no clashing rectangle.
 *
 * Presentational only; wrap it in the section's own reveal/motion.
 */
export function MorphTile({
  title,
  kicker,
  sub,
  image,
  video,
  poster,
  states,
  corner = "3.25rem",
  sizes = "(min-width: 1024px) 32vw, 90vw",
  className,
  priority = false,
}: MorphTileProps) {
  return (
    <div
      className={cn("group relative", className)}
      style={{ "--corner": corner } as React.CSSProperties}
    >
      {/* overflow-hidden + the morphing radius is what makes the tile take the
          shape of the mark. */}
      <div className="brand-shape-morph relative h-full w-full overflow-hidden bg-[#05070d]">
        <MediaFill
          image={image}
          video={video}
          poster={poster}
          alt={title}
          sizes={sizes}
          priority={priority}
          subjectClassName="transition-[transform,opacity] duration-700 ease-out group-hover:scale-[1.04] group-hover:opacity-0 group-focus-visible:opacity-0"
        />

        {/* Resting: just the name over a soft scrim. */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-black/10 transition-opacity duration-500 group-hover:opacity-0 group-focus-visible:opacity-0"
          aria-hidden="true"
        />
        <div className="absolute inset-x-0 bottom-0 p-5 transition-opacity duration-300 group-hover:opacity-0 group-focus-visible:opacity-0">
          <p className="type-h4 text-[1.05rem] text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)]">
            {title}
          </p>
        </div>

        {/* Hover: the card, inside the same clipped box, so it inherits the shape.
            Content is centred so short entries fill the frame rather than leaving a
            blank lower half. */}
        <div className="absolute inset-0 flex flex-col justify-center bg-white p-5 opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100 md:p-6">
          <p className="type-label text-[color:var(--brand-blue)]">{kicker}</p>
          <h3 className="type-h4 mt-3 max-w-[22ch] text-balance text-[1.05rem] text-foreground">
            {title}
          </h3>
          <p className="type-caption mt-2.5 max-w-[42ch] text-muted">{sub}</p>
          {states?.length ? (
            <ul className="mt-4 flex flex-wrap gap-2">
              {states.map((s) => (
                <li
                  key={s}
                  className="rounded-full border border-border-strong px-2.5 py-1 text-xs font-medium text-foreground"
                >
                  {s}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>

      {/* The rule that traces the silhouette the frame morphed into. */}
      <span
        className="brand-shape-morph pointer-events-none absolute inset-0 border-2 border-transparent transition-colors duration-500 group-hover:border-[rgba(21,20,26,0.5)] group-focus-visible:border-[color:var(--brand-sky)]"
        aria-hidden="true"
      />
    </div>
  );
}
