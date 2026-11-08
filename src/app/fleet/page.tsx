import type { Metadata } from "next";
import { FleetIndex } from "@/components/FleetIndex";
import { VehicleCaption, VehicleFrame, type FeatureLayout } from "@/components/FleetFeature";
import { PageHead } from "@/components/PageHead";
import { Scene } from "@/components/Scene";
import type { Vehicle } from "@/content/types";
import { getFleet, getServices } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Fleet",
  description:
    "Explore the Kadi Limo & Transportation black fleet: Cadillac Escalade, Chevrolet Suburban, GMC Yukon, Cadillac sedan, stretch limousine and Rolls-Royce. Request availability for your date.",
  path: "/fleet",
});

type Group = { type: "full" | "pair" | "print" | "pano" | "finale"; items: { v: Vehicle; i: number }[] };

/**
 * Editorial sequence: each vehicle gets a different composition so the page
 * reads like a printed portfolio, not a list. Extra CMS vehicles fall back to
 * alternating "print" layouts.
 */
function compose(fleet: Vehicle[]): Group[] {
  const items = fleet.map((v, i) => ({ v, i }));
  const groups: Group[] = [];
  const plan: Group["type"][] = ["full", "pair", "print", "pano", "finale"];
  let cursor = 0;
  for (const type of plan) {
    if (cursor >= items.length) break;
    if (type === "pair") {
      if (cursor + 1 < items.length) {
        groups.push({ type, items: items.slice(cursor, cursor + 2) });
        cursor += 2;
      }
      continue;
    }
    groups.push({ type, items: [items[cursor]] });
    cursor += 1;
  }
  while (cursor < items.length) groups.push({ type: "print", items: [items[cursor++]] });
  return groups;
}

export default async function FleetPage() {
  const [fleet, services] = await Promise.all([getFleet(), getServices()]);
  const total = fleet.length;
  const usingRepresentative = fleet.some((v) => v.image?.isRepresentative);
  const usingIllustrations = fleet.some((v) => !v.image);
  const closing = fleet.find((v) => v.category === "suv" && v.image && v.slug !== fleet[0]?.slug) ?? fleet[0];
  const groups = compose(fleet);

  const caption = (v: Vehicle, i: number, layout: FeatureLayout) => (
    <VehicleCaption vehicle={v} index={i} total={total} services={services} layout={layout} />
  );

  return (
    <>
      <PageHead num="00" label="The fleet" lines={["Black vehicles,", <em key="e">every kind of trip.</em>]}>
        <p className="lede">
          SUVs and sedans for everyday travel, a stretch limousine and a Rolls-Royce for the
          occasions that call for them. Choose one, or tell us your plans and we’ll recommend one.
        </p>
        <p className="note note--night">
          <strong>Availability varies by date.</strong> We confirm which vehicles are available,
          and the details of each, when we reply to your request.
          {usingRepresentative &&
            " Images marked “Representative image” show the vehicle type, not Kadi’s own vehicle."}
          {usingIllustrations && " Illustrations are shown where no image is available yet."}
        </p>
      </PageHead>

      <FleetIndex vehicles={fleet} />

      <div className="fleet-seq">
        {groups.map((g) => {
          const key = g.items.map((x) => x.v.slug).join("-");
          if (g.type === "full") {
            const { v, i } = g.items[0];
            return (
              <section key={key} id={v.slug} className="fseq fseq--full night-deep" aria-label={v.name}>
                <VehicleFrame vehicle={v} layout="full" sizes="100vw" priority={i === 0} />
                <div className="container">{caption(v, i, "full")}</div>
              </section>
            );
          }
          if (g.type === "pair") {
            return (
              <section key={key} className="fseq fseq--pair night-deep" aria-label="Full-size SUVs">
                <div className="container fpair">
                  {g.items.map(({ v, i }, n) => {
                    const layout: FeatureLayout = n === 0 ? "pair-lead" : "pair-follow";
                    return (
                      <article key={v.slug} id={v.slug} className={`fpair__item fpair__item--${n === 0 ? "lead" : "follow"}`}>
                        <VehicleFrame vehicle={v} layout={layout} sizes="(min-width: 960px) 55vw, 100vw" />
                        {caption(v, i, layout)}
                      </article>
                    );
                  })}
                </div>
              </section>
            );
          }
          if (g.type === "print") {
            const { v, i } = g.items[0];
            const flip = i % 2 === 1;
            return (
              <section key={key} id={v.slug} className={`fseq fseq--print ivory${flip ? " fseq--flip" : ""}`} aria-label={v.name}>
                <div className="container fprint">
                  <VehicleFrame vehicle={v} layout="print" sizes="(min-width: 960px) 62vw, 100vw" />
                  {caption(v, i, "print")}
                </div>
              </section>
            );
          }
          if (g.type === "pano") {
            const { v, i } = g.items[0];
            return (
              <section key={key} id={v.slug} className="fseq fseq--pano night-deep" aria-label={v.name}>
                <VehicleFrame vehicle={v} layout="pano" sizes="100vw" />
                <div className="container">{caption(v, i, "pano")}</div>
              </section>
            );
          }
          const { v, i } = g.items[0];
          return (
            <section key={key} id={v.slug} className="fseq fseq--finale ivory ivory--light" aria-label={v.name}>
              <div className="container ffinale">
                <VehicleFrame vehicle={v} layout="finale" sizes="(min-width: 960px) 80vw, 100vw" />
                {caption(v, i, "finale")}
              </div>
            </section>
          );
        })}
      </div>

      <Scene
        vehicle={closing}
        lines={["Not sure which", <em key="e">vehicle fits?</em>]}
        body="Tell us how many people are traveling and what the occasion is. We’ll suggest the options available for your date."
      />
    </>
  );
}
