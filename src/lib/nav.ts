export const mainNav = [
  { href: "/fleet", label: "Fleet" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export function telHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export function smsHref(phone: string) {
  return `sms:${phone.replace(/[^\d+]/g, "")}`;
}

export function whatsappHref(number: string) {
  return `https://wa.me/${number.replace(/\D/g, "")}`;
}

/** Contact actions available from site settings. Empty until the owner provides details. */
export type ContactInfo = { phone: string | null; textEnabled: boolean; whatsapp: string | null };

export function contactActions({ phone, textEnabled, whatsapp }: ContactInfo) {
  const actions: { key: string; label: string; href: string; external?: boolean }[] = [];
  if (phone) actions.push({ key: "call", label: "Call", href: telHref(phone) });
  if (phone && textEnabled) actions.push({ key: "text", label: "Text", href: smsHref(phone) });
  if (whatsapp) actions.push({ key: "whatsapp", label: "WhatsApp", href: whatsappHref(whatsapp), external: true });
  return actions;
}
