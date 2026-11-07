"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { mainNav, telHref } from "@/lib/nav";
import { ArrowRight } from "./Icons";

export function SiteHeader({ phone, email }: { phone: string | null; email: string | null }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const close = useCallback((restoreFocus = false) => {
    setOpen(false);
    if (restoreFocus) toggleRef.current?.focus();
  }, []);

  // Close the menu whenever the route changes (including back/forward).
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll lock, Escape to close, and a simple focus trap while open.
  useEffect(() => {
    document.body.dataset.menuOpen = String(open);
    if (!open) return;
    const menu = menuRef.current;
    menu?.querySelector<HTMLElement>("a")?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close(true);
        return;
      }
      if (e.key !== "Tab" || !menu) return;
      const focusables = [
        toggleRef.current,
        ...Array.from(menu.querySelectorAll<HTMLElement>("a, button")),
      ].filter(Boolean) as HTMLElement[];
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.dataset.menuOpen = "false";
    };
  }, [open, close]);

  // Links to the current page don't change the route, so close explicitly.
  const onMenuClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("a")) setOpen(false);
  };

  const isCurrent = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <header className="site-header" data-scrolled={scrolled || open}>
        <div className="container site-header__inner">
          <Link href="/" className="brand" aria-label="Kadi Limo & Transportation, home">
            <span className="brand__name">Kadi</span>
            <span className="brand__tag">Limo &amp; Transportation</span>
          </Link>

          <nav className="nav-desktop" aria-label="Main">
            <ul>
              {mainNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} aria-current={isCurrent(item.href) ? "page" : undefined}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <Link className="btn btn--primary" href="/contact">
              Request a quote
            </Link>
          </nav>

          <button
            ref={toggleRef}
            type="button"
            className="menu-toggle"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span>{open ? "Close" : "Menu"}</span>
            <span className="menu-toggle__icon" aria-hidden="true">
              <span />
              <span />
            </span>
          </button>
        </div>
      </header>

      <div
        id="mobile-menu"
        ref={menuRef}
        className="mobile-menu"
        data-open={open}
        aria-hidden={!open}
        inert={!open}
      >
        <nav className="mobile-menu__nav" aria-label="Mobile" onClick={onMenuClick}>
          <ol>
            <li>
              <Link href="/" aria-current={pathname === "/" ? "page" : undefined}>
                Home
              </Link>
            </li>
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} aria-current={isCurrent(item.href) ? "page" : undefined}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ol>
        </nav>
        <div className="mobile-menu__foot" onClick={onMenuClick}>
          <Link className="btn btn--primary" href="/contact">
            Request a quote <ArrowRight />
          </Link>
          {phone && (
            <a className="btn btn--ghost" href={telHref(phone)}>
              Call {phone}
            </a>
          )}
          <p className="mobile-menu__meta">
            Private transportation in Atlanta, Georgia.
            {email && (
              <>
                {" "}
                <a href={`mailto:${email}`}>{email}</a>
              </>
            )}
          </p>
        </div>
      </div>
    </>
  );
}
