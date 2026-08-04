import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/common/container";

type GalleryItem = { src: string; title: string; note?: string };

/**
 * Selected work.
 *
 * Each frame behaves like the discipline-wall tiles on the homepage: point at it
 * and its corners sweep away into the silhouette of our own mark while the picture
 * turns over to a card naming the piece. The shape here is deliberately *heavier*
 * than the homepage's — a larger corner radius and a 3px rule — because these
 * tiles are smaller and the mark needs the extra weight to read.
 *
 * A PLAIN ALIGNED GRID. The columns used to drift against each other on scroll
 * (middle lagging, outer leading), which meant the tiles never lined up into rows
 * — at any given scroll position the grid was three columns at three different
 * heights, with ragged space above and below. It read as broken rather than as
 * depth. Rows line up now, and the section keeps its interest from the morph on
 * hover, which is the gesture that was worth having.
 *
 * Frames are contained, not cropped. One tile shape across a set that mixes 16:9
 * film frames with square simulation renders means something has to give, and it
 * is not going to be the work: the box is the constant, the whole frame is shown
 * inside it, and the dark plate behind is the mat. Pass a `cellRatio` matching
 * whatever shape the set mostly is and the mat all but disappears.
 */
export function WorkGrid({
  images,
  rule,
  cellRatio = "4 / 3",
}: {
  images: readonly GalleryItem[];
  rule: string;
  /** Tile shape, as a CSS `aspect-ratio`. Match the set's dominant aspect. */
  cellRatio?: string;
}) {
  return (
    <section
      id="work"
      className="scroll-mt-36 border-t border-border bg-[var(--surface)] py-20 md:py-28"
    >
      <Container size="xl">
        <div className="mb-12 flex items-center gap-4">
          <span className="block h-[2px] w-10" style={{ background: rule }} aria-hidden="true" />
          <h2 className="type-h3 text-foreground">Selected work</h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((item) => (
            <article
              key={item.src}
              className="group relative w-full"
              // Heavier than the homepage wall's 3rem: smaller tiles need a
              // bigger radius for the mark's shape to register.
              style={{ "--corner": "4rem", aspectRatio: cellRatio } as React.CSSProperties}
            >
              <div className="brand-shape-morph relative h-full w-full overflow-hidden bg-[#0a0a0d]">
                <Image
                  src={item.src}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 31vw, (min-width: 640px) 46vw, 92vw"
                  className="object-contain transition-[transform,opacity] duration-700 ease-out group-hover:scale-[1.05] group-hover:opacity-0 group-focus-within:opacity-0"
                />

                {/* Resting: the title, over a soft scrim at the foot. */}
                <div
                  className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent transition-opacity duration-500 group-hover:opacity-0 group-focus-within:opacity-0"
                  aria-hidden="true"
                />
                <div className="absolute inset-x-0 bottom-0 p-5 transition-opacity duration-300 group-hover:opacity-0 group-focus-within:opacity-0">
                  <p className="type-h4 text-[1.05rem] text-white">{item.title}</p>
                </div>

                {/* Hover: the card. Inside the clipped box, so it inherits the
                    mark's shape. */}
                <div className="absolute inset-0 flex flex-col justify-between bg-white p-6 opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-within:opacity-100">
                  <ArrowUpRight
                    className="size-6 self-end transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    style={{ color: rule }}
                    aria-hidden="true"
                  />
                  <div>
                    <h3 className="type-h4 text-[1.15rem] text-foreground">{item.title}</h3>
                    {item.note ? <p className="type-caption mt-2 text-muted">{item.note}</p> : null}
                  </div>
                </div>
              </div>

              {/* The rule that traces the mark. 3px — the "thicker" the tile
                  was asked to carry. */}
              <span
                className="brand-shape-morph pointer-events-none absolute inset-0 border-[3px] border-transparent transition-colors duration-500 group-hover:border-[rgba(21,20,26,0.6)]"
                aria-hidden="true"
              />
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
