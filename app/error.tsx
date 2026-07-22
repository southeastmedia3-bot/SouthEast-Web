"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/constants/site";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surfaces in the platform logs. `digest` is the only handle on a
    // production error — React redacts the message client-side.
    console.error("[error boundary]", error.digest ?? error.message);
  }, [error]);

  return (
    <main className="grid min-h-dvh place-items-center bg-background p-6 text-foreground">
      <div className="max-w-md space-y-5 rounded-lg border border-border bg-surface p-8 text-center">
        <p className="text-sm uppercase tracking-[0.18em] text-accent">Something interrupted</p>
        <h1 className="text-3xl font-semibold">This view didn&apos;t load</h1>
        <p className="text-muted">
          Try again — it is usually momentary. If it persists, write to us at{" "}
          <a className="underline underline-offset-4" href={`mailto:${siteConfig.contactEmail}`}>
            {siteConfig.contactEmail}
          </a>
          .
        </p>
        <Button type="button" onClick={reset}>
          Try again
        </Button>
      </div>
    </main>
  );
}
