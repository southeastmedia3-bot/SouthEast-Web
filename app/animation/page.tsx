import { FrameLibrary } from "@/components/verticals/frame-library";
import { FrameStrip } from "@/components/verticals/frame-strip";
import { VerticalTemplate } from "@/components/verticals/vertical-template";
import { animationAssets } from "@/data/media";
import { getVertical } from "@/data/verticals";
import { createMetadata } from "@/lib/seo";

const vertical = getVertical("animation")!;
const RULE = "var(--brand-gold)";

export const metadata = createMetadata({
  title: vertical.label,
  description: vertical.summary,
  path: "/animation",
});

export default function AnimationPage() {
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
            frames={animationAssets.characterFrames}
            heading="A character sequence, shot by shot"
            lead="Twelve frames from one build. Same rig, same set, same lighting model — which is what keeps a series looking like a series."
            dark
          />
          <FrameLibrary
            id="library"
            rule={RULE}
            frames={[...animationAssets.characterFrames, ...animationAssets.brandBuilds]}
            heading="Character work and brand builds"
            lead="The complete animation library — character sets, logo builds and artwork reveals."
          />
        </>
      }
    />
  );
}
