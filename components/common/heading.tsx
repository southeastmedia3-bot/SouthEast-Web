import type { ComponentPropsWithoutRef, ElementType } from "react";
import { cn } from "@/lib/utils";

type HeadingProps = ComponentPropsWithoutRef<"h2"> & {
  as?: ElementType;
  eyebrow?: string;
};

export function Heading({ as: Comp = "h2", eyebrow, className, children, ...props }: HeadingProps) {
  return (
    <div className="max-w-4xl">
      {eyebrow ? <p className="type-label mb-6 text-accent">{eyebrow}</p> : null}
      <Comp className={cn("type-h2 text-balance text-foreground", className)} {...props}>
        {children}
      </Comp>
    </div>
  );
}
