import Image from "next/image";
import { Container } from "@/components/common/container";
import { Reveal } from "@/components/common/reveal";
import { studioDiagrams } from "@/data/media";

const PANELS = [studioDiagrams.pitching, studioDiagrams.workflow] as const;

const CAPTIONS: Record<string, string> = {
  diagramPitching: "Who touches a brief before it becomes a pitch.",
  diagramWorkflow: "What happens to it after the pitch is won.",
};

/**
 * The studio's two internal flow diagrams, published unedited.
 *
 * These are working documents — the ones the producers actually route jobs
 * against — not marketing illustrations drawn to look organised. That is the
 * point: an outsourced media division is a claim about structure, and this is
 * the structure. Anyone can write "one accountable studio"; far fewer can show
 * the chart.
 *
 * They are wide, dense and meant to be read, so they sit on a light ground at
 * full width with a horizontal scroll on narrow screens rather than being
 * shrunk to fit a phone.
 */
export function StudioFlow() {
  return (
    <section className="border-t border-border bg-[var(--surface)] py-20 md:py-28">
      <Container size="xl">
        <div className="grid items-end gap-10 lg:grid-cols-[1fr_auto]">
          <Reveal>
            <p className="type-label mb-4 text-accent-ink">How the studio is wired</p>
            <h2 className="type-h3 max-w-2xl text-balance text-foreground">
              The two charts we actually run jobs against.
            </h2>
          </Reveal>
          {/* Where both charts start, and the only stage that is still paper. */}
          <Reveal delay={0.08}>
            <Image
              src={studioDiagrams.desk.src}
              alt={studioDiagrams.desk.alt}
              width={studioDiagrams.desk.w}
              height={studioDiagrams.desk.h}
              sizes="(min-width: 1024px) 26rem, 92vw"
              className="h-auto w-full rounded-[0.35rem] lg:w-[26rem]"
            />
          </Reveal>
        </div>

        <div className="mt-14 space-y-14">
          {PANELS.map((panel, i) => (
            <figure key={panel.key}>
              <Reveal delay={i * 0.06}>
                {/* Dense line art. It scrolls inside its own box rather than
                    shrinking below the point the labels stop being legible. */}
                <div className="overflow-x-auto rounded-[0.35rem] border border-border bg-white">
                  <Image
                    src={panel.src}
                    alt={panel.alt}
                    width={panel.w}
                    height={panel.h}
                    sizes="(min-width: 1024px) 92vw, 200vw"
                    className="h-auto w-full min-w-[46rem] max-w-none"
                  />
                </div>
              </Reveal>
              <figcaption className="mt-4 flex flex-wrap items-baseline gap-x-5 gap-y-1 border-t border-border pt-4">
                <span className="type-h4 text-[1.05rem] text-foreground">{panel.label}</span>
                <span className="type-body text-muted">{CAPTIONS[panel.key]}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}
