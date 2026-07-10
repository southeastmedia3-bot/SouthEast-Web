"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { BrandMark } from "@/components/brand/brand-mark";
import { DesktopNav } from "@/components/navigation/desktop-nav";
import { MobileNav } from "@/components/navigation/mobile-nav";
import { siteConfig } from "@/constants/site";
import { cn } from "@/lib/utils";

/**
 * Navigation does not exist until it is earned — hidden through Threshold
 * and Arrival, revealed only once the visitor has scrolled past the opening
 * scene, interpolated continuously rather than toggled.
 */
export function SiteHeader() {
  const [progress, setProgress] = useState(0);
  const frame = useRef(0);

  useEffect(() => {
    const update = () => {
      frame.current = 0;
      const vh = window.innerHeight;
      const start = vh * 0.55;
      const end = vh * 0.85;
      const value = Math.min(1, Math.max(0, (window.scrollY - start) / (end - start)));
      setProgress(value);
    };

    const onScroll = () => {
      if (frame.current) return;
      frame.current = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, []);

  return (
    <header
      className="fixed inset-x-0 top-0 z-[60]"
      style={{
        opacity: progress,
        transform: `translateY(${(1 - progress) * -8}px)`,
        pointerEvents: progress > 0.05 ? "auto" : "none",
      }}
      aria-hidden={progress < 0.4}
    >
      <div
        className={cn(
          "border-b border-border/0 bg-background/0 backdrop-blur-0 transition-[background-color,border-color,backdrop-filter] duration-500",
          progress > 0.7 && "border-border bg-background/85 backdrop-blur-xl",
        )}
      >
        <div className="mx-auto flex h-20 max-w-[100rem] items-center justify-between px-6 sm:px-10 lg:px-16">
          <Link
            href="/"
            className="group inline-flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={`${siteConfig.name} home`}
          >
            <BrandMark className="transition duration-300 group-hover:opacity-80" />
            <span className="sr-only">{siteConfig.projectName}</span>
          </Link>
          <DesktopNav />
          <Link
            href="/contact"
            className="type-label relative hidden text-muted-foreground transition hover:text-foreground lg:inline-flex lg:items-center"
          >
            Contact
          </Link>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
