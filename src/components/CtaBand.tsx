import Link from "next/link";
import { ArrowRight } from "./Icons";

export function CtaBand({
  heading = "Planning a trip?",
  body = "Send us the details and we’ll reply with availability and a quote. There’s no obligation to book.",
}: {
  heading?: string;
  body?: string;
}) {
  return (
    <section className="cta-band section section--tight" aria-labelledby="cta-heading">
      <div className="container cta-band__inner">
        <div style={{ display: "grid", gap: 18 }}>
          <h2 id="cta-heading" className="display-md">
            {heading}
          </h2>
          <p className="lede">{body}</p>
        </div>
        <div className="btn-row btn-row--stack-mobile">
          <Link className="btn btn--primary" href="/contact">
            Request a quote <ArrowRight />
          </Link>
        </div>
      </div>
    </section>
  );
}
