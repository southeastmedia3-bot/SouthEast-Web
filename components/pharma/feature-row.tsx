"use client";

import { Check } from "lucide-react";
import { Container } from "@/components/common/container";
import { Reveal } from "@/components/common/reveal";
import { NaturalMedia } from "@/components/pharma/natural-media";
import { Parallax } from "@/components/pharma/parallax";
import { cn } from "@/lib/utils";

type FeatureRowProps = {
  id?: string;
  eyebrow: string;
  title: string;
  body: string;
  points?: readonly string[];
  states?: readonly string[];
  image: string;
  imageAlt?: string;
  video?: string;
  poster?: string;
  /** Which side the media sits on at desktop. */
  side?: "left" | "right";
  /** Dark ground (for the black-background renders / loops). */
  dark?: boolean;
  /** A SectionSeam sits directly above — drop the top rule so they don't double. */
  seamAbove?: boolean;
};

/**
 * A single deck subject as a media-and-text row, sides alternating down the page.
 * The media is shown whole at its own shape (NaturalMedia) — never cropped —
 * whether it is a still or a looping video. Carries the library (slide 2) and
 * dermatology (slide 24) sections.
 */
export function FeatureRow({
  id,
  eyebrow,
  title,
  body,
  points,
  states,
  image,
  imageAlt = "",
  video,
  poster,
  side = "right",
  dark = false,
  seamAbove = false,
}: FeatureRowProps) {
  return (
    <section
      id={id}
      className={cn(
        "scroll-mt-36 py-20 md:py-28",
        !seamAbove && "border-t",
        dark ? "border-white/10 bg-[#05070d]" : "border-border bg-white",
      )}
    >
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className={cn(side === "left" && "lg:order-2")}>
            <Reveal x={side === "left" ? 44 : -44}>
              <p
                className="type-label mb-5"
                style={{ color: dark ? "var(--brand-sky)" : "var(--brand-blue)" }}
              >
                {eyebrow}
              </p>
            </Reveal>
            <Reveal mask delay={0.06}>
              <h2
                className={cn(
                  "type-h3 text-balance",
                  dark ? "text-[var(--ink-frame-foreground)]" : "text-foreground",
                )}
              >
                {title}
              </h2>
            </Reveal>
            <Reveal delay={0.16} y={16}>
              <p
                className={cn(
                  "type-body-lg mt-5 max-w-xl",
                  dark ? "text-[color:var(--brand-ice)]/70" : "text-muted",
                )}
              >
                {body}
              </p>

              {points?.length ? (
                <ul className="mt-8 flex flex-col gap-3.5">
                  {points.map((point) => (
                    <li key={point} className="flex gap-3">
                      <Check
                        className="mt-0.5 size-5 shrink-0"
                        style={{ color: dark ? "var(--brand-sky)" : "var(--brand-blue)" }}
                        aria-hidden="true"
                      />
                      <span
                        className={cn(
                          "type-body",
                          dark ? "text-[color:var(--brand-ice)]/80" : "text-foreground",
                        )}
                      >
                        {point}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : null}

              {states?.length ? (
                <ul className="mt-8 flex flex-wrap gap-2.5">
                  {states.map((state) => (
                    <li
                      key={state}
                      className={cn(
                        "rounded-full border px-3.5 py-1.5 text-sm font-medium",
                        dark
                          ? "border-white/15 text-[color:var(--brand-ice)]/80"
                          : "border-border-strong text-foreground",
                      )}
                    >
                      {state}
                    </li>
                  ))}
                </ul>
              ) : null}
            </Reveal>
          </div>

          <Parallax distance={20} className={cn(side === "left" && "lg:order-1")}>
            <Reveal delay={0.1} y={0} rotateY={side === "left" ? -12 : 12} duration={0.9}>
              <div
                className={cn(
                  "overflow-hidden rounded-[1.5rem] border",
                  dark
                    ? "border-white/10 bg-[#0a0c11]"
                    : "border-border bg-white shadow-[0_40px_90px_-55px_rgba(21,20,26,0.4)]",
                )}
              >
                <NaturalMedia
                  image={image}
                  video={video}
                  poster={poster}
                  alt={imageAlt}
                  sizes="(min-width: 1024px) 46vw, 92vw"
                />
              </div>
            </Reveal>
          </Parallax>
        </div>
      </Container>
    </section>
  );
}
