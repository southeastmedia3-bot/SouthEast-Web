import { AnimationVertical } from "@/components/verticals/animation-vertical";
import { JsonLd } from "@/components/seo/json-ld";
import { getVertical } from "@/data/verticals";
import { pageSchema } from "@/lib/schema";
import { metadataFor } from "@/lib/seo";

const vertical = getVertical("animation")!;

export const metadata = metadataFor("/animation");

export default function AnimationPage() {
  return (
    <>
      <JsonLd schema={pageSchema("/animation")} />
      <AnimationVertical vertical={vertical} />
    </>
  );
}
