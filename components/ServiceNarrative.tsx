import { Check, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { narratives, platformNarratives } from "@/lib/service-narratives";
export function ServiceNarrative({ slug }: { slug: string }) {
  const content = narratives[slug];
  if (!content) return null;
  return (
    <section className="container section detail-context">
      <div data-reveal>
        <span className="eyebrow">
          <span className="dash" /> THE BUSINESS BEHIND THE SOLUTION
        </span>
        <h2>{content.heading}</h2>
        <p>{content.context}</p>
        <p>{content.approach}</p>
        <Link className="text-link" href="/contact">
          Discuss your priorities <ArrowUpRight size={17} />
        </Link>
      </div>
      <aside className="context-note" data-reveal>
        <span className="context-label">AN EXAMPLE STARTING POINT</span>
        <p>{content.example}</p>
        <h3>What we work towards</h3>
        <ul>
          {content.outputs.map((o) => (
            <li key={o}>
              <Check size={18} />
              {o}
            </li>
          ))}
        </ul>
      </aside>
    </section>
  );
}
export function PlatformNarrative({ slug }: { slug: string }) {
  const content = platformNarratives[slug];
  if (!content) return null;
  return (
    <section className="section platform-context">
      <div className="container">
        <div data-reveal>
          <span className="eyebrow">PLATFORM CHOICE. BUSINESS PURPOSE.</span>
          <h2>
            Start with the outcome.
            <br />
            Connect the decisions.
          </h2>
          <p>{content.intro}</p>
          <Link className="text-link" href="/contact">
            Shape your platform roadmap <ArrowUpRight size={17} />
          </Link>
        </div>
        <ul>
          {content.focus.map(([title, text]) => (
            <li key={title} data-reveal>
              <strong>{title}</strong>
              <p>{text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
