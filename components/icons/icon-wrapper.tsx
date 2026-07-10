import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

export function IconWrapper({ className, ...props }: ComponentPropsWithoutRef<"span">) {
  return (
    <span
      className={cn(
        "inline-flex size-10 items-center justify-center rounded-md border border-border bg-surface text-accent",
        className,
      )}
      {...props}
    />
  );
}
