import type { ComponentPropsWithoutRef } from "react";
import Image from "next/image";
import { LazyLoopVideo } from "@/components/media/lazy-loop-video";
import { cn } from "@/lib/utils";

type MediaFrameProps = ComponentPropsWithoutRef<"div"> & {
  tone?: "sky" | "blue" | "gold" | "violet";
  ratio?: "portrait" | "wide" | "square" | "tall";
  src?: string;
  /** Optional autoplay-muted loop that fills the frame (takes priority over src). */
  video?: string;
  /** Poster still for the video / first-paint. */
  poster?: string;
  alt?: string;
  sizes?: string;
  priority?: boolean;
};

const tones = {
  sky: "linear-gradient(150deg, #1c3f57 0%, #0d1e2a 60%, #08131b 100%)",
  blue: "linear-gradient(150deg, #17335c 0%, #0b1a30 60%, #070f1c 100%)",
  gold: "linear-gradient(150deg, #4a3a20 0%, #241a0e 60%, #140f08 100%)",
  violet: "linear-gradient(150deg, #2c2447 0%, #17132a 60%, #0d0b18 100%)",
} as const;

const ratios = {
  portrait: "aspect-[4/5]",
  wide: "aspect-[16/9]",
  square: "aspect-square",
  tall: "aspect-[3/4]",
} as const;

/**
 * The frame real photography/video will fill. Reserves the correct aspect
 * ratio for its slot; renders a looping video when `video` is supplied, a
 * reference image when `src` is supplied, or a toned gradient placeholder
 * otherwise. Never a flat gray box.
 */
export function MediaFrame({
  tone = "sky",
  ratio = "wide",
  src,
  video,
  poster,
  alt = "",
  sizes = "90vw",
  priority = false,
  className,
  ...props
}: MediaFrameProps) {
  const hasMedia = Boolean(video || src);

  return (
    <div
      className={cn("relative isolate overflow-hidden rounded-[0.35rem]", ratios[ratio], className)}
      style={hasMedia ? undefined : { backgroundImage: tones[tone] }}
      aria-hidden={hasMedia ? undefined : "true"}
      {...props}
    >
      {video ? (
        // Deliberately not an inline <video autoPlay>. That fetched the file on
        // mount, so every loop on a page downloaded before anyone scrolled to it.
        <LazyLoopVideo src={video} poster={poster} />
      ) : src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          className="object-cover"
          priority={priority}
        />
      ) : (
        // Placeholder-only flourish: a soft off-center key light so empty
        // frames read as "cinematic, awaiting grade" rather than blank.
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 90% at 28% 18%, rgba(255,255,255,0.10), transparent 46%)",
          }}
        />
      )}
      <div className="grain absolute inset-0" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.08),transparent_38%)]" />
    </div>
  );
}
