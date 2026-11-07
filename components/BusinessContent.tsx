import { ArrowUpRight, Check, Plus } from "lucide-react";
import Link from "next/link";
export const engagementSteps = [
  [
    "Discover the real challenge",
    "We start with the people, processes and applications involved. Together, we identify the constraints, dependencies and business priorities that should shape the work.",
    "A shared definition of success",
  ],
  [
    "Design the right path",
    "Translate the priorities into an architecture and a sequenced plan. Consider integration, operational ownership and adoption alongside the technical choices.",
    "A practical implementation roadmap",
  ],
  [
    "Build with a clear purpose",
    "Connect the systems, validate the critical workflows and prepare the transition. Keep business stakeholders involved so the result reflects how the organisation actually works.",
    "A solution ready for everyday use",
  ],
  [
    "Improve as you evolve",
    "Review the operating experience, address friction and identify the next improvement. Keep the technology aligned with changing demands and business priorities.",
    "A foundation for continued progress",
  ],
];
export function DeliveryApproach() {
  return (
    <section className="delivery-section section">
      <div className="container">
        <div className="section-heading" data-reveal>
          <div>
            <span className="eyebrow">
              <span className="dash" /> HOW WE TURN INTENT INTO IMPACT
            </span>
            <h2>
              Clear thinking.
              <br />
              Accountable delivery.
            </h2>
          </div>
          <p>
            The strongest solutions connect business understanding with
            engineering discipline. Our approach keeps both in view, from the
            first discussion through implementation and ongoing improvement.
          </p>
        </div>
        <div className="delivery-grid">
          {engagementSteps.map(([title, text, result], i) => (
            <article key={title} data-reveal>
              <div className="delivery-index">
                <span>0{i + 1}</span>
                <ArrowUpRight size={22} />
              </div>
              <h3>{title}</h3>
              <p>{text}</p>
              <span className="delivery-result">
                <Check size={15} />
                {result}
              </span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
export function WhyInfocus() {
  return (
    <section className="container section human-section">
      <div className="human-visual" data-reveal>
        <img
          src="/images/greater.webp"
          alt="People collaborating on a business and technology challenge"
          loading="lazy"
        />
        <div className="human-image-note">
          <span>EXPERTISE IS HUMAN.</span>
          <strong>
            Technology works better
            <br />
            when people work together.
          </strong>
        </div>
      </div>
      <div className="human-copy" data-reveal>
        <span className="eyebrow">
          <span className="dash" /> THE INFOCUS DIFFERENCE
        </span>
        <h2>
          We see the business
          <br />
          behind the technology.
        </h2>
        <p>
          A platform is only valuable when it helps your people do something
          better. That is why we bring consulting, implementation and
          operational thinking into the same conversation.
        </p>
        <div className="editorial-points">
          <div>
            <span>01</span>
            <div>
              <h3>Your context comes first.</h3>
              <p>
                We look at the whole environment — the systems you depend on,
                the processes they support and the outcomes you want to change.
              </p>
            </div>
          </div>
          <div>
            <span>02</span>
            <div>
              <h3>Connections are part of the design.</h3>
              <p>
                Cloud and enterprise decisions belong together. Integration is
                considered from the start, so new capabilities fit into the
                wider business.
              </p>
            </div>
          </div>
          <div>
            <span>03</span>
            <div>
              <h3>Progress has a practical shape.</h3>
              <p>
                Clear priorities, a manageable sequence and attention to ongoing
                operations help turn ambitious ideas into work that can move
                forward.
              </p>
            </div>
          </div>
        </div>
        <Link href="/about" className="text-link">
          Get to know Infocus <ArrowUpRight size={18} />
        </Link>
      </div>
    </section>
  );
}
export function ProjectQuestions() {
  const questions = [
    [
      "Where should a transformation project begin?",
      "Start with a business problem and the systems that influence it. You do not need a complete technical specification. Bring the challenge, the current environment and the change you want to achieve; these give the discovery conversation a useful starting point.",
    ],
    [
      "Can we improve existing systems without replacing everything?",
      "Yes. Modernisation can be a sequence of targeted changes. Application integration, selected workload migration and process automation can help you build on existing investments. The right sequence depends on dependencies, constraints and the business case.",
    ],
    [
      "How do cloud and Oracle services fit together?",
      "Cloud provides the infrastructure and platform foundation. Oracle ERP and other business applications support core processes, while integration connects those applications with the wider environment. We consider these layers together when shaping a solution.",
    ],
    [
      "What should we prepare for the first conversation?",
      "A brief outline of your goals, the applications or platforms involved, the main points of friction and any timing constraints. Share what you already know. We can use that context to identify the questions that need further exploration.",
    ],
  ];
  return (
    <section className="container section project-questions">
      <div data-reveal>
        <span className="eyebrow">
          <span className="dash" /> BEFORE WE BUILD
        </span>
        <h2>
          Better questions.
          <br />
          <span className="muted">Stronger beginnings.</span>
        </h2>
        <p>
          A little clarity at the start creates a better foundation for
          everything that follows.
        </p>
        <Link className="text-link" href="/contact">
          Talk through your challenge <ArrowUpRight size={17} />
        </Link>
      </div>
      <div>
        {questions.map(([q, a]) => (
          <details key={q}>
            <summary>
              {q}
              <Plus size={20} />
            </summary>
            <p>{a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
