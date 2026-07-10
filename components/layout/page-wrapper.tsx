import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

export function PageWrapper({ className, ...props }: ComponentPropsWithoutRef<"main">) {
  return <main id="main-content" className={cn("min-h-dvh pt-24", className)} {...props} />;
}
