import type { Metadata } from "next";
import Link from "next/link";
import { Journey } from "@/components/Journey";
import { Lines } from "@/components/Lines";
import { PageHead } from "@/components/PageHead";
import { RepImage } from "@/components/RepImage";
import { Reveal } from "@/components/Reveal";
import { Scene } from "@/components/Scene";
import { Stop } from "@/components/Stop";
import { getFleet, getSettings } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "About",
  description:
    "Kadi Limo & Transportation is a private chauffeured car service in Atlanta, Georgia for airport trips, business travel, weddings and special occasions.",
  path: "/about",
});

export default async function AboutPage() {
  const [settings, fleet] = await Promise.all([getSettings(), getFleet()]);
  const { about } = settings;
  const bandVehicle = fleet.find((v) => v.category === "luxury" && v.image) ?? fleet.find((v) => v.image);
  const closing = fleet.find((v) => v.slug === "chevrolet-suburban" && v.image) ?? fleet.find((v) => v.image);

  return (
    <>
      <PageHead num="00" label={about.heading} lines={["Transportation,", <em key="e">handled with care.</em>]}>
        <p className="lede">{about.intro}</p>
      </PageHead>

      {bandVehicle && (
        <Reveal variant="curtain" className="band">
          <RepImage
            image={bandVehicle.image}
            category={bandVehicle.category}
            name={bandVehicle.name}
            sizes="100vw"
            parallax
            label="tr"
          />
        </Reveal>
      )}

      <section className="chapter ivory" aria-labelledby="approach-title">
        <div className="container arrival">
          <div className="arrival__top">
          <div className="chapter-head" style={{ marginBottom: 0 }}>
            <Reveal>
              <Stop num="01" label="Our approach" />
            </Reveal>
            <Reveal variant="lines">
              <h2 id="approach-title" className="statement" style={{ maxWidth: "20ch" }}>
                <Lines lines={["Built around what you actually need."]} />
              </h2>
            </Reveal>
          </div>
          <Reveal className="prose" delay={150}>
            {about.body.map((p) => (
              <p key={p} className="lede" style={{ maxWidth: "none" }}>
                {p}
              </p>
            ))}
            <p style={{ marginTop: 28 }}>
              <Link className="link-arrow" href="/services">
                See our services <span className="link-arrow__line" aria-hidden="true" />
              </Link>
            </p>
          </Reveal>
          </div>
        </div>
      </section>

      <section className="chapter night-deep" aria-labelledby="principles-title">
        <div className="container">
          <div className="chapter-head">
            <Reveal>
              <Stop num="02" label="How we work" />
            </Reveal>
            <Reveal variant="lines">
              <h2 id="principles-title" className="display-lg">
                <Lines lines={["Quiet,", <em key="e">by design.</em>]} />
              </h2>
            </Reveal>
          </div>
          <ol className="principles">
            {about.principles.map((p, i) => (
              <Reveal as="li" key={p.title} delay={i * 80}>
                <span className="principles__num" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3>{p.title}</h3>
                <p>{p.body}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="chapter ivory ivory--light" aria-labelledby="process-title">
        <div className="container">
          <div className="chapter-head">
            <Reveal>
              <Stop num="03" label="Booking" />
            </Reveal>
            <Reveal variant="lines">
              <h2 id="process-title" className="display-lg">
                <Lines lines={["From request", <em key="e">to ride.</em>]} />
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
        lines={["Planning", <em key="e">a trip?</em>]}
        body="Send us the details and we’ll reply with availability and a quote. There’s no obligation to book."
      />
    </>
  );
}
