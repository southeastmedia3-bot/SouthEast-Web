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
        <h1 className="text-4xl font-semibold">This frame is missing</h1>
        <Lead className="mx-auto">
          The page you asked for isn&apos;t here — it may have moved, or the link may be incomplete.
          The work is all one click away.
        </Lead>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link href="/" className={buttonVariants()} aria-label="Return to home">
            Return home
          </Link>
          <Link
            href="/verticals"
            className={buttonVariants({ variant: "outline" })}
            aria-label="Browse all verticals"
          >
            Browse the work
          </Link>
        </div>
      </Container>
    </PageWrapper>
  );
}
