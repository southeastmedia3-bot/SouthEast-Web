import { PharmaVertical } from "@/components/pharma/pharma-vertical";
import { getVertical } from "@/data/verticals";
import { createMetadata } from "@/lib/seo";

const vertical = getVertical("pharma")!;

export const metadata = createMetadata({
  title: vertical.label,
  description: vertical.summary,
  path: "/pharma",
  image: "/media/pharma/heart-poster.jpg",
});

export default function PharmaPage() {
  return <PharmaVertical vertical={vertical} />;
}
