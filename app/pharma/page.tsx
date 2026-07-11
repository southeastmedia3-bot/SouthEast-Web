import { VerticalTemplate } from "@/components/verticals/vertical-template";
import { getVertical } from "@/data/verticals";
import { createMetadata } from "@/lib/seo";

const vertical = getVertical("pharma")!;

export const metadata = createMetadata({
  title: vertical.label,
  description: vertical.summary,
  path: "/pharma",
});

export default function PharmaPage() {
  return <VerticalTemplate vertical={vertical} />;
}
