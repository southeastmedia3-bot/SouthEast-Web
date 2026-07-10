import { Arrival } from "@/components/scenes/arrival";
import { Invitation } from "@/components/scenes/invitation";
import { Mandate } from "@/components/scenes/mandate";
import { TheReel } from "@/components/scenes/the-reel";
import { TrustBar } from "@/components/scenes/trust-bar";
import { PageWrapper } from "@/components/layout/page-wrapper";

export default function Home() {
  return (
    <PageWrapper>
      <Arrival />
      <TrustBar />
      <TheReel />
      <Mandate />
      <Invitation />
    </PageWrapper>
  );
}
