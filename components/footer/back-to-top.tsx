"use client";

import { ArrowUp } from "lucide-react";
import { scrollToTop } from "@/utils/scroll";

export function BackToTop() {
  return (
    <button
      type="button"
      onClick={scrollToTop}
      className="inline-flex size-11 items-center justify-center rounded-full border border-border text-muted transition hover:border-info hover:bg-white/[0.055] hover:text-info focus-visible:text-info"
      aria-label="Back to top"
    >
      <ArrowUp className="size-4" aria-hidden="true" />
    </button>
  );
}
