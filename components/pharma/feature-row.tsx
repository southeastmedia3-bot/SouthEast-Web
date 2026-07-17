"use client";

import Image from "next/image";
import { Check } from "lucide-react";
import { Container } from "@/components/common/container";
import { Reveal } from "@/components/common/reveal";
import { LoopVideo } from "@/components/pharma/loop-video";
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
  imageContain?: boolean;
};

/**
 * A single deck subject as a media-and-text row, sides alternating down the page.
 * Renders a looping video when one is supplied, otherwise the still. This carries
 * the library (slide 2) and dermatology (slide 24) sections and is the workhorse
 * of the rebuilt page.
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
  imageContain = false,
}: FeatureRowProps) {
  return (
    <section
      id={id}
      className={cn(
        "scroll-mt-36 border-t py-20 md:py-28",
        dark ? "border-white/10 bg-[#05070d]" : "border-border bg-white",
      )}
    >
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className={cn(side === "left" && "lg:order-2")}>
            <Reveal>
              <p
                className="type-label mb-5"
                style={{ color: dark ? "var(--brand-sky)" : "var(--brand-blue)" }}
              >
                {eyebrow}
              </p>
              <h2
                className={cn(
                  "type-h3 text-balance",
                  dark ? "text-[var(--ink-frame-foreground)]" : "text-foreground",
                )}
              >
                {title}
              </h2>
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

          <Reveal delay={0.1} className={cn(side === "left" && "lg:order-1")}>
            <div
              className={cn(
                "relative aspect-[4/3] w-full overflow-hidden rounded-[1.75rem]",
                dark ? "bg-black" : "bg-[#f3f0e8]",
              )}
            >
              {video && poster ? (
                <LoopVideo src={video} poster={poster} />
              ) : (
                <Image
                  src={image}
                  alt={imageAlt}
                  fill
                  sizes="(min-width: 1024px) 45vw, 92vw"
                  className={imageContain ? "object-contain" : "object-cover"}
                />
              )}
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
