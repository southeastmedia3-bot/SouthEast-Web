import { VerticalTemplate } from "@/components/verticals/vertical-template";
import { getVertical } from "@/data/verticals";
import { createMetadata } from "@/lib/seo";

const vertical = getVertical("animation")!;

export const metadata = createMetadata({
  title: vertical.label,
  description: vertical.summary,
  path: "/animation",
});

export default function AnimationPage() {
  return <VerticalTemplate vertical={vertical} />;
}
