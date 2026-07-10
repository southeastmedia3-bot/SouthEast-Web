import { ArrowRight, PlayCircle } from "lucide-react";
import { RevealWrapper } from "@/components/animations/reveal-wrapper";
import { BrandMark } from "@/components/brand/brand-mark";
import { Container } from "@/components/common/container";
import { Section } from "@/components/common/section";
import { Button } from "@/components/ui/button";

export function FinalCtaSection() {
  return (
    <Section id="final-cta" className="relative isolate overflow-hidden pb-36">
      <div className="absolute inset-x-0 bottom-0 -z-20 h-[70%] bg-[linear-gradient(180deg,transparent,rgba(255,255,255,0.035),rgba(8,9,11,1))]" />
      <div className="absolute left-1/2 top-20 -z-10 h-[30rem] w-[60rem] -translate-x-1/2 rounded-full bg-white/[0.035] blur-3xl" />
      <Container>
        <RevealWrapper className="mx-auto max-w-5xl text-center">
          <div className="mb-10 inline-flex rounded-full border border-border bg-white/[0.045] px-4 py-3 backdrop-blur-xl">
            <BrandMark compact />
          </div>
          <p className="type-label text-accent">Final call to action</p>
          <h2 className="mx-auto mt-6 max-w-5xl text-balance type-display">
            Make the next launch feel impossible to ignore.
          </h2>
          <p className="mx-auto mt-8 max-w-2xl type-body-lg text-muted">
            The experience is now structured as scenes, ready for real films, renders, copy, and
            proof.
          </p>
          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <Button size="lg">
              Start a project <ArrowRight className="size-4" aria-hidden="true" />
            </Button>
            <Button variant="secondary" size="lg">
              <PlayCircle className="size-4" aria-hidden="true" /> View reel
            </Button>
          </div>
        </RevealWrapper>
      </Container>
    </Section>
  );
}
