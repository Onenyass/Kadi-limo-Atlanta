import Link from "next/link";
import type { Service, SiteSettings } from "@/content/types";
import { mainNav, telHref } from "@/lib/nav";

export function SiteFooter({ settings, services }: { settings: SiteSettings; services: Service[] }) {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link href="/" className="brand" aria-label="Kadi Limo & Transportation, home">
              <span className="brand__name">Kadi</span>
              <span className="brand__tag">Limo &amp; Transportation</span>
            </Link>
            <p>
              Private chauffeured transportation in {settings.city}, {settings.region}. Request
              availability and a quote for your next trip.
            </p>
            <ul style={{ listStyle: "none", display: "grid", gap: 6 }} className="muted">
              {settings.phone && (
                <li>
                  <a href={telHref(settings.phone)}>{settings.phone}</a>
                </li>
              )}
              {settings.email && (
                <li>
                  <a href={`mailto:${settings.email}`}>{settings.email}</a>
                </li>
              )}
            </ul>
          </div>
          <div className="footer-col">
            <h2>Explore</h2>
            <ul>
              <li>
                <Link href="/">Home</Link>
              </li>
              {mainNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="footer-col">
            <h2>Services</h2>
            <ul>
              {services.slice(0, 6).map((s) => (
                <li key={s.slug}>
                  <Link href={`/services#${s.slug}`}>{s.title}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>
            © {year} {settings.businessName}
          </p>
          <p>
            <Link href="/privacy">Privacy</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
