import { cn } from "@/lib/utils";

type MarqueeProps = {
  items: string[];
  /** Seconds for one full loop. Lower = faster. */
  duration?: number;
  className?: string;
};

/**
 * An infinite horizontal scroller for disciplines / capability tags. The track
 * is doubled and translated -50%, so the loop is seamless. Pauses on hover and
 * freezes under reduced motion (both handled in globals.css). Presentational —
 * safe as a Server Component.
 */
export function DisciplineMarquee({ items, duration = 42, className }: MarqueeProps) {
  // The track is translated by exactly -50%, so the two halves have to be
  // identical AND each half has to be wider than the viewport — otherwise the
  // loop runs off the end and leaves a bare strip behind it. A short list (the
  // discipline tags are five merged names now) is repeated until a half is long
  // enough to cover a wide screen; the halves stay identical either way.
  const half = items.length
    ? Array.from({ length: Math.ceil(8 / items.length) }, () => items).flat()
    : items;
  const doubled = [...half, ...half];

  return (
    <div
      className={cn(
        "marquee-mask relative overflow-hidden border-y border-border py-6",
        "[mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]",
        className,
      )}
      aria-hidden="true"
    >
      {/* Layout utilities are duplicated here on purpose: `.marquee-track` only
          needs to own the animation. If that stylesheet rule ever fails to
          apply, the children (each `display:flex`) would stack vertically. */}
      <div
        className="marquee-track flex w-max flex-nowrap items-center"
        style={{ ["--marquee-duration" as string]: `${duration}s` }}
      >
        {doubled.map((item, i) => (
          <span key={i} className="flex items-center whitespace-nowrap">
            <span className="type-label px-8 text-muted">{item}</span>
            <span className="h-1 w-1 rounded-full bg-accent/60" />
          </span>
        ))}
      </div>
    </div>
  );
}
