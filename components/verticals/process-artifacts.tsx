import { Container } from "@/components/common/container";
import { Reveal } from "@/components/common/reveal";
import { NaturalMedia } from "@/components/pharma/natural-media";
import { productionArtifacts } from "@/data/media";

/**
 * The process, shown instead of described.
 *
 * `ProcessRail` above it states the stages in words. This states them in files:
 * the boards, the look-dev frame, the key render, the contact sheet and the
 * finished film — all from one audio project, in the order they were made.
 * Nothing here is an illustration of a pipeline; it is the pipeline's own
 * output, which is the only version of this claim a visitor can actually check.
 *
 * That is also why the run starts at the storyboard rather than the moodboard —
 * see the note on `productionArtifacts` in `data/media.ts` before adding a stage.
 *
 * The stage name and one short line are the entire text budget per frame. If a
 * caption needs a second sentence, the frame is not carrying its weight.
 *
 * Frames take their own shape via `NaturalMedia` — a wide board strip, a contact
 * sheet and a 16:9 film are three different rectangles, and forcing them into
 * one tile would flatten the thing the section is about.
 */
export function ProcessArtifacts({ rule, id }: { rule: string; id?: string }) {
  return (
    <section
      id={id}
      className="scroll-mt-36 border-t border-border bg-[var(--surface)] py-20 md:py-28"
    >
      <Container size="xl">
        <Reveal>
          <div className="mb-3 flex items-center gap-4">
            <span className="block h-[2px] w-10" style={{ background: rule }} aria-hidden="true" />
            <h2 className="type-h3 text-foreground">One film, every stage kept</h2>
          </div>
          <p className="type-body mb-14 max-w-xl text-muted">
            The same project, start to finish. Every file below came off our own machines.
          </p>
        </Reveal>

        <ol className="grid gap-x-8 gap-y-14 md:grid-cols-2">
          {productionArtifacts.map((artifact, i) => {
            // The board strip and the contact sheet are worth reading detail in,
            // and the finished film is the payoff — those three run full width,
            // which also leaves the two middle frames as a clean pair.
            const full = i === 0 || i >= 3;
            return (
              <li key={artifact.key} className={full ? "md:col-span-2" : undefined}>
                <Reveal delay={(i % 2) * 0.06}>
                  <NaturalMedia
                    image={artifact.src}
                    video={artifact.video}
                    ratio={artifact.w / artifact.h}
                    alt={artifact.alt}
                    sizes={full ? "92vw" : "(min-width: 768px) 45vw, 92vw"}
                    className="bg-[#0a0a0d]"
                  />
                </Reveal>
                <div className="mt-4 flex flex-wrap items-baseline gap-x-5 gap-y-1 border-t border-border pt-4">
                  <span className="type-index text-muted">{String(i + 1).padStart(2, "0")}</span>
                  <span className="type-h4 text-[1.05rem] text-foreground">{artifact.stage}</span>
                  <span className="type-body text-muted">{artifact.label}</span>
                </div>
              </li>
            );
          })}
        </ol>
      </Container>
    </section>
  );
}
