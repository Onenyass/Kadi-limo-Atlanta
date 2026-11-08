"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { contactActions, type ContactInfo } from "@/lib/nav";
import { ArrowRight } from "./Icons";

/**
 * Small-screen action bar: "Request a quote", plus Call / Text / WhatsApp only
 * when those details exist in site settings.
 */
export function MobileCtaBar({ contact }: { contact: ContactInfo }) {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const actions = contactActions(contact);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.dataset.ctaBar = String(visible && pathname !== "/contact");
  }, [visible, pathname]);

  if (pathname === "/contact") return null;

  return (
    <div className="mobile-cta" data-visible={visible} inert={!visible}>
      {actions.map((a) => (
        <a
          key={a.key}
          className="btn btn--line mobile-cta__action"
          href={a.href}
          {...(a.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {a.label}
        </a>
      ))}
      <Link className="btn btn--brass mobile-cta__quote" href="/contact">
        Request a quote <ArrowRight />
      </Link>
    </div>
  );
}
