"use client";

import { cn } from "@/lib/utils";

type CinematicBackdropProps = {
  /** Dominant brand tone for the light field. */
  tone?: "blue" | "sky" | "violet" | "mixed";
  /** Deepen the base for text legibility over the field. */
  dark?: boolean;
  /** Add the slow vertical render-scan sweep. */
  scan?: boolean;
  className?: string;
};

const fields: Record<
  NonNullable<CinematicBackdropProps["tone"]>,
  { a: string; b: string; c: string }
> = {
  blue: { a: "var(--brand-blue)", b: "var(--brand-sky)", c: "var(--brand-violet)" },
  sky: { a: "var(--brand-sky)", b: "var(--brand-ice)", c: "var(--brand-blue)" },
  violet: { a: "var(--brand-violet)", b: "var(--brand-blue)", c: "var(--brand-sky)" },
  mixed: { a: "var(--brand-blue)", b: "var(--brand-sky)", c: "var(--brand-gold)" },
};

/**
 * A slow-drifting field of brand-toned light — the cinematic stand-in for real
 * footage. Purely decorative and CSS-driven, so it costs nothing at runtime and
 * freezes gracefully under `prefers-reduced-motion` (handled in globals.css).
 * Sits behind content as an absolute layer; parent controls sizing.
 */
export function CinematicBackdrop({
  tone = "blue",
  dark = true,
  scan = false,
  className,
}: CinematicBackdropProps) {
  const field = fields[tone];

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 -z-10 overflow-hidden",
        scan && "cine-scan",
        className,
      )}
      aria-hidden="true"
    >
      {dark ? <div className="absolute inset-0 bg-[#05070d]" /> : null}

      <div
        className="cine-blob cine-blob--1 left-[-10%] top-[-15%] h-[55vh] w-[55vh]"
        style={{
          background: `radial-gradient(circle at 50% 50%, color-mix(in srgb, ${field.a} 68%, transparent), transparent 68%)`,
        }}
      />
      <div
        className="cine-blob cine-blob--2 right-[-12%] top-[10%] h-[60vh] w-[60vh]"
        style={{
          background: `radial-gradient(circle at 50% 50%, color-mix(in srgb, ${field.b} 60%, transparent), transparent 66%)`,
        }}
      />
      <div
        className="cine-blob cine-blob--3 bottom-[-20%] left-[25%] h-[65vh] w-[65vh]"
        style={{
          background: `radial-gradient(circle at 50% 50%, color-mix(in srgb, ${field.c} 55%, transparent), transparent 70%)`,
        }}
      />

      {/* fine grain + a top-and-bottom vignette so overlaid type stays crisp */}
      <div className="grain absolute inset-0 opacity-[0.6]" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(5,7,13,0.55) 0%, rgba(5,7,13,0.1) 32%, rgba(5,7,13,0.2) 68%, rgba(5,7,13,0.78) 100%)",
        }}
      />
    </div>
  );
}
