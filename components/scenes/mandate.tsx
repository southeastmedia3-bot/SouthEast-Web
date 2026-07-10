"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { mandate } from "@/data/home";
import { setupGsap } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

/**
 * Scene 04 — Technical & Security Mandate. Off-center, quiet, brief: the
 * institutional credibility scene. Never a client testimonial — a statement
 * of governance, infrastructure, and pipeline discipline, in the studio's
 * quiet voice, backed by four unadorned facts whose rules draw themselves in.
 */
export function Mandate() {
  const listRef = useRef<HTMLDListElement | null>(null);
  const ruleRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !listRef.current) {
      return;
    }

    const { gsap } = setupGsap();
    const rules = ruleRefs.current.filter((el): el is HTMLSpanElement => Boolean(el));
    const rows = Array.from(listRef.current.querySelectorAll<HTMLElement>("[data-pillar-row]"));

    gsap.set(rules, { scaleX: 0, transformOrigin: "left center" });
    gsap.set(rows, { opacity: 0, y: 16 });

    // A single scrubbed timeline sequences all four rows against scroll
    // position — no independent per-row durations that a fast scroll could
    // outrun or leave mid-flight.
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: listRef.current,
        start: "top 85%",
        end: "bottom 65%",
        scrub: 0.4,
      },
    });

    rows.forEach((row, index) => {
      const rule = rules[index];
      const position = index * 0.9;
      if (rule) {
        timeline.to(rule, { scaleX: 1, ease: "none" }, position);
      }
      timeline.to(row, { opacity: 1, y: 0, ease: "none" }, position + 0.15);
    });

    return () => {
      timeline.kill();
    };
  }, [reducedMotion]);

  return (
    <section id="mandate" className="px-6 py-32 sm:px-10 lg:px-16 lg:py-40">
      <p className="type-label mb-16 text-muted">04 — Technical &amp; Security Mandate</p>
      <div className="grid gap-16 lg:grid-cols-[0.58fr_0.42fr] lg:items-start lg:gap-10 xl:gap-24">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="voice-quiet max-w-xl text-balance text-[clamp(1.75rem,3.8vw,2.9rem)] leading-snug text-foreground"
        >
          {mandate.statement}
        </motion.p>

        <dl ref={listRef} className="flex flex-col">
          {mandate.pillars.map((pillar, index) => (
            <div
              key={pillar.label}
              data-pillar-row
              className={cn("pt-7 first:pt-0", !reducedMotion && "opacity-0")}
            >
              <span
                ref={(el) => {
                  ruleRefs.current[index] = el;
                }}
                className={cn(
                  "block h-px w-full origin-left bg-border",
                  !reducedMotion && "scale-x-0",
                )}
                aria-hidden="true"
              />
              <div className="flex items-baseline gap-4 pt-5">
                <span className="type-index shrink-0 text-muted">0{index + 1}</span>
                <div>
                  <dt className="type-caption text-muted">{pillar.label}</dt>
                  <dd className="type-body mt-1.5 text-foreground">{pillar.detail}</dd>
                </div>
              </div>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
