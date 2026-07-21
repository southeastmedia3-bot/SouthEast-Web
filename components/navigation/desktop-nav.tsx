"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, ChevronDown, ChevronRight } from "lucide-react";
import { primaryNavigation } from "@/config/navigation";
import { verticals } from "@/data/verticals";
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
 * The primary nav, and the verticals mega-menu.
 *
 * The menu is a two-level panel: a rail of the seven verticals on the left, and a
 * wide detail pane on the right that swaps as you move down the rail. Hovering a
 * rail item previews it; clicking it opens the vertical.
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
  const [activeSlug, setActiveSlug] = useState(verticals[0]!.slug);
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

  const active = verticals.find((v) => v.slug === activeSlug) ?? verticals[0]!;

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
        const hasMenu = Boolean(item.children?.length);
        const isActive = hasMenu
          ? pathname === item.href || verticals.some((v) => pathname.startsWith(`/${v.slug}`))
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
                {/* The rail — the seven verticals. Hover previews, click opens. */}
                <div className="flex flex-col border-r border-border/60 bg-[#f8f6f1]/70 p-3">
                  <p className="type-label px-4 pb-1 pt-3 text-muted">Verticals</p>
                  <ul className="flex flex-col">
                    {verticals.map((vertical) => {
                      const selected = vertical.slug === activeSlug;
                      return (
                        <li key={vertical.slug}>
                          <Link
                            href={`/${vertical.slug}`}
                            onPointerEnter={() => setActiveSlug(vertical.slug)}
                            onFocus={() => setActiveSlug(vertical.slug)}
                            onClick={closeNow}
                            className={cn(
                              "flex items-center justify-between gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition",
                              selected
                                ? "bg-white text-foreground shadow-[0_12px_28px_-20px_rgba(21,20,26,0.55)]"
                                : "text-muted-foreground hover:text-foreground",
                            )}
                          >
                            <span>{vertical.label}</span>
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
                    All seven disciplines
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
                      key={active.slug}
                      initial={reducedMotion ? false : { opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.18, ease: EASE }}
                    >
                      <div className="flex items-start justify-between gap-10 border-b border-border/60 pb-6">
                        <div>
                          <p className="type-label text-accent">{active.eyebrow}</p>
                          <h3 className="type-h4 mt-2.5 text-foreground">{active.title}</h3>
                          <p className="type-body mt-2 max-w-xl text-muted">{active.summary}</p>
                        </div>
                        <Link
                          href={`/${active.slug}`}
                          onClick={closeNow}
                          className="group/open mt-1 inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground transition hover:border-accent hover:text-accent"
                        >
                          Open vertical
                          <ArrowUpRight
                            className="size-4 transition-transform duration-300 group-hover/open:-translate-y-0.5 group-hover/open:translate-x-0.5"
                            aria-hidden="true"
                          />
                        </Link>
                      </div>

                      {/* Capped: a vertical may carry eight capabilities (pharma
                          does) and rendering them all would stretch the panel far
                          past the height it is designed for. The page has the rest. */}
                      <ul className="mt-6 grid grid-cols-2 gap-x-8 gap-y-1">
                        {active.capabilities.slice(0, 4).map((capability) => (
                          <li key={capability.name}>
                            <Link
                              href={`/${active.slug}`}
                              onClick={closeNow}
                              className="-mx-3 block rounded-xl px-3 py-3 transition hover:bg-black/[0.035]"
                            >
                              <p className="text-sm font-semibold text-foreground">
                                {capability.name}
                              </p>
                              <p className="type-caption mt-1 text-muted">{capability.detail}</p>
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
