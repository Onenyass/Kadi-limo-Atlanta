"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { mainNav, telHref } from "@/lib/nav";
import { ArrowRight, BrandMark } from "./Icons";

export function SiteHeader({
  phone,
  email,
  city,
}: {
  phone: string | null;
  email: string | null;
  city: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  const [hidden, setHidden] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const close = useCallback((restoreFocus = false) => {
    setOpen(false);
    if (restoreFocus) toggleRef.current?.focus();
  }, []);

  // Close the menu when the route changes (including back/forward).
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
    setHidden(false);
  }

  // Transparent over the opening scene; solid once scrolled.
  // Tucks away while scrolling down, returns on any scroll up.
  useEffect(() => {
    let lastY = window.scrollY;
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      setSolid(y > 24);
      if (Math.abs(y - lastY) > 6) {
        setHidden(y > lastY && y > 480);
        lastY = y;
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Scroll lock, Escape to close, and a focus trap while the menu is open.
  useEffect(() => {
    document.body.dataset.menuOpen = String(open);
    if (!open) return;
    const menu = menuRef.current;
    const t = setTimeout(() => menu?.querySelector<HTMLElement>("a")?.focus(), 120);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close(true);
        return;
      }
      if (e.key !== "Tab" || !menu) return;
      const focusables = [toggleRef.current, ...Array.from(menu.querySelectorAll<HTMLElement>("a, button"))].filter(
        Boolean,
      ) as HTMLElement[];
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
      clearTimeout(t);
      document.removeEventListener("keydown", onKey);
      document.body.dataset.menuOpen = "false";
    };
  }, [open, close]);

  const onMenuClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("a")) setOpen(false);
  };

  const isCurrent = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  const items = [{ href: "/", label: "Home" }, ...mainNav];

  return (
    <>
      <header
        className="site-header"
        data-solid={solid || open}
        data-hidden={hidden && !open}
        onFocusCapture={() => setHidden(false)}
      >
        <div className="container site-header__inner">
          <Link href="/" className="brand" aria-label="Kadi Limo & Transportation, home">
            <BrandMark className="brand__mark" />
            <span className="brand__word">
              <span className="brand__name">Kadi</span>
              <span className="brand__tag">Limo &amp; Transportation</span>
            </span>
          </Link>

          <nav className="nav-desktop" aria-label="Main">
            <ul>
              {mainNav.map((item) => (
                <li key={item.href}>
                  <Link
                    className="nav-link"
                    href={item.href}
                    aria-current={isCurrent(item.href) ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <Link className="btn btn--brass" href="/contact">
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

      <div id="mobile-menu" ref={menuRef} className="mobile-menu" data-open={open} inert={!open}>
        <nav className="mobile-menu__nav" aria-label="Mobile" onClick={onMenuClick}>
          <ol>
            {items.map((item, i) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  style={{ "--i": i } as React.CSSProperties}
                  aria-current={(item.href === "/" ? pathname === "/" : isCurrent(item.href)) ? "page" : undefined}
                >
                  <span className="num" aria-hidden="true">
                    0{i + 1}
                  </span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ol>
        </nav>
        <div className="mobile-menu__foot" onClick={onMenuClick}>
          <Link className="btn btn--brass" href="/contact">
            Request a quote <ArrowRight />
          </Link>
          {phone && (
            <a className="btn btn--line" href={telHref(phone)}>
              Call {phone}
            </a>
          )}
          <p className="mobile-menu__meta">
            <span>{city}, GA</span>
            {email ? <a href={`mailto:${email}`}>{email}</a> : <span>Private transportation</span>}
          </p>
        </div>
      </div>
    </>
  );
}
