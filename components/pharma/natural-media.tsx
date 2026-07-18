"use client";

import Image from "next/image";
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
}: NaturalMediaProps) {
  const ratioSrc = poster ?? image;
  const ratio = ratioOf(ratioSrc);

  return (
    <div
      className={cn("relative w-full overflow-hidden", className)}
      style={{ aspectRatio: String(ratio) }}
    >
      {video ? (
        <video
          className={cn("absolute inset-0 h-full w-full object-cover", imgClassName)}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={ratioSrc}
        >
          <source src={video} type="video/mp4" />
        </video>
      ) : (
        <Image
          src={image}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className={cn("object-cover", imgClassName)}
        />
      )}
    </div>
  );
}
