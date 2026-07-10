import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

export function Divider({ className, ...props }: ComponentPropsWithoutRef<"hr">) {
  return <hr className={cn("border-0 border-t border-border", className)} {...props} />;
}
