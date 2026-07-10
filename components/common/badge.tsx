import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

export function Badge({ className, ...props }: ComponentPropsWithoutRef<"span">) {
  return (
    <span
      className={cn(
        "type-label inline-flex items-center rounded-full bg-white/[0.045] px-4 py-1.5 text-muted-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.055)] backdrop-blur-xl",
        className,
      )}
      {...props}
    />
  );
}

export const Tag = Badge;
