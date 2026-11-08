import type { Metadata } from "next";
import { PageHead } from "@/components/PageHead";
import { Reveal } from "@/components/Reveal";
import { RideRequestForm } from "@/components/RideRequestForm";
import { NETLIFY_FORM_NAME, siteConfig } from "@/lib/config";
import { getFleet, getServices, getSettings } from "@/lib/content";
import { smsHref, telHref, whatsappHref } from "@/lib/nav";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Request a Ride",
  description:
    "Request availability and a quote from Kadi Limo & Transportation for airport transfers, business travel, weddings, events and private rides in Atlanta.",
  path: "/contact",
});

export default async function ContactPage() {
  const [settings, services, fleet] = await Promise.all([getSettings(), getServices(), getFleet()]);

  return (
    <>
      <PageHead num="00" label="Request a ride" lines={["Where are", <em key="e">you headed?</em>]}>
        <p className="lede">{settings.contactIntro}</p>
      </PageHead>

      <section className="chapter tone-raised" aria-label="Ride request" style={{ paddingTop: "clamp(56px, 8vw, 112px)" }}>
        <div className="container contact-grid">
          <Reveal as="aside" className="contact-aside contact-aside--after" aria-labelledby="contact-details-title">
            <div style={{ display: "grid", gap: 16 }}>
              <h2 id="contact-details-title" className="display-sm">
                Three short steps
              </h2>
              <p className="muted">
                Tell us about the occasion, the journey and how to reach you. We’ll reply with
                availability and a quote.
              </p>
            </div>
            <ul className="details">
              <li>
                <span className="label">Phone</span>
                {settings.phone ? (
                  <span className="details__actions">
                    <a href={telHref(settings.phone)}>Call {settings.phone}</a>
                    {settings.textEnabled && <a href={smsHref(settings.phone)}>Text</a>}
                  </span>
                ) : (
                  <span className="placeholder-value">Phone number coming soon</span>
                )}
              </li>
              {settings.whatsapp && (
                <li>
                  <span className="label">WhatsApp</span>
                  <a href={whatsappHref(settings.whatsapp)} target="_blank" rel="noopener noreferrer">
                    Message on WhatsApp
                  </a>
                </li>
              )}
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
            <p className="note">
              <strong>Requests are not bookings.</strong> We’ll confirm availability, vehicle and
              quote before anything is reserved.
            </p>
          </Reveal>

          <Reveal delay={150} id="request">
            <RideRequestForm
              mode={siteConfig.formMode}
              formName={NETLIFY_FORM_NAME}
              services={services.map((s) => ({ value: s.slug, label: s.title }))}
              vehicles={fleet.map((v) => ({ value: v.slug, label: v.name }))}
              email={settings.email}
              businessName={settings.businessName}
            />
          </Reveal>
        </div>
      </section>
    </>
  );
}
