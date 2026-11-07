import type { ReactNode } from "react";

export function PageHero({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <header className="page-hero">
      <div className="container page-hero__inner">
        <div className="page-hero__title">
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="display-lg">{title}</h1>
        </div>
        {(intro || children) && (
          <div>
            {intro && <p className="lede">{intro}</p>}
            {children}
          </div>
        )}
      </div>
    </header>
  );
}
