import { Container } from "@/components/common/container";
import { Reveal } from "@/components/common/reveal";
import type { VerticalSection } from "@/data/verticals";

/**
 * Where the unit goes — the page's third and last dark room.
 *
 * The section every competitor writes as one line of a services list, given a
 * room of its own because it is the line a buyer with a working facility is
 * actually shopping for. A hospital floor, an occupied office and a live
 * production line are not "locations"; they are three different access problems,
 * and a crew that has solved them says so specifically.
 *
 * NO PHOTOGRAPHY HERE ON PURPOSE. The studio's finished library is commercial
 * product and brand work — dressing this section with an architectural render of
 * a lobby would illustrate a shoot that never happened. The band carries the
 * claim, ruled and numbered, and lets the frames elsewhere on the page do the
 * showing.
 */
export function FilmsLocationBand({
  section,
  rule,
  id,
}: {
  section: VerticalSection;
  rule: string;
  id?: string;
}) {
  return (
    <section id={id} className="scroll-mt-36 bg-[#05070d] py-20 md:py-28">
      <Container size="xl">
        <div className="grid gap-x-16 gap-y-10 lg:grid-cols-[26rem_minmax(0,1fr)]">
          <div className="lg:sticky lg:top-40 lg:self-start">
            {section.eyebrow ? (
              <p className="type-label mb-4" style={{ color: rule }}>
                {section.eyebrow}
              </p>
            ) : null}
            <Reveal mask>
              <h2 className="type-h3 text-balance text-[var(--ink-frame-foreground)]">
                {section.heading}
              </h2>
            </Reveal>
          </div>

          <div>
            {section.lead ? (
              <Reveal>
                <p className="type-body-lg max-w-2xl text-[color:var(--brand-ice)]/80">
                  {section.lead}
                </p>
              </Reveal>
            ) : null}

            {section.body?.map((para, i) => (
              <Reveal key={para.slice(0, 40)} delay={0.06 + i * 0.06}>
                <p className="type-body mt-5 max-w-2xl text-[color:var(--brand-ice)]/60">{para}</p>
              </Reveal>
            ))}

            {section.items?.length ? (
              <dl className="mt-14 grid gap-x-10 gap-y-10 sm:grid-cols-3">
                {section.items.map((item, i) => (
                  <Reveal key={item.name} delay={i * 0.07}>
                    <div className="border-t border-white/15 pt-6">
                      {/* The number carries the weight here — there is no frame
                          in this room for it to compete with. */}
                      <span
                        className="type-index block text-[1.35rem] leading-none"
                        style={{ color: rule }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <dt className="type-h4 mt-4 text-[1.1rem] text-[var(--ink-frame-foreground)]">
                        {item.name}
                      </dt>
                      <dd className="type-body mt-2.5 text-[color:var(--brand-ice)]/65">
                        {item.detail}
                      </dd>
                    </div>
                  </Reveal>
                ))}
              </dl>
            ) : null}
          </div>
        </div>
      </Container>
    </section>
  );
}
