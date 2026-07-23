import { Container } from "@/components/common/container";
import { Reveal } from "@/components/common/reveal";

/**
 * The capabilities, set as a call sheet.
 *
 * Every other vertical lists its capabilities as a numbered grid, which is the
 * right answer when the payload is a set of disciplines. A shooting division is
 * not bought that way: a producer books *units* — camera, lighting and grip,
 * cast and coordination, locations — and the document that names them is a call
 * sheet. So this is one. Ruled rows, a mono header band, and a unit number down
 * the left, on paper rather than in a card.
 *
 * The point it makes structurally is the one the page's proof band states in
 * words: every line on this sheet is in the building. A call sheet with six units
 * and no subcontractor column is an argument.
 */
export function FilmsCallSheet({
  units,
  rule,
  id,
}: {
  units: { name: string; detail: string }[];
  rule: string;
  id?: string;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-36 border-t border-border bg-[var(--surface)] py-20 md:py-28"
    >
      <Container size="xl">
        <div className="mb-12 max-w-3xl">
          <div className="mb-4 flex items-center gap-4">
            <span className="block h-[2px] w-10" style={{ background: rule }} aria-hidden="true" />
            <p className="type-label text-muted">The units</p>
          </div>
          <Reveal mask>
            <h2 className="type-h2 text-balance text-foreground">
              Six units, one building, no subcontractors.
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="type-body-lg mt-6 text-muted">
              A shooting division is booked as departments, not as adjectives. This is the sheet.
            </p>
          </Reveal>
        </div>

        {/* The document's header band. */}
        <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 border-y border-[color:var(--border-strong)] py-3">
          <span className="type-label text-foreground">Call sheet</span>
          <span className="type-label text-muted">In-house units</span>
          <span className="type-label text-muted">Sheet 01 / 01</span>
        </div>

        <dl>
          {units.map((unit, i) => (
            <Reveal key={unit.name} delay={Math.min(i, 3) * 0.05}>
              <div className="grid gap-x-10 gap-y-2 border-b border-border py-7 md:grid-cols-[5.5rem_18rem_minmax(0,1fr)] md:py-8">
                <span className="type-index self-start text-muted">
                  UNIT {String(i + 1).padStart(2, "0")}
                </span>
                <dt className="type-h4 text-[1.15rem] text-foreground">{unit.name}</dt>
                <dd className="type-body max-w-2xl text-muted">{unit.detail}</dd>
              </div>
            </Reveal>
          ))}
        </dl>

        <p className="type-caption mt-6 text-muted">
          No line on this sheet is subcontracted. The people who specify the capture are the people
          who have to finish it.
        </p>
      </Container>
    </section>
  );
}
