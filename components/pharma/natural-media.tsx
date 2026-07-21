"use client";

import Image from "next/image";
import { LazyLoopVideo } from "@/components/media/lazy-loop-video";
import { Reveal } from "@/components/common/reveal";
import { ratioOf } from "@/lib/pharma-media-dims";
import { cn } from "@/lib/utils";

type NaturalMediaProps = {
  image: string;
  video?: string;
  poster?: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
  /** object-fit for the media; cover fills exactly (box already matches ratio). */
  imgClassName?: string;
  /**
   * Explicit aspect ratio (w/h), for assets whose dimensions travel with the
   * asset itself rather than living in `lib/pharma-media-dims.ts` — the SaaS and
   * Enterprise slots in `data/media.ts` carry their own measured `w`/`h` so a
   * real file can replace a placeholder without touching any component.
   */
  ratio?: number;
  /**
   * Load immediately rather than lazily. For frames at the top of a page — the
   * still loads eagerly, and a `video` fetches its header up front and starts a
   * screen early instead of waiting to be scrolled onto.
   */
  eager?: boolean;
  /**
   * Wipe the picture in from an edge as the frame arrives.
   *
   * Belongs here rather than around the outside. Wrapping a `<NaturalMedia>` in
   * a `<Reveal clip>` puts the frame's own ground — the dark plate the box is
   * given so an undecoded image still reads as a frame — behind the curtain too,
   * so until the reveal lands there is nothing on the page at all. At the scale
   * these frames run that is a screen of white, and a slow image or a dropped
   * animation turns it into a permanent one; it is what was being reported as
   * "blank spaces" on the SaaS formats and work grids. Held inside, the plate is
   * painted the moment the box has its shape and only the picture wipes, so the
   * worst case a visitor ever sees is an empty frame where a frame goes.
   */
  reveal?: "up" | "down" | "left" | "right";
};

/**
 * A frame that takes the shape of its own image.
 *
 * The box is sized to the render's true aspect ratio, so the full image fills it
 * corner to corner — nothing cropped, nothing letterboxed, no blurred filler. This
 * is the one rule the whole pharma page follows for imagery: show the given frame,
 * whole, at the shape it was made in.
 */
export function NaturalMedia({
  image,
  video,
  poster,
  alt,
  sizes = "(min-width: 1024px) 33vw, 100vw",
  priority = false,
  className,
  imgClassName,
  ratio: explicitRatio,
  eager = false,
  reveal,
}: NaturalMediaProps) {
  const ratioSrc = poster ?? image;
  const ratio = explicitRatio ?? ratioOf(ratioSrc);

  const media = video ? (
    // Was `autoPlay` + `preload`, which downloaded every loop on the page at
    // mount. Now it loads and plays only once it is actually on screen.
    <LazyLoopVideo
      src={video}
      poster={ratioSrc}
      className={imgClassName}
      priority={eager || priority}
    />
  ) : (
    <Image
      src={image}
      alt={alt}
      fill
      priority={priority}
      {...(eager && !priority ? { loading: "eager" as const } : {})}
      sizes={sizes}
      className={cn("object-cover", imgClassName)}
    />
  );

  return (
    <div
      className={cn("relative w-full overflow-hidden", className)}
      style={{ aspectRatio: String(ratio) }}
    >
      {reveal ? (
        <Reveal clip={reveal} y={0} duration={0.95} className="absolute inset-0">
          {media}
        </Reveal>
      ) : (
        media
      )}
    </div>
  );
}
