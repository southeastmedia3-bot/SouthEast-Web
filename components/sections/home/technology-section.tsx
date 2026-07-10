import { RevealWrapper } from "@/components/animations/reveal-wrapper";
import { AnimatedCounter } from "@/components/common/animated-counter";
import { Container } from "@/components/common/container";
import { Section } from "@/components/common/section";
import { SectionTitle } from "@/components/common/section-title";
import { technologyItems } from "@/data/home";

export function TechnologySection() {
  return (
    <Section id="technology" className="relative overflow-hidden">
      <Container className="grid gap-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        <div className="space-y-10 lg:sticky lg:top-28">
          <SectionTitle
            eyebrow="Scene six / Technology"
            title="Invisible systems, visible momentum."
          />
          <div className="grid grid-cols-3 gap-3">
            {[
              [60, "fps", "motion target"],
              [3, "", "prototype loops"],
              [12, "+", "handoff modules"],
            ].map(([value, suffix, label]) => (
              <div
                key={label}
                className="rounded-[1.35rem] bg-white/[0.045] p-5 shadow-[inset_0_1px_0_rgba(235,246,255,0.07)]"
              >
                <p className="text-3xl font-black tracking-[-0.04em]">
                  <AnimatedCounter value={Number(value)} suffix={String(suffix)} />
                </p>
                <p className="mt-2 type-caption text-muted">{label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-5">
          {technologyItems.map((item) => {
            const Icon = item.icon;
            return (
              <RevealWrapper key={item.title}>
                <article className="group flex gap-6 rounded-[2rem] bg-[rgba(235,246,255,0.045)] p-6 shadow-[inset_0_1px_0_rgba(235,246,255,0.07)] backdrop-blur-xl transition duration-500 hover:translate-x-2">
                  <Icon className="mt-1 size-7 shrink-0 text-info" aria-hidden="true" />
                  <div>
                    <h3 className="type-h4">{item.title}</h3>
                    <p className="mt-3 type-body text-muted">{item.description}</p>
                  </div>
                </article>
              </RevealWrapper>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
