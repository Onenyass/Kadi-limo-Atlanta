import Link from "next/link";
import { ArrowRight } from "@/components/Icons";

export default function NotFound() {
  return (
    <section className="section">
      <div className="container not-found">
        <p className="eyebrow">Page not found</p>
        <h1 className="display-lg">This road doesn’t go anywhere.</h1>
        <p className="lede">The page you’re looking for may have moved. Try one of these instead.</p>
        <div className="btn-row btn-row--stack-mobile">
          <Link className="btn btn--primary" href="/">
            Back to home <ArrowRight />
          </Link>
          <Link className="btn btn--ghost" href="/contact">
            Request a quote
          </Link>
        </div>
      </div>
    </section>
  );
}
