import Image from "next/image";
import Link from "next/link";
import type { Service, Vehicle } from "@/content/types";
import { Reveal } from "./Reveal";

/**
 * Services paired with the vehicles whose descriptions suit them.
 * Vehicle links (/fleet#slug) select that vehicle in the showroom.
 */
export function OccasionMatch({ services, vehicles }: { services: Service[]; vehicles: Vehicle[] }) {
  const rows = services
    .map((s) => ({ s, vs: vehicles.filter((v) => v.suitedTo.includes(s.slug)) }))
    .filter((r) => r.vs.length > 0);
  if (!rows.length) return null;
  return (
    <ul className="match">
      {rows.map(({ s, vs }, i) => (
        <Reveal as="li" key={s.slug} className="match__row" delay={i * 50}>
          <div className="match__service">
            <span className="match__num" aria-hidden="true">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div>
              <h3>
                <Link href={`/services#${s.slug}`}>{s.title}</Link>
              </h3>
              <p>{s.summary}</p>
            </div>
          </div>
          <ul className="match__vehicles" aria-label={`Vehicles suited to ${s.title}`}>
            {vs.map((v) => (
              <li key={v.slug}>
                <a href={`#${v.slug}`} className="match__vehicle">
                  <span className="match__thumb" aria-hidden="true">
                    {v.image && <Image src={v.image.url} alt="" fill sizes="96px" />}
                  </span>
                  <span>{v.name}</span>
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      ))}
    </ul>
  );
}
