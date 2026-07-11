import { Arrival } from "@/components/scenes/arrival";
import { TheFilm } from "@/components/scenes/the-film";
import { Invitation } from "@/components/scenes/invitation";
import { Mandate } from "@/components/scenes/mandate";
import { Showcase } from "@/components/scenes/showcase";
import { TheReel } from "@/components/scenes/the-reel";
import { TrustBar } from "@/components/scenes/trust-bar";
import { PageWrapper } from "@/components/layout/page-wrapper";

export default function Home() {
  return (
    <PageWrapper>
      <Arrival />
      <TheFilm />
      <TrustBar />
      <TheReel />
      <Showcase />
      <Mandate />
      <Invitation />
    </PageWrapper>
  );
}
