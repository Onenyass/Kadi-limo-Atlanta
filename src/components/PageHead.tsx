import type { ReactNode } from "react";
import { Lines } from "./Lines";
import { Reveal } from "./Reveal";
import { Stop } from "./Stop";

/** Inner-page opening: a stop, a large masked title and an aside. */
export function PageHead({
  num,
  label,
  lines,
  children,
}: {
  num: string;
  label: string;
  lines: ReactNode[];
  children?: ReactNode;
}) {
  return (
    <header className="page-head">
      <div className="container page-head__inner">
        <div className="page-head__title">
          <Reveal>
            <Stop num={num} label={label} />
          </Reveal>
          <Reveal variant="lines">
            <h1 className="display-xl">
              <Lines lines={lines} baseDelay={100} />
            </h1>
          </Reveal>
        </div>
        {children && (
          <Reveal delay={350} className="page-head__aside">
            {children}
          </Reveal>
        )}
      </div>
    </header>
  );
}
