import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SpecimenPlateProps = {
  /** Two-digit plate number, e.g. "01". */
  index?: string;
  /** The plate's subject, set as a mono overline. */
  label: string;
  /** Optional right-aligned meta (technique, count, ethnicity set…). */
  meta?: string;
  /** Extra classes — usually the aspect ratio for the plate. */
  className?: string;
  /** The render. Sits on the plate's own white ground; the frame is drawn around it. */
  children: ReactNode;
};

/**
 * A "specimen plate" — the studio frame the pharma page uses for its white-ground
 * renders (the family, the systems library, the body-type variants).
 *
 * The deck renders ship on a white ground, so a tinted card leaves a hard seam and
 * a bare white box reads as unfinished. This frames the white instead of fighting
 * it: registration ticks at the corners, a mono index + label overline on a
 * hairline rule, optional meta. The generous margin around each figure stops
 * reading as dead space and starts reading as a catalogued studio capture — and it
 * ties these light sections to the mono index/caption language the dark atlas and
 * anatomy sections already speak.
 *
 * Every mark lands on the render's own white margin, so nothing overlaps the
 * subject and there is no colour clash with the baked-in background.
 */
export function SpecimenPlate({ index, label, meta, className, children }: SpecimenPlateProps) {
  return (
    <div
      className={cn(
        "group/plate relative w-full overflow-hidden rounded-[1.5rem] border border-border bg-white",
        "shadow-[0_40px_90px_-55px_rgba(21,20,26,0.45)]",
        className,
      )}
    >
      {/* The render. */}
      {children}

      {/* Frame furniture — drawn over the white margin, never over the subject. */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {/* Corner registration ticks. */}
        <span className="absolute left-3.5 top-3.5 h-3.5 w-3.5 border-l border-t border-[rgba(21,20,26,0.28)]" />
        <span className="absolute right-3.5 top-3.5 h-3.5 w-3.5 border-r border-t border-[rgba(21,20,26,0.28)]" />
        <span className="absolute bottom-3.5 left-3.5 h-3.5 w-3.5 border-b border-l border-[rgba(21,20,26,0.28)]" />
        <span className="absolute bottom-3.5 right-3.5 h-3.5 w-3.5 border-b border-r border-[rgba(21,20,26,0.28)]" />

        {/* Overline: index · label ———— meta, on a hairline rule. */}
        <div className="absolute inset-x-6 top-6 flex items-center gap-3 sm:top-7">
          {index ? (
            <span className="type-index shrink-0 text-[color:var(--brand-blue)]">{index}</span>
          ) : null}
          <span className="type-label shrink-0 text-[color:var(--muted-foreground)]">{label}</span>
          <span className="h-px flex-1 bg-[rgba(21,20,26,0.12)]" />
          {meta ? (
            <span className="type-caption hidden shrink-0 text-[color:var(--muted)] sm:block">
              {meta}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
