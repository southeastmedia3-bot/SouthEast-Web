import { VerticalTemplate } from "@/components/verticals/vertical-template";
import { getVertical } from "@/data/verticals";
import { createMetadata } from "@/lib/seo";

const vertical = getVertical("enterprise")!;

export const metadata = createMetadata({
  title: vertical.label,
  description: vertical.summary,
  path: "/enterprise",
});

export default function EnterprisePage() {
  return <VerticalTemplate vertical={vertical} />;
}
