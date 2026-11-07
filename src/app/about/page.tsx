import type { Metadata } from "next";
import Link from "next/link";
import { BookingSteps } from "@/components/BookingSteps";
import { CtaBand } from "@/components/CtaBand";
import { ArrowRight } from "@/components/Icons";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { getSettings } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "About",
  description:
    "Kadi Limo & Transportation is a private chauffeured car service in Atlanta, Georgia for airport trips, business travel, weddings and special occasions.",
  path: "/about",
});

export default async function AboutPage() {
  const settings = await getSettings();
  const { about } = settings;

  return (
    <>
      <PageHero
        eyebrow={about.heading}
        title={
          <>
            Transportation handled with <em>care</em>
          </>
        }
        intro={about.intro}
      />

      <section className="section light" aria-labelledby="approach-title">
        <div className="container intro-grid">
          <Reveal>
            <p className="eyebrow">Our approach</p>
            <h2 id="approach-title" className="display-md" style={{ marginTop: 20 }}>
              Built around what you actually need
            </h2>
          </Reveal>
          <Reveal delay={120} className="prose">
            {about.body.map((p) => (
              <p key={p} className="lede">
                {p}
              </p>
            ))}
            <p style={{ marginTop: 28 }}>
              <Link className="text-link" href="/services">
                See our services <ArrowRight />
              </Link>
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section" aria-labelledby="principles-title">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">What to expect</p>
            <h2 id="principles-title" className="display-md">
              How we work
            </h2>
          </div>
          <ul className="principles">
            {about.principles.map((p, i) => (
              <Reveal as="li" key={p.title} delay={i * 80}>
                <h3>{p.title}</h3>
                <p>{p.body}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="section light" aria-labelledby="process-title">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">Booking</p>
            <h2 id="process-title" className="display-md">
              From request to ride
            </h2>
          </div>
          <BookingSteps />
        </div>
      </section>

      <CtaBand />
    </>
  );
}
