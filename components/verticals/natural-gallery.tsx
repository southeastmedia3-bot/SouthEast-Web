import { Container } from "@/components/common/container";
import { NaturalMedia } from "@/components/pharma/natural-media";
import type { MediaSlot } from "@/data/media";

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
 * The media rule on these pages is that a frame is never cropped to fit a tile,
 * and that still holds — but it used to be paid for with the layout: two columns
 * dealt by running height, one of them dropped half a frame so the two "never
 * line up into a grid". Deliberately ragged, and it read as exactly that. Frames
 * sat at unrelated heights, the columns ended at different depths, and the drop
 * left a hole under the shorter one.
 *
 * So the grid is a grid. Every frame sits in an identical cell, rows line up, and
 * nothing is cropped to make that happen: the cell is a mat and the frame is
 * contained inside it at its own aspect. Wide film frames and square renders can
 * then sit next to each other without either being cut.
 *
 * The curtain still opens from alternating edges — the frames arrive, they do not
 * appear.
 */
export function NaturalGallery({
  entries,
  rule,
  eyebrow = "Selected work",
  heading,
  cellRatio = 4 / 3,
}: {
  entries: GalleryEntry[];
  rule: string;
  eyebrow?: string;
  heading?: string;
  /** Cell shape as w/h. Match the set's dominant aspect and the mat vanishes. */
  cellRatio?: number;
}) {
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

        <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {entries.map((entry, i) => (
            <figure key={entry.slot.key}>
              {/* Curtain held inside the frame — see `NaturalMedia`'s `reveal`.
                  Around the outside it hid the frame's own ground as well as the
                  picture, which is what read as blank space down this column. */}
              <NaturalMedia
                image={entry.slot.src}
                video={entry.slot.video}
                // The cell shape, not the file's — the file's own shape is
                // preserved by containing it inside the cell instead.
                ratio={cellRatio}
                alt={entry.slot.alt}
                sizes="(min-width: 1024px) 31vw, (min-width: 640px) 46vw, 92vw"
                className="bg-[#0a0a0d]"
                imgClassName="object-contain"
                reveal={i % 2 === 0 ? "right" : "left"}
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
      </Container>
    </section>
  );
}
