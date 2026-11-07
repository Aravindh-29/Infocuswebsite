import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function CTA() {
  return (
    <section className="cta-section container" data-reveal>
      <span className="eyebrow">LET’S BRING YOUR NEXT CHAPTER INTO FOCUS.</span>
      <div>
        <h2>
          What’s your <span>next?</span>
        </h2>
        <Link
          href="/contact"
          aria-label="Start a conversation"
          className="cta-arrow"
        >
          <ArrowUpRight />
        </Link>
      </div>
      <p>
        A new challenge. A bold idea. A better way forward. Let’s build it
        together.
      </p>
    </section>
  );
}
