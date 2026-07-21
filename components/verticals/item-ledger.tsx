import { Container } from "@/components/common/container";
import { Reveal } from "@/components/common/reveal";
import { cn } from "@/lib/utils";

/**
 * A named-item band: a heading, then the items ruled off across the full measure.
 *
 * Used where a section's payload is a short set of definitions rather than an
 * argument — "where it earns" on the SaaS page, the governance ledger and the
 * engagement mechanics on Enterprise. Deliberately the quietest layout on either
 * page: no media, no cards, no borders except the hairline each item hangs from,
 * so it reads as a reference table between two louder sections.
 */
export function ItemLedger({
  eyebrow,
  heading,
  lead,
  items,
  rule,
  columns = 4,
  dark = false,
  id,
  className,
}: {
  eyebrow?: string;
  heading: string;
  lead?: string;
  items: { name: string; detail: string }[];
  rule: string;
  columns?: 2 | 3 | 4;
  dark?: boolean;
  id?: string;
  className?: string;
}) {
  const grid = {
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-2 lg:grid-cols-3",
    4: "sm:grid-cols-2 lg:grid-cols-4",
  }[columns];

  return (
    <section
      id={id}
      className={cn(
        "scroll-mt-36 border-t py-20 md:py-28",
        dark ? "border-white/10 bg-[#05070d]" : "border-border bg-[var(--surface)]",
        className,
      )}
    >
      <Container size="xl">
        <div className="max-w-3xl">
          {eyebrow ? (
            <p className="type-label mb-4" style={{ color: dark ? "var(--brand-sky)" : rule }}>
              {eyebrow}
            </p>
          ) : null}
          <Reveal mask>
            <h2
              className={cn(
                "type-h3 text-balance",
                dark ? "text-[var(--ink-frame-foreground)]" : "text-foreground",
              )}
            >
              {heading}
            </h2>
          </Reveal>
          {lead ? (
            <Reveal delay={0.08}>
              <p
                className={cn(
                  "type-body-lg mt-5",
                  dark ? "text-[color:var(--brand-ice)]/75" : "text-muted",
                )}
              >
                {lead}
              </p>
            </Reveal>
          ) : null}
        </div>

        <dl className={cn("mt-14 grid gap-x-10 gap-y-10", grid)}>
          {items.map((item, i) => (
            <Reveal key={item.name} delay={(i % columns) * 0.06}>
              <div
                className={cn("border-t pt-6", dark ? "border-white/15" : "border-border-strong")}
              >
                <span className="type-index text-muted">{String(i + 1).padStart(2, "0")}</span>
                <dt
                  className={cn(
                    "type-h4 mt-3 text-[1.1rem]",
                    dark ? "text-[var(--ink-frame-foreground)]" : "text-foreground",
                  )}
                >
                  {item.name}
                </dt>
                <dd
                  className={cn(
                    "type-body mt-2.5",
                    dark ? "text-[color:var(--brand-ice)]/65" : "text-muted",
                  )}
                >
                  {item.detail}
                </dd>
              </div>
            </Reveal>
          ))}
        </dl>
      </Container>
    </section>
  );
}
