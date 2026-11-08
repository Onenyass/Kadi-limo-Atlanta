import type { Metadata } from "next";
import { Journey } from "@/components/Journey";
import { Lines } from "@/components/Lines";
import { PageHead } from "@/components/PageHead";
import { Reveal } from "@/components/Reveal";
import { Scene } from "@/components/Scene";
import { ServiceAccordion } from "@/components/ServiceAccordion";
import { Stop } from "@/components/Stop";
import { getFleet, getServices } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Services",
  description:
    "Airport and hotel transfers, corporate travel, weddings, proms, celebrations, concerts and sporting events, hourly chauffeur service, point-to-point rides and group transportation in Atlanta.",
  path: "/services",
});

export default async function ServicesPage() {
  const [services, fleet] = await Promise.all([getServices(), getFleet()]);
  const closing = fleet.find((v) => v.category === "sedan" && v.image) ?? fleet.find((v) => v.image);

  return (
    <>
      <PageHead num="00" label="Services" lines={["Private transportation,", <em key="e">planned around you.</em>]}>
        <p className="lede">
          Each trip is planned around your schedule. Open a service for details, then request
          availability and a quote.
        </p>
      </PageHead>

      <section className="chapter ivory ivory--light" aria-label="All services" style={{ paddingTop: "clamp(56px, 8vw, 112px)" }}>
        <div className="container">
          <ServiceAccordion services={services} />
        </div>
      </section>

      <section className="chapter" aria-labelledby="process-title">
        <div className="container">
          <div className="chapter-head">
            <Reveal>
              <Stop num="01" label="Booking" />
            </Reveal>
            <Reveal variant="lines">
              <h2 id="process-title" className="display-lg">
                <Lines lines={["Three stops,", <em key="e">one clear plan.</em>]} />
              </h2>
            </Reveal>
          </div>
          <Reveal>
            <Journey />
          </Reveal>
        </div>
      </section>

      <Scene
        vehicle={closing}
        lines={["Something else", <em key="e">in mind?</em>]}
        body="If your trip doesn’t fit neatly into a category, describe it in your request and we’ll let you know what we can offer."
      />
    </>
  );
}
