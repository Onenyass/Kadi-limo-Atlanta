import type { Metadata } from "next";
import { CtaBand } from "@/components/CtaBand";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { VehicleCard } from "@/components/VehicleCard";
import { getFleet } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Fleet",
  description:
    "Explore the Kadi Limo & Transportation black fleet: Cadillac Escalade, Chevrolet Suburban, GMC Yukon, Cadillac sedan, stretch limousine and Rolls-Royce. Request availability for your date.",
  path: "/fleet",
});

export default async function FleetPage() {
  const fleet = await getFleet();
  const usingIllustrations = fleet.some((v) => !v.image);
  const usingRepresentative = fleet.some((v) => v.image?.isRepresentative);

  return (
    <>
      <PageHero
        eyebrow="The fleet"
        title={
          <>
            Black vehicles for <em>every</em> kind of trip
          </>
        }
        intro="From full-size SUVs to a classic stretch limousine, choose the vehicle that suits your trip — or tell us about your plans and we’ll recommend one."
      />

      <section className="section" aria-label="Vehicles">
        <div className="container">
          <div style={{ display: "grid", gap: 12, marginBottom: 40 }}>
            <p className="notice">
              <span>
                <strong>Availability varies by date.</strong> We’ll confirm which vehicles are
                available — and the details of each — when we reply to your request.
                {usingIllustrations &&
                  " Illustrations are shown where vehicle photos are not yet available."}
                {usingRepresentative &&
                  " Images marked “Representative image” show the vehicle type, not Kadi’s own vehicle."}
              </span>
            </p>
          </div>
          <ul className="fleet-grid fleet-grid--3">
            {fleet.map((v, i) => (
              <Reveal as="li" key={v.slug} delay={(i % 3) * 80}>
                <VehicleCard vehicle={v} headingLevel="h2" />
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand
        heading="Not sure which vehicle fits?"
        body="Tell us how many people are traveling and what the occasion is. We’ll suggest the options available for your date."
      />
    </>
  );
}
