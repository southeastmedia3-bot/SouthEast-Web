import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

type GridProps = ComponentPropsWithoutRef<"div"> & {
  columns?: "auto" | 2 | 3 | 4;
};

const columnsMap = {
  auto: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  2: "grid-cols-1 md:grid-cols-2",
  3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
} as const;

export function Grid({ className, columns = "auto", ...props }: GridProps) {
  return <div className={cn("grid gap-6", columnsMap[columns], className)} {...props} />;
}
