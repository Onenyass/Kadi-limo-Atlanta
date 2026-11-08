"use client";

import { useEffect, useState } from "react";

/** Appears after the visitor has scrolled well down the page. */
export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      setVisible(window.scrollY > window.innerHeight * 1.2);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const toTop = () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    // Return keyboard focus to the start of the page.
    document.querySelector<HTMLElement>(".brand")?.focus({ preventScroll: true });
  };

  return (
    <button
      type="button"
      className="to-top"
      data-visible={visible}
      onClick={toTop}
      aria-label="Back to top"
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
    >
      <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false">
        <path d="M10 17V3M5 8l5-5 5 5" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    </button>
  );
}
