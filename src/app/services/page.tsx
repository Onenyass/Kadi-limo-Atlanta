import type { Metadata } from "next";
import Link from "next/link";
import { CtaBand } from "@/components/CtaBand";
import { ArrowRight } from "@/components/Icons";
import { PageHero } from "@/components/PageHero";
import { getServices } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Services",
  description:
    "Airport and hotel transfers, corporate travel, weddings, proms, celebrations, concerts and sporting events, hourly chauffeur service, point-to-point rides and group transportation in Atlanta.",
  path: "/services",
});

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <>
      <PageHero
        eyebrow="Services"
        title={
          <>
            Private transportation, <em>planned</em> around your day
          </>
        }
        intro="Each trip is planned around your schedule. Choose a service below to request availability and a quote."
      />

      <nav className="jump-nav light" aria-label="Services on this page">
        <div className="container">
          <ul>
            {services.map((s) => (
              <li key={s.slug}>
                <a href={`#${s.slug}`}>{s.title}</a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <section className="section light" aria-label="All services" style={{ paddingTop: 48 }}>
        <div className="container">
          <ul className="service-list">
            {services.map((s, i) => (
              <li key={s.slug} id={s.slug} className="service-row">
                <span className="service-row__num" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h2>{s.title}</h2>
                  <p className="service-row__summary">{s.summary}</p>
                </div>
                <div className="service-row__body">
                  <p>{s.description}</p>
                  {s.goodFor.length > 0 && (
                    <ul className="tag-list" aria-label={`Common uses for ${s.title}`}>
                      {s.goodFor.map((g) => (
                        <li key={g}>{g}</li>
                      ))}
                    </ul>
                  )}
                  {s.note && <p className="service-row__note">{s.note}</p>}
                  <p>
                    <Link
                      className="text-link"
                      href={`/contact?service=${encodeURIComponent(s.slug)}`}
                      aria-label={`Request a quote for ${s.title}`}
                    >
                      Request a quote <ArrowRight />
                    </Link>
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand
        heading="Have something else in mind?"
        body="If your trip doesn’t fit neatly into a category, describe it in your request and we’ll let you know what we can offer."
      />
    </>
  );
}
