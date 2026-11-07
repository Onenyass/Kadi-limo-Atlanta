import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Manrope } from "next/font/google";
import { JsonLd } from "@/components/JsonLd";
import { MobileCtaBar } from "@/components/MobileCtaBar";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { siteConfig } from "@/lib/config";
import { getServices, getSettings } from "@/lib/content";
import { localBusinessJsonLd } from "@/lib/seo";
import "./globals.css";

const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const sans = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    metadataBase: new URL(siteConfig.siteUrl),
    title: {
      default: `${settings.businessName} | Private transportation in Atlanta`,
      template: `%s | ${settings.businessName}`,
    },
    description: settings.seoDescription,
    applicationName: settings.businessName,
    robots: siteConfig.indexable ? { index: true, follow: true } : { index: false, follow: false },
    openGraph: {
      siteName: settings.businessName,
      locale: "en_US",
      type: "website",
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#0b100e",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [settings, services] = await Promise.all([getSettings(), getServices()]);
  return (
    <html lang="en-US" className={`${serif.variable} ${sans.variable} no-js`} suppressHydrationWarning>
      <body>
        <script
          // Marks JS as available so scroll-reveal styles apply; content stays visible without JS.
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.remove('no-js')",
          }}
        />
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <SiteHeader phone={settings.phone} email={settings.email} />
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <SiteFooter settings={settings} services={services} />
        <MobileCtaBar phone={settings.phone} />
        <JsonLd data={localBusinessJsonLd(settings)} />
      </body>
    </html>
  );
}
