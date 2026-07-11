import { VerticalTemplate } from "@/components/verticals/vertical-template";
import { getVertical } from "@/data/verticals";
import { createMetadata } from "@/lib/seo";

const vertical = getVertical("graphics")!;

export const metadata = createMetadata({
  title: vertical.label,
  description: vertical.summary,
  path: "/graphics",
});

export default function GraphicsPage() {
  return <VerticalTemplate vertical={vertical} />;
}
