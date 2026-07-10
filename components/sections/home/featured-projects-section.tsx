import { ArrowUpRight } from "lucide-react";
import { RevealWrapper } from "@/components/animations/reveal-wrapper";
import { ImagePlaceholder } from "@/components/common/card";
import { Container } from "@/components/common/container";
import { Section } from "@/components/common/section";
import { SectionTitle } from "@/components/common/section-title";
import { Button } from "@/components/ui/button";
import { featuredProjects } from "@/data/home";
import { cn } from "@/lib/utils";

export function FeaturedProjectsSection() {
  return (
    <Section
      id="featured-projects"
      className="relative overflow-hidden bg-[linear-gradient(180deg,rgba(255,255,255,0.006),rgba(255,255,255,0.026))]"
    >
      <Container className="space-y-16">
        <SectionTitle
          eyebrow="Scene five / Featured work"
          title="Media should arrive at cinematic scale."
          description="These are reserved as large future video/render spaces rather than small thumbnails."
        />
        <div className="space-y-20">
          {featuredProjects.map((project, index) => (
            <RevealWrapper key={project.title}>
              <article
                className={cn(
                  "grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end",
                  index % 2 === 1 && "lg:grid-cols-[0.8fr_1.2fr]",
                )}
              >
                <ImagePlaceholder
                  className={cn("min-h-[24rem] rounded-[2.5rem]", index % 2 === 1 && "lg:order-2")}
                />
                <div className="relative z-10 -mt-20 max-w-xl rounded-[2rem] bg-background/64 p-7 shadow-[0_28px_100px_rgba(0,0,0,0.34),inset_0_1px_0_rgba(235,246,255,0.08)] backdrop-blur-2xl lg:mt-0 lg:-ml-20">
                  <p className="type-label text-accent">{project.category}</p>
                  <h3 className="mt-5 type-h2">{project.title}</h3>
                  <p className="mt-5 type-body text-muted">{project.description}</p>
                  <Button className="mt-7" variant="outline" aria-label={`View ${project.title}`}>
                    View structure
                    <ArrowUpRight className="size-4" aria-hidden="true" />
                  </Button>
                </div>
              </article>
            </RevealWrapper>
          ))}
        </div>
      </Container>
    </Section>
  );
}
