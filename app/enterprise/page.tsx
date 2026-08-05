import { EnterpriseVertical } from "@/components/verticals/enterprise-vertical";
import { JsonLd } from "@/components/seo/json-ld";
import { getVertical } from "@/data/verticals";
import { pageSchema } from "@/lib/schema";
import { metadataFor } from "@/lib/seo";

const vertical = getVertical("enterprise")!;

export const metadata = metadataFor("/enterprise");

export default function EnterprisePage() {
  return (
    <>
      <JsonLd schema={pageSchema("/enterprise")} />
      <EnterpriseVertical vertical={vertical} />
    </>
  );
}
