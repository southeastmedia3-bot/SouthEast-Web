import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

type BrandMarkProps = ComponentPropsWithoutRef<"div"> & {
  showWordmark?: boolean;
  compact?: boolean;
};

export function BrandMark({
  className,
  showWordmark = true,
  compact = false,
  ...props
}: BrandMarkProps) {
  return (
    <div className={cn("inline-flex items-center gap-3", className)} {...props}>
      <span
        className={cn("relative flex shrink-0 items-end", compact ? "h-7 w-12" : "h-9 w-16")}
        aria-hidden="true"
      >
        <span className="absolute bottom-0 left-0 h-full w-[46%] rounded-tl-[999px] rounded-br-[999px] bg-[var(--brand-violet)]" />
        <span className="absolute bottom-0 left-[28%] h-full w-[36%] rounded-br-[999px] bg-[var(--brand-blue)]" />
        <span className="absolute bottom-0 left-[53%] h-full w-[32%] rounded-br-[999px] bg-[var(--brand-sky)]" />
        <span className="absolute bottom-0 right-0 h-full w-[28%] rounded-br-[999px] bg-[var(--brand-ice)]" />
      </span>
      {/* Wordmark inherits `currentColor` so surfaces (dark hero vs. frosted
          header vs. footer) can set it — never hardcode a colour here. */}
      {showWordmark ? (
        <span className="leading-none text-current">
          <span className="block text-sm font-black tracking-[-0.02em]">Southeast</span>
          <span className="block text-sm font-black tracking-[-0.02em] opacity-90">media</span>
        </span>
      ) : null}
    </div>
  );
}
