"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Vehicle } from "@/content/types";

/**
 * Sticky fleet index with thumbnails. Highlights the vehicle in view and jumps
 * to a vehicle on click (plain anchor links, so it works without JavaScript).
 */
export function FleetIndex({ vehicles }: { vehicles: Vehicle[] }) {
  const [active, setActive] = useState(vehicles[0]?.slug ?? "");
  const listRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const targets = vehicles
      .map((v) => document.getElementById(v.slug))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!targets.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-35% 0px -45% 0px", threshold: [0, 0.25, 0.5] },
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, [vehicles]);

  // Keep the active item visible in the horizontally scrolling list (phones).
  useEffect(() => {
    const list = listRef.current;
    const item = list?.querySelector<HTMLElement>(`[data-slug="${active}"]`);
    if (!list || !item || list.scrollWidth <= list.clientWidth) return;
    const left = item.offsetLeft - list.clientWidth / 2 + item.clientWidth / 2;
    list.scrollTo({ left, behavior: "smooth" });
  }, [active]);

  return (
    <nav className="fleet-index" aria-label="Vehicles on this page">
      <div className="container">
        <ol ref={listRef} className="fleet-index__list">
          {vehicles.map((v, i) => (
            <li key={v.slug} data-slug={v.slug}>
              <a href={`#${v.slug}`} aria-current={active === v.slug ? "true" : undefined}>
                <span className="fleet-index__thumb" aria-hidden="true">
                  {v.image && <Image src={v.image.url} alt="" fill sizes="72px" />}
                </span>
                <span className="fleet-index__num" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="fleet-index__name">{v.name}</span>
              </a>
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}
