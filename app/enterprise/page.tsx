import { EnterpriseVertical } from "@/components/verticals/enterprise-vertical";
import { getVertical } from "@/data/verticals";
import { createMetadata } from "@/lib/seo";

const vertical = getVertical("enterprise")!;

export const metadata = createMetadata({
  title: vertical.label,
  description: vertical.summary,
  path: "/enterprise",
});

export default function EnterprisePage() {
  return <EnterpriseVertical vertical={vertical} />;
}
