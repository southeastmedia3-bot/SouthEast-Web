import { Container } from "@/components/common/container";
import { Reveal } from "@/components/common/reveal";
import { NaturalMedia } from "@/components/pharma/natural-media";
import { animationAssets } from "@/data/media";
import { cn } from "@/lib/utils";

/**
 * How a frame gets made — four artifacts, not four illustrations.
 *
 * The process rail above this says the stages in words. This is the evidence:
 * the actual board cell, the actual set, the actual lighting study and the actual
 * finished frame, in the order they were made. Its whole value is that these are
 * files off our own machines — a stage whose artifact is somebody else's work
 * proves the opposite of what the section claims, which is why the stock "SCRIPT
 * on a desk" photograph in `/media/process/` is not among them.
 *
 * Rows alternate sides and the frames take their own shapes, so the run reads as
 * a sequence of documents rather than a table of thumbnails.
 */
export function AnimationLadder({ id, rule }: { id?: string; rule: string }) {
  return (
    <section
      id={id}
      className="scroll-mt-36 border-t border-border bg-[var(--surface-elevated)] py-20 md:py-28"
    >
      <Container size="xl">
        <Reveal>
          <div className="mb-3 flex items-center gap-4">
            <span className="block h-[2px] w-10" style={{ background: rule }} aria-hidden="true" />
            <h2 className="type-h3 text-foreground">From a marker line to a graded frame</h2>
          </div>
          <p className="type-body mb-16 max-w-2xl text-muted">
            Four files off our own machines, in the order they were made. Every stage of an
            animation still exists here, which is the only way to prove every stage happened here.
          </p>
        </Reveal>

        <div className="flex flex-col gap-16 md:gap-24">
          {animationAssets.ladder.map((artifact, i) => (
            <article
              key={artifact.key}
              className={cn(
                "grid items-center gap-x-12 gap-y-6 md:grid-cols-2",
                // Alternating sides. The frame is ordered first on mobile either
                // way — the picture is the point, the caption explains it.
                i % 2 === 1 && "md:[&>figure]:order-1",
              )}
            >
              <figure className="order-1 md:order-none">
                <NaturalMedia
                  image={artifact.src}
                  ratio={artifact.w / artifact.h}
                  alt={artifact.alt}
                  sizes="(min-width: 768px) 45vw, 92vw"
                  className="rounded-[1.25rem] bg-[#0a0a0d]"
                  reveal={i % 2 === 0 ? "left" : "right"}
                />
              </figure>

              <div className="order-2 md:order-none">
                <Reveal>
                  <div className="flex items-baseline gap-4">
                    <span className="type-index text-muted">{String(i + 1).padStart(2, "0")}</span>
                    <p className="type-label" style={{ color: rule }}>
                      {artifact.stage}
                    </p>
                  </div>
                  <p className="type-h4 mt-5 max-w-md text-balance text-[1.35rem] text-foreground">
                    {artifact.label}
                  </p>
                  <span
                    className="mt-7 block h-px w-24 bg-[color:var(--border-strong)]"
                    aria-hidden="true"
                  />
                </Reveal>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
