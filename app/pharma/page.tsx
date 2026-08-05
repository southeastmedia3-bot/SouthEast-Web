import { PharmaVertical } from "@/components/pharma/pharma-vertical";
import { JsonLd } from "@/components/seo/json-ld";
import { getVertical } from "@/data/verticals";
import { pageSchema } from "@/lib/schema";
import { metadataFor } from "@/lib/seo";

const vertical = getVertical("pharma")!;

/**
 * Title and description come from `data/seo.ts`, not from `vertical.label` and
 * `vertical.summary`.
 *
 * The label is "Pharma" — a one-word internal category that rendered as
 * "Pharma | Southeast Media" and matched nothing anyone types. The summary is
 * good prose but names no service and no city. Search copy and page copy want
 * different sentences; they now live in different modules rather than one being
 * bent to serve the other.
 */
export const metadata = metadataFor("/pharma", { image: "/media/pharma/heart-poster.jpg" });

export default function PharmaPage() {
  return (
    <>
      <JsonLd schema={pageSchema("/pharma")} />
      <PharmaVertical vertical={vertical} />
    </>
  );
}
