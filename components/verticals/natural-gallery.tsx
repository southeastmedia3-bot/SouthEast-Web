import { Container } from "@/components/common/container";
import { NaturalMedia } from "@/components/pharma/natural-media";
import type { MediaSlot } from "@/data/media";
import { cn } from "@/lib/utils";

export type GalleryEntry = {
  slot: MediaSlot;
  /** What the frame on screen is. */
  title: string;
  /** The named format the slot is reserved for. */
  note?: string;
};

/**
 * Selected work, shown whole.
 *
 * The shared `WorkGrid` crops every frame to a uniform 4:3 tile, which is the one
 * thing the media rule on these pages forbids — so this is its natural-aspect
 * counterpart: two columns, each frame taking the shape of its own file, the right
 * column dropped half a frame so the two never line up into a grid. Aspects
 * alternate down each column, so no two neighbouring frames share a crop.
 *
 * The curtain opens from alternating edges (Iris/Curtain) rather than fading in —
 * the frames arrive, they do not appear.
 */

/** Caption block plus the rule above it, in the same units as the frame heights. */
const CAPTION = 0.13;

/**
 * Deal the frames into two columns so both end at roughly the same line, and say
 * which column should carry the half-frame drop.
 *
 * Alternating by index — the obvious split — is what left a screen of white
 * under the shorter column, because a run of squares on one side and 16:9s on
 * the other is exactly what the alternating aspects produce. So each frame goes
 * to whichever column is currently shorter, measured in column-widths from the
 * slot's own `w`/`h`. Nothing is cropped to make it fit; the order is preserved.
 *
 * The stagger then goes on the column that finished *shorter*, so the offset
 * absorbs what is left of the imbalance instead of adding to it. Which side it
 * lands on is immaterial — its whole job is to stop the two columns lining up
 * into a grid, and it does that from either side.
 */
function deal(entries: GalleryEntry[]) {
  const columns: [GalleryEntry[], GalleryEntry[]] = [[], []];
  const height: [number, number] = [0, 0];

  for (const entry of entries) {
    const c = height[1] < height[0] ? 1 : 0;
    columns[c].push(entry);
    height[c] += entry.slot.h / entry.slot.w + CAPTION;
  }

  return { columns, stagger: height[0] <= height[1] ? 0 : 1 };
}

export function NaturalGallery({
  entries,
  rule,
  eyebrow = "Selected work",
  heading,
}: {
  entries: GalleryEntry[];
  rule: string;
  eyebrow?: string;
  heading?: string;
}) {
  const { columns, stagger } = deal(entries);

  return (
    <section
      id="work"
      className="scroll-mt-36 border-t border-border bg-[var(--surface)] py-20 md:py-28"
    >
      <Container size="xl">
        <div className="mb-14 flex items-center gap-4">
          <span className="block h-[2px] w-10" style={{ background: rule }} aria-hidden="true" />
          <h2 className="type-h3 text-foreground">{heading ?? eyebrow}</h2>
        </div>

        <div className="grid gap-x-8 gap-y-14 lg:grid-cols-2">
          {columns.map((column, c) => (
            <div key={c} className={cn("flex flex-col gap-14", c === stagger && "lg:mt-28")}>
              {column.map((entry) => (
                <figure key={entry.slot.key}>
                  {/* Curtain held inside the frame — see `NaturalMedia`'s
                      `reveal`. Around the outside it hid the frame's own ground
                      as well as the picture, which is what read as blank space
                      down this column. */}
                  <NaturalMedia
                    image={entry.slot.src}
                    video={entry.slot.video}
                    ratio={entry.slot.w / entry.slot.h}
                    alt={entry.slot.alt}
                    sizes="(min-width: 1024px) 45vw, 92vw"
                    className="bg-[#0a0a0d]"
                    reveal={c === 0 ? "right" : "left"}
                  />
                  <figcaption className="mt-4 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-t border-border pt-4">
                    <span className="type-h4 text-[1.05rem] text-foreground">{entry.title}</span>
                    {entry.note ? (
                      <span className="type-label text-muted" style={{ color: rule }}>
                        {entry.note}
                      </span>
                    ) : null}
                  </figcaption>
                </figure>
              ))}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
