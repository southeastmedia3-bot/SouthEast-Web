import { RevealWrapper } from "@/components/animations/reveal-wrapper";
import { Container } from "@/components/common/container";
import { Section } from "@/components/common/section";
import { SectionTitle } from "@/components/common/section-title";
import { capabilities } from "@/data/home";

export function CapabilitiesSection() {
  return (
    <Section
      id="capabilities"
      className="relative overflow-hidden bg-[linear-gradient(180deg,rgba(255,255,255,0.012),rgba(255,255,255,0.028),rgba(255,255,255,0.012))]"
    >
      <div
        className="absolute right-0 top-20 h-80 w-80 rounded-full bg-white/[0.035] blur-3xl"
        aria-hidden="true"
      />
      <Container className="space-y-16">
        <SectionTitle
          eyebrow="Scene three / Capabilities"
          title="Disciplines staged like a production floor."
          description="The service system now reads as a cinematic sequence instead of a repeated card grid."
        />
        <div className="space-y-5">
          {capabilities.map((capability, index) => {
            const Icon = capability.icon;
            return (
              <RevealWrapper key={capability.title}>
                <article className="group grid gap-8 border-t border-border py-8 transition duration-500 last:border-b hover:border-info/70 lg:grid-cols-[0.18fr_0.32fr_0.5fr] lg:items-center">
                  <p className="text-sm font-black uppercase tracking-[0.22em] text-muted">
                    0{index + 1}
                  </p>
                  <div className="flex items-center gap-5">
                    <span className="grid size-14 place-items-center rounded-full bg-white/[0.055] text-info shadow-[inset_0_1px_0_rgba(235,246,255,0.08)] transition duration-500 group-hover:scale-110">
                      <Icon className="size-6" aria-hidden="true" />
                    </span>
                    <h3 className="type-h3">{capability.title}</h3>
                  </div>
                  <p className="max-w-2xl type-body-lg text-muted lg:justify-self-end">
                    {capability.description}
                  </p>
                </article>
              </RevealWrapper>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
