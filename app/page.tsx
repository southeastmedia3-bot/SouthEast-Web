import { HomeHero } from "@/components/hero/home-hero";
import { CapabilitiesSection } from "@/components/sections/home/capabilities-section";
import { FeaturedProjectsSection } from "@/components/sections/home/featured-projects-section";
import { FinalCtaSection } from "@/components/sections/home/final-cta-section";
import { IndustriesSection } from "@/components/sections/home/industries-section";
import { ProcessSection } from "@/components/sections/home/process-section";
import { StatisticsSection } from "@/components/sections/home/statistics-section";
import { TechnologySection } from "@/components/sections/home/technology-section";
import { TestimonialsSection } from "@/components/sections/home/testimonials-section";
import { TrustStrip } from "@/components/sections/home/trust-strip";
import { WhoWeAre } from "@/components/sections/home/who-we-are";
import { PageWrapper } from "@/components/layout/page-wrapper";

export default function Home() {
  return (
    <PageWrapper className="pt-0">
      <HomeHero />
      <TrustStrip />
      <WhoWeAre />
      <CapabilitiesSection />
      <IndustriesSection />
      <FeaturedProjectsSection />
      <TechnologySection />
      <ProcessSection />
      <StatisticsSection />
      <TestimonialsSection />
      <FinalCtaSection />
    </PageWrapper>
  );
}
