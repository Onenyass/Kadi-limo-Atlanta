import Link from "next/link";
import type { Vehicle } from "@/content/types";
import { ArrowRight } from "./Icons";
import { Lines } from "./Lines";
import { RepImage } from "./RepImage";
import { Reveal } from "./Reveal";

/** Closing cinematic scene with a single call to action. */
export function Scene({
  vehicle,
  lines,
  body,
}: {
  vehicle?: Vehicle;
  lines: React.ReactNode[];
  body: string;
}) {
  return (
    <section className="scene" aria-labelledby="scene-title">
      {vehicle && (
        <div className="scene__media">
          <RepImage
            image={vehicle.image}
            category={vehicle.category}
            name={vehicle.name}
            sizes="100vw"
            parallax
            label="tr"
          />
        </div>
      )}
      <div className="scene__shade" aria-hidden="true" />
      <div className="container scene__content">
        <Reveal variant="lines" style={{ display: "grid", gap: 24 }}>
          <h2 id="scene-title" className="display-xl">
            <Lines lines={lines} />
          </h2>
          <p className="lede">{body}</p>
        </Reveal>
        <Reveal delay={200} className="btn-row btn-row--stack">
          <Link className="btn btn--brass" href="/contact">
            Request a quote <ArrowRight />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
