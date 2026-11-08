"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { telHref } from "@/lib/nav";
import { ArrowRight } from "./Icons";

/** Small-screen action bar that appears once the visitor has scrolled past the opening. */
export function MobileCtaBar({ phone }: { phone: string | null }) {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.7);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pathname === "/contact") return null;

  return (
    <div className="mobile-cta" data-visible={visible} inert={!visible}>
      {phone && (
        <a className="btn btn--line" href={telHref(phone)}>
          Call
        </a>
      )}
      <Link className="btn btn--brass" href="/contact">
        Request a quote <ArrowRight />
      </Link>
    </div>
  );
}
