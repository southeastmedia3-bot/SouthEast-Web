import { FilmsVertical } from "@/components/verticals/films-vertical";
import { JsonLd } from "@/components/seo/json-ld";
import { getVertical } from "@/data/verticals";
import { pageSchema } from "@/lib/schema";
import { metadataFor } from "@/lib/seo";

const vertical = getVertical("films")!;

export const metadata = metadataFor("/films");

export default function FilmsPage() {
  return (
    <>
      <JsonLd schema={pageSchema("/films")} />
      <FilmsVertical vertical={vertical} />
    </>
  );
}
