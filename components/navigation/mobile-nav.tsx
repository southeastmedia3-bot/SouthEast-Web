"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { primaryNavigation } from "@/config/navigation";
import { useLockBodyScroll } from "@/hooks/use-lock-body-scroll";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  useLockBodyScroll(open);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const closeMenu = () => setOpen(false);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        className="relative z-[75] inline-flex size-11 items-center justify-center rounded-md border border-border bg-background/50 text-foreground backdrop-blur-xl"
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
              className="absolute inset-0 bg-background/70 backdrop-blur-xl"
              aria-label="Close navigation overlay"
              type="button"
              onClick={closeMenu}
            />
            <motion.div
              id="mobile-navigation"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
              className="absolute right-0 top-0 h-full w-full max-w-md overflow-y-auto border-l border-border bg-background/95 p-6 pt-24 shadow-[0_24px_80px_rgba(0,0,0,0.42)]"
            >
              <nav aria-label="Mobile navigation" className="grid gap-2">
                {primaryNavigation.map((item) => {
                  const isExpanded = expanded === item.href;
                  return (
                    <div
                      key={item.href}
                      className="rounded-lg border border-border bg-white/[0.03]"
                    >
                      <div className="flex items-center justify-between gap-2 p-2">
                        <Link
                          href={item.href}
                          onClick={closeMenu}
                          className="flex-1 rounded-md px-3 py-3 text-lg font-medium text-foreground focus-visible:bg-white/[0.06]"
                        >
                          {item.label}
                        </Link>
                        {item.children ? (
                          <button
                            type="button"
                            aria-label={`Toggle ${item.label} submenu`}
                            aria-expanded={isExpanded}
                            className="inline-flex size-11 items-center justify-center rounded-md text-muted-foreground transition hover:bg-white/[0.06] hover:text-foreground"
                            onClick={() => setExpanded(isExpanded ? null : item.href)}
                          >
                            <ChevronDown
                              className={cn("size-4 transition", isExpanded && "rotate-180")}
                            />
                          </button>
                        ) : null}
                      </div>
                      <AnimatePresence initial={false}>
                        {item.children && isExpanded ? (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="grid gap-1 px-4 pb-4">
                              {item.children.map((child) => (
                                <Link
                                  key={child.href}
                                  href={child.href}
                                  onClick={closeMenu}
                                  className="rounded-md px-3 py-2 text-sm text-muted transition hover:bg-white/[0.06] hover:text-foreground focus-visible:bg-white/[0.06]"
                                >
                                  {child.label}
                                </Link>
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
