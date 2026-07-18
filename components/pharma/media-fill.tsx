"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

type MediaFillProps = {
  image: string;
  video?: string;
  poster?: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
  /** Extra classes on the contained subject (e.g. MorphTile's hover fade). */
  subjectClassName?: string;
  /** Tune the darkening of the blurred fill (default reads as a dark tile). */
  overlayClassName?: string;
};

/**
 * The full-frame media treatment for the pharma page.
 *
 * The renders are a mixed bag — landscape, portrait, square, some on white and
 * some on black ground — so nothing sits uniformly in a fixed frame. This shows
 * the subject **contained** (in full, never cropped, per the brief) and fills the
 * frame behind it with a blurred, darkened copy of the same frame. Every panel
 * then reads as one cohesive object regardless of the source's shape or ground:
 * no letterbox bars, no clashing rectangle.
 *
 * Must sit inside a `relative overflow-hidden` parent.
 */
export function MediaFill({
  image,
  video,
  poster,
  alt,
  sizes = "(min-width: 1024px) 32vw, 90vw",
  priority = false,
  subjectClassName,
  overlayClassName,
}: MediaFillProps) {
  const fill = poster ?? image;
  return (
    <>
      {/* Ambient fill: a blurred, darkened copy so the contained subject never
          sits against an empty bar or a clashing ground. */}
      <Image
        src={fill}
        alt=""
        aria-hidden="true"
        fill
        sizes={sizes}
        className="scale-125 object-cover blur-2xl"
      />
      <div className={cn("absolute inset-0 bg-[#05070d]/55", overlayClassName)} aria-hidden="true" />

      {/* The subject, shown in full. */}
      {video ? (
        <video
          className={cn("absolute inset-0 h-full w-full object-contain", subjectClassName)}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={fill}
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
          className={cn("object-contain", subjectClassName)}
        />
      )}
    </>
  );
}
