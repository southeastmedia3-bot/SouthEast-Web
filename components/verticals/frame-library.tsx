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
 * where the rest of it goes: every remaining frame.
 *
 * A REAL GRID, AND EVERY FRAME WHOLE. This was CSS multi-columns, which let each
 * frame keep its own height — and produced a masonry collage where nothing lined
 * up, columns ended at wildly different depths, and a tall render dragged one
 * column a screen below its neighbours. Now every frame sits in an identical cell
 * and the rows line up.
 *
 * The cell is a mat, not a crop. `object-contain` means a 2.9:1 lung comparison
 * and a 0.45:1 standing figure are both shown complete, at their own aspect,
 * inside the same box — which is the whole requirement for a library: the work is
 * what is being shown, so nothing in it may be cut off to make the layout tidy.
 * Where a set is mostly one shape, pass a `cellRatio` that matches it and the
 * mat all but disappears.
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
  cellRatio = "4 / 3",
  cols = 4,
}: {
  frames: MediaSlot[];
  heading: string;
  lead?: string;
  rule: string;
  id?: string;
  dark?: boolean;
  /**
   * The shape of every cell, as a CSS `aspect-ratio`. Pick the shape most of the
   * set already is — a run of 16:9 film frames wants `16 / 9`, a set with tall
   * anatomy in it wants something nearer square so the tall frames stay large.
   */
  cellRatio?: string;
  /**
   * Columns at the widest breakpoint (steps down to 3/2 on smaller screens).
   * Fewer columns means bigger cells, which is what a set of tall frames needs.
   */
  cols?: 3 | 4;
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

        <div
          className={cn(
            "grid grid-cols-2 gap-3 md:gap-4",
            cols === 3 ? "md:grid-cols-2 xl:grid-cols-3" : "md:grid-cols-3 xl:grid-cols-4",
          )}
        >
          {frames.map((frame) => (
            <figure
              key={frame.key}
              className={cn(
                "group relative overflow-hidden",
                // The mat. On a light section a light mat lets the frames shot on
                // white disappear into the page and the ones shot on black read as
                // plates; on a dark section the reverse. A mid grey would fight
                // both.
                dark ? "bg-white/[0.04]" : "bg-foreground/[0.04]",
              )}
              style={{ aspectRatio: cellRatio }}
            >
              <Image
                src={frame.src}
                alt={frame.alt}
                fill
                sizes={
                  cols === 3
                    ? "(min-width: 1280px) 30vw, (min-width: 768px) 46vw, 46vw"
                    : "(min-width: 1280px) 22vw, (min-width: 768px) 30vw, 46vw"
                }
                loading="lazy"
                className="object-contain transition-transform duration-700 ease-out group-hover:scale-[1.03]"
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
