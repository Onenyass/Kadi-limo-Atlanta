"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { Service, Vehicle } from "@/content/types";
import { ArrowRight } from "./Icons";
import { VehicleArt } from "./VehicleArt";

/**
 * Fleet showroom: a thumbnail selector with the selected vehicle's image and
 * details directly beneath it. All images load eagerly and stay mounted, so
 * switching never shows an empty frame. Selection syncs with the URL hash
 * (/fleet#rolls-royce), and works with click, arrow keys, Home/End or swipe.
 */
export function FleetShowroom({ vehicles, services }: { vehicles: Vehicle[]; services: Service[] }) {
  const uid = useId();
  const [index, setIndex] = useState(0);
  const [loaded, setLoaded] = useState<Record<string, boolean>>({});
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const stageRef = useRef<HTMLDivElement>(null);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const count = vehicles.length;
  const v = vehicles[index];

  const scrollStageIntoView = useCallback(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const top = stage.getBoundingClientRect().top;
    // Only move the page if the stage is out of comfortable view.
    if (top < 0 || top > window.innerHeight * 0.6) {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      stage.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    }
  }, []);

  const select = useCallback(
    (next: number, opts: { focus?: boolean; scroll?: boolean } = {}) => {
      const i = (next + count) % count;
      setIndex(i);
      const slug = vehicles[i]?.slug;
      if (slug && window.location.hash !== `#${slug}`) {
        history.replaceState(null, "", `#${slug}`);
      }
      const tab = tabsRef.current[i];
      if (opts.focus) tab?.focus();
      const list = tab?.parentElement?.parentElement;
      if (tab && list && list.scrollWidth > list.clientWidth) {
        list.scrollTo({ left: tab.offsetLeft - list.clientWidth / 2 + tab.clientWidth / 2, behavior: "smooth" });
      }
      if (opts.scroll) scrollStageIntoView();
    },
    [count, vehicles, scrollStageIntoView],
  );

  // Select from the URL hash on load and when links elsewhere change it.
  useEffect(() => {
    const fromHash = (scroll: boolean) => {
      const slug = decodeURIComponent(window.location.hash.slice(1));
      const i = vehicles.findIndex((x) => x.slug === slug);
      if (i !== -1) {
        setIndex(i);
        if (scroll) requestAnimationFrame(scrollStageIntoView);
      }
    };
    fromHash(false);
    const onHash = () => fromHash(true);
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [vehicles, scrollStageIntoView]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const keys: Record<string, number> = { ArrowRight: index + 1, ArrowLeft: index - 1, Home: 0, End: count - 1 };
    if (e.key in keys) {
      e.preventDefault();
      select(keys[e.key], { focus: true });
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
    if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.4) select(index + (dx < 0 ? 1 : -1));
  };

  if (!v) return null;
  const suited = v.suitedTo
    .map((slug) => services.find((s) => s.slug === slug))
    .filter((s): s is Service => Boolean(s));
  const num = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="showroom">
      <div className="showroom__bar">
        <div className="container">
          <div className="showroom__tabs" role="tablist" aria-label="Choose a vehicle" onKeyDown={onKeyDown}>
            <ol>
              {vehicles.map((item, i) => (
                <li key={item.slug}>
                  <button
                    ref={(el) => {
                      tabsRef.current[i] = el;
                    }}
                    type="button"
                    role="tab"
                    id={`${uid}-tab-${i}`}
                    aria-selected={i === index}
                    aria-controls={`${uid}-panel`}
                    tabIndex={i === index ? 0 : -1}
                    className="showroom__tab"
                    onClick={() => select(i, { scroll: true })}
                  >
                    <span className="showroom__thumb" aria-hidden="true">
                      {item.image ? (
                        <Image src={item.image.url} alt="" fill sizes="80px" loading="eager" />
                      ) : (
                        <VehicleArt category={item.category} title="" />
                      )}
                    </span>
                    <span className="showroom__tab-text">
                      <span className="showroom__tab-num" aria-hidden="true">
                        {num(i + 1)}
                      </span>
                      <span>{item.name}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      <div
        ref={stageRef}
        className="container showroom__stage"
        role="tabpanel"
        id={`${uid}-panel`}
        aria-labelledby={`${uid}-tab-${index}`}
      >
        <div className="showroom__frame" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
          {vehicles.map((item, i) => (
            <div
              key={item.slug}
              className="showroom__slide"
              data-active={i === index}
              data-loaded={item.image ? Boolean(loaded[item.slug]) : true}
              aria-hidden={i !== index}
            >
              {item.image ? (
                <Image
                  src={item.image.url}
                  alt={item.image.alt}
                  fill
                  loading="eager"
                  priority={i === 0}
                  sizes="(min-width: 1100px) 64vw, 100vw"
                  onLoad={() => setLoaded((m) => (m[item.slug] ? m : { ...m, [item.slug]: true }))}
                />
              ) : (
                <div className="showroom__art">
                  <VehicleArt category={item.category} title={`Illustration of a black ${item.name}`} />
                </div>
              )}
            </div>
          ))}
          <span className="rep-label rep-label--tl">
            {v.image ? (v.image.isRepresentative ? "Representative image" : "Kadi vehicle") : "Illustration"}
          </span>
          <div className="showroom__controls">
            <button type="button" className="icon-btn icon-btn--prev" onClick={() => select(index - 1)} aria-label="Previous vehicle">
              <ArrowRight />
            </button>
            <span className="showroom__count" aria-hidden="true">
              {num(index + 1)} / {num(count)}
            </span>
            <button type="button" className="icon-btn" onClick={() => select(index + 1)} aria-label="Next vehicle">
              <ArrowRight />
            </button>
          </div>
          <div className="showroom__progress" aria-hidden="true">
            <span style={{ width: `${((index + 1) / count) * 100}%` }} />
          </div>
        </div>

        <div className="showroom__info" key={v.slug} aria-live="polite">
          <p className="showroom__meta">
            <span className="showroom__num" aria-hidden="true">
              {num(index + 1)}
            </span>
            <span className="small-caps">{v.kind || "Vehicle"}</span>
          </p>
          <h2 className="showroom__name">{v.name}</h2>
          {v.useLine && (
            <p className="showroom__use">
              <em>{v.useLine}</em>
            </p>
          )}
          <p className="showroom__desc">{v.description}</p>
          {v.confirmedDetails.length > 0 && (
            <ul className="chips" aria-label={`${v.name} details`}>
              {v.confirmedDetails.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          )}
          {suited.length > 0 && (
            <div className="showroom__suited">
              <p className="showroom__suited-label">Suited to</p>
              <ul>
                {suited.map((s) => (
                  <li key={s.slug}>
                    <Link href={`/services#${s.slug}`}>
                      <span>{s.title}</span>
                      <ArrowRight />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="showroom__actions">
            <Link
              className="btn btn--brass"
              href={`/contact?vehicle=${encodeURIComponent(v.slug)}#request`}
              aria-label={`Request availability for the ${v.name}`}
            >
              Request availability <ArrowRight />
            </Link>
          </div>
          <p className="showroom__fine">
            Availability is confirmed with every quote.
            {v.image?.isRepresentative && " The image shows the vehicle type, not Kadi’s own vehicle."}
          </p>
        </div>
      </div>
    </div>
  );
}
