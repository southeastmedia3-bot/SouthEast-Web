import { VerticalTemplate } from "@/components/verticals/vertical-template";
import { getVertical } from "@/data/verticals";
import { createMetadata } from "@/lib/seo";

const vertical = getVertical("vfx")!;

export const metadata = createMetadata({
  title: vertical.label,
  description: vertical.summary,
  path: "/vfx",
});

export default function VfxPage() {
  return <VerticalTemplate vertical={vertical} />;
}
