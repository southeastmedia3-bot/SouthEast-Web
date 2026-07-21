import { SaasVertical } from "@/components/verticals/saas-vertical";
import { getVertical } from "@/data/verticals";
import { createMetadata } from "@/lib/seo";

const vertical = getVertical("saas")!;

export const metadata = createMetadata({
  title: vertical.label,
  description: vertical.summary,
  path: "/saas",
});

export default function SaasPage() {
  return <SaasVertical vertical={vertical} />;
}
