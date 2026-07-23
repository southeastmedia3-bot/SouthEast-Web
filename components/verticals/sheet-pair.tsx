import Image from "next/image";
import { Container } from "@/components/common/container";
import { Reveal } from "@/components/common/reveal";
import type { SheetSlot } from "@/data/media";
import { cn } from "@/lib/utils";

/**
 * Two contact sheets from one project, stacked and labelled.
 *
 * Used for the wearable work: a sheet of pencil line-pass frames above a sheet of
 * the finished renders. The argument is the studio's own — geometry and framing
 * are settled in line before anything is made beautiful — and showing both
 * documents whole makes it without a word of copy.
 *
 * NOT a compare slider, and not paired thumbnails. The pencil files carry
 * arbitrary numeric suffixes, so sketch N is not render N; any side-by-side that
 * implied otherwise would be asserting a correspondence that does not exist.
 * Two complete documents, in sequence, claiming only what is true.
 *
 * Each sheet is laid out here from its own frames rather than loaded as a baked
 * sheet JPG. The exported sheets sat on a fixed four-column canvas, so a set of
 * nine arrived with three empty cells and a black band burnt into the file —
 * dead space at the bottom right that no amount of CSS could crop out, and which
 * read on the page as a layout that had failed to load. Live, the grid ends where
 * the frames end, each tile serves at its own size, and the last row is always
 * full (see the `cols` note on `SheetSlot`).
 */
export function SheetPair({
  sheets,
  heading,
  lead,
  rule,
  id,
}: {
  sheets: SheetSlot[];
  heading: string;
  lead?: string;
  rule: string;
  id?: string;
}) {
  return (
    <section id={id} className="scroll-mt-36 border-t border-border bg-background py-20 md:py-28">
      <Container size="xl">
        <Reveal>
          <div className="mb-3 flex items-center gap-4">
            <span className="block h-[2px] w-10" style={{ background: rule }} aria-hidden="true" />
            <h2 className="type-h3 text-foreground">{heading}</h2>
          </div>
          {lead ? <p className="type-body mb-12 max-w-2xl text-muted">{lead}</p> : null}
        </Reveal>

        <div className="space-y-12">
          {sheets.map((sheet, i) => (
            <figure key={sheet.key}>
              <Reveal delay={i * 0.06}>
                {/* Hairline gutters over the near-black ground, so the sheet keeps
                    the ruled look of the exported original — the gap is the rule. */}
                <div className={cn("grid gap-px bg-[#0a0a0d] p-px", GRID[sheet.cols])}>
                  {sheet.frames.map((frame) => (
                    <div key={frame.key} className="relative aspect-square">
                      <Image
                        src={frame.src}
                        alt={frame.alt}
                        fill
                        sizes={SIZES[sheet.cols]}
                        loading="lazy"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </Reveal>
              <figcaption className="mt-4 flex flex-wrap items-baseline gap-x-5 gap-y-1 border-t border-border pt-4">
                <span className="type-index text-muted">{String(i + 1).padStart(2, "0")}</span>
                <span className="type-h4 text-[1.05rem] text-foreground">{sheet.label}</span>
                <span className="type-index ml-auto text-muted">{sheet.frames.length} frames</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* Column counts are spelled out rather than composed, because Tailwind only
   emits the classes it can see in the source. The mobile count is chosen to
   divide the same frame totals the desktop count does — a sheet that is whole
   at 1440px and holed at 390px is still a holed sheet. */
const GRID: Record<SheetSlot["cols"], string> = {
  3: "grid-cols-3",
  4: "grid-cols-2 md:grid-cols-4",
  5: "grid-cols-2 md:grid-cols-5",
};

const SIZES: Record<SheetSlot["cols"], string> = {
  3: "(min-width: 1024px) 31vw, 32vw",
  4: "(min-width: 768px) 23vw, 47vw",
  5: "(min-width: 768px) 19vw, 47vw",
};
