import type { ComponentPropsWithoutRef } from "react";
import Link from "next/link";
import type { VariantProps } from "class-variance-authority";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type LinkButtonProps = ComponentPropsWithoutRef<typeof Link> &
  VariantProps<typeof buttonVariants>;

/**
 * A `next/link` styled as a button. Use for navigation CTAs (the `Button`
 * component renders a real `<button>` and is for actions, not links).
 */
export function LinkButton({ className, variant, size, ...props }: LinkButtonProps) {
  return <Link className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}
