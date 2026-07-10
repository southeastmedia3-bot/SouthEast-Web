"use client";

import { useLenis } from "@/hooks/use-lenis";
import type { WithChildren } from "@/types/global";

export function LenisProvider({ children }: WithChildren) {
  useLenis();
  return children;
}
