import { RevealWrapper } from "@/components/animations/reveal-wrapper";
import { Container } from "@/components/common/container";
import { ImagePlaceholder } from "@/components/common/card";
import { Section } from "@/components/common/section";
import { Kicker, Lead } from "@/components/common/typography";

export function WhoWeAre() {
  return (
    <Section id="who-we-are">
      <Container className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <RevealWrapper>
          <div className="relative">
            <div className="absolute -inset-5 rounded-[2.5rem] bg-[radial-gradient(circle_at_30%_20%,rgba(54,161,223,0.2),transparent_38%)] blur-2xl" />
            <ImagePlaceholder className="relative aspect-[4/5] rounded-[2rem]" />
          </div>
        </RevealWrapper>
        <RevealWrapper className="space-y-7">
          <Kicker>Who we are</Kicker>
          <h2 className="max-w-4xl text-balance type-h2">
            A media studio for moments that need gravity.
          </h2>
          <Lead>
            We shape stories with the discipline of a production team and the sensitivity of a
            design studio. Every frame, scroll, transition, and system decision is built to make the
            audience feel the brand before they analyze it.
          </Lead>
          <p className="max-w-2xl type-body text-muted">
            The visual system now follows the official mark: rounded geometry, layered panels, quiet
            contrast, and restrained moments of blue, violet, sky, and gold.
          </p>
        </RevealWrapper>
      </Container>
    </Section>
  );
}
