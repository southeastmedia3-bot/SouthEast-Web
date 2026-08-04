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
 * WHERE THE SET IS ALL SHAPES, pass `layout="justified"` instead — see the note
 * on that prop. The uniform cell is right for a set that is roughly one shape and
 * wrong for one that isn't: mat a 0.26:1 liver strip into a square and the frame
 * is a sliver of picture adrift in a field of ground.
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
  layout = "grid",
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
   * Ignored under `layout="justified"`, which has no fixed cell.
   */
  cellRatio?: string;
  /**
   * Columns at the widest breakpoint (steps down to 3/2 on smaller screens).
   * Fewer columns means bigger cells, which is what a set of tall frames needs.
   * Ignored under `layout="justified"`, which fits as many as each row holds.
   */
  cols?: 3 | 4;
  /**
   * `grid` — the uniform cell above. Right when the set is broadly one shape.
   *
   * `justified` — rows of a common height, each frame at its own true width, the
   * row filled edge to edge: a contact sheet the way a printer would lay one up.
   * No cell, so no mat and no crop — every frame is its own picture, whole, at
   * its own proportions, and the sheet still squares off left and right.
   */
  layout?: "grid" | "justified";
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

        {layout === "justified" ? (
          <JustifiedSheet frames={frames} dark={dark} />
        ) : (
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
                  // The mat. On a light section a light mat lets the frames shot
                  // on white disappear into the page and the ones shot on black
                  // read as plates; on a dark section the reverse. A mid grey
                  // would fight both.
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
                <FrameCaption label={frame.label} />
              </figure>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}

/** The hover caption. Identical in both layouts, so it lives in one place. */
function FrameCaption({ label }: { label?: string }) {
  if (!label) return null;
  return (
    <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-black/85 to-transparent p-4 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
      <span className="type-caption text-[var(--ink-frame-foreground)]">{label}</span>
    </figcaption>
  );
}

/**
 * A justified contact sheet: rows of a common height, every frame at its own
 * true proportions, each row filled exactly edge to edge.
 *
 * This is pure CSS — no measuring, no resize listener, no layout shift after
 * hydration — and it works because of one identity. Give each frame
 *
 *     flex-basis: --row-h * aspect        flex-grow: aspect
 *
 * and its growth is proportional to its basis, so after flexbox hands out the
 * leftover space on a row every frame on it has width `aspect * H` for a single
 * H the row worked out for itself. Widths in proportion to aspect ratios is the
 * definition of a row of pictures at one height — and since each frame also
 * carries its own `aspect-ratio`, that height is what it actually renders at.
 * The same identity holds when a row overflows and the frames shrink instead, so
 * a 2.97:1 lung comparison alone on a narrow screen simply sits at full width.
 *
 * `--row-h` is the height a row *aims* for, not one it is held to: a row of wide
 * frames comes out shorter than a row of tall ones, which is exactly right — it
 * is what stops the tall frames from towering over the page.
 *
 * The trailing spacers are the one piece of housekeeping. Flexbox justifies the
 * last row like any other, so a sheet ending on a single frame would end on one
 * frame blown up to the full width of the page. The spacers are zero-height flex
 * items that soak up that space instead, leaving a short last row short.
 */
function JustifiedSheet({ frames, dark }: { frames: MediaSlot[]; dark: boolean }) {
  return (
    <div className="flex flex-wrap items-start gap-3 [--row-h:9rem] sm:[--row-h:12rem] lg:[--row-h:15rem] md:gap-4 xl:[--row-h:17rem]">
      {frames.map((frame) => {
        const aspect = frame.w / frame.h;
        return (
          <figure
            key={frame.key}
            className={cn(
              "group relative overflow-hidden",
              // Only ever seen while the image decodes — the box is the picture's
              // own shape, so once it lands there is no ground left showing.
              dark ? "bg-white/[0.04]" : "bg-foreground/[0.04]",
            )}
            style={{
              flexGrow: aspect,
              flexBasis: `calc(var(--row-h) * ${aspect.toFixed(4)})`,
              aspectRatio: `${frame.w} / ${frame.h}`,
            }}
          >
            <Image
              src={frame.src}
              alt={frame.alt}
              fill
              // Cover, not contain: the box is this frame's own aspect ratio, so
              // the two agree to the pixel and covering crops nothing. It just
              // spares the sub-pixel seam contain leaves down one edge.
              sizes="(min-width: 1280px) 42vw, (min-width: 768px) 55vw, 92vw"
              loading="lazy"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            />
            <FrameCaption label={frame.label} />
          </figure>
        );
      })}
      {/* Four is enough to absorb a full short row at every breakpoint. */}
      {[1.4, 1.4, 1.4, 1.4].map((aspect, i) => (
        <span
          key={`filler-${i}`}
          aria-hidden="true"
          className="h-0"
          style={{ flexGrow: aspect, flexBasis: `calc(var(--row-h) * ${aspect})` }}
        />
      ))}
    </div>
  );
}
