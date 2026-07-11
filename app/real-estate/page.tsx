import { VerticalTemplate } from "@/components/verticals/vertical-template";
import { getVertical } from "@/data/verticals";
import { createMetadata } from "@/lib/seo";

const vertical = getVertical("real-estate")!;

export const metadata = createMetadata({
  title: vertical.label,
  description: vertical.summary,
  path: "/real-estate",
});

export default function RealEstatePage() {
  return <VerticalTemplate vertical={vertical} />;
}
