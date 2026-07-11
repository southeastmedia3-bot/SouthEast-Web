import { Hero } from "@/components/scenes/hero";
import { TheFilm } from "@/components/scenes/the-film";
import { TrustBar } from "@/components/scenes/trust-bar";
import { Capabilities } from "@/components/scenes/capabilities";
import { ServicesList } from "@/components/scenes/services-list";
import { Pipeline } from "@/components/scenes/pipeline";
import { Mandate } from "@/components/scenes/mandate";
import { Invitation } from "@/components/scenes/invitation";
import { PageWrapper } from "@/components/layout/page-wrapper";

export default function Home() {
  return (
    <PageWrapper>
      <Hero />
      <TheFilm />
      <TrustBar />
      <Capabilities />
      <ServicesList />
      <Pipeline />
      <Mandate />
      <Invitation />
    </PageWrapper>
  );
}
