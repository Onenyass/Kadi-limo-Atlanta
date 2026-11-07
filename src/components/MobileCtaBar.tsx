"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { telHref } from "@/lib/nav";

/** Small-screen action bar that appears after the visitor scrolls a little. */
export function MobileCtaBar({ phone }: { phone: string | null }) {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 480);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pathname === "/contact") return null;

  return (
    <div className="mobile-cta" data-visible={visible} aria-hidden={!visible} inert={!visible}>
      {phone && (
        <a className="btn btn--ghost" href={telHref(phone)}>
          Call
        </a>
      )}
      <Link className="btn btn--primary" href="/contact">
        Request a quote
      </Link>
    </div>
  );
}
