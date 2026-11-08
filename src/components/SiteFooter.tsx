import Link from "next/link";
import type { Service, SiteSettings } from "@/content/types";
import { mainNav, telHref } from "@/lib/nav";
import { BrandMark } from "./Icons";

export function SiteFooter({ settings, services }: { settings: SiteSettings; services: Service[] }) {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link href="/" className="brand" aria-label="Kadi Limo & Transportation, home">
              <BrandMark className="brand__mark" />
              <span className="brand__word">
                <span className="brand__name">Kadi</span>
                <span className="brand__tag">Limo &amp; Transportation</span>
              </span>
            </Link>
            <p className="muted">
              Private chauffeured transportation in {settings.city}, {settings.region}.
            </p>
            {(settings.phone || settings.email) && (
              <ul className="muted" style={{ display: "grid", gap: 6 }}>
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
            )}
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
            <span aria-hidden="true">33.749° N · 84.388° W · </span>
            <Link href="/privacy">Privacy</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
