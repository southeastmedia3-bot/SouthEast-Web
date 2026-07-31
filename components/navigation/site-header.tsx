import Link from "next/link";
import { BrandMark } from "@/components/brand/brand-mark";
import { DesktopNav } from "@/components/navigation/desktop-nav";
import { MobileNav } from "@/components/navigation/mobile-nav";
import { siteConfig } from "@/constants/site";

/**
 * The header is whole from the first paint, on every route including home.
 *
 * It used to interpolate itself in over the first half-screen of scroll on the
 * homepage: transparent bar, logo only, nav fading up as you scrolled. That read
 * as a missing header rather than a restrained one — a visitor landing on the
 * hero had no way to reach the work without scrolling first. The frosted bar is
 * now always on, which also keeps the nav legible over the dark showreel that
 * opens the page.
 *
 * NOTE no transform on this element or anything inside it: the verticals
 * mega-panel is `position: fixed` and a transform here would make this bar its
 * containing block. Same trap that breaks the pinned scroll stages.
 */
export function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-[60]">
      <div className="border-b border-border/60 bg-white/75 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-[100rem] items-center justify-between px-6 sm:px-10 lg:px-16">
          <Link
            href="/"
            className="group inline-flex items-center gap-3 text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={`${siteConfig.name} home`}
          >
            <BrandMark className="transition duration-300 group-hover:opacity-80" />
            <span className="sr-only">{siteConfig.projectName}</span>
          </Link>

          {/* Contact already lives in `primaryNavigation` — a second link here
              rendered it twice in the bar. */}
          <div className="flex items-center gap-6">
            <DesktopNav />
            <MobileNav />
          </div>
        </div>
      </div>
    </header>
  );
}
