import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

type CardProps = ComponentPropsWithoutRef<"article"> & {
  variant?: "default" | "glass" | "elevated" | "interactive";
};

const variants = {
  default: "bg-card shadow-[inset_0_1px_0_rgba(255,255,255,0.045)]",
  glass: "bg-white/[0.045] shadow-[inset_0_1px_0_rgba(255,255,255,0.055)] backdrop-blur-2xl",
  elevated: "bg-surface-elevated shadow-[0_22px_70px_rgba(0,0,0,0.28)]",
  interactive:
    "bg-white/[0.04] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition duration-500 hover:-translate-y-1 hover:bg-white/[0.058] hover:shadow-[0_22px_72px_rgba(0,0,0,0.24)]",
} as const;

export function Card({ className, variant = "default", ...props }: CardProps) {
  return (
    <article className={cn("rounded-[1.5rem] p-7", variants[variant], className)} {...props} />
  );
}

export function ImagePlaceholder({ className, ...props }: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={cn(
        "brand-panel-rhythm aspect-video overflow-hidden rounded-[1.5rem] shadow-[inset_0_1px_0_rgba(255,255,255,0.055)] before:block before:h-full before:w-full before:bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.12),transparent_32%),radial-gradient(circle_at_80%_70%,rgba(54,161,223,0.08),transparent_34%)]",
        className,
      )}
      aria-hidden="true"
      {...props}
    />
  );
}
