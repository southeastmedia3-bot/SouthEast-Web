import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/common/container";
import { Reveal } from "@/components/common/reveal";
import { LinkButton } from "@/components/ui/link-button";
import { AnatomyReveal } from "@/components/verticals/anatomy-reveal";
import { ContrastBlock } from "@/components/verticals/contrast-block";
import { FaqList } from "@/components/verticals/faq-list";
import { ProcessRail } from "@/components/verticals/process-rail";
import { SignatureFrame } from "@/components/verticals/signature-frame";
import { VerticalHero } from "@/components/verticals/vertical-hero";
import { VerticalNav, type NavSection } from "@/components/verticals/vertical-nav";
import { VideoWall } from "@/components/verticals/video-wall";
import { WorkGrid } from "@/components/verticals/work-grid";
import type { Vertical } from "@/data/verticals";
import { verticalHeroes } from "@/data/media";

const toneRule: Record<string, string> = {
  blue: "var(--brand-blue)",
  sky: "var(--brand-sky)",
  gold: "var(--brand-gold)",
  violet: "var(--brand-violet)",
};

/**
 * The shared layout every vertical subpage renders.
 *
 * These pages have to stand entirely on their own. A pharmaceutical client who
 * lands here has no interest in real estate, and sending them back to the
 * homepage to understand us is how you lose them — so each vertical carries the
 * full argument: what it is, the terms, the capability, the case against carrying
 * on as they are, how the engagement runs, the work, the proof, and the objections
 * answered.
 *
 * The order is the one every studio that sells a single discipline converges on
 * (3dforscience, maverickframe, opus, 3dlabz): state the terms, show the work,
 * make the case, show the process, answer the objections, ask for the call — with
 * a way to jump straight to any of it.
 *
 * Sections render only when the data supports them, so the four verticals without
 * deep source material degrade to the short form rather than showing empty frames.
 */
export function VerticalTemplate({ vertical }: { vertical: Vertical }) {
  const hero = verticalHeroes[vertical.slug];
  const rule = toneRule[vertical.tone] ?? "var(--brand-sky)";
  // The anatomy-reveal set-piece is built from pharma's own rigged-model layers.
  const hasAnatomy = vertical.slug === "pharma";

  const sections: NavSection[] = [
    { id: "capabilities", label: "Capabilities" },
    ...(vertical.sections?.length ? [{ id: "approach", label: "Approach" }] : []),
    ...(hasAnatomy ? [{ id: "anatomy", label: "Anatomy" }] : []),
    ...(vertical.contrast ? [{ id: "why", label: "Why us" }] : []),
    ...(vertical.process?.length ? [{ id: "process", label: "Process" }] : []),
    ...(vertical.gallery?.length ? [{ id: "work", label: "Work" }] : []),
    ...(vertical.videos?.length ? [{ id: "motion", label: "In motion" }] : []),
    ...(vertical.faqs?.length ? [{ id: "faq", label: "FAQ" }] : []),
  ];

  return (
    <main id="main-content">
      <VerticalHero vertical={vertical} />

      <VerticalNav label={vertical.label} sections={sections} />

      <SignatureFrame
        tone={hero?.tone ?? vertical.tone}
        src={hero?.src}
        video={hero?.video}
        poster={hero?.poster}
        alt={hero?.alt ?? vertical.title}
      />

      {/* Capabilities */}
      <Container id="capabilities" className="scroll-mt-36 py-16 md:py-24">
        <Reveal>
          <div className="mb-12 flex items-center gap-4">
            <span className="block h-[2px] w-10" style={{ background: rule }} aria-hidden="true" />
            <h2 className="type-h3 text-foreground">Capabilities</h2>
          </div>
        </Reveal>
        <div className="grid gap-x-10 gap-y-12 md:grid-cols-2">
          {vertical.capabilities.map((cap, i) => (
            <Reveal key={cap.name} delay={(i % 2) * 0.06}>
              <div className="group border-t border-border pt-6 transition-colors duration-300 hover:border-[color:var(--border-strong)]">
                <span className="type-index text-muted">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="type-h4 mt-3 text-foreground">{cap.name}</h3>
                <p className="type-body mt-2 text-muted">{cap.detail}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>

      {/* Long-form — only the verticals with real source material carry it. */}
      {vertical.sections?.length ? (
        <div id="approach" className="scroll-mt-36 border-t border-border bg-[var(--surface)]">
          {vertical.sections.map((section, i) => (
            <Container
              key={section.heading}
              className={`py-16 md:py-24 ${i !== 0 ? "border-t border-border" : ""}`}
            >
              <div className="grid gap-x-16 gap-y-8 lg:grid-cols-[22rem_1fr]">
                <div className="lg:sticky lg:top-40 lg:self-start">
                  {section.eyebrow ? (
                    <p className="type-label mb-4" style={{ color: rule }}>
                      {section.eyebrow}
                    </p>
                  ) : null}
                  <h2 className="type-h3 text-balance text-foreground">{section.heading}</h2>
                </div>

                <Reveal>
                  {section.lead ? (
                    <p className="type-body-lg max-w-2xl text-foreground">{section.lead}</p>
                  ) : null}

                  {section.body?.map((para) => (
                    <p key={para.slice(0, 40)} className="type-body mt-5 max-w-2xl text-muted">
                      {para}
                    </p>
                  ))}

                  {section.bullets?.length ? (
                    <ul className="mt-8 grid gap-x-10 gap-y-3 sm:grid-cols-2">
                      {section.bullets.map((bullet) => (
                        <li key={bullet} className="flex gap-3 type-body text-muted">
                          <span
                            className="mt-[0.6em] size-1.5 shrink-0 rounded-full"
                            style={{ background: rule }}
                            aria-hidden="true"
                          />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}

                  {section.items?.length ? (
                    <dl className="mt-8 grid gap-x-10 gap-y-8 sm:grid-cols-2">
                      {section.items.map((item) => (
                        <div key={item.name} className="border-t border-border pt-5">
                          <dt className="type-h4 text-[1.05rem] text-foreground">{item.name}</dt>
                          <dd className="type-body mt-2 text-muted">{item.detail}</dd>
                        </div>
                      ))}
                    </dl>
                  ) : null}
                </Reveal>
              </div>
            </Container>
          ))}
        </div>
      ) : null}

      {hasAnatomy ? <AnatomyReveal /> : null}

      {vertical.contrast ? <ContrastBlock contrast={vertical.contrast} rule={rule} /> : null}

      {vertical.process?.length ? <ProcessRail steps={vertical.process} rule={rule} /> : null}

      {vertical.gallery?.length ? <WorkGrid images={vertical.gallery} rule={rule} /> : null}

      {vertical.videos?.length ? <VideoWall videos={vertical.videos} rule={rule} /> : null}

      {/* Mid-page CTA. Every reference site repeats the ask rather than saving it
          all for the foot of a nine-screen page. */}
      <section className="border-t border-border bg-[var(--surface-elevated)] py-16">
        <Container>
          <Reveal>
            <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
              <p className="type-h4 max-w-2xl text-balance text-foreground">
                Have a brief already? Send it over and we will tell you what it takes.
              </p>
              <Link
                href="/contact"
                className="group inline-flex shrink-0 items-center gap-2.5 rounded-full border border-[color:var(--border-strong)] px-6 py-3 text-sm font-medium text-foreground transition hover:border-foreground"
              >
                Start a project
                <ArrowRight
                  className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Link>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Proof — capability and terms. Never a fabricated client story. */}
      <section className="relative overflow-hidden bg-[#0a0a0d] py-24 md:py-32">
        <Container>
          <Reveal>
            <p className="type-label mb-6 text-[color:var(--brand-ice)]/60">
              {vertical.proof.label}
            </p>
            <h2 className="type-h2 max-w-3xl text-balance text-[var(--ink-frame-foreground)]">
              {vertical.proof.title}
            </h2>
            <p className="type-body-lg mt-6 max-w-2xl text-[color:var(--brand-ice)]/70">
              {vertical.proof.body}
            </p>
          </Reveal>
          <dl className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-3">
            {vertical.proof.metrics.map((m, i) => (
              <Reveal key={m.label} delay={i * 0.08}>
                <div className="border-t border-white/15 pt-5">
                  {/* type-h3, not type-display: these values are words now
                      ("Unlimited", "1–2 wks"), and display size would burst the column. */}
                  <dt className="type-h3 text-balance text-[var(--ink-frame-foreground)]">
                    {m.value}
                  </dt>
                  <dd className="type-caption mt-2 uppercase tracking-[0.1em] text-[color:var(--brand-ice)]/55">
                    {m.label}
                  </dd>
                </div>
              </Reveal>
            ))}
          </dl>
        </Container>
      </section>

      {vertical.faqs?.length ? <FaqList faqs={vertical.faqs} rule={rule} /> : null}

      {/* Close */}
      <Container className="py-24 text-center md:py-32">
        <Reveal>
          <h2 className="type-h2 mx-auto max-w-3xl text-balance text-foreground">
            Bring us the frame that has to be right.
          </h2>
          <div className="mt-10">
            <LinkButton href="/contact" variant="primary" size="lg">
              Initiate Vendor Protocol
            </LinkButton>
          </div>
        </Reveal>
      </Container>
    </main>
  );
}
