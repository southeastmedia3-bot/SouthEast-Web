import { Container } from "@/components/common/container";
import { Reveal } from "@/components/common/reveal";
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
 * The shared `WorkGrid` crops every frame to a uniform 4:3 tile, which is the one
 * thing the media rule on these pages forbids — so this is its natural-aspect
 * counterpart: two columns, each frame taking the shape of its own file, the right
 * column dropped half a frame so the two never line up into a grid. Aspects
 * alternate down each column, so no two neighbouring frames share a crop.
 *
 * The curtain opens from alternating edges (Iris/Curtain) rather than fading in —
 * the frames arrive, they do not appear.
 */
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
  const columns = [entries.filter((_, i) => i % 2 === 0), entries.filter((_, i) => i % 2 === 1)];

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
            <div
              key={c}
              className={c === 1 ? "flex flex-col gap-14 lg:mt-28" : "flex flex-col gap-14"}
            >
              {column.map((entry, i) => (
                <figure key={entry.slot.key}>
                  <Reveal clip={c === 0 ? "right" : "left"} y={0} duration={0.95} delay={i * 0.04}>
                    <NaturalMedia
                      image={entry.slot.src}
                      video={entry.slot.video}
                      ratio={entry.slot.w / entry.slot.h}
                      alt={entry.slot.alt}
                      sizes="(min-width: 1024px) 45vw, 92vw"
                      className="bg-[#0a0a0d]"
                    />
                  </Reveal>
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
