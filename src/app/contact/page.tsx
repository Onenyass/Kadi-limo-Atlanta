import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { RideRequestForm } from "@/components/RideRequestForm";
import { NETLIFY_FORM_NAME, siteConfig } from "@/lib/config";
import { getFleet, getServices, getSettings } from "@/lib/content";
import { telHref } from "@/lib/nav";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Request a Ride",
  description:
    "Request availability and a quote from Kadi Limo & Transportation for airport transfers, business travel, weddings, events and private rides in Atlanta.",
  path: "/contact",
});

export default async function ContactPage() {
  const [settings, services, fleet] = await Promise.all([getSettings(), getServices(), getFleet()]);
  const serviceOptions = services.map((s) => ({ value: s.slug, label: s.title }));
  const vehicleOptions = fleet.map((v) => ({ value: v.slug, label: v.name }));

  const form = (
    <RideRequestForm
      mode={siteConfig.formMode}
      formName={NETLIFY_FORM_NAME}
      services={serviceOptions}
      vehicles={vehicleOptions}
      email={settings.email}
      businessName={settings.businessName}
    />
  );

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title={
          <>
            Request a <em>ride</em>
          </>
        }
        intro={settings.contactIntro}
      />

      <section className="section light" aria-label="Contact details and ride request form">
        <div className="container contact-grid">
          <aside className="contact-aside" aria-labelledby="contact-details-title">
            <div style={{ display: "grid", gap: 16 }}>
              <h2 id="contact-details-title" className="display-sm">
                Get in touch
              </h2>
              <p className="muted">
                The quickest way to reach us is the request form. Include as much detail as you can
                and we’ll reply with availability and a quote.
              </p>
            </div>
            <ul className="contact-list">
              <li>
                <span className="label">Phone</span>
                {settings.phone ? (
                  <a href={telHref(settings.phone)}>{settings.phone}</a>
                ) : (
                  <span className="placeholder-value">Phone number coming soon</span>
                )}
              </li>
              <li>
                <span className="label">Email</span>
                {settings.email ? (
                  <a href={`mailto:${settings.email}`}>{settings.email}</a>
                ) : (
                  <span className="placeholder-value">Email address coming soon</span>
                )}
              </li>
              <li>
                <span className="label">Based in</span>
                <span>
                  {settings.city}, {settings.region}
                </span>
              </li>
              <li>
                <span className="label">Service area</span>
                {settings.serviceArea ? (
                  <span>{settings.serviceArea}</span>
                ) : (
                  <span className="placeholder-value">Service area details coming soon</span>
                )}
              </li>
            </ul>
            <p className="notice">
              <span>
                <strong>Requests are not bookings.</strong> We’ll confirm availability, vehicle and
                quote before anything is reserved.
              </span>
            </p>
          </aside>

          {form}
        </div>
      </section>
    </>
  );
}
