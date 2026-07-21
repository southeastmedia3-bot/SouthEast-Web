import Image from "next/image";
import { Container } from "@/components/common/container";
import { Reveal } from "@/components/common/reveal";
import type { MediaSlot } from "@/data/media";

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
 * Sheets are dense and meant to be read, so they take full width and scroll
 * inside their own box on narrow screens rather than shrinking past legibility.
 */
export function SheetPair({
  sheets,
  heading,
  lead,
  rule,
  id,
}: {
  sheets: MediaSlot[];
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
                <div className="overflow-x-auto bg-[#0a0a0d]">
                  <Image
                    src={sheet.src}
                    alt={sheet.alt}
                    width={sheet.w}
                    height={sheet.h}
                    sizes="(min-width: 1024px) 92vw, 180vw"
                    loading="lazy"
                    className="h-auto w-full min-w-[40rem] max-w-none"
                  />
                </div>
              </Reveal>
              <figcaption className="mt-4 flex flex-wrap items-baseline gap-x-5 gap-y-1 border-t border-border pt-4">
                <span className="type-index text-muted">{String(i + 1).padStart(2, "0")}</span>
                <span className="type-h4 text-[1.05rem] text-foreground">{sheet.label}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}
