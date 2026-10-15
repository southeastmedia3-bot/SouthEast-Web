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
 * NOTE nothing that wraps the nav may carry a transform, a filter or a
 * backdrop-filter. Any of the three makes that element the containing block
 * for every `position: fixed` descendant, and both menus are fixed: the
 * services mega-panel, and the mobile menu's full-screen overlay. Same trap
 * that breaks the pinned scroll stages.
 *
 * That is why the frosted glass is its own layer behind the bar's contents
 * rather than the element around them. While the blur wrapped the nav, the
 * mobile menu was sized to this 80px bar instead of the screen and opened as a
 * white strip with the first link cut off at its bottom edge.
 */
export function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-[60]">
      <div
        aria-hidden="true"
        className="absolute inset-0 border-b border-border/60 bg-white/75 backdrop-blur-xl"
      />
      {/* The bar's height is the `--header-h` token, not a literal — the
          homepage reel offsets itself by the same token so it starts below
          this bar instead of running under it. `relative` stacks it over the
          glass. */}
      <div className="relative mx-auto flex h-[var(--header-h)] max-w-[100rem] items-center justify-between px-6 sm:px-10 lg:px-16">
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
    </header>
  );
}
