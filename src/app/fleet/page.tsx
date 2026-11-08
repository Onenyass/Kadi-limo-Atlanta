import type { Metadata } from "next";
import { FleetShowroom } from "@/components/FleetShowroom";
import { Lines } from "@/components/Lines";
import { OccasionMatch } from "@/components/OccasionMatch";
import { PageHead } from "@/components/PageHead";
import { Reveal } from "@/components/Reveal";
import { Scene } from "@/components/Scene";
import { Stop } from "@/components/Stop";
import { getFleet, getServices } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Fleet",
  description:
    "Explore the Kadi Limo & Transportation black fleet: Cadillac Escalade, Chevrolet Suburban, GMC Yukon, Cadillac sedan, stretch limousine and Rolls-Royce. Request availability for your date.",
  path: "/fleet",
});

export default async function FleetPage() {
  const [fleet, services] = await Promise.all([getFleet(), getServices()]);
  const closing = fleet.find((v) => v.category === "limousine" && v.image) ?? fleet.find((v) => v.image);

  return (
    <>
      <PageHead num="00" label="The fleet" lines={["Black vehicles,", <em key="e">every kind of trip.</em>]}>
        <p className="lede">
          Choose a vehicle to see it up close, or tell us your plans and we’ll recommend one.
          Availability varies by date and is confirmed with every quote.
        </p>
      </PageHead>

      <section aria-label="Fleet showroom" className="tone-deep">
        <FleetShowroom vehicles={fleet} services={services} />
      </section>

      <section className="chapter tone-raised" aria-labelledby="match-title">
        <div className="container">
          <div className="chapter-head chapter-head--split">
            <div style={{ display: "grid", gap: 28 }}>
              <Reveal>
                <Stop num="01" label="By occasion" />
              </Reveal>
              <Reveal variant="lines">
                <h2 id="match-title" className="display-lg">
                  <Lines lines={["Matched to", <em key="e">the occasion.</em>]} />
                </h2>
              </Reveal>
            </div>
            <Reveal delay={120}>
              <p className="lede">
                Pairings drawn from each vehicle’s description. Select a vehicle to view it above,
                or open a service for details.
              </p>
            </Reveal>
          </div>
          <OccasionMatch services={services} vehicles={fleet} />
        </div>
      </section>

      <Scene
        vehicle={closing}
        lines={["Not sure which", <em key="e">vehicle fits?</em>]}
        body="Tell us how many people are traveling and what the occasion is. We’ll suggest the options available for your date."
      />
    </>
  );
}
