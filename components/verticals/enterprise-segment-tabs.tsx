"use client";

import { useId, useState } from "react";
import { motion } from "framer-motion";
import { Container } from "@/components/common/container";
import { Reveal } from "@/components/common/reveal";
import { NaturalMedia } from "@/components/pharma/natural-media";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { enterpriseAssets } from "@/data/media";
import type { VerticalSection } from "@/data/verticals";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * The buyer segments, behind a tab row — the reference's category filter.
 *
 * Four kinds of organisation buy this, and they want different things; a stacked
 * list makes each of them read three sections that are not about them. Tabs let
 * a visitor answer "which of these am I" once and then read only their own case.
 *
 * The swap is discrete, so Framer owns it and scroll has nothing to do with it.
 * The panel arrives on a curtain wipe rather than a fade — the Iris/Curtain
 * primitive — and the active marker slides between tabs on a shared layout id,
 * which is the only continuous motion in the section.
 */
export function EnterpriseSegmentTabs({
  section,
  rule,
  id,
}: {
  section: VerticalSection;
  rule: string;
  id?: string;
}) {
  const reducedMotion = useReducedMotion();
  const groupId = useId();
  const [active, setActive] = useState(0);

  const segments = section.items ?? [];
  const segment = segments[active];
  const frames = enterpriseAssets.segmentFrames[active] ?? [];

  return (
    <section id={id} className="scroll-mt-36 border-t border-border bg-white py-20 md:py-28">
      <Container size="xl">
        <div className="max-w-3xl">
          {section.eyebrow ? (
            <p className="type-label mb-4" style={{ color: rule }}>
              {section.eyebrow}
            </p>
          ) : null}
          <Reveal mask>
            <h2 className="type-h2 text-balance text-foreground">{section.heading}</h2>
          </Reveal>
          {section.lead ? (
            <Reveal delay={0.08}>
              <p className="type-body-lg mt-6 text-foreground">{section.lead}</p>
            </Reveal>
          ) : null}
        </div>

        {/* Tab row. Scrolls sideways on narrow screens rather than wrapping into
            a second line that reads as two separate rows of options. */}
        <div
          role="tablist"
          aria-label={section.heading}
          className="mt-14 flex gap-2 overflow-x-auto border-b border-border pb-px [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {segments.map((item, i) => {
            const selected = i === active;
            return (
              <button
                key={item.name}
                type="button"
                role="tab"
                id={`${groupId}-tab-${i}`}
                aria-selected={selected}
                aria-controls={`${groupId}-panel-${i}`}
                onClick={() => setActive(i)}
                className={cn(
                  "relative shrink-0 whitespace-nowrap px-5 py-3.5 text-[0.95rem] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  selected ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {item.name}
                {selected ? (
                  <motion.span
                    layoutId={`${groupId}-marker`}
                    className="absolute inset-x-0 -bottom-px h-[2px]"
                    style={{ background: rule }}
                    transition={{ duration: reducedMotion ? 0 : 0.4, ease: EASE }}
                    aria-hidden="true"
                  />
                ) : null}
              </button>
            );
          })}
        </div>

        {segment ? (
          <motion.div
            key={active}
            role="tabpanel"
            id={`${groupId}-panel-${active}`}
            aria-labelledby={`${groupId}-tab-${active}`}
            initial={reducedMotion ? false : { clipPath: "inset(0 100% 0 0)" }}
            animate={{ clipPath: "inset(0 0% 0 0)" }}
            transition={{ duration: 0.7, ease: EASE }}
            className="mt-14"
          >
            <div className="grid gap-x-14 gap-y-10 lg:grid-cols-[24rem_1fr]">
              <div>
                <h3 className="type-h3 text-balance text-foreground">{segment.name}</h3>
              </div>
              <p className="type-body-lg max-w-3xl text-muted">{segment.detail}</p>
            </div>

            <div className="mt-12 grid gap-x-8 gap-y-10 lg:grid-cols-2">
              {frames.map((slot) => (
                <figure key={slot.key}>
                  <NaturalMedia
                    image={slot.src}
                    video={slot.video}
                    ratio={slot.w / slot.h}
                    alt={slot.alt}
                    sizes="(min-width: 1024px) 45vw, 92vw"
                    className="rounded-[1.25rem] bg-[#0a0a0d]"
                  />
                  {slot.label ? (
                    <figcaption className="type-caption mt-4 border-t border-border pt-4 text-muted">
                      {slot.label}
                    </figcaption>
                  ) : null}
                </figure>
              ))}
            </div>
          </motion.div>
        ) : null}
      </Container>
    </section>
  );
}
