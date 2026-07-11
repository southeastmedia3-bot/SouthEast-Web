import { SiteFooter } from "@/components/footer/site-footer";
import { ScrollProgress } from "@/components/layout/scroll-progress";
import { SiteHeader } from "@/components/navigation/site-header";
import { Threshold } from "@/components/scenes/threshold";
import { CustomCursor } from "@/components/effects/custom-cursor";
import type { WithChildren } from "@/types/global";

export function AppShell({ children }: WithChildren) {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[90] focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:text-accent-foreground"
      >
        Skip to content
      </a>
      <CustomCursor />
      <Threshold />
      <ScrollProgress />
      <SiteHeader />
      {children}
      <SiteFooter />
    </>
  );
}
