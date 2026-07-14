import { Check, X } from "lucide-react";
import { Container } from "@/components/common/container";
import { Reveal } from "@/components/common/reveal";
import type { Vertical } from "@/data/verticals";

/**
 * The case for the discipline, stated as a contrast — the device SciePro leads
 * with, and the only section on the page that answers the question a buyer is
 * actually holding: "why not just carry on doing what we already do?"
 *
 * The left column is deliberately unflattering about the status quo and says
 * nothing about us; the right column answers it line for line. Every claim on the
 * right is one the rest of the page can back up.
 */
export function ContrastBlock({
  contrast,
  rule,
}: {
  contrast: NonNullable<Vertical["contrast"]>;
  rule: string;
}) {
  return (
    <section id="why" className="scroll-mt-36 border-t border-border bg-white py-20 md:py-28">
      <Container>
        <Reveal>
          <div className="mb-14 flex items-center gap-4">
            <span className="block h-[2px] w-10" style={{ background: rule }} aria-hidden="true" />
            <h2 className="type-h3 max-w-3xl text-balance text-foreground">{contrast.heading}</h2>
          </div>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-2">
          <Reveal>
            <div className="h-full rounded-2xl border border-border bg-[var(--surface-elevated)] p-8">
              <p className="type-label mb-7 text-muted">{contrast.without.label}</p>
              <ul className="flex flex-col gap-5">
                {contrast.without.points.map((point) => (
                  <li key={point} className="flex gap-3.5">
                    <X
                      className="mt-0.5 size-5 shrink-0 text-[color:var(--brand-red)]/70"
                      aria-hidden="true"
                    />
                    <span className="type-body text-muted">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div
              className="h-full rounded-2xl border p-8"
              style={{
                borderColor: rule,
                background: `color-mix(in srgb, ${rule} 5%, white)`,
              }}
            >
              <p className="type-label mb-7" style={{ color: rule }}>
                {contrast.with.label}
              </p>
              <ul className="flex flex-col gap-5">
                {contrast.with.points.map((point) => (
                  <li key={point} className="flex gap-3.5">
                    <Check
                      className="mt-0.5 size-5 shrink-0"
                      style={{ color: rule }}
                      aria-hidden="true"
                    />
                    <span className="type-body text-foreground">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
