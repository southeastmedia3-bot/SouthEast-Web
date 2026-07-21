import Image from "next/image";
import { Container } from "@/components/common/container";
import { Reveal } from "@/components/common/reveal";
import type { MediaSlot } from "@/data/media";
import { cn } from "@/lib/utils";

/**
 * The whole library, shown as a contact sheet.
 *
 * A visitor lands on one service page and never sees the others, so each page has
 * to carry the complete run of its own discipline — not a curated six. This is
 * where the rest of it goes: every remaining frame, dense, at natural aspect.
 *
 * CSS multi-column rather than a grid. A grid forces one row height and would
 * crop square simulation renders and 16:9 film frames into the same tile; columns
 * let each frame keep its own shape and let the mixed aspects interlock. That
 * matters more here than anywhere else on the site, because a library is exactly
 * where the shapes are most varied.
 *
 * Frames already shown higher up the page reappear here on purpose — a contact
 * sheet that skips the ones you have seen is not a contact sheet.
 */
export function FrameLibrary({
  frames,
  heading,
  lead,
  rule,
  id,
  dark = false,
}: {
  frames: MediaSlot[];
  heading: string;
  lead?: string;
  rule: string;
  id?: string;
  dark?: boolean;
}) {
  return (
    <section
      id={id}
      className={cn(
        "scroll-mt-36 border-t py-20 md:py-28",
        dark ? "border-white/10 bg-[#0a0a0d]" : "border-border bg-[var(--surface)]",
      )}
    >
      <Container size="xl">
        <Reveal>
          <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="block h-[2px] w-10" style={{ background: rule }} aria-hidden="true" />
            <h2
              className={cn(
                "type-h3",
                dark ? "text-[var(--ink-frame-foreground)]" : "text-foreground",
              )}
            >
              {heading}
            </h2>
            {/* Not tinted with `rule`. The brand hues are ~2.4:1 as small text on
                the light ground, so the rule stays on the bar where it is a
                graphic, and the count reads in a colour you can actually read. */}
            <span
              className={cn("type-index", dark ? "text-[color:var(--brand-ice)]/70" : "text-muted")}
            >
              {frames.length} frames
            </span>
          </div>
          {lead ? (
            <p
              className={cn(
                "type-body mb-12 max-w-2xl",
                dark ? "text-[color:var(--brand-ice)]/60" : "text-muted",
              )}
            >
              {lead}
            </p>
          ) : null}
        </Reveal>

        <div className="columns-2 gap-3 md:columns-3 md:gap-4 xl:columns-4">
          {frames.map((frame) => (
            <figure
              key={frame.key}
              // `break-inside-avoid` is what stops a column split tearing a frame
              // in half; `mb-*` is the vertical gutter (columns ignore `gap-y`).
              className="group relative mb-3 break-inside-avoid overflow-hidden bg-[#0a0a0d] md:mb-4"
            >
              <Image
                src={frame.src}
                alt={frame.alt}
                width={frame.w}
                height={frame.h}
                sizes="(min-width: 1280px) 22vw, (min-width: 768px) 30vw, 46vw"
                loading="lazy"
                className="h-auto w-full transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              />
              {frame.label ? (
                <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-black/85 to-transparent p-4 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  <span className="type-caption text-[var(--ink-frame-foreground)]">
                    {frame.label}
                  </span>
                </figcaption>
              ) : null}
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}
