import type { ReactNode } from "react";

/**
 * Splits a heading into masked lines that rise into place when an ancestor
 * has data-visible="true" (see Reveal) or the page has .is-loaded.
 * Pass an array to control line breaks; nodes may include <em>.
 */
export function Lines({ lines, baseDelay = 0 }: { lines: ReactNode[]; baseDelay?: number }) {
  return (
    <>
      {lines.map((line, i) => (
        <span
          className="mask-line"
          key={i}
          style={{ "--i": i, "--base-delay": `${baseDelay}ms` } as React.CSSProperties}
        >
          <span>{line}</span>
        </span>
      ))}
    </>
  );
}
