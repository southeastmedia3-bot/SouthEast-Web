import Link from "next/link";
import { Container } from "@/components/common/container";
import { Lead } from "@/components/common/typography";
import { PageWrapper } from "@/components/layout/page-wrapper";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <PageWrapper className="grid place-items-center">
      <Container size="sm" className="space-y-6 py-24 text-center">
        <p className="text-sm uppercase tracking-[0.18em] text-accent">404</p>
        <h1 className="text-4xl font-semibold">Page not found</h1>
        <Lead className="mx-auto">The shell is ready, but this route has not been built yet.</Lead>
        <Link href="/" className={buttonVariants()} aria-label="Return to home">
          Return home
        </Link>
      </Container>
    </PageWrapper>
  );
}
