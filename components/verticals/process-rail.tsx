"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Container } from "@/components/common/container";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * How the engagement runs — as a rail rather than a grid of boxes.
 *
 * A vertical line runs the length of the section and *fills* as you scroll it,
 * with each step's node lighting as the fill passes. It reads as progress through
 * a process, which is the entire point of the section, and it is the one place on
 * the page where a scroll-linked animation is carrying meaning rather than
 * decoration.
 *
 * The fill is a scaleY on a line that is already there, so it is compositor-only.
 * The rail costs no extra page height: it is scrubbed against the section's own
 * span, not a pinned stage.
 */
export function ProcessRail({
  steps,
  rule,
}: {
  steps: { step: string; detail: string }[];
  rule: string;
}) {
  const reducedMotion = useReducedMotion();
  const ref = useRef<HTMLOListElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    // Fills between the point the list reaches reading height and the point its
    // foot leaves it — so the line is full exactly as you finish the last step.
    offset: ["start 75%", "end 60%"],
  });
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section
      id="process"
      className="scroll-mt-36 border-t border-border bg-[var(--surface-elevated)] py-20 md:py-28"
    >
      <Container>
        <div className="mb-14 flex items-center gap-4">
          <span className="block h-[2px] w-10" style={{ background: rule }} aria-hidden="true" />
          <h2 className="type-h3 text-foreground">How the engagement runs</h2>
        </div>

        <ol ref={ref} className="relative pl-10 md:pl-14">
          {/* The track, and the fill that runs down it. */}
          <span
            className="absolute left-[7px] top-2 h-[calc(100%-1rem)] w-px bg-border md:left-[11px]"
            aria-hidden="true"
          />
          <motion.span
            className="absolute left-[7px] top-2 h-[calc(100%-1rem)] w-px origin-top md:left-[11px]"
            style={reducedMotion ? { background: rule } : { background: rule, scaleY }}
            aria-hidden="true"
          />

          {steps.map((step, i) => (
            <motion.li
              key={step.step}
              className="relative pb-12 last:pb-0"
              initial={reducedMotion ? undefined : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              <span
                className="absolute -left-10 top-1.5 flex size-4 items-center justify-center rounded-full border-2 border-[var(--surface-elevated)] md:-left-14"
                style={{ background: rule }}
                aria-hidden="true"
              />
              <span className="type-index text-muted">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="type-h4 mt-2 text-[1.2rem] text-foreground">{step.step}</h3>
              <p className="type-body mt-2 max-w-2xl text-muted">{step.detail}</p>
            </motion.li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
