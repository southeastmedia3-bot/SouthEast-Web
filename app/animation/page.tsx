import { AnimationVertical } from "@/components/verticals/animation-vertical";
import { getVertical } from "@/data/verticals";
import { createMetadata } from "@/lib/seo";

const vertical = getVertical("animation")!;

export const metadata = createMetadata({
  title: vertical.label,
  description: vertical.summary,
  path: "/animation",
});

export default function AnimationPage() {
  return <AnimationVertical vertical={vertical} />;
}
