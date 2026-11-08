"use client";

import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";

/**
 * Reveals content once when it enters the viewport.
 * variant: "fade" (rise + fade), "curtain" (image uncovers), "lines" (masked heading).
 * Reduced-motion CSS shows everything immediately.
 */
export function Reveal({
  children,
  as: Tag = "div",
  delay = 0,
  variant = "fade",
  className = "",
  ...rest
}: {
  children: ReactNode;
  as?: ElementType;
  delay?: number;
  variant?: "fade" | "curtain" | "lines";
  className?: string;
} & Record<string, unknown>) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      const raf = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(raf);
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.01 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const variantClass = variant === "fade" ? "reveal" : `reveal reveal--${variant}`;
  return (
    <Tag
      ref={ref}
      className={`${variantClass} ${className}`.trim()}
      data-visible={visible}
      style={delay ? ({ "--reveal-delay": `${delay}ms` } as React.CSSProperties) : undefined}
      {...rest}
    >
      {children}
    </Tag>
  );
}
