import Link from "next/link";
import type { Vehicle } from "@/content/types";
import { ArrowRight } from "./Icons";
import { VehicleMedia } from "./VehicleMedia";

export function VehicleCard({
  vehicle,
  headingLevel = "h3",
  compact = false,
}: {
  vehicle: Vehicle;
  headingLevel?: "h2" | "h3";
  compact?: boolean;
}) {
  const Heading = headingLevel;
  return (
    <article className="vehicle-card" id={vehicle.slug}>
      <VehicleMedia image={vehicle.image} category={vehicle.category} name={vehicle.name} />
      <div className="vehicle-card__body">
        {vehicle.kind && <p className="vehicle-card__kind">{vehicle.kind}</p>}
        <Heading>{vehicle.name}</Heading>
        {!compact && <p>{vehicle.description}</p>}
        {!compact && vehicle.confirmedDetails.length > 0 && (
          <ul className="vehicle-card__details" aria-label={`${vehicle.name} details`}>
            {vehicle.confirmedDetails.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        )}
        <div className="vehicle-card__foot">
          <Link
            className="text-link"
            href={`/contact?vehicle=${encodeURIComponent(vehicle.slug)}`}
            aria-label={`Request availability for the ${vehicle.name}`}
          >
            Request availability <ArrowRight />
          </Link>
        </div>
      </div>
    </article>
  );
}
