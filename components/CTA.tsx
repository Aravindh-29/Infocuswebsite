import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
export default function CTA() {
  return (
    <section className="renewal-cta">
      <div className="cta-orb" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>
      <div className="container">
        <span className="eyebrow">THE FUTURE DOESN’T BUILD ITSELF.</span>
        <div className="renewal-cta-grid">
          <h2>
            Make your next
            <br />
            move <em>matter.</em>
          </h2>
          <div>
            <p>
              Your ambitions deserve a practical path forward. Bring us the
              challenge. Together, we’ll shape a practical path from where you
              are to where your business needs to be.
            </p>
            <Link className="button" href="/contact">
              Let’s build your advantage <ArrowUpRight size={19} />
            </Link>
            <span className="cta-small">
              A focused conversation. A clearer direction.
            </span>
          </div>
        </div>
        <div className="cta-footnote">
          <span>CLOUD TRANSFORMATION</span>
          <span>ENTERPRISE INTEGRATION</span>
          <span>LASTING OPERATIONAL VALUE</span>
        </div>
      </div>
    </section>
  );
}
