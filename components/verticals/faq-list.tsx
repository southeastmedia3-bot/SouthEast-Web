"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { Container } from "@/components/common/container";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * The objections, answered.
 *
 * An accordion rather than a wall of text, because a buyer scans for their one
 * question. Only one panel is open at a time — two open panels push the rest of
 * the list off screen and the thing stops being scannable, which is the only
 * reason it exists.
 *
 * The panel animates on height, which is not compositor-friendly, but it runs
 * once per click on a handful of nodes and the alternative (a native <details>)
 * cannot be animated at all. Under reduced motion it collapses to an instant
 * show/hide.
 */
export function FaqList({
  faqs,
  rule,
}: {
  faqs: { q: string; a: string }[];
  rule: string;
}) {
  const reducedMotion = useReducedMotion();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Container id="faq" className="scroll-mt-36 py-20 md:py-28">
      <div className="grid gap-x-16 gap-y-8 lg:grid-cols-[22rem_1fr]">
        <div className="lg:sticky lg:top-40 lg:self-start">
          <p className="type-label mb-4" style={{ color: rule }}>
            Before you call
          </p>
          <h2 className="type-h3 text-balance text-foreground">Questions we get asked.</h2>
        </div>

        <ul className="border-t border-border">
          {faqs.map((faq, i) => {
            const isOpen = open === i;
            return (
              <li key={faq.q} className="border-b border-border">
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${i}`}
                    className="flex w-full items-start justify-between gap-8 py-6 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <span
                      className={cn(
                        "type-h4 text-[1.15rem] transition-colors",
                        isOpen ? "text-foreground" : "text-foreground/75",
                      )}
                    >
                      {faq.q}
                    </span>
                    <Plus
                      className={cn(
                        "mt-1 size-5 shrink-0 transition-transform duration-300",
                        isOpen ? "rotate-45 text-foreground" : "text-muted",
                      )}
                      aria-hidden="true"
                    />
                  </button>
                </h3>

                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <motion.div
                      id={`faq-panel-${i}`}
                      key="panel"
                      initial={reducedMotion ? false : { height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={reducedMotion ? undefined : { height: 0, opacity: 0 }}
                      transition={{ duration: 0.38, ease: EASE }}
                      className="overflow-hidden"
                    >
                      <p className="type-body max-w-2xl pb-7 text-muted">{faq.a}</p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>
    </Container>
  );
}
