import type { CSSProperties } from "react";
import { RevealWrapper } from "@/components/animations/reveal-wrapper";
import { Container } from "@/components/common/container";
import { Section } from "@/components/common/section";
import { SectionTitle } from "@/components/common/section-title";
import { processSteps } from "@/data/home";

export function ProcessSection() {
  return (
    <Section
      id="process"
      className="relative overflow-hidden bg-[linear-gradient(180deg,rgba(255,255,255,0.026),rgba(8,9,11,0))]"
    >
      <Container className="space-y-16">
        <SectionTitle
          eyebrow="Scene seven / Process"
          title="The path is a sequence, not a checklist."
        />
        <div className="relative space-y-16 before:absolute before:left-5 before:top-6 before:h-[calc(100%-3rem)] before:w-px before:bg-border lg:space-y-0 lg:before:left-0 lg:before:right-0 lg:before:top-1/2 lg:before:h-px lg:before:w-full">
          <div className="grid gap-10 lg:grid-cols-4">
            {processSteps.map((item, index) => (
              <RevealWrapper key={item.step}>
                <article className="relative pl-16 lg:pl-0 lg:pt-20">
                  <div className="absolute left-0 top-0 grid size-11 place-items-center rounded-full bg-info text-sm font-black text-background shadow-[0_0_50px_rgba(54,161,223,0.25)] lg:top-0">
                    {item.step}
                  </div>
                  <div
                    className="rounded-[1.75rem] bg-background/52 p-6 shadow-[inset_0_1px_0_rgba(235,246,255,0.08)] backdrop-blur-xl lg:translate-y-[calc(var(--offset)*1rem)]"
                    style={{ "--offset": index % 2 === 0 ? 0 : 2 } as CSSProperties}
                  >
                    <h3 className="type-h4">{item.title}</h3>
                    <p className="mt-3 type-body text-muted">{item.description}</p>
                  </div>
                </article>
              </RevealWrapper>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
