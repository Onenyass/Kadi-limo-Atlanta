import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { getSettings } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Privacy",
  description: "Privacy information for Kadi Limo & Transportation.",
  path: "/privacy",
});

export default async function PrivacyPage() {
  const settings = await getSettings();
  return (
    <>
      <PageHero eyebrow="Privacy" title="Privacy policy" />
      <section className="section light">
        <div className="container">
          {settings.privacyPolicy ? (
            <div className="legal-placeholder prose">
              {settings.privacyPolicy.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          ) : (
            <div className="legal-placeholder">
              <p className="notice">
                <span>
                  <strong>Placeholder — policy not yet published.</strong> Kadi Limo &amp;
                  Transportation’s privacy policy will appear here once it has been prepared and
                  reviewed. It can be added in the CMS under Site settings → Privacy policy.
                </span>
              </p>
              <p className="muted">
                In the meantime, information you share through the{" "}
                <Link href="/contact">ride-request form</Link> is used only to respond to your
                request.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
