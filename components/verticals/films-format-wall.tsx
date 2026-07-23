import { Container } from "@/components/common/container";
import { Reveal } from "@/components/common/reveal";
import type { VerticalSection } from "@/data/verticals";

/**
 * The named formats, as slates.
 *
 * DELIBERATELY WITHOUT PHOTOGRAPHY, and that is the whole design decision. The
 * SaaS and Animation pages zip a frame to every format card, which works because
 * every format on those pages has finished work behind it. Here the list runs to
 * corporate podcasts, interviews and facility shoots, and the finished library is
 * commercial product and brand films — so a frame per card would have put a
 * jewellery still under "corporate podcast" and claimed a piece of work that does
 * not exist. See the note on `filmsAssets` in `data/media.ts`.
 *
 * What replaces it is the one object every one of these formats genuinely has in
 * common: the slate that gets shot at the head of every take. Ink on paper, the
 * clapper bar drawn rather than photographed, and the bar runs on hover — the
 * sticks closing. It is a device the page can own precisely because it is not a
 * picture of somebody else's shoot.
 */
export function FilmsFormatWall({
  section,
  rule,
  id,
}: {
  section: VerticalSection;
  rule: string;
  id?: string;
}) {
  const formats = section.items ?? [];

  return (
    <section
      id={id}
      className="scroll-mt-36 border-t border-border bg-[var(--surface-elevated)] py-20 md:py-28"
    >
      <Container size="xl">
        <div className="mb-16 max-w-3xl">
          {section.eyebrow ? (
            <p className="type-label mb-4" style={{ color: rule }}>
              {section.eyebrow}
            </p>
          ) : null}
          <Reveal mask>
            <h2 className="type-h2 text-balance text-foreground">{section.heading}</h2>
          </Reveal>
          {section.lead ? (
            <Reveal delay={0.08}>
              <p className="type-body-lg mt-6 text-foreground">{section.lead}</p>
            </Reveal>
          ) : null}
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {formats.map((format, i) => (
            <Reveal key={format.name} delay={(i % 4) * 0.06}>
              <article className="group flex h-full flex-col border border-[color:var(--border-strong)] bg-[var(--surface)] transition-colors duration-300 hover:border-foreground">
                {/* The sticks. Wider than the slate and pulled left, so the
                    hover slides a continuous run of stripes rather than
                    revealing an edge. */}
                <div className="h-7 shrink-0 overflow-hidden" aria-hidden="true">
                  <div
                    className="h-full w-[calc(100%+42px)] -translate-x-[42px] transition-transform duration-700 ease-out group-hover:translate-x-0"
                    style={{
                      background:
                        "repeating-linear-gradient(115deg, #15141a 0 21px, #f3f0e8 21px 42px)",
                    }}
                  />
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="type-index text-muted">
                      SLATE {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className="block h-[2px] w-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                      style={{ background: rule }}
                      aria-hidden="true"
                    />
                  </div>
                  <h3 className="type-h4 mt-4 text-[1.15rem] text-foreground">{format.name}</h3>
                  <p className="type-body mt-3 text-muted">{format.detail}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
