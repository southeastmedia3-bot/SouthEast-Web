import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

export function Stack({ className, ...props }: ComponentPropsWithoutRef<"div">) {
  return <div className={cn("flex flex-col gap-6", className)} {...props} />;
}
