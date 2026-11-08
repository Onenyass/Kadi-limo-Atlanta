import type { Metadata } from "next";
import Link from "next/link";
import { PageHead } from "@/components/PageHead";
import { RepImage } from "@/components/RepImage";
import { Reveal } from "@/components/Reveal";
import { Scene } from "@/components/Scene";
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
  const usingRepresentative = fleet.some((v) => v.image?.isRepresentative);
  const usingIllustrations = fleet.some((v) => !v.image);
  const total = String(fleet.length).padStart(2, "0");
  const closing = fleet.find((v) => v.category === "luxury" && v.image) ?? fleet.find((v) => v.image);

  return (
    <>
      <PageHead num="00" label="The fleet" lines={["Black vehicles,", <em key="e">every kind of trip.</em>]}>
        <p className="lede">
          From full-size SUVs to a classic stretch limousine, choose the vehicle that suits your
          trip, or tell us your plans and we’ll recommend one.
        </p>
        <p className="note note--night">
          <strong>Availability varies by date.</strong> We confirm which vehicles are available,
          and the details of each, when we reply to your request.
          {usingRepresentative &&
            " Images marked “Representative image” show the vehicle type, not Kadi’s own vehicle."}
          {usingIllustrations && " Illustrations are shown where no image is available yet."}
        </p>
      </PageHead>

      <section className="night-deep" aria-label="Vehicles">
        <div className="container">
          <ol>
            {fleet.map((v, i) => (
              <li key={v.slug} id={v.slug} className="plate">
                <Reveal variant="curtain" className="plate__media">
                  <RepImage
                    image={v.image}
                    category={v.category}
                    name={v.name}
                    sizes="(min-width: 960px) 62vw, 100vw"
                    parallax
                    priority={i === 0}
                  />
                </Reveal>
                <Reveal className="plate__body" delay={150}>
                  <div className="plate__index">
                    <span className="plate__num" aria-hidden="true">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="small-caps">
                      {v.kind || "Vehicle"} <span aria-hidden="true">· {String(i + 1).padStart(2, "0")}/{total}</span>
                    </span>
                  </div>
                  <h2 className="plate__name">{v.name}</h2>
                  <p className="plate__desc">{v.description}</p>
                  {v.confirmedDetails.length > 0 && (
                    <ul className="chips" aria-label={`${v.name} details`}>
                      {v.confirmedDetails.map((d) => (
                        <li key={d}>{d}</li>
                      ))}
                    </ul>
                  )}
                  <div>
                    <Link
                      className="link-arrow"
                      href={`/contact?vehicle=${encodeURIComponent(v.slug)}`}
                      aria-label={`Request availability for the ${v.name}`}
                    >
                      Request availability <span className="link-arrow__line" aria-hidden="true" />
                    </Link>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
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
