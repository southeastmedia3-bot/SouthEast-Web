"use client";

import Image from "next/image";
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
 * A frame that turns into the mark. The pharma page's shared version of the
 * homepage discipline-wall tile: point at it and the rectangle's corners sweep
 * into the studio's own logo silhouette (`.brand-shape-morph`), the render scales
 * and fades, and a white card turns over in its place — a short line naming and
 * explaining the subject. Carries both stills and looping video, so the atlas
 * grid and the head studies all speak the same interaction.
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
  sizes = "(min-width: 1024px) 22vw, 45vw",
  className,
  priority = false,
}: MorphTileProps) {
  return (
    <div
      className={cn("group relative", className)}
      style={{ "--corner": corner } as React.CSSProperties}
    >
      {/* overflow-hidden + the morphing radius is what makes the picture itself
          take the shape of the mark. */}
      <div className="brand-shape-morph relative h-full w-full overflow-hidden bg-[#0a0a0d]">
        {video ? (
          <video
            className="absolute inset-0 h-full w-full object-cover transition-[transform,opacity] duration-700 ease-out group-hover:scale-[1.04] group-hover:opacity-0 group-focus-visible:opacity-0"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={poster ?? image}
          >
            <source src={video} type="video/mp4" />
          </video>
        ) : (
          <Image
            src={image}
            alt={title}
            fill
            priority={priority}
            sizes={sizes}
            className="object-cover transition-[transform,opacity] duration-700 ease-out group-hover:scale-[1.04] group-hover:opacity-0 group-focus-visible:opacity-0"
          />
        )}

        {/* Resting: just the name over a soft scrim. */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent transition-opacity duration-500 group-hover:opacity-0 group-focus-visible:opacity-0"
          aria-hidden="true"
        />
        <div className="absolute inset-x-0 bottom-0 p-5 transition-opacity duration-300 group-hover:opacity-0 group-focus-visible:opacity-0">
          <p className="type-h4 text-[1.05rem] text-white">{title}</p>
        </div>

        {/* Hover: the card, inside the same clipped box, so it inherits the shape. */}
        <div className="absolute inset-0 flex flex-col justify-between bg-white p-5 opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100 md:p-6">
          <div>
            <p className="type-label text-[color:var(--brand-blue)]">{kicker}</p>
            <h3 className="type-h4 mt-3 max-w-[18ch] text-balance text-[1.05rem] text-foreground">
              {title}
            </h3>
            <p className="type-caption mt-2.5 text-muted">{sub}</p>
          </div>
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
