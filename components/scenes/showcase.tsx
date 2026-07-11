import { MediaTower } from "@/components/media/media-tower";
import { showcaseContent } from "@/data/home";
import { towerAssets } from "@/data/media";

/**
 * Scene 05 — Selected Work. The image-library "tower": a pinned 3D column of
 * representative frames the visitor scrolls through.
 */
export function Showcase() {
  return (
    <MediaTower
      items={towerAssets}
      eyebrow={showcaseContent.eyebrow}
      heading={showcaseContent.heading}
      intro={showcaseContent.intro}
    />
  );
}
