export function ArrowRight({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false">
      <path d="M2 10h15M12 5l5 5-5 5" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

/** Kadi monogram: a K drawn as a route with a single stop. */
export function BrandMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 34 34" fill="none" aria-hidden="true" focusable="false">
      <circle cx="17" cy="17" r="16.25" stroke="currentColor" strokeOpacity="0.35" strokeWidth="1" />
      <path d="M12.5 9v16" stroke="currentColor" strokeWidth="1.4" />
      <path d="M22.5 9.5 12.6 18.2l9.9 6.8" stroke="#c1a271" strokeWidth="1.4" />
      <circle cx="12.6" cy="18.2" r="1.9" fill="#0a0f0d" stroke="#c1a271" strokeWidth="1.2" />
    </svg>
  );
}
