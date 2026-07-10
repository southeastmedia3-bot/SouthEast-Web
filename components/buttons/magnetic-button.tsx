"use client";

import type { MouseEvent, ReactNode } from "react";
import { useRef } from "react";
import { Button, type ButtonProps } from "@/components/ui/button";

export function MagneticButton({ children, ...props }: ButtonProps & { children: ReactNode }) {
  const ref = useRef<HTMLButtonElement | null>(null);

  const handleMove = (event: MouseEvent<HTMLButtonElement>) => {
    const element = ref.current;
    if (!element) {
      return;
    }

    const rect = element.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;

    element.style.transform = `translate(${x * 0.14}px, ${y * 0.22}px)`;
  };

  const handleLeave = () => {
    if (ref.current) {
      ref.current.style.transform = "translate(0, 0)";
    }
  };

  return (
    <Button ref={ref} onMouseMove={handleMove} onMouseLeave={handleLeave} {...props}>
      {children}
    </Button>
  );
}
