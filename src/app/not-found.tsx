import Link from "next/link";
import { ArrowRight } from "@/components/Icons";
import { Stop } from "@/components/Stop";

export default function NotFound() {
  return (
    <section>
      <div className="container not-found">
        <Stop num="404" label="Wrong turn" />
        <h1 className="display-xl">
          This road doesn’t <em>go anywhere.</em>
        </h1>
        <p className="lede">The page you’re looking for may have moved. Try one of these instead.</p>
        <div className="btn-row btn-row--stack">
          <Link className="btn btn--brass" href="/">
            Back to home <ArrowRight />
          </Link>
          <Link className="btn btn--line" href="/contact">
            Request a quote
          </Link>
        </div>
      </div>
    </section>
  );
}
