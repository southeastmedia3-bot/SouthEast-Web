import { Hero } from "@/components/scenes/hero";
import { TheFilm } from "@/components/scenes/the-film";
import { TrustBar } from "@/components/scenes/trust-bar";
import { Capabilities } from "@/components/scenes/capabilities";
import { ServicesList } from "@/components/scenes/services-list";
import { FilmReel } from "@/components/scenes/film-reel";
import { Pipeline } from "@/components/scenes/pipeline";
import { Mandate } from "@/components/scenes/mandate";
import { Invitation } from "@/components/scenes/invitation";
import { PageWrapper } from "@/components/layout/page-wrapper";

/**
 * The page breathes light -> dark -> light. It opens bright and spare, then
 * drops into black for the two scenes that need it (the 3D capability models and
 * the reel drum), and closes dark. Never dark at the door.
 */
export default function Home() {
  return (
    <PageWrapper>
      <Hero /> {/* white */}
      <TheFilm /> {/* dark — scroll-scrubbed villa footage */}
      <TrustBar /> {/* white */}
      <Capabilities /> {/* black — 3D point-cloud models */}
      <ServicesList /> {/* white */}
      <FilmReel /> {/* black — the rotating film drum */}
      <Pipeline /> {/* cream */}
      <Mandate /> {/* light */}
      <Invitation /> {/* dark close */}
    </PageWrapper>
  );
}
