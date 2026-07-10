import { Container } from "@/components/common/container";
import { SectionSkeleton } from "@/components/common/skeleton";
import { PageWrapper } from "@/components/layout/page-wrapper";

export default function Loading() {
  return (
    <PageWrapper>
      <Container className="py-20">
        <SectionSkeleton />
      </Container>
    </PageWrapper>
  );
}
