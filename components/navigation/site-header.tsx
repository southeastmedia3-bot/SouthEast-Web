"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BrandMark } from "@/components/brand/brand-mark";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/constants/site";
import { cn } from "@/lib/utils";
import { DesktopNav } from "@/components/navigation/desktop-nav";
import { MobileNav } from "@/components/navigation/mobile-nav";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 12);

    update();
    window.addEventListener("scroll", update, { passive: true });

    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-[60] px-3 pt-3 sm:px-4">
      <div
        className={cn(
          "mx-auto flex h-[4.35rem] max-w-7xl items-center justify-between rounded-[1.35rem] border px-4 transition duration-500",
          scrolled
            ? "border-border bg-background/78 shadow-[0_24px_90px_rgba(0,0,0,0.34)] backdrop-blur-2xl"
            : "border-transparent bg-transparent",
        )}
      >
        <Link
          href="/"
          className="group inline-flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={`${siteConfig.name} home`}
        >
          <BrandMark className="transition duration-300 group-hover:opacity-90" />
          <span className="sr-only">{siteConfig.projectName}</span>
        </Link>
        <DesktopNav />
        <div className="hidden items-center gap-3 lg:flex">
          <Button variant="secondary" size="sm" aria-label="Contact Southeast Media">
            Contact
            <ArrowRight
              className="size-4 transition group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Button>
        </div>
        <MobileNav />
      </div>
    </header>
  );
}
