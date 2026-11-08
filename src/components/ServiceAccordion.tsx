"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Service, Vehicle } from "@/content/types";

/**
 * Services as an expandable index. Several can be open at once.
 * Links to /services#slug open and scroll to that service.
 */
export function ServiceAccordion({ services, vehicles = [] }: { services: Service[]; vehicles?: Vehicle[] }) {
  const [open, setOpen] = useState<Set<string>>(() => new Set(services[0] ? [services[0].slug] : []));

  useEffect(() => {
    const openFromHash = () => {
      const slug = decodeURIComponent(window.location.hash.slice(1));
      if (!slug || !services.some((s) => s.slug === slug)) return;
      setOpen((prev) => new Set(prev).add(slug));
      requestAnimationFrame(() => document.getElementById(slug)?.scrollIntoView({ block: "start" }));
    };
    openFromHash();
    window.addEventListener("hashchange", openFromHash);
    return () => window.removeEventListener("hashchange", openFromHash);
  }, [services]);

  const toggle = (slug: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });

  return (
    <ul className="accordion">
      {services.map((s, i) => {
        const isOpen = open.has(s.slug);
        const num = String(i + 1).padStart(2, "0");
        return (
          <li key={s.slug} id={s.slug} className="acc-item">
            <h2>
              <button
                type="button"
                className="acc-trigger"
                aria-expanded={isOpen}
                aria-controls={`${s.slug}-panel`}
                id={`${s.slug}-trigger`}
                onClick={() => toggle(s.slug)}
              >
                <span className="acc-trigger__num" aria-hidden="true">
                  {num}
                </span>
                <span className="acc-trigger__title">{s.title}</span>
                <span className="acc-trigger__summary">{s.summary}</span>
                <span className="acc-trigger__icon" aria-hidden="true" />
              </button>
            </h2>
            <div
              className="acc-panel"
              id={`${s.slug}-panel`}
              role="region"
              aria-labelledby={`${s.slug}-trigger`}
              data-open={isOpen}
              inert={!isOpen}
            >
              <div className="acc-panel__inner">
                <div className="acc-panel__body">
                  <div className="acc-panel__main">
                    <p>{s.description}</p>
                  </div>
                  <div className="acc-panel__side">
                    {s.goodFor.length > 0 && (
                      <ul className="chips" aria-label={`Common uses for ${s.title}`}>
                        {s.goodFor.map((g) => (
                          <li key={g}>{g}</li>
                        ))}
                      </ul>
                    )}
                    {s.note && <p className="acc-note">{s.note}</p>}
                    {vehicles.some((v) => v.suitedTo.includes(s.slug)) && (
                      <div className="acc-vehicles">
                        <p className="acc-vehicles__label">Suggested vehicles</p>
                        <ul>
                          {vehicles
                            .filter((v) => v.suitedTo.includes(s.slug))
                            .map((v) => (
                              <li key={v.slug}>
                                <Link href={`/fleet#${v.slug}`} className="match__vehicle">
                                  <span className="match__thumb" aria-hidden="true">
                                    {v.image && <Image src={v.image.url} alt="" fill sizes="96px" />}
                                  </span>
                                  <span>{v.name}</span>
                                </Link>
                              </li>
                            ))}
                        </ul>
                      </div>
                    )}
                    <Link
                      className="link-arrow"
                      href={`/contact?service=${encodeURIComponent(s.slug)}`}
                      aria-label={`Request a quote for ${s.title}`}
                    >
                      Request a quote <span className="link-arrow__line" aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
