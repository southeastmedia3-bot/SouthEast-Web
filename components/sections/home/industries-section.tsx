import { RevealWrapper } from "@/components/animations/reveal-wrapper";
import { Container } from "@/components/common/container";
import { Section } from "@/components/common/section";
import { SectionTitle } from "@/components/common/section-title";
import { industries } from "@/data/home";
import { cn } from "@/lib/utils";

export function IndustriesSection() {
  return (
    <Section id="industries" className="relative overflow-hidden">
      <Container className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
        <SectionTitle eyebrow="Scene four / Industries" title="Audiences orbit the story." />
        <div className="relative min-h-[34rem]">
          <div
            className="absolute left-1/2 top-1/2 size-64 -translate-x-1/2 -translate-y-1/2 rounded-full border border-border bg-[radial-gradient(circle,rgba(54,161,223,0.14),transparent_68%)]"
            aria-hidden="true"
          />
          {industries.map((industry, index) => {
            const Icon = industry.icon;
            const positions = [
              "left-0 top-0",
              "right-0 top-16",
              "bottom-12 left-8",
              "bottom-0 right-10",
            ];
            return (
              <RevealWrapper
                key={industry.title}
                className={cn("absolute w-[min(18rem,72vw)]", positions[index])}
              >
                <article className="group rounded-[2rem] bg-background/52 p-6 shadow-[0_28px_90px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(235,246,255,0.08)] backdrop-blur-2xl transition duration-500 hover:-translate-y-2">
                  <Icon
                    className="size-8 text-info transition duration-500 group-hover:scale-110"
                    aria-hidden="true"
                  />
                  <h3 className="mt-8 type-h4">{industry.title}</h3>
                  <p className="mt-3 type-body text-muted">{industry.description}</p>
                </article>
              </RevealWrapper>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
