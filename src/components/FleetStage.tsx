"use client";

import Link from "next/link";
import { useCallback, useId, useRef, useState } from "react";
import type { Vehicle } from "@/content/types";
import { ArrowRight } from "./Icons";
import { RepImage } from "./RepImage";

/**
 * Fleet browser: an accessible tab list beside a large stage.
 * Click, arrow keys (Home/End too) or swipe on the image to change vehicle.
 */
export function FleetStage({ vehicles }: { vehicles: Vehicle[] }) {
  const [index, setIndex] = useState(0);
  const uid = useId();
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const count = vehicles.length;
  const v = vehicles[index];

  const go = useCallback(
    (next: number, focus = false) => {
      const i = (next + count) % count;
      setIndex(i);
      const tab = tabsRef.current[i];
      if (focus) tab?.focus();
      tab?.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth" });
    },
    [count],
  );

  const onKeyDown = (e: React.KeyboardEvent) => {
    const keys: Record<string, number> = {
      ArrowRight: index + 1,
      ArrowDown: index + 1,
      ArrowLeft: index - 1,
      ArrowUp: index - 1,
      Home: 0,
      End: count - 1,
    };
    if (e.key in keys) {
      e.preventDefault();
      go(keys[e.key], true);
    }
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touch.current;
    touch.current = null;
    if (!start) return;
    const dx = e.changedTouches[0].clientX - start.x;
    const dy = e.changedTouches[0].clientY - start.y;
    if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.4) go(index + (dx < 0 ? 1 : -1));
  };

  if (!v) return null;

  return (
    <div className="stage">
      <div className="stage__list" role="tablist" aria-label="Vehicles" aria-orientation="vertical" onKeyDown={onKeyDown}>
        {vehicles.map((item, i) => (
          <button
            key={item.slug}
            ref={(el) => {
              tabsRef.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`${uid}-tab-${i}`}
            aria-selected={i === index}
            aria-controls={`${uid}-panel`}
            tabIndex={i === index ? 0 : -1}
            className="stage__tab"
            onClick={() => go(i)}
          >
            <span className="num" aria-hidden="true">
              {String(i + 1).padStart(2, "0")}
            </span>
            {item.name}
          </button>
        ))}
      </div>

      <div
        className="stage__panel"
        role="tabpanel"
        id={`${uid}-panel`}
        aria-labelledby={`${uid}-tab-${index}`}
      >
        <div className="stage__frame" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
          {vehicles.map((item, i) => (
            <div key={item.slug} className="stage__slide" data-active={i === index} aria-hidden={i !== index}>
              <RepImage
                image={item.image}
                category={item.category}
                name={item.name}
                sizes="(min-width: 1000px) 60vw, 100vw"
                label="tl"
              />
            </div>
          ))}
          <div className="stage__progress" aria-hidden="true">
            <span style={{ width: `${((index + 1) / count) * 100}%` }} />
          </div>
        </div>

        <div className="stage__caption">
          <div className="stage__text" key={v.slug}>
            {v.kind && <p className="small-caps stage__kind">{v.kind}</p>}
            <h3 className="stage__name">{v.name}</h3>
            <p className="stage__desc">{v.description}</p>
          </div>
          <div style={{ display: "grid", gap: 18, justifyItems: "start" }}>
            <div className="stage__controls">
              <button type="button" className="icon-btn icon-btn--prev" onClick={() => go(index - 1)} aria-label="Previous vehicle">
                <ArrowRight />
              </button>
              <span className="stage__count" aria-live="polite">
                {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
              </span>
              <button type="button" className="icon-btn" onClick={() => go(index + 1)} aria-label="Next vehicle">
                <ArrowRight />
              </button>
            </div>
            <Link
              className="link-arrow"
              href={`/contact?vehicle=${encodeURIComponent(v.slug)}`}
              aria-label={`Request availability for the ${v.name}`}
            >
              Request availability <span className="link-arrow__line" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
