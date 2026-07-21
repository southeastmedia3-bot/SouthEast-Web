import { FrameLibrary } from "@/components/verticals/frame-library";
import { VerticalTemplate } from "@/components/verticals/vertical-template";
import { realEstateLibrary } from "@/data/media";
import { getVertical } from "@/data/verticals";
import { createMetadata } from "@/lib/seo";

const vertical = getVertical("real-estate")!;
const RULE = "var(--brand-sky)";

export const metadata = createMetadata({
  title: vertical.label,
  description: vertical.summary,
  path: "/real-estate",
});

export default function RealEstatePage() {
  return (
    <VerticalTemplate
      vertical={vertical}
      extraNav={[{ id: "library", label: "Library" }]}
      extras={
        <FrameLibrary
          id="library"
          rule={RULE}
          frames={realEstateLibrary}
          heading="The full render library"
          lead="Every interior and exterior in the archive. The six above are a shortlist; this is closer to what a delivered set actually looks like."
        />
      }
    />
  );
}
