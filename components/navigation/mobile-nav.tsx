"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { primaryNavigation } from "@/config/navigation";
import { useLockBodyScroll } from "@/hooks/use-lock-body-scroll";
import { cn } from "@/lib/utils";

/** Everything the browser will hand focus to, in document order. */
const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  /** Distinguishes "closed because it was dismissed" from "closed on mount",
   *  so the very first render does not steal focus onto the hamburger. */
  const wasOpen = useRef(false);

  useLockBodyScroll(open);

  /*
   * Modal keyboard behaviour, hand-rolled — the whole of it is the ~40 lines
   * below, which is not worth a dependency.
   *
   * The panel covers the viewport, so without a trap Tab walks straight off its
   * last link and into the page behind it: the visitor is then driving links
   * they cannot see, under an overlay they cannot tell they are still inside.
   * `aria-modal` tells a screen reader to ignore that background, and this makes
   * the same true for the keyboard.
   */
  useEffect(() => {
    if (!open) {
      if (wasOpen.current) {
        wasOpen.current = false;
        // Back where they were. Without this, dismissing the menu drops focus
        // on <body> and the next Tab restarts at the top of the document.
        triggerRef.current?.focus();
      }
      return;
    }

    wasOpen.current = true;

    // The container, not its first link: it reads the dialog's name before its
    // contents, and one Tab still lands on the first item. `preventScroll`
    // because the panel animates in from x:100% and focusing mid-travel would
    // otherwise ask the browser to scroll to where it currently is.
    panelRef.current?.focus({ preventScroll: true });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        return;
      }
      if (event.key !== "Tab") {
        return;
      }

      const panel = panelRef.current;
      if (!panel) {
        return;
      }

      // Re-read every time: submenus mount and unmount as they expand.
      const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (element) => element.getClientRects().length > 0,
      );

      const active = document.activeElement;
      const inside = active instanceof Node && panel.contains(active);

      const first = items[0];
      const last = items[items.length - 1];

      if (!first || !last) {
        event.preventDefault();
        panel.focus({ preventScroll: true });
        return;
      }

      if (event.shiftKey) {
        // The panel itself is the wrap point going backwards, since it holds
        // focus on open.
        if (!inside || active === first || active === panel) {
          event.preventDefault();
          last.focus();
        }
      } else if (!inside || active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const closeMenu = () => setOpen(false);

  return (
    <div className="lg:hidden">
      <button
        ref={triggerRef}
        type="button"
        className="relative z-[75] inline-flex size-11 items-center justify-center rounded-md border border-border bg-white/70 text-foreground backdrop-blur-xl"
        aria-label={open ? "Close navigation" : "Open navigation"}
        aria-expanded={open}
        aria-controls="mobile-navigation"
        onClick={() => setOpen((value) => !value)}
      >
        <span className="sr-only">Menu</span>
        <span
          className={cn(
            "absolute h-px w-5 bg-current transition",
            open ? "rotate-45" : "-translate-y-1.5",
          )}
        />
        <span
          className={cn(
            "absolute h-px w-5 bg-current transition",
            open ? "opacity-0" : "opacity-100",
          )}
        />
        <span
          className={cn(
            "absolute h-px w-5 bg-current transition",
            open ? "-rotate-45" : "translate-y-1.5",
          )}
        />
      </button>
      <AnimatePresence>
        {open ? (
          <motion.div
            className="fixed inset-0 z-[70]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              className="absolute inset-0 bg-background/80 backdrop-blur-xl"
              aria-label="Close navigation overlay"
              type="button"
              onClick={closeMenu}
            />
            <motion.div
              id="mobile-navigation"
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-label="Site navigation"
              tabIndex={-1}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
              className="absolute right-0 top-0 h-full w-full max-w-md overflow-y-auto border-l border-border bg-white p-6 pt-24 shadow-[0_24px_60px_rgba(0,0,0,0.5)] focus:outline-none"
            >
              <nav aria-label="Mobile navigation" className="flex flex-col">
                {primaryNavigation.map((item, index) => {
                  const isExpanded = expanded === item.href;
                  return (
                    <div
                      key={item.href}
                      className={cn("py-1", index !== 0 && "border-t border-border")}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <Link
                          href={item.href}
                          onClick={closeMenu}
                          className="flex-1 py-3 text-xl font-medium text-foreground"
                        >
                          {item.label}
                        </Link>
                        {item.categories ? (
                          <button
                            type="button"
                            aria-label={`Toggle ${item.label} submenu`}
                            aria-expanded={isExpanded}
                            className="inline-flex size-11 items-center justify-center text-muted-foreground transition hover:text-foreground"
                            onClick={() => setExpanded(isExpanded ? null : item.href)}
                          >
                            <ChevronDown
                              className={cn("size-4 transition", isExpanded && "rotate-180")}
                            />
                          </button>
                        ) : null}
                      </div>
                      <AnimatePresence initial={false}>
                        {item.categories && isExpanded ? (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            {/* Grouped rather than flat: 28 services in one
                                undifferentiated column tells a phone visitor
                                nothing about how the work is organised. */}
                            <div className="flex flex-col gap-5 pb-4 pl-1">
                              {item.categories.map((category) => (
                                <div key={category.label} className="flex flex-col">
                                  <p className="type-label pb-1 text-muted">{category.label}</p>
                                  {category.items.map((service) => (
                                    <Link
                                      key={service.label}
                                      href={service.href}
                                      onClick={closeMenu}
                                      className="py-2 text-base text-muted transition hover:text-foreground"
                                    >
                                      {service.label}
                                    </Link>
                                  ))}
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        ) : null}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </nav>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
