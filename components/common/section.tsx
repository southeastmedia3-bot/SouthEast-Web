import type { ComponentPropsWithoutRef } from "react";
import { designTokens } from "@/constants/design";
import { cn } from "@/lib/utils";

type SectionProps = ComponentPropsWithoutRef<"section"> & {
  compact?: boolean;
};

export function Section({ className, compact = false, ...props }: SectionProps) {
  return (
    <section
      className={cn(
        compact ? designTokens.spacing.sectionCompact : "py-28 md:py-36 lg:py-44",
        className,
      )}
      {...props}
    />
  );
}
