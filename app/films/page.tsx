import { FrameLibrary } from "@/components/verticals/frame-library";
import { FrameStrip } from "@/components/verticals/frame-strip";
import { VerticalTemplate } from "@/components/verticals/vertical-template";
import { filmsAssets } from "@/data/media";
import { getVertical } from "@/data/verticals";
import { createMetadata } from "@/lib/seo";

const vertical = getVertical("films")!;
const RULE = "var(--brand-violet)";

export const metadata = createMetadata({
  title: vertical.label,
  description: vertical.summary,
  path: "/films",
});

export default function FilmsPage() {
  return (
    <VerticalTemplate
      vertical={vertical}
      extraNav={[
        { id: "sequence", label: "Sequence" },
        { id: "library", label: "Library" },
      ]}
      extras={
        <>
          <FrameStrip
            id="sequence"
            rule={RULE}
            frames={filmsAssets.serumProgression}
            heading="The beauty film, frame by frame"
            lead="Fifteen consecutive frames in cut order. Scrub it — holding the light steady across a cut is the part that takes the time."
            dark
          />
          <FrameLibrary
            id="library"
            rule={RULE}
            frames={filmsAssets.library}
            heading="Every finished frame"
            lead="The complete commercial library — beauty, jewellery, eyewear, metal and interface."
          />
        </>
      }
    />
  );
}
