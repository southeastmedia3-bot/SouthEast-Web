"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandMark } from "@/components/brand/brand-mark";
import { DesktopNav } from "@/components/navigation/desktop-nav";
import { MobileNav } from "@/components/navigation/mobile-nav";
import { siteConfig } from "@/constants/site";
import { cn } from "@/lib/utils";

/**
 * The logo is present from the very top over a fully transparent bar; the nav
 * cluster, verticals dropdown, and a frosted background reveal only once the
 * visitor scrolls — interpolated, not toggled. On inner pages (which don't open
 * on a full-bleed hero) the nav is present from the top.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scroll, setScroll] = useState(0);
  const frame = useRef(0);

  useEffect(() => {
    const update = () => {
      frame.current = 0;
      const vh = window.innerHeight;
      const start = vh * 0.16;
      const end = vh * 0.5;
      const value = Math.min(1, Math.max(0, (window.scrollY - start) / (end - start)));
      setScroll(value);
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

  // On inner pages the chrome is present immediately; on home it earns its way in.
  const navProgress = isHome ? scroll : 1;
  const chromeVisible = navProgress > 0.25;

  return (
    <header className="fixed inset-x-0 top-0 z-[60]">
      <div
        className={cn(
          "border-b border-transparent transition-[background-color,border-color,backdrop-filter] duration-500",
          // Light frosted chrome — the site opens on a bright field, so the bar
          // stays light and the wordmark stays dark.
          chromeVisible && "border-border/60 bg-white/75 backdrop-blur-xl",
        )}
      >
        <div className="mx-auto flex h-20 max-w-[100rem] items-center justify-between px-6 sm:px-10 lg:px-16">
          {/* Logo — always visible from the top. */}
          <Link
            href="/"
            className="group inline-flex items-center gap-3 text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={`${siteConfig.name} home`}
          >
            <BrandMark className="transition duration-300 group-hover:opacity-80" />
            <span className="sr-only">{siteConfig.projectName}</span>
          </Link>

          {/* Nav cluster — revealed on scroll (home) / present (inner pages).
              Opacity ONLY: a transform here (even an identity one) would become a
              containing block, and the verticals mega-panel is `position: fixed`
              — it would end up anchored to this little flex cluster instead of the
              viewport. Same trap that broke the pinned scroll stages. */}
          <div
            className="flex items-center gap-6"
            style={{
              opacity: navProgress,
              pointerEvents: navProgress > 0.2 ? "auto" : "none",
            }}
            aria-hidden={navProgress < 0.4}
          >
            {/* Contact already lives in `primaryNavigation` — a second link here
                rendered it twice in the bar. */}
            <DesktopNav />
            <MobileNav />
          </div>
        </div>
      </div>
    </header>
  );
}
