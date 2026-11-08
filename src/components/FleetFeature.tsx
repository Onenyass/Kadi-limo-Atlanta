import Link from "next/link";
import type { Service, Vehicle } from "@/content/types";
import { ArrowRight } from "./Icons";
import { RepImage } from "./RepImage";
import { Reveal } from "./Reveal";

export type FeatureLayout = "full" | "pair-lead" | "pair-follow" | "print" | "pano" | "finale";

/** Image frame for a vehicle, with the "Representative image" label. */
export function VehicleFrame({
  vehicle,
  layout,
  sizes,
  priority = false,
}: {
  vehicle: Vehicle;
  layout: FeatureLayout;
  sizes: string;
  priority?: boolean;
}) {
  return (
    <Reveal variant="curtain" className={`vframe vframe--${layout}`}>
      <div className="vframe__img">
        <RepImage
          image={vehicle.image}
          category={vehicle.category}
          name={vehicle.name}
          sizes={sizes}
          priority={priority}
          parallax={layout === "full" || layout === "pano"}
          label="tl"
        />
      </div>
    </Reveal>
  );
}

/** Name, description, suited uses and the request action for a vehicle. */
export function VehicleCaption({
  vehicle,
  index,
  total,
  services,
  layout,
}: {
  vehicle: Vehicle;
  index: number;
  total: number;
  services: Service[];
  layout: FeatureLayout;
}) {
  const suited = vehicle.suitedTo
    .map((slug) => services.find((s) => s.slug === slug))
    .filter((s): s is Service => Boolean(s));
  const num = String(index + 1).padStart(2, "0");
  return (
    <Reveal className={`vcap vcap--${layout}`} delay={120}>
      <div className="vcap__meta">
        <span className="vcap__num" aria-hidden="true">
          {num}
        </span>
        <span className="small-caps">
          {vehicle.kind || "Vehicle"}
          <span aria-hidden="true">
            {" "}
            · {num}/{String(total).padStart(2, "0")}
          </span>
        </span>
      </div>
      <h2 className="vcap__name">{vehicle.name}</h2>
      {suited[0] && (
        <p className="vcap__use">
          <em>For {suited[0].title.toLowerCase()}</em>
        </p>
      )}
      <p className="vcap__desc">{vehicle.description}</p>
      {vehicle.confirmedDetails.length > 0 && (
        <ul className="chips" aria-label={`${vehicle.name} details`}>
          {vehicle.confirmedDetails.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
      )}
      {suited.length > 1 && (
        <div className="vcap__suited">
          <span className="vcap__suited-label">Also suited to</span>
          <ul>
            {suited.slice(1).map((s) => (
              <li key={s.slug}>
                <Link href={`/services#${s.slug}`}>{s.title}</Link>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="vcap__actions">
        <Link
          className="btn btn--brass"
          href={`/contact?vehicle=${encodeURIComponent(vehicle.slug)}#request`}
          aria-label={`Request availability for the ${vehicle.name}`}
        >
          Request availability <ArrowRight />
        </Link>
      </div>
    </Reveal>
  );
}
