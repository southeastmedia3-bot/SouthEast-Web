import { SaasVertical } from "@/components/verticals/saas-vertical";
import { JsonLd } from "@/components/seo/json-ld";
import { getVertical } from "@/data/verticals";
import { pageSchema } from "@/lib/schema";
import { metadataFor } from "@/lib/seo";

const vertical = getVertical("saas")!;

export const metadata = metadataFor("/saas");

export default function SaasPage() {
  return (
    <>
      <JsonLd schema={pageSchema("/saas")} />
      <SaasVertical vertical={vertical} />
    </>
  );
}
