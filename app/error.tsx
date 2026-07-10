"use client";

import { Button } from "@/components/ui/button";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="grid min-h-dvh place-items-center bg-background p-6 text-foreground">
      <div className="max-w-md space-y-5 rounded-lg border border-border bg-surface p-8 text-center">
        <p className="text-sm uppercase tracking-[0.18em] text-accent">Application error</p>
        <h1 className="text-3xl font-semibold">Something went wrong</h1>
        <p className="text-muted">
          The global fallback caught an unexpected state. Try refreshing this view.
        </p>
        <Button type="button" onClick={reset}>
          Try again
        </Button>
      </div>
    </main>
  );
}
