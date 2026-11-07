import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BookingSteps } from "@/components/BookingSteps";
import { CtaBand } from "@/components/CtaBand";
import { ArrowRight } from "@/components/Icons";
import { Reveal } from "@/components/Reveal";
import { VehicleCard } from "@/components/VehicleCard";
import { VehicleMedia } from "@/components/VehicleMedia";
import { getFleet, getServices, getSettings } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return pageMetadata({ description: settings.seoDescription, path: "/" });
}

export default async function HomePage() {
  const [settings, services, fleet] = await Promise.all([getSettings(), getServices(), getFleet()]);
  const featuredServices = (services.filter((s) => s.featured).length
    ? services.filter((s) => s.featured)
    : services
  ).slice(0, 4);
  const featuredFleet = (fleet.filter((v) => v.featured).length ? fleet.filter((v) => v.featured) : fleet).slice(0, 4);
  const heroVehicle = fleet.find((v) => v.category === "suv") ?? fleet[0];

  return (
    <>
      {/* ------------------------------------------------------------ Hero */}
      <section className="hero" aria-labelledby="hero-title">
        <div className="container">
          <div className="hero__grid">
            <div className="hero__copy">
              <p className="eyebrow">{settings.hero.eyebrow}</p>
              <h1 id="hero-title" className="display-xl hero__title">
                {settings.hero.heading}
              </h1>
              <p className="lede">{settings.hero.intro}</p>
              <div className="btn-row btn-row--stack-mobile">
                <Link className="btn btn--primary" href="/contact">
                  Request a quote <ArrowRight />
                </Link>
                <Link className="btn btn--ghost" href="/fleet">
                  View the fleet
                </Link>
              </div>
            </div>
            <div className="hero__media">
              {settings.hero.image ? (
                <div className="frame frame--hero">
                  <Image
                    className="frame__photo"
                    src={settings.hero.image.url}
                    alt={settings.hero.image.alt}
                    fill
                    priority
                    sizes="(min-width: 1000px) 48vw, 100vw"
                  />
                  {settings.hero.image.isRepresentative && (
                    <span className="frame__label">Representative image</span>
                  )}
                </div>
              ) : (
                heroVehicle && (
                  <VehicleMedia
                    variant="hero"
                    category={heroVehicle.category}
                    name={heroVehicle.name}
                    priority
                  />
                )
              )}
            </div>
          </div>
          <ul className="hero__services" aria-label="Popular services">
            <li>Airport transfers</li>
            <li>Business travel</li>
            <li>Weddings</li>
            <li>Celebrations &amp; events</li>
          </ul>
        </div>
      </section>

      {/* ----------------------------------------------------------- Intro */}
      <section className="section light" aria-labelledby="intro-title">
        <div className="container intro-grid">
          <Reveal>
            <p className="eyebrow">Kadi Limo &amp; Transportation</p>
            <h2 id="intro-title" className="display-lg" style={{ marginTop: 20 }}>
              {settings.homeIntro.heading}
            </h2>
          </Reveal>
          <Reveal delay={120} className="prose">
            {settings.homeIntro.body.map((p) => (
              <p key={p} className="lede">
                {p}
              </p>
            ))}
            <p style={{ marginTop: 28 }}>
              <Link className="text-link" href="/about">
                More about Kadi <ArrowRight />
              </Link>
            </p>
          </Reveal>
        </div>
      </section>

      {/* -------------------------------------------------------- Services */}
      <section className="section light light--paper" aria-labelledby="services-title">
        <div className="container">
          <div className="section-head section-head--split">
            <Reveal>
              <p className="eyebrow">Services</p>
              <h2 id="services-title" className="display-md" style={{ marginTop: 20 }}>
                Transportation for the trips that matter
              </h2>
            </Reveal>
            <Reveal delay={100}>
              <p className="lede">
                From an early flight to a late reception, tell us what the day looks like and
                we’ll recommend a suitable vehicle.
              </p>
            </Reveal>
          </div>
          <ul className="service-grid service-grid--4">
            {featuredServices.map((s, i) => (
              <Reveal as="li" key={s.slug} delay={i * 80} className="service-card">
                <span className="service-card__num" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3>{s.title}</h3>
                <p>{s.summary}</p>
                <Link
                  className="text-link"
                  href={`/services#${s.slug}`}
                  aria-label={`Learn more about ${s.title}`}
                >
                  Learn more <ArrowRight />
                </Link>
              </Reveal>
            ))}
          </ul>
          <p style={{ marginTop: 36 }}>
            <Link className="btn btn--ghost" href="/services">
              See all services <ArrowRight />
            </Link>
          </p>
        </div>
      </section>

      {/* ----------------------------------------------------------- Fleet */}
      <section className="section" aria-labelledby="fleet-title">
        <div className="container">
          <div className="section-head section-head--split">
            <Reveal>
              <p className="eyebrow">The fleet</p>
              <h2 id="fleet-title" className="display-md" style={{ marginTop: 20 }}>
                A black fleet, chosen for the occasion
              </h2>
            </Reveal>
            <Reveal delay={100}>
              <p className="lede">
                SUVs and sedans for everyday travel, with specialty vehicles for weddings and
                celebrations. Availability is confirmed with every quote.
              </p>
            </Reveal>
          </div>
          <ul className="rail">
            {featuredFleet.map((v, i) => (
              <Reveal as="li" key={v.slug} delay={i * 80}>
                <VehicleCard vehicle={v} compact />
              </Reveal>
            ))}
          </ul>
          <p className="rail-hint" aria-hidden="true">
            Swipe to see more →
          </p>
          <p style={{ marginTop: 36 }}>
            <Link className="btn btn--ghost" href="/fleet">
              Explore the full fleet <ArrowRight />
            </Link>
          </p>
        </div>
      </section>

      {/* --------------------------------------------------------- Booking */}
      <section className="section light" aria-labelledby="booking-title">
        <div className="container">
          <div className="section-head section-head--split">
            <Reveal>
              <p className="eyebrow">How booking works</p>
              <h2 id="booking-title" className="display-md" style={{ marginTop: 20 }}>
                Three simple steps to your ride
              </h2>
            </Reveal>
            <Reveal delay={100}>
              <p className="lede">
                No online checkout and no surprises. We review each request and
                reply with what’s available.
              </p>
            </Reveal>
          </div>
          <Reveal>
            <BookingSteps />
          </Reveal>
          <div className="btn-row btn-row--stack-mobile" style={{ marginTop: 40 }}>
            <Link className="btn btn--primary" href="/contact">
              Start a request <ArrowRight />
            </Link>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
