import type { ComponentPropsWithoutRef } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function FeatureList({ className, ...props }: ComponentPropsWithoutRef<"ul">) {
  return <ul className={cn("grid gap-3 text-muted", className)} {...props} />;
}

export function FeatureListItem({ className, children, ...props }: ComponentPropsWithoutRef<"li">) {
  return (
    <li className={cn("flex gap-3", className)} {...props}>
      <Check className="mt-1 size-4 shrink-0 text-accent" aria-hidden="true" />
      <span>{children}</span>
    </li>
  );
}
