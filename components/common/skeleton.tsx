import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

export function Skeleton({ className, ...props }: ComponentPropsWithoutRef<"div">) {
  return <div className={cn("animate-pulse rounded-md bg-white/10", className)} {...props} />;
}

export function ButtonSkeleton() {
  return <Skeleton className="h-11 w-32 rounded-md" />;
}

export function ImageSkeleton() {
  return <Skeleton className="aspect-video w-full" />;
}

export function CardSkeleton() {
  return (
    <div className="space-y-4 rounded-lg border border-border bg-surface p-6">
      <ImageSkeleton />
      <Skeleton className="h-5 w-2/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-4/5" />
    </div>
  );
}

export function SectionSkeleton() {
  return (
    <div className="space-y-8">
      <Skeleton className="h-8 w-48" />
      <div className="grid gap-6 md:grid-cols-3">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    </div>
  );
}
