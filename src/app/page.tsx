import type { Metadata } from "next";
import Link from "next/link";
import { FleetStage } from "@/components/FleetStage";
import { HeroScene } from "@/components/HeroScene";
import { ArrowRight } from "@/components/Icons";
import { Journey } from "@/components/Journey";
import { Lines } from "@/components/Lines";
import { Reveal } from "@/components/Reveal";
import { Scene } from "@/components/Scene";
import { Stop } from "@/components/Stop";
import { getFleet, getServices, getSettings } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return pageMetadata({ description: settings.seoDescription, path: "/" });
}

export default async function HomePage() {
  const [settings, services, fleet] = await Promise.all([getSettings(), getServices(), getFleet()]);
  const featured = services.filter((s) => s.featured);
  const occasions = (featured.length ? featured : services).slice(0, 5);
  const heroVehicle = fleet.find((v) => v.slug === "cadillac-escalade" && v.image) ?? fleet.find((v) => v.image) ?? fleet[0];
  const closingVehicle =
    fleet.find((v) => v.category === "limousine" && v.image) ?? fleet.find((v) => v.image && v !== heroVehicle);

  return (
    <>
      <HeroScene
        eyebrow={settings.hero.eyebrow}
        heading={settings.hero.heading}
        intro={settings.hero.intro}
        vehicle={heroVehicle}
      />

      {/* 01 — Arrival */}
      <section id="arrival" className="chapter tone-raised" aria-labelledby="arrival-title">
        <div className="container arrival">
          <div className="arrival__top">
          <div className="chapter-head" style={{ marginBottom: 0 }}>
            <Reveal>
              <Stop num="01" label="Arrival" />
            </Reveal>
            <Reveal variant="lines">
              <h2 id="arrival-title" className="statement" style={{ maxWidth: "22ch" }}>
                <Lines lines={[settings.homeIntro.heading]} />
              </h2>
            </Reveal>
          </div>
          <Reveal className="prose" delay={150}>
            {settings.homeIntro.body.map((p) => (
              <p key={p} className="lede" style={{ maxWidth: "none" }}>
                {p}
              </p>
            ))}
          </Reveal>
          </div>
          <ul className="arrival__notes">
            {settings.about.principles.map((p, i) => (
              <Reveal as="li" key={p.title} delay={i * 90}>
                <h3>{p.title}</h3>
                <p>{p.body}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* 02 — The fleet */}
      <section className="chapter night-deep" aria-labelledby="fleet-title">
        <div className="container">
          <div className="chapter-head chapter-head--split">
            <div style={{ display: "grid", gap: 28 }}>
              <Reveal>
                <Stop num="02" label="The fleet" />
              </Reveal>
              <Reveal variant="lines">
                <h2 id="fleet-title" className="display-lg">
                  <Lines lines={["The black fleet,", <em key="e">chosen for the occasion.</em>]} />
                </h2>
              </Reveal>
            </div>
            <Reveal delay={120}>
              <p className="lede">
                Full-size SUVs and sedans for everyday travel, with a stretch limousine and a
                Rolls-Royce for the occasions that call for them. Availability is confirmed with
                every quote.
              </p>
            </Reveal>
          </div>
          <Reveal>
            <FleetStage vehicles={fleet} />
          </Reveal>
          <div className="stage__foot">
            <Link className="btn btn--line" href="/fleet">
              View the full fleet <ArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* 03 — Occasions */}
      <section className="chapter tone-raised" aria-labelledby="occasions-title">
        <div className="container">
          <div className="chapter-head chapter-head--split">
            <div style={{ display: "grid", gap: 28 }}>
              <Reveal>
                <Stop num="03" label="Occasions" />
              </Reveal>
              <Reveal variant="lines">
                <h2 id="occasions-title" className="display-lg">
                  <Lines lines={["Planned around", <em key="e">your day.</em>]} />
                </h2>
              </Reveal>
            </div>
            <Reveal delay={120}>
              <p className="lede">
                From an early flight to a late reception, tell us what the day looks like and
                we’ll recommend a suitable vehicle.
              </p>
            </Reveal>
          </div>
          <ul className="index-list">
            {occasions.map((s, i) => (
              <Reveal as="li" key={s.slug} className="index-row" delay={i * 60}>
                <Link href={`/services#${s.slug}`}>
                  <span className="index-row__num" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="index-row__title">{s.title}</span>
                  <span className="index-row__summary">{s.summary}</span>
                  <span className="index-row__arrow" aria-hidden="true">
                    <ArrowRight />
                  </span>
                </Link>
              </Reveal>
            ))}
          </ul>
          <div style={{ marginTop: 40 }}>
            <Link className="btn btn--line" href="/services">
              All {services.length} services <ArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* 04 — Booking */}
      <section className="chapter" aria-labelledby="booking-title">
        <div className="container">
          <div className="chapter-head chapter-head--split">
            <div style={{ display: "grid", gap: 28 }}>
              <Reveal>
                <Stop num="04" label="Booking" />
              </Reveal>
              <Reveal variant="lines">
                <h2 id="booking-title" className="display-lg">
                  <Lines lines={["From request", <em key="e">to ride.</em>]} />
                </h2>
              </Reveal>
            </div>
            <Reveal delay={120}>
              <p className="lede">
                No online checkout and no surprises. We review each request and reply with what’s
                available.
              </p>
            </Reveal>
          </div>
          <Reveal>
            <Journey />
          </Reveal>
        </div>
      </section>

      <Scene
        vehicle={closingVehicle}
        lines={["Where are", <em key="e">you headed?</em>]}
        body="Send us the details and we’ll reply with availability and a quote. There’s no obligation to book."
      />
    </>
  );
}
