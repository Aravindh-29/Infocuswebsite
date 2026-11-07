import { vendors, vendorForName } from "@/lib/vendors";
import VendorBrand from "@/components/VendorBrand";
import VendorVisual from "@/components/VendorVisual";
import {
  OriginalLogoStrip,
  OriginalPhotoStory,
} from "@/components/OriginalAssets";
import type { CSSProperties } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight, Check, ArrowRight } from "lucide-react";
import {
  Button,
  Icon,
  IndustryExplorer,
  ContactForm,
  CareersList,
} from "@/components/Interface";
import CapabilityVisual from "@/components/CapabilityVisual";
import Globe from "@/components/Globe";
import { solutions, services, platforms, offices } from "@/lib/content";
import CTA from "@/components/CTA";
const pages: Record<
  string,
  { title: string; headline: string; description: string; image?: string }
> = {
  solutions: {
    title: "Solutions",
    headline: "Built for your business.\nDesigned for what’s next.",
    description:
      "Connect cloud, applications and enterprise expertise to move your business forward.",
    image: "cloud-hero.webp",
  },
  industries: {
    title: "Industries",
    headline: "Your industry.\nA sharper perspective.",
    description:
      "Technology begins with understanding the world you work in. Explore a focused approach to your industry.",
  },
  platforms: {
    title: "Technology ecosystem",
    headline: "The right platforms.\nWorking better together.",
    description:
      "An ecosystem of cloud, enterprise, infrastructure and collaboration technologies, connected around your goals.",
    image: "integration.webp",
  },
  services: {
    title: "Oracle services",
    headline: "Deep expertise.\nConnected possibilities.",
    description:
      "Make more of your Oracle investment with integration, enterprise applications and communications solutions.",
    image: "integration.webp",
  },
  about: {
    title: "About Infocus",
    headline: "Technology with purpose.\nPeople with perspective.",
    description:
      "We are Infocus Consulting Services: a service-focused, customer-oriented community of people who believe in quality, collective knowledge and meaningful progress.",
    image: "about.webp",
  },
  careers: {
    title: "Careers",
    headline: "Bring your curiosity.\nBuild something greater.",
    description:
      "Exceptional work begins with people. Explore your next chapter in a service-focused team that values your contribution.",
    image: "careers.webp",
  },
  contact: {
    title: "Contact us",
    headline: "Every possibility starts\nwith a conversation.",
    description:
      "A complex challenge. A bold ambition. A new beginning. Tell us what you have in mind.",
  },
  privacy: {
    title: "Privacy policy",
    headline: "Your information.\nHandled with care.",
    description:
      "How this website handles the information you choose to share.",
  },
};
const aliases: Record<string, string> = {
  "aboutus.html": "about",
  "careers.html": "careers",
  "jobs.html": "careers",
  "contact.html": "contact",
  "service1.html": "services/oracle-erp",
  "service2.html": "services/oracle-integration-cloud",
  "service3.html": "services/oracle-integration",
  "service4.html": "services/oracle-rodod",
};
const routes = [
  ...Object.keys(pages),
  ...solutions.map((s) => "solutions/" + s.slug),
  ...services.map((s) => "services/" + s.slug),
  ...Object.keys(aliases),
  ...vendors.map((v) => "platforms/" + v.slug),
];
export function generateStaticParams() {
  return routes.map((s) => ({ slug: s.split("/") }));
}
export const dynamicParams = false;
function resolve(slug: string[]) {
  const path = slug.join("/");
  return Object.hasOwn(aliases, path) ? aliases[path] : path;
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const path = resolve(slug);
  const detail =
    solutions.find((s) => path === "solutions/" + s.slug) ||
    services.find((s) => path === "services/" + s.slug) ||
    vendors.find((v) => path === "platforms/" + v.slug);
  const p = pages[path];
  return {
    title: detail?.title || p?.title || "Infocus",
    description: detail?.description || p?.description,
    alternates: { canonical: "/" + path },
    openGraph: {
      title: detail?.title || p?.title,
      description: detail?.description || p?.description,
    },
  };
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const path = resolve(slug);
  const vendor = vendors.find((v) => path === "platforms/" + v.slug);
  if (vendor)
    return (
      <main
        id="main"
        className={"vendor-page brand-" + vendor.slug}
        style={{ "--vendor-color": vendor.color } as CSSProperties}
      >
        <section className="inner-hero">
          <div className="container">
            <div className="breadcrumbs">
              <Link href="/">Home</Link>
              <span>/</span>
              <Link href="/platforms">Platforms</Link>
              <span>/</span>
              {vendor.title}
            </div>
            <div className="inner-hero-grid vendor-hero-grid">
              <div>
                <VendorBrand
                  vendor={vendor.slug}
                  withName={vendor.slug !== "oracle"}
                />
                <h1>{vendor.headline}</h1>
                <p>{vendor.description}</p>
                <Button href="/contact">Explore the possibilities</Button>
              </div>
              <VendorVisual vendor={vendor.slug} />
            </div>
          </div>
        </section>
        <section className="section container vendor-story">
          <div>
            <span className="eyebrow">YOUR AMBITION. CONNECTED EXPERTISE.</span>
            <h2>
              Make the platform
              <br />
              work for your business.
            </h2>
            <p>
              Start with what you want to achieve. We help you connect the right
              architecture, applications and operational approach to your
              priorities.
            </p>
            <div className="tags">
              {vendor.nodes.map((n) => (
                <span key={n}>{n}</span>
              ))}
            </div>
            <Button
              href={vendor.slug === "oracle" ? "/services" : "/solutions/cloud"}
            >
              Discover related solutions
            </Button>
          </div>
          <img
            src={"/images/" + vendor.image}
            alt={
              vendor.slug === "oracle"
                ? "Oracle ERP capabilities diagram"
                : "Technology expertise and collaboration"
            }
          />
        </section>
        <CTA />
      </main>
    );
  if (path === "")
    return (
      <main id="main">
        <div className="container section">
          <h1>Welcome to Infocus.</h1>
          <Button href="/">Explore the new homepage</Button>
        </div>
      </main>
    );
  const solution = solutions.find((s) => path === "solutions/" + s.slug),
    service = services.find((s) => path === "services/" + s.slug);
  const detail = solution || service;
  if (detail)
    return (
      <main id="main" className={service ? "brand-oracle" : ""}>
        <section className="inner-hero detail-hero">
          <div className="container">
            <div className="breadcrumbs">
              <Link href="/">Home</Link>
              <span>/</span>
              <Link href={solution ? "/solutions" : "/services"}>
                {solution ? "Solutions" : "Services"}
              </Link>
              <span>/</span>
              {detail.title}
            </div>
            <div className="inner-hero-grid">
              <div>
                <span className="eyebrow">
                  <span className="dash" />
                  {solution ? "SOLUTIONS THAT MOVE YOU" : "ORACLE EXPERTISE"}
                </span>
                <h1>
                  {detail.title}
                  <span className="blue-text">.</span>
                </h1>
                {service && <VendorBrand vendor="oracle" />}
                <p>{detail.description}</p>
                <Button href="/contact">Discuss your next project</Button>
              </div>
              {service ? (
                <VendorVisual
                  vendor="oracle"
                  nodes={
                    service.slug === "oracle-erp"
                      ? ["Finance", "Operations", "Enterprise data"]
                      : service.slug === "oracle-rodod"
                        ? ["Offer design", "Orders", "Fulfilment"]
                        : ["Applications", "Integration", "Automation"]
                  }
                />
              ) : solution && solution.slug !== "cloud" ? (
                <CapabilityVisual variant={solution.slug} />
              ) : (
                <img
                  className="inner-art"
                  src={
                    solution?.slug === "cloud"
                      ? "/images/cloud-hero.webp"
                      : "/images/integration.webp"
                  }
                  alt={
                    solution?.slug === "cloud"
                      ? "Connected cloud infrastructure"
                      : "Connected enterprise application architecture"
                  }
                />
              )}
            </div>
          </div>
        </section>
        <section className="section container">
          <div className="section-heading">
            <div>
              <span className="eyebrow">FROM AMBITION TO ACTION</span>
              <h2>
                Expertise where
                <br />
                it matters.
              </h2>
            </div>
            <p>
              Build a practical path forward with capabilities shaped around
              your organization’s needs.
            </p>
          </div>
          <div className="capability-grid">
            {detail.capabilities.map((c, i) => (
              <article key={c} data-reveal>
                <span className="eyebrow">0{i + 1} /</span>
                <h3>{c}</h3>
                <p>{capabilityCopy(c)}</p>
                <Check size={22} />
              </article>
            ))}
          </div>
        </section>
        <section className="container section vendor-story">
          <div>
            <span className="eyebrow">EXPERTISE IN ACTION</span>
            <h2>
              {service
                ? "Bring your Oracle ecosystem into focus."
                : "Technology built around the way you work."}
            </h2>
            <p>
              Connect experienced people, a clear architecture and the systems
              your business depends on.
            </p>
            <Button href="/contact">Talk to our team</Button>
          </div>
          <img
            src={
              "/images/" +
              (service?.slug === "oracle-erp"
                ? "oracle-expertise 1.webp"
                : service?.slug === "oracle-integration-cloud"
                  ? "t3.webp"
                  : service
                    ? "t2.webp"
                    : solution?.slug === "cloud"
                      ? "t1.webp"
                      : solution?.slug === "applications"
                        ? "t3.webp"
                        : solution?.slug === "managed"
                          ? "t5.webp"
                          : "greater.webp")
            }
            alt={
              service?.slug === "oracle-erp"
                ? "Oracle ERP capability diagram"
                : "Technology specialists at work"
            }
          />
        </section>
        <section className="section approach-section">
          <div className="container detail-process">
            <h2>
              A clear path.
              <br />
              <span className="muted">A shared focus.</span>
            </h2>
            <div>
              {[
                "Understand your environment",
                "Define the right architecture",
                "Implement with purpose",
                "Optimize as you evolve",
              ].map((t, i) => (
                <div key={t}>
                  <span>0{i + 1}</span>
                  <h3>{t}</h3>
                  <ArrowRight size={20} />
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="section container">
          <span className="eyebrow">EXPLORE FURTHER</span>
          <h2>Connected expertise.</h2>
          <div className="related-grid">
            {(solution
              ? solutions.filter((s) => s.slug !== solution.slug).slice(0, 3)
              : services.filter((s) => s.slug !== service?.slug)
            ).map((s) => (
              <Link
                key={s.slug}
                href={(solution ? "/solutions/" : "/services/") + s.slug}
              >
                <h3>{s.title}</h3>
                <ArrowUpRight />
              </Link>
            ))}
          </div>
        </section>
        <CTA />
      </main>
    );
  const p = pages[path];
  if (!p) notFound();
  return (
    <main id="main">
      <section
        className={
          "inner-hero " +
          (p.image ? "has-image" : "") +
          (path === "services" ? " brand-oracle" : "")
        }
      >
        <div className="container">
          <div className="breadcrumbs">
            <Link href="/">Home</Link>
            <span>/</span>
            {p.title}
          </div>
          <div className="inner-hero-grid">
            <div>
              <span className="eyebrow">
                <span className="dash" /> {p.title.toUpperCase()}
              </span>
              <h1>
                {p.headline.split("\n").map((s, i) => (
                  <span key={s} className={i ? "muted" : ""}>
                    {s}
                    <br />
                  </span>
                ))}
              </h1>
              <p>{p.description}</p>
              {path === "careers" && (
                <Button href="#opportunities">
                  Explore your possibilities
                </Button>
              )}
            </div>
            {path === "services" ? (
              <VendorVisual vendor="oracle" />
            ) : (
              p.image && (
                <img
                  className="inner-art"
                  src={"/images/" + p.image}
                  alt={
                    p.title === "About Infocus"
                      ? "Infocus company culture"
                      : p.title === "Careers"
                        ? "People and collaboration at Infocus"
                        : "Connected technology ecosystem"
                  }
                />
              )
            )}
          </div>
        </div>
      </section>
      {path === "solutions" && (
        <section className="container section solution-list">
          {solutions.map((s) => (
            <article className="solution-row" key={s.slug} data-reveal>
              <span className="row-number">{s.number}</span>
              <div className="row-icon">
                <Icon name={s.icon} size={44} />
              </div>
              <div>
                <h2>{s.title}</h2>
                <p>{s.description}</p>
                <div className="tags">
                  {s.capabilities.map((c) => (
                    <span key={c}>{c}</span>
                  ))}
                </div>
              </div>
              <Link
                aria-label={"Explore " + s.title}
                href={"/solutions/" + s.slug}
              >
                <ArrowUpRight size={30} />
              </Link>
            </article>
          ))}
        </section>
      )}
      {path === "industries" && (
        <section className="container section">
          <IndustryExplorer />
        </section>
      )}
      {path === "platforms" && (
        <section className="container section">
          <p className="platform-disclaimer">
            Our technology ecosystem reflects platforms listed in our company
            materials. Platform names do not imply current certification or
            official partner status.
          </p>
          <div className="platform-grid">
            {platforms.map((group, i) => (
              <article key={group.category} data-reveal>
                <span className="eyebrow">0{i + 1} /</span>
                <h2>{group.category}</h2>
                {group.names.map((n) => (
                  <Link
                    className="platform-line"
                    key={n}
                    href={
                      vendorForName(n)
                        ? "/platforms/" + vendorForName(n)
                        : "/solutions/managed"
                    }
                  >
                    {vendorForName(n) && (
                      <VendorBrand vendor={vendorForName(n)} />
                    )}
                    <span>{n}</span>
                    <ArrowUpRight size={18} />
                  </Link>
                ))}
              </article>
            ))}
          </div>
        </section>
      )}
      {path === "services" && (
        <section className="container section services-grid">
          {services.map((s, i) => (
            <Link href={"/services/" + s.slug} key={s.slug} data-reveal>
              <span className="eyebrow">0{i + 1} / ORACLE SERVICES</span>
              <div className="service-brand-art">
                <VendorBrand vendor="oracle" />
                <img
                  src={
                    "/images/" +
                    [
                      "t3.webp",
                      "oracle-expertise 1.webp",
                      "t2.webp",
                      "t1.webp",
                    ][i]
                  }
                  alt={s.title + " expertise"}
                  loading="lazy"
                />
              </div>
              <h2>{s.title}</h2>
              <p>{s.description}</p>
              <span className="text-link">
                Explore service <ArrowUpRight size={17} />
              </span>
            </Link>
          ))}
        </section>
      )}
      {path === "about" && (
        <>
          <OriginalPhotoStory />
          <OriginalLogoStrip />
          <section className="container section story-grid">
            <div data-reveal>
              <span className="eyebrow">OUR SHARED FOCUS</span>
              <h2>
                Service at heart.
                <br />
                Quality in everything.
              </h2>
            </div>
            <div data-reveal>
              <p>
                Infocus Consulting Services brings IT services, consulting and
                business solutions together. We advise, design, build and manage
                solutions across multicloud, enterprise applications and
                integration.
              </p>
              <p>
                Our approach starts with people: passionate, purpose-led
                professionals who combine collective knowledge with a commitment
                to customer service.
              </p>
              <p>
                We believe the best technology work begins with understanding
                your business, and continues through implementation and ongoing
                improvement.
              </p>
            </div>
          </section>
          <section className="section approach-section">
            <div className="container values-grid">
              {[
                [
                  "Our vision",
                  "To be a respected organization known for a distinctive, customer-focused approach.",
                ],
                [
                  "Our mission",
                  "To deliver service with quality, helping our customers and people reach their potential.",
                ],
                [
                  "Our values",
                  "Professionalism, excellence, collaboration and solidarity with society guide how we work.",
                ],
              ].map(([t, d]) => (
                <article key={t} data-reveal>
                  <span className="dash" />
                  <h2>{t}</h2>
                  <p>{d}</p>
                </article>
              ))}
            </div>
          </section>
          <section className="container section" id="presence">
            <Globe />
          </section>
        </>
      )}
      {path === "careers" && (
        <>
          <section className="container section">
            <div className="section-heading">
              <div>
                <span className="eyebrow">LIFE AT INFOCUS</span>
                <h2>
                  People make
                  <br />
                  the difference.
                </h2>
              </div>
              <p>
                We value our employees and customers, encourage professional
                growth and work together with a shared sense of purpose.
              </p>
            </div>
            <div className="values-grid">
              {[
                [
                  "Grow with purpose",
                  "Bring your skills to meaningful technology challenges and continue building your expertise.",
                ],
                [
                  "Create together",
                  "Share ideas and collective knowledge with people who care about doing great work.",
                ],
                [
                  "Make your contribution count",
                  "Be part of a service-focused environment that values professionalism and your individual perspective.",
                ],
              ].map(([t, d]) => (
                <article key={t} data-reveal>
                  <h3>{t}</h3>
                  <p>{d}</p>
                </article>
              ))}
            </div>
          </section>
          <section className="container section" id="opportunities">
            <span className="eyebrow">YOUR NEXT CHAPTER</span>
            <h2>Find your focus.</h2>
            <CareersList />
            <div className="recruitment-note">
              <h3>A note on recruitment</h3>
              <p>
                Infocus recruiters contact candidates through Infocus email
                addresses. Verify the sender and contact{" "}
                <a href="mailto:hr@infocuscs.com">hr@infocuscs.com</a> if you
                are unsure about a message. Areas listed here are not confirmed
                open vacancies.
              </p>
            </div>
          </section>
        </>
      )}
      {path === "contact" && (
        <>
          <section className="container section contact-grid">
            <div>
              <span className="eyebrow">LET’S CONNECT</span>
              <h2>
                Good conversations.
                <br />
                Great beginnings.
              </h2>
              <p>
                Tell us about your business and where you want to go. Prepare an
                enquiry for our team, or explore your nearest office below.
              </p>
              <a className="text-link" href="mailto:hr@infocuscs.com">
                hr@infocuscs.com <ArrowUpRight size={17} />
              </a>
              <p className="muted">
                Published company contact for enquiries and careers.
              </p>
              <img
                src="/images/formimg.webp"
                alt="A business conversation with Infocus"
                loading="lazy"
              />
            </div>
            <ContactForm />
          </section>
          <section className="section container">
            <span className="eyebrow">GLOBAL PRESENCE</span>
            <h2>Find us around the world.</h2>
            <div className="office-grid">
              {offices.map((o) => (
                <article key={o.city}>
                  <img
                    className="office-photo"
                    src={
                      "/images/" +
                      {
                        Hyderabad: "location3.webp",
                        Newark: "location.webp",
                        Singapore: "location2.webp",
                        "Petaling Jaya": "location4.webp",
                        Guntur: "location3.webp",
                      }[o.city]
                    }
                    alt={o.country + " location"}
                    loading="lazy"
                  />
                  <span className="eyebrow">{o.country}</span>
                  <h3>{o.city}</h3>
                  <p>{o.address}</p>
                  <a
                    target="_blank"
                    rel="noreferrer"
                    className="text-link"
                    href={
                      "https://www.google.com/maps/search/?api=1&query=" +
                      encodeURIComponent(o.address)
                    }
                  >
                    View on map <ArrowUpRight size={16} />
                  </a>
                </article>
              ))}
            </div>
          </section>
        </>
      )}
      {path === "privacy" && (
        <section className="container section legal">
          <h2>Website privacy information</h2>
          <p>
            This website does not send your enquiry to a server. The contact
            form prepares a draft in your email application, where you can
            review and send it. Your form data is held in the current page only.
          </p>
          <h3>Asthara assistant</h3>
          <p>
            Asthara is a local FAQ guide. Conversation history is stored in your
            browser’s session storage and is not sent to an AI provider. Close
            the browser tab to end the session. Please avoid sharing sensitive
            information in chat.
          </p>
          <h3>Your colour preference</h3>
          <p>
            Your chosen light or night mode is saved in local storage on this
            device. It is not sent to a server and is used only to restore your
            display preference.
          </p>
          <h3>External services</h3>
          <p>
            Map links open Google Maps. Email links open your configured email
            application. Those services have their own privacy policies. This
            site does not include analytics or marketing tracking.
          </p>
          <h3>Contact</h3>
          <p>
            For questions about this website or information you send by email,
            contact <a href="mailto:hr@infocuscs.com">hr@infocuscs.com</a>.
          </p>
        </section>
      )}
      {path !== "contact" && path !== "privacy" && <CTA />}
    </main>
  );
}
function capabilityCopy(c: string) {
  if (/migration|modernization/i.test(c))
    return "Assess your existing landscape and define a practical transition that aligns technology with your business priorities.";
  if (/integration|connectivity|orchestration/i.test(c))
    return "Connect systems and workflows across your technology environment with an architecture shaped around your operations.";
  if (/optimization|operations|support|monitoring/i.test(c))
    return "Bring ongoing visibility and a structured approach to keeping your technology aligned with changing business needs.";
  return "Combine hands-on technical expertise with an understanding of your business to plan and implement the right solution.";
}
