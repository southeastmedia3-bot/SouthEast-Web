"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronDown, ChevronRight } from "lucide-react";
import { primaryNavigation, serviceMenu, serviceRoutes } from "@/config/navigation";
import { cn } from "@/lib/utils";
import { getAriaCurrent } from "@/utils/accessibility";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Long enough to cross the dead space between the trigger and the panel below it
 * without the menu snapping shut, short enough that it doesn't linger.
 */
const CLOSE_DELAY = 150;

/**
 * The primary nav, and the services mega-menu.
 *
 * The menu is a two-level panel: a rail of the five service categories on the
 * left, and a wide detail pane on the right that swaps as you move down the rail.
 * Hovering a rail item previews its services; clicking any of them opens the page
 * that carries that work.
 *
 * Open/close is on state rather than `:hover`, because CSS hover can't bridge the
 * gap between the trigger and the panel (the pointer crosses bare header and the
 * menu dies mid-travel), and because the two-level preview needs state anyway.
 *
 * NOTE the panel is `position: fixed` so it can span the viewport rather than the
 * width of the nav item that spawned it. That only works while no ancestor has a
 * transform/filter — see the comment in `site-header.tsx`.
 */
export function DesktopNav() {
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(serviceMenu[0]!.label);
  const closeTimer = useRef<number | null>(null);

  const cancelClose = () => {
    if (closeTimer.current !== null) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };
  const openMenu = () => {
    cancelClose();
    setOpen(true);
  };
  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = window.setTimeout(() => setOpen(false), CLOSE_DELAY);
  };
  const closeNow = () => {
    cancelClose();
    setOpen(false);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => cancelClose, []);

  const active = serviceMenu.find((c) => c.label === activeCategory) ?? serviceMenu[0]!;

  return (
    <nav
      className="hidden items-center gap-1 lg:flex"
      aria-label="Primary navigation"
      // Tabbing out of the nav entirely closes the menu; moving between the
      // trigger and the panel (both inside this element) does not.
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) closeNow();
      }}
    >
      {primaryNavigation.map((item) => {
        const hasMenu = Boolean(item.categories?.length);
        const isActive = hasMenu
          ? pathname === item.href || serviceRoutes.some((route) => pathname.startsWith(route))
          : pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <div
            key={item.href}
            className="relative"
            onPointerEnter={hasMenu ? openMenu : undefined}
            onPointerLeave={hasMenu ? scheduleClose : undefined}
          >
            <Link
              href={item.href}
              aria-current={getAriaCurrent(isActive)}
              aria-expanded={hasMenu ? open : undefined}
              aria-haspopup={hasMenu ? "true" : undefined}
              onFocus={hasMenu ? openMenu : closeNow}
              onClick={closeNow}
              className={cn(
                "group relative inline-flex h-11 items-center gap-1.5 px-3.5 text-sm font-medium text-muted-foreground transition hover:text-foreground focus-visible:text-foreground",
                (isActive || (hasMenu && open)) && "text-foreground",
              )}
            >
              {item.label}
              {hasMenu ? (
                <ChevronDown
                  className={cn("size-3.5 transition-transform duration-300", open && "rotate-180")}
                  aria-hidden="true"
                />
              ) : null}
              <span
                className={cn(
                  "absolute inset-x-3.5 bottom-1 h-px origin-left scale-x-0 bg-accent-ink transition-transform duration-300 group-hover:scale-x-100",
                  (isActive || (hasMenu && open)) && "scale-x-100",
                )}
                aria-hidden="true"
              />
            </Link>
          </div>
        );
      })}

      <AnimatePresence>
        {open ? (
          <>
            {/* Pushes the page back so the panel reads as the only live surface. */}
            <motion.div
              key="scrim"
              className="pointer-events-none fixed inset-x-0 bottom-0 top-20 bg-[#0a0a0d]/[0.06] backdrop-blur-[2px]"
              initial={reducedMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: EASE }}
              aria-hidden="true"
            />

            <motion.div
              key="panel"
              className="fixed inset-x-0 top-20 px-6 sm:px-10 lg:px-16"
              initial={reducedMotion ? false : { opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.24, ease: EASE }}
              onPointerEnter={openMenu}
              onPointerLeave={scheduleClose}
            >
              {/* Opaque, not frosted: the panel opens over whatever section happens
                  to be behind it — including the black film scene — and a
                  translucent card reads as muddy grey there. The page behind is
                  pushed back by the scrim instead. */}
              <div className="mx-auto grid max-w-[76rem] grid-cols-[16rem_1fr] overflow-hidden rounded-[1.75rem] border border-border/70 bg-white shadow-[0_60px_120px_-45px_rgba(21,20,26,0.45)]">
                {/* The rail — the five categories. Hover previews, click opens the
                    page the category's work lives on. */}
                <div className="flex flex-col border-r border-border/60 bg-[#f8f6f1]/70 p-3">
                  <p className="type-label px-4 pb-1 pt-3 text-muted">Categories</p>
                  <ul className="flex flex-col">
                    {serviceMenu.map((category) => {
                      const selected = category.label === active.label;
                      return (
                        <li key={category.label}>
                          <Link
                            href={category.href}
                            onPointerEnter={() => setActiveCategory(category.label)}
                            onFocus={() => setActiveCategory(category.label)}
                            onClick={closeNow}
                            className={cn(
                              "flex items-center justify-between gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition",
                              selected
                                ? "bg-white text-foreground shadow-[0_12px_28px_-20px_rgba(21,20,26,0.55)]"
                                : "text-muted-foreground hover:text-foreground",
                            )}
                          >
                            <span>{category.label}</span>
                            <ChevronRight
                              className={cn(
                                "size-4 shrink-0 text-accent transition-all duration-200",
                                selected ? "translate-x-0 opacity-100" : "-translate-x-1 opacity-0",
                              )}
                              aria-hidden="true"
                            />
                          </Link>
                        </li>
                      );
                    })}
                  </ul>

                  <Link
                    href="/verticals"
                    onClick={closeNow}
                    className="group/all mt-auto flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground transition hover:text-foreground"
                  >
                    Every discipline
                    <ArrowRight
                      className="size-4 transition-transform duration-300 group-hover/all:translate-x-1"
                      aria-hidden="true"
                    />
                  </Link>
                </div>

                {/* The detail pane — swapped as the rail selection changes. */}
                <div className="p-8">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={active.label}
                      initial={reducedMotion ? false : { opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.18, ease: EASE }}
                    >
                      <p className="type-label text-accent-ink">{active.label}</p>

                      {/* Three across, as the category sheets are laid out. Every
                          item links to the page that actually carries that work. */}
                      <ul className="mt-5 grid grid-cols-3 gap-x-8 gap-y-1">
                        {active.items.map((service) => (
                          <li key={service.label}>
                            <Link
                              href={service.href}
                              onClick={closeNow}
                              className="-mx-3 block rounded-xl px-3 py-3 transition hover:bg-black/[0.035]"
                            >
                              <p className="text-sm font-semibold text-foreground">
                                {service.label}
                              </p>
                              <p className="type-caption mt-1 text-muted">{service.description}</p>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </nav>
  );
}
