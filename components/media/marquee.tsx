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
  const doubled = [...items, ...items];

  return (
    <div
      className={cn(
        "marquee-mask relative overflow-hidden border-y border-border py-6",
        "[mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]",
        className,
      )}
      aria-hidden="true"
    >
      <div className="marquee-track" style={{ ["--marquee-duration" as string]: `${duration}s` }}>
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
