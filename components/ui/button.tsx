import * as React from "react";
import { Loader2 } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "type-button group inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full transition-[background,color,border-color,box-shadow,transform] duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-primary-foreground shadow-[0_14px_34px_rgba(25,81,168,0.22)] hover:-translate-y-0.5 hover:bg-[color-mix(in_srgb,var(--brand-blue)_92%,white)] hover:shadow-[0_18px_44px_rgba(25,81,168,0.28)]",
        secondary:
          "border border-border bg-white/[0.045] text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-xl hover:-translate-y-0.5 hover:border-[var(--border-strong)] hover:bg-white/[0.07]",
        outline:
          "border border-border bg-transparent text-foreground hover:-translate-y-0.5 hover:border-accent hover:text-foreground hover:shadow-[0_14px_36px_rgba(54,161,223,0.1)]",
        ghost: "text-foreground hover:bg-white/[0.055]",
        icon: "border border-border bg-white/[0.045] text-foreground hover:border-accent hover:text-accent",
      },
      size: {
        sm: "h-9 px-4",
        md: "h-11 px-5",
        lg: "h-12 px-6",
        icon: "size-11 p-0",
      },
      isLoading: {
        true: "cursor-wait",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    loading?: boolean;
  };

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading = false, disabled, children, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size, isLoading: loading, className }))}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : null}
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </button>
  ),
);
Button.displayName = "Button";
