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
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
              className="absolute right-0 top-0 h-full w-full max-w-md overflow-y-auto border-l border-border bg-white p-6 pt-24 shadow-[0_24px_60px_rgba(0,0,0,0.5)]"
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
