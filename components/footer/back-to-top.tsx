"use client";

import { ArrowUp } from "lucide-react";
import { scrollToTop } from "@/utils/scroll";

export function BackToTop() {
  return (
    <button
      type="button"
      onClick={scrollToTop}
      className="inline-flex size-11 items-center justify-center rounded-full border border-white/20 text-[color:var(--brand-ice)]/70 transition hover:border-[color:var(--brand-sky)] hover:bg-white/[0.08] hover:text-[color:var(--brand-sky)] focus-visible:text-[color:var(--brand-sky)]"
      aria-label="Back to top"
    >
      <ArrowUp className="size-4" aria-hidden="true" />
    </button>
  );
}
