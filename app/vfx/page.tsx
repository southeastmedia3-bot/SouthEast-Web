import { FrameLibrary } from "@/components/verticals/frame-library";
import { FrameStrip } from "@/components/verticals/frame-strip";
import { SheetPair } from "@/components/verticals/sheet-pair";
import { VerticalTemplate } from "@/components/verticals/vertical-template";
import { vfxAssets } from "@/data/media";
import { getVertical } from "@/data/verticals";
import { createMetadata } from "@/lib/seo";

const vertical = getVertical("vfx")!;
const RULE = "var(--brand-violet)";

export const metadata = createMetadata({
  title: vertical.label,
  description: vertical.summary,
  path: "/vfx",
});

export default function VfxPage() {
  return (
    <VerticalTemplate
      vertical={vertical}
      extraNav={[
        { id: "line-to-render", label: "Line to render" },
        { id: "sequence", label: "Sequence" },
        { id: "library", label: "Library" },
      ]}
      extras={
        <>
          {/* The page's own process claim — geometry validated before materials —
              shown as the two documents it actually produces. */}
          <SheetPair
            id="line-to-render"
            rule={RULE}
            sheets={vfxAssets.wearableSheets}
            heading="Line pass, then render"
            lead="The same wearable set, twice. Framing and geometry get signed off in line, where a change costs minutes; materials and light come after, where it costs render hours."
          />
          <FrameStrip
            id="sequence"
            rule={RULE}
            frames={vfxAssets.wearableRenders}
            heading="Ten display treatments, one build"
            lead="One rigged model, lit ten ways. Building for reuse is what makes the eleventh variant cheap."
            dark
          />
          <FrameLibrary
            id="library"
            rule={RULE}
            frames={vfxAssets.library}
            heading="The simulation library"
            lead="Cloth, particles, volumetrics, fluid and fibre — every frame the pipeline above exists to render."
          />
        </>
      }
    />
  );
}
