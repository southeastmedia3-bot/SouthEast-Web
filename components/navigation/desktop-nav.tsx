"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Search } from "lucide-react";
import { primaryNavigation } from "@/config/navigation";
import { cn } from "@/lib/utils";
import { getAriaCurrent } from "@/utils/accessibility";

export function DesktopNav() {
  const pathname = usePathname();

  return (
    <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary navigation">
      {primaryNavigation.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <div key={item.href} className="group relative">
            <Link
              href={item.href}
              aria-current={getAriaCurrent(isActive)}
              className={cn(
                "relative inline-flex h-11 items-center gap-1 rounded-full px-3.5 text-sm font-medium text-muted-foreground transition hover:bg-white/[0.055] hover:text-foreground focus-visible:text-foreground",
                isActive && "text-foreground",
              )}
            >
              {item.label}
              {item.children ? (
                <ChevronDown
                  className="size-3.5 transition group-hover:rotate-180"
                  aria-hidden="true"
                />
              ) : null}
              <span
                className={cn(
                  "absolute inset-x-3 bottom-1 h-px origin-left scale-x-0 bg-info transition-transform duration-300 group-hover:scale-x-100",
                  isActive && "scale-x-100",
                )}
                aria-hidden="true"
              />
            </Link>
            {item.children ? (
              <div className="invisible absolute left-0 top-full w-[28rem] translate-y-3 rounded-[1.35rem] border border-border bg-background/92 p-3 opacity-0 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-2xl transition duration-200 group-hover:visible group-hover:translate-y-1 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-1 group-focus-within:opacity-100">
                <div className="grid gap-2">
                  {item.children.map((child) => {
                    const Icon = child.icon;
                    return (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="group/item flex gap-3 rounded-md p-3 transition hover:bg-white/[0.06] focus-visible:bg-white/[0.06]"
                      >
                        {Icon ? (
                          <Icon className="mt-1 size-4 text-info" aria-hidden="true" />
                        ) : null}
                        <span>
                          <span className="block text-sm font-medium text-foreground">
                            {child.label}
                          </span>
                          {child.description ? (
                            <span className="mt-1 block text-sm leading-6 text-muted">
                              {child.description}
                            </span>
                          ) : null}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </div>
        );
      })}
      <button
        type="button"
        className="ml-2 inline-flex size-11 items-center justify-center rounded-md text-muted-foreground transition hover:bg-white/[0.06] hover:text-foreground focus-visible:bg-white/[0.06]"
        aria-label="Open search"
      >
        <Search className="size-4" aria-hidden="true" />
      </button>
    </nav>
  );
}
