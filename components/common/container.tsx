import type { ComponentPropsWithoutRef } from "react";
import { designTokens } from "@/constants/design";
import { cn } from "@/lib/utils";

type ContainerProps = ComponentPropsWithoutRef<"div"> & {
  size?: keyof typeof designTokens.containers;
  bleed?: boolean;
};

export function Container({ className, size = "lg", bleed = false, ...props }: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full",
        designTokens.containers[size],
        !bleed && designTokens.spacing.gutter,
        className,
      )}
      {...props}
    />
  );
}
