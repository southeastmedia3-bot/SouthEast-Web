import { FilmsVertical } from "@/components/verticals/films-vertical";
import { getVertical } from "@/data/verticals";
import { createMetadata } from "@/lib/seo";

const vertical = getVertical("films")!;

export const metadata = createMetadata({
  title: vertical.label,
  description: vertical.summary,
  path: "/films",
});

export default function FilmsPage() {
  return <FilmsVertical vertical={vertical} />;
}
