import Image from "next/image";
import { cn } from "@/lib/utils";

type BrandMarkProps = {
  className?: string;
  showWordmark?: boolean;
  compact?: boolean;
  /** `light` = for dark surfaces: the wordmark is knocked out to white. */
  tone?: "dark" | "light";
};

/**
 * The brand lockup. Both pieces are cut straight from the supplied master
 * artwork (`Artboard 1@4x.png`), not redrawn: the four-panel mark and the
 * two-line wordmark are the real thing, so the geometry and the typeface are
 * exact rather than approximated with CSS and a web font.
 *
 * The master is a *stacked* lockup (mark over wordmark). It is split here into
 * mark + wordmark so they can sit side by side, which is the only arrangement
 * that reads at the height of a nav bar; the artwork itself is untouched.
 *
 * The wordmark is brand blue, which has no contrast on the black footer — hence
 * the knocked-out `light` variant, which keeps the identical letterforms (it is
 * the same alpha channel) and only repaints them white.
 */
export function BrandMark({
  className,
  showWordmark = true,
  compact = false,
  tone = "dark",
}: BrandMarkProps) {
  return (
    <span className={cn("inline-flex items-center", compact ? "gap-2" : "gap-2.5", className)}>
      <Image
        src="/brand/logo-mark.png"
        alt=""
        width={512}
        height={200}
        priority
        className={cn("w-auto shrink-0", compact ? "h-5" : "h-7")}
      />
      {showWordmark ? (
        <Image
          src={tone === "light" ? "/brand/logo-wordmark-light.png" : "/brand/logo-wordmark.png"}
          alt=""
          width={768}
          height={272}
          priority
          className={cn("w-auto shrink-0", compact ? "h-6" : "h-8")}
        />
      ) : null}
    </span>
  );
}
