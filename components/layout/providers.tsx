"use client";

import { LenisProvider } from "@/components/layout/lenis-provider";
import type { WithChildren } from "@/types/global";

export function Providers({ children }: WithChildren) {
  return <LenisProvider>{children}</LenisProvider>;
}
