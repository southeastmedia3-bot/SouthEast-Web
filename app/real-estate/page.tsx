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
      // The shortlist is three 16:9 interiors against three 2.4:1 exteriors.
      workCellRatio="16 / 9"
      extraNav={[{ id: "library", label: "Library" }]}
      extras={
        <FrameLibrary
          id="library"
          rule={RULE}
          frames={realEstateLibrary}
          // 13 of the 20 renders are 16:9 and the other 7 are 2.39:1, so a 16:9
          // cell fits most of the set exactly and mats only the widest.
          cellRatio="16 / 9"
          heading="The full render library"
          lead="Every interior and exterior in the archive. The six above are a shortlist; this is closer to what a delivered set actually looks like."
        />
      }
    />
  );
}
