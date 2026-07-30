import { Hero } from "@/components/scenes/hero";
import { TheFilm } from "@/components/scenes/the-film";
import { TrustBar } from "@/components/scenes/trust-bar";
import { FilmReel } from "@/components/scenes/film-reel";
import { ServicesList } from "@/components/scenes/services-list";
import { Pipeline } from "@/components/scenes/pipeline";
import { Mandate } from "@/components/scenes/mandate";
import { DisciplineWall } from "@/components/scenes/discipline-wall";
import { Invitation } from "@/components/scenes/invitation";
import { PageWrapper } from "@/components/layout/page-wrapper";
import { createMetadata } from "@/lib/seo";

/**
 * The home page inherits its title and description from the root layout, but
 * not a canonical URL — without one, the root is reachable and indexable at
 * several addresses (www, trailing slash, query strings) as separate pages.
 */
export const metadata = createMetadata({ path: "/" });

/**
 * The page breathes dark -> light -> dark. It opens on the showreel — the work
 * itself, uncovered by a wipe — holds dark through the villa footage, lifts into
 * the white scenes, and closes dark. The reel is the door now: the spectacle is
 * the first thing, not the last.
 */
export default function Home() {
  return (
    <PageWrapper>
      <Hero /> {/* dark — the showreel, wiped open */}
      <TheFilm /> {/* dark — scroll-scrubbed villa footage */}
      <TrustBar /> {/* white */}
      <FilmReel /> {/* black — the rotating film drum */}
      <ServicesList /> {/* white */}
      <Pipeline /> {/* cream */}
      <Mandate /> {/* light */}
      <DisciplineWall /> {/* white — frames that morph into the mark */}
      {/* The team rail used to sit here. It was twelve blank cards — no names, no
          roles, no portraits — so it read as an unfinished section rather than a
          roster. Pulled until there are real faces to put in it; the component and
          its `team` data still exist, so putting it back is one import. */}
      <Invitation /> {/* dark close */}
    </PageWrapper>
  );
}
