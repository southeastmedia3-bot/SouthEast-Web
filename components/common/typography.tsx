import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

export function Lead({ className, ...props }: ComponentPropsWithoutRef<"p">) {
  return <p className={cn("type-body-lg max-w-[64ch] text-muted", className)} {...props} />;
}

export function Kicker({ className, ...props }: ComponentPropsWithoutRef<"p">) {
  return <p className={cn("type-label text-accent", className)} {...props} />;
}
