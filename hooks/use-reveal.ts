"use client";

import { useEffect, useRef, useState } from "react";

export function useReveal<TElement extends HTMLElement>(options?: IntersectionObserverInit) {
  const ref = useRef<TElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(node);
        }
      },
      options ?? { threshold: 0.2, rootMargin: "0px 0px -10%" },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [options]);

  return { ref, isVisible };
}
