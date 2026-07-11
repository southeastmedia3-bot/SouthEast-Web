"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
                "relative inline-flex h-11 items-center px-3.5 text-sm font-medium text-muted-foreground transition hover:text-foreground focus-visible:text-foreground",
                isActive && "text-foreground",
              )}
            >
              {item.label}
              <span
                className={cn(
                  "absolute inset-x-3 bottom-1 h-px origin-left scale-x-0 bg-accent-ink transition-transform duration-300 group-hover:scale-x-100",
                  isActive && "scale-x-100",
                )}
                aria-hidden="true"
              />
            </Link>
            {item.children ? (
              <div className="invisible absolute left-1/2 top-full w-[32rem] -translate-x-1/2 translate-y-2 overflow-hidden rounded-2xl border border-border bg-white/90 opacity-0 shadow-[0_40px_90px_-40px_rgba(21,20,26,0.35)] backdrop-blur-2xl transition duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                <ul className="flex flex-col p-2">
                  {item.children.map((child, index) => (
                    <li key={child.href}>
                      <Link
                        href={child.href}
                        className={cn(
                          "group/item flex items-baseline gap-4 rounded-xl px-4 py-3.5 transition hover:bg-black/[0.035] focus-visible:bg-black/[0.035]",
                          index !== 0 && "border-t border-border/60",
                        )}
                      >
                        <span className="type-index shrink-0 text-accent">0{index + 1}</span>
                        <span className="type-h4 flex-1 text-[1.15rem] text-foreground transition-transform duration-300 group-hover/item:translate-x-1">
                          {child.label}
                        </span>
                        {child.description ? (
                          <span className="type-caption max-w-[12rem] shrink-0 text-right text-muted">
                            {child.description}
                          </span>
                        ) : null}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        );
      })}
    </nav>
  );
}
