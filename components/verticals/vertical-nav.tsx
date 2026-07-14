"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export type NavSection = { id: string; label: string };

/**
 * The in-page rail: a sticky strip under the header that names the sections of a
 * vertical page and marks where you are in it.
 *
 * These pages run long — pharma is nine screens — and every reference site that
 * sells a single service the way this one has to (maverickframe, opus, 3dlabz)
 * gives the visitor a way to skip straight to the part they came for. A buyer who
 * only wants the price and the turnaround should not have to scroll past the
 * anatomy library to find them.
 *
 * Scroll-spy runs on an IntersectionObserver with a rootMargin that collapses the
 * viewport to a band just under the header, so the "active" section is whichever
 * one is actually at reading height — not merely whichever is technically on
 * screen, which with sections this tall would light two up at once.
 */
export function VerticalNav({ label, sections }: { label: string; sections: NavSection[] }) {
  const [active, setActive] = useState(sections[0]?.id ?? "");

  useEffect(() => {
    const nodes = sections
      .map((s) => document.getElementById(s.id))
      .filter((n): n is HTMLElement => Boolean(n));
    if (nodes.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Several sections can straddle the band at once; take the highest one
        // that is intersecting, which is the one you are reading.
        const hit = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (hit?.target.id) setActive(hit.target.id);
      },
      // Top edge sits just below the sticky header + this rail; the bottom edge is
      // pulled up to leave a narrow reading band.
      { rootMargin: "-140px 0px -55% 0px", threshold: 0 },
    );

    for (const node of nodes) observer.observe(node);
    return () => observer.disconnect();
  }, [sections]);

  return (
    <div className="sticky top-20 z-40 hidden border-b border-border bg-white/85 backdrop-blur-xl lg:block">
      <div className="mx-auto flex h-14 max-w-[100rem] items-center gap-8 px-6 sm:px-10 lg:px-16">
        <span className="type-label shrink-0 text-foreground">{label}</span>

        <nav aria-label="On this page" className="flex items-center gap-1">
          {sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              aria-current={active === section.id ? "true" : undefined}
              className={cn(
                "relative px-3 py-2 text-sm font-medium transition-colors",
                active === section.id
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {section.label}
              <span
                className={cn(
                  "absolute inset-x-3 -bottom-[1px] h-[2px] origin-left bg-accent transition-transform duration-300",
                  active === section.id ? "scale-x-100" : "scale-x-0",
                )}
                aria-hidden="true"
              />
            </a>
          ))}
        </nav>

        <Link
          href="/contact"
          className="ml-auto shrink-0 rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
        >
          Start a project
        </Link>
      </div>
    </div>
  );
}
