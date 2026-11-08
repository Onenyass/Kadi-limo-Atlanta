import type { Metadata } from "next";
import Link from "next/link";
import { PageHead } from "@/components/PageHead";
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
      <PageHead num="00" label="Privacy" lines={["Privacy policy"]} />
      <section className="chapter tone-raised" style={{ paddingTop: "clamp(56px, 8vw, 112px)" }}>
        <div className="container">
          {settings.privacyPolicy ? (
            <div className="legal prose">
              {settings.privacyPolicy.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          ) : (
            <div className="legal">
              <p className="note">
                <strong>Placeholder: policy not yet published.</strong> Kadi Limo &amp;
                Transportation’s privacy policy will appear here once it has been prepared and
                reviewed. It can be added in the CMS under Site settings → Privacy policy.
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
