import { Quote } from "lucide-react";
import { RevealWrapper } from "@/components/animations/reveal-wrapper";
import { Container } from "@/components/common/container";
import { Section } from "@/components/common/section";
import { SectionTitle } from "@/components/common/section-title";

export function TestimonialsSection() {
  return (
    <Section id="testimonials" className="relative overflow-hidden">
      <Container className="grid gap-14 lg:grid-cols-[0.7fr_1.3fr] lg:items-center">
        <SectionTitle
          eyebrow="Proof scene"
          title="A quiet space for real voices."
          description="The carousel architecture remains ready, but the presentation is now staged like a testimonial film frame."
        />
        <RevealWrapper>
          <article className="relative min-h-[24rem] overflow-hidden rounded-[2.5rem] bg-[linear-gradient(135deg,rgba(255,255,255,0.075),rgba(255,255,255,0.04),rgba(235,246,255,0.035))] p-8 shadow-[0_36px_130px_rgba(0,0,0,0.36),inset_0_1px_0_rgba(235,246,255,0.08)] md:p-12">
            <Quote className="size-10 text-info" aria-hidden="true" />
            <p className="mt-12 max-w-3xl text-3xl font-black leading-tight tracking-[-0.045em] md:text-5xl">
              A reserved testimonial stage with room for approved client language, video stills, and
              carousel controls.
            </p>
            <p className="mt-8 text-xs font-semibold uppercase tracking-[0.22em] text-muted">
              Client quote placeholder
            </p>
          </article>
        </RevealWrapper>
      </Container>
    </Section>
  );
}
