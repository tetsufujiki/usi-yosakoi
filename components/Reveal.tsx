"use client";

import { type ElementType, type ReactNode, useEffect, useRef } from "react";

type RevealProps = {
  as?: ElementType;
  className?: string;
  children: ReactNode;
  id?: string;
  "aria-labelledby"?: string;
};

/**
 * Marks its element `data-reveal="armed"` only once JavaScript runs and the
 * element is still below the fold, then `"shown"` when it enters the viewport.
 * Without JavaScript, or with reduced motion, content is simply visible.
 */
export function Reveal({
  as: Component = "div",
  className,
  children,
  ...rest
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      element.dataset.reveal = "shown";
      return;
    }

    const bounds = element.getBoundingClientRect();
    if (bounds.top < window.innerHeight * 0.92) {
      element.dataset.reveal = "shown";
      return;
    }

    element.dataset.reveal = "armed";
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        element.dataset.reveal = "shown";
        observer.disconnect();
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <Component ref={ref} className={className} {...rest}>
      {children}
    </Component>
  );
}
