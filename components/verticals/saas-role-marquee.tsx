import { Container } from "@/components/common/container";
import { Reveal } from "@/components/common/reveal";
import { DriftRow } from "@/components/verticals/drift-row";
import type { VerticalSection } from "@/data/verticals";

/**
 * The squad, as a run rather than a grid.
 *
 * The reference stacks the eight roles into two rows that keep moving, and the
 * movement is doing real work: a grid of eight boxes reads as a checklist, while
 * a run that never ends reads as a department that is always staffed. Row one
 * drifts left, row two drifts right and starts halfway through the list, so the
 * two never line up into columns.
 *
 * Under reduced motion both rows go still and wrap — every role is still there
 * to read, which is the only thing the section actually has to do.
 */
export function SaasRoleMarquee({
  section,
  rule,
  id,
}: {
  section: VerticalSection;
  rule: string;
  id?: string;
}) {
  const roles = section.items ?? [];
  const half = Math.ceil(roles.length / 2);
  // Row two enters the list from its midpoint, so the two runs never sit in step.
  const rowB = [...roles.slice(half), ...roles.slice(0, half)];

  return (
    <section
      id={id}
      className="scroll-mt-36 overflow-hidden border-t border-border bg-[var(--surface-elevated)] py-20 md:py-28"
    >
      <Container>
        <div className="max-w-3xl">
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
          {section.body?.map((para, i) => (
            <Reveal key={para.slice(0, 40)} delay={0.14 + i * 0.05}>
              <p className="type-body mt-5 text-muted">{para}</p>
            </Reveal>
          ))}
        </div>
      </Container>

      <div className="mt-16 flex flex-col gap-5">
        <DriftRow duration={72} direction="left" trackClassName="gap-5 pr-5">
          {roles.map((role, i) => (
            <RoleCard key={role.name} index={i} name={role.name} detail={role.detail} rule={rule} />
          ))}
        </DriftRow>

        <DriftRow duration={88} direction="right" trackClassName="gap-5 pr-5">
          {rowB.map((role) => (
            <RoleCard
              key={role.name}
              index={roles.findIndex((r) => r.name === role.name)}
              name={role.name}
              detail={role.detail}
              rule={rule}
            />
          ))}
        </DriftRow>
      </div>
    </section>
  );
}

function RoleCard({
  index,
  name,
  detail,
  rule,
}: {
  index: number;
  name: string;
  detail: string;
  rule: string;
}) {
  return (
    <article className="w-[19rem] shrink-0 rounded-2xl border border-border bg-white p-6 sm:w-[23rem]">
      <div className="flex items-center gap-3">
        <span className="block h-px w-6" style={{ background: rule }} aria-hidden="true" />
        <span className="type-index text-muted">{String(index + 1).padStart(2, "0")}</span>
      </div>
      <h3 className="type-h4 mt-4 text-[1.15rem] text-foreground">{name}</h3>
      <p className="type-body mt-2.5 text-[0.95rem] text-muted">{detail}</p>
    </article>
  );
}
