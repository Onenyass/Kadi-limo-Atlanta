"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Vehicle } from "@/content/types";
import { ArrowRight } from "./Icons";
import { Lines } from "./Lines";
import { RepImage } from "./RepImage";

/** The opening scene: headlights come up, the headline rises line by line. */
export function HeroScene({
  eyebrow,
  heading,
  intro,
  vehicle,
}: {
  eyebrow: string;
  heading: string;
  intro: string;
  vehicle?: Vehicle;
}) {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const raf = requestAnimationFrame(() => setLoaded(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const lines = heading.split("\n").filter(Boolean);

  return (
    <section className={`hero${loaded ? " is-loaded" : ""}`} aria-labelledby="hero-title">
      {vehicle && (
        <div className="hero__media">
          <RepImage
            image={vehicle.image}
            category={vehicle.category}
            name={vehicle.name}
            sizes="100vw"
            priority
            label="tr"
          />
        </div>
      )}
      <div className="hero__shade" aria-hidden="true" />
      <div className="container hero__content">
        <p className="stop">
          <span className="stop__num" aria-hidden="true">
            00
          </span>
          <span className="stop__line" aria-hidden="true" />
          <span>{eyebrow}</span>
        </p>
        <h1 id="hero-title" className="display-hero hero__title">
          <Lines lines={lines} baseDelay={250} />
        </h1>
        <div className="hero__intro">
          <p className="lede">{intro}</p>
          <div className="btn-row btn-row--stack">
            <Link className="btn btn--brass" href="/contact">
              Request a quote <ArrowRight />
            </Link>
            <Link className="btn btn--line" href="/fleet">
              Explore the fleet
            </Link>
          </div>
        </div>
        <div className="hero__bar">
          <div className="hero__bar-group">
            <span>Airport</span>
            <span>Corporate</span>
            <span>Weddings</span>
            <span className="hide-sm">Celebrations</span>
            <span className="hide-sm">Events</span>
          </div>
          <a className="scroll-cue" href="#arrival">
            <span className="hide-sm" aria-hidden="true">
              33.749° N · 84.388° W
            </span>
            <span className="scroll-cue__track" aria-hidden="true" />
            <span>Scroll</span>
          </a>
        </div>
      </div>
    </section>
  );
}
