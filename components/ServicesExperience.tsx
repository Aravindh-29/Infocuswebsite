"use client";

import { useLayoutEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowDown,
  ArrowUpRight,
  Blocks,
  Check,
  Cloud,
  Code2,
  Database,
  Globe2,
  Headphones,
  Layers3,
  Lightbulb,
  Monitor,
  Network,
  RefreshCw,
  Rocket,
  Server,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import { serviceCatalog, type ServiceCard } from "@/lib/service-catalog";
import VendorBrand from "@/components/VendorBrand";
import EnterpriseApplicationVisual from "@/components/EnterpriseApplicationVisual";

const icons = {
  cloud: Cloud,
  code: Code2,
  rocket: Rocket,
  globe: Globe2,
  smartphone: Smartphone,
  database: Database,
  headset: Headphones,
};
const groups = [
  {
    id: "cloud",
    number: "01",
    title: "A stronger foundation for everything ahead.",
    label: "Cloud & integration",
    text: "Choose the right platform, connect the right systems, and build resilience into the way your business works.",
  },
  {
    id: "build",
    number: "02",
    title: "Turn your next idea into something people use.",
    label: "Products & applications",
    text: "From the first useful release to a connected enterprise application, bring your customers and your teams a better digital experience.",
  },
  {
    id: "support",
    number: "03",
    title: "Keep the systems you depend on moving forward.",
    label: "Data & ongoing support",
    text: "Give your data, applications and infrastructure the attention they need to stay useful as your business evolves.",
  },
] as const;

function CloudArchitecture({ service }: { service: ServiceCard }) {
  const architecture = service.architecture;
  if (!architecture) return null;
  return (
    <figure
      className="service-architecture"
      aria-label={`${service.title}: illustrative architecture`}
    >
      <div className="service-visual-heading">
        <span className="service-visual-label">CONNECTED BY DESIGN</span>
        <div className="service-brand">
          <VendorBrand vendor={service.vendor!} withName />
        </div>
      </div>
      <div className="architecture-foundation">
        <div className="architecture-tier-heading">
          <ShieldCheck size={21} />
          <strong>Foundation & landing zone</strong>
        </div>
        <div className="architecture-foundation-items">
          {architecture.foundation.map((label) => (
            <span key={label}>
              <Check size={14} />
              {label}
            </span>
          ))}
        </div>
      </div>
      <div
        className="architecture-connector architecture-split"
        aria-hidden="true"
      >
        <i />
        <i />
        <i />
      </div>
      <div className="architecture-lanes">
        {["A", "B"].map((lane) => (
          <div className="architecture-lane" key={lane}>
            <span className="architecture-lane-label">
              <i />
              Availability group {lane}
            </span>
            <div className="architecture-workload">
              <Server size={20} />
              <span>{architecture.primary[0]}</span>
            </div>
          </div>
        ))}
      </div>
      <div
        className="architecture-connector architecture-recovery-line"
        aria-hidden="true"
      >
        <ArrowDown size={19} />
      </div>
      <div className="architecture-services">
        <span className="architecture-services-label">
          Supporting integration & data services
        </span>
        <div>
          <div className="architecture-workload">
            <Network size={20} />
            <span>{architecture.primary[1]}</span>
          </div>
          <div className="architecture-workload">
            <Database size={20} />
            <span>{architecture.primary[2]}</span>
          </div>
        </div>
      </div>
      <div
        className="architecture-connector architecture-recovery-line"
        aria-hidden="true"
      >
        <ArrowDown size={19} />
      </div>
      <div className="architecture-recovery">
        <div className="architecture-tier-heading">
          <RefreshCw size={20} />
          <strong>Separate recovery & backups</strong>
        </div>
        <div>
          {architecture.recovery.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>
      </div>
      <figcaption>
        <strong>Illustrative architecture.</strong> {architecture.caption}{" "}
        Availability design varies by service and region.
      </figcaption>
    </figure>
  );
}

function ApplicationVisual({ service }: { service: ServiceCard }) {
  const icon = service.icon;
  const Icon = icons[icon as keyof typeof icons] ?? Code2;
  return (
    <figure className={`service-product-visual service-product-${icon}`}>
      <div className="service-visual-heading">
        <span className="service-visual-label">
          DESIGNED AROUND YOUR BUSINESS
        </span>
        {icon !== "code" && (
          <span className="service-emblem">
            <Icon size={36} strokeWidth={1.5} />
          </span>
        )}
      </div>
      {icon === "code" && <EnterpriseApplicationVisual />}
      {icon === "rocket" && (
        <div className="product-launch-map">
          <div className="product-launch-orbit">
            <Rocket size={66} strokeWidth={1.25} />
            <span>
              YOUR FIRST
              <br />
              <strong>meaningful release.</strong>
            </span>
          </div>
          <div className="product-release-stages">
            {[
              [Lightbulb, "Shape the idea"],
              [Blocks, "Build the essentials"],
              [Rocket, "Put it in users’ hands"],
              [RefreshCw, "Learn & improve"],
            ].map(([StepIcon, label], i) => {
              const StageIcon = StepIcon as typeof Lightbulb;
              return (
                <div key={String(label)}>
                  <span>0{i + 1}</span>
                  <StageIcon size={22} />
                  <strong>{String(label)}</strong>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {icon === "globe" && (
        <div className="product-web-map">
          <div className="product-browser">
            <div className="product-browser-bar">
              <i />
              <i />
              <i />
              <span>your digital experience</span>
            </div>
            <div className="product-browser-content">
              <span>MADE FOR YOUR AUDIENCE</span>
              <h4>
                A clearer story.
                <br />A better first impression.
              </h4>
              <div className="product-browser-action">
                Discover your business <ArrowUpRight size={18} />
              </div>
              <div className="product-browser-tiles">
                <i />
                <i />
                <i />
              </div>
            </div>
          </div>
          <div className="product-quality-tags">
            <span>Responsive</span>
            <span>Accessible</span>
            <span>Easy to manage</span>
          </div>
        </div>
      )}
      {icon === "smartphone" && (
        <div className="product-mobile-map">
          <div className="product-phone">
            <div className="product-phone-camera" />
            <div className="product-phone-screen">
              <span>
                GOOD EXPERIENCES,
                <br />
                WHEREVER YOU ARE.
              </span>
              <div className="product-phone-icon">
                <Smartphone size={35} />
              </div>
              <h4>
                Your business.
                <br />
                In their hands.
              </h4>
              <div className="product-phone-row">
                <Check size={19} />
                Useful everyday journeys
              </div>
              <div className="product-phone-row">
                <Check size={19} />
                Connected information
              </div>
              <div className="product-phone-nav">
                <Globe2 />
                <Layers3 />
                <ShieldCheck />
              </div>
            </div>
          </div>
          <div className="product-mobile-notes">
            <span>iOS & Android</span>
            <span>Thoughtful interactions</span>
            <span>Connected backend</span>
          </div>
        </div>
      )}
      {icon === "database" && (
        <div className="product-data-map">
          <div className="product-data-sources">
            <span>Applications</span>
            <span>Business systems</span>
            <span>Reporting</span>
          </div>
          <div className="product-flow-line" aria-hidden="true" />
          <div className="product-data-core">
            <Database size={72} strokeWidth={1.2} />
            <h4>A dependable data layer.</h4>
            <p>Model · store · query · protect</p>
          </div>
          <div className="product-flow-line" aria-hidden="true" />
          <div className="product-data-outcomes">
            <span>
              <ShieldCheck />
              Access & recovery
            </span>
            <span>
              <Network />
              Connected insight
            </span>
          </div>
        </div>
      )}
      {icon === "headset" && (
        <div className="product-support-map">
          <div className="product-support-heading">
            <Headphones size={36} />
            <div>
              <span>A CONTINUOUS SERVICE CYCLE</span>
              <h4>Clarity. Ownership. Progress.</h4>
            </div>
          </div>
          {[
            {
              icon: Monitor,
              title: "Application health",
              label: "Understand the experience",
            },
            {
              icon: Server,
              title: "Infrastructure visibility",
              label: "See the operating picture",
            },
            {
              icon: Headphones,
              title: "Incident & request handling",
              label: "Coordinate the response",
            },
            {
              icon: RefreshCw,
              title: "Ongoing improvement",
              label: "Turn learning into action",
            },
          ].map(({ icon: RowIcon, title, label }, i) => (
            <div className="product-support-row" key={title}>
              <RowIcon size={24} />
              <div>
                <strong>{title}</strong>
                <span>{label}</span>
              </div>
              <small>0{i + 1}</small>
            </div>
          ))}
        </div>
      )}
      <figcaption>
        Illustrative service view · The approach is shaped around your
        requirements.
      </figcaption>
    </figure>
  );
}

export default function ServicesExperience() {
  const root = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    const page = root.current;
    if (!page) return;
    gsap.registerPlugin(ScrollTrigger);
    const panels = Array.from(
      page.querySelectorAll<HTMLElement>(".service-panel"),
    );
    const visibility = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          (entry.target as HTMLElement).dataset.visualActive = String(
            entry.isIntersecting,
          );
        });
      },
      { rootMargin: "80px", threshold: 0 },
    );
    panels.forEach((panel) => visibility.observe(panel));
    const media = gsap.matchMedia();
    media.add(
      "(prefers-reduced-motion: no-preference)",
      () => {
        const stacks = Array.from(
          page.querySelectorAll<HTMLElement>(".services-stack"),
        ).map((element) => ({
          element,
          panels: Array.from(
            element.querySelectorAll<HTMLElement>(".service-panel"),
          ),
          heights: [] as number[],
          tops: [] as number[],
        }));
        const header = document.querySelector<HTMLElement>(".header");
        let motion: ReturnType<typeof gsap.context> | undefined;
        let viewportHeight = innerHeight;
        let measurement = "";
        let frame = 0;
        let disposed = false;
        const naturalTop = (stack: (typeof stacks)[number], index: number) =>
          stack.element.getBoundingClientRect().top +
          scrollY +
          (parseFloat(getComputedStyle(stack.element).paddingTop) || 0) +
          stack.heights
            .slice(0, index)
            .reduce((sum, height) => sum + height, 0);
        const measure = () => {
          frame = 0;
          if (disposed) return;
          viewportHeight = Math.min(
            innerHeight,
            window.visualViewport?.height ?? innerHeight,
          );
          const headerTop = (header?.offsetHeight ?? 96) + 14;
          stacks.forEach((stack) => {
            stack.heights = stack.panels.map((panel) => panel.offsetHeight);
            stack.tops = stack.heights.map((height) =>
              Math.min(headerTop, viewportHeight - height - 20),
            );
          });
          const signature = [
            innerWidth,
            viewportHeight,
            headerTop,
            ...stacks.flatMap((stack) => [
              naturalTop(stack, 0),
              ...stack.heights,
            ]),
          ].join(",");
          if (signature === measurement) return;
          measurement = signature;
          stacks.forEach((stack) =>
            stack.panels.forEach((panel, index) =>
              panel.style.setProperty(
                "--service-sticky-top",
                `${stack.tops[index]}px`,
              ),
            ),
          );
          page.dataset.servicesStackActive = "true";
          if (!motion) {
            motion = gsap.context(() => {
              stacks.forEach((stack) =>
                stack.panels.slice(0, -1).forEach((panel, index) => {
                  gsap.fromTo(
                    panel.querySelector(".service-surface"),
                    { scale: 1, y: 0, filter: "brightness(1)" },
                    {
                      scale: 0.965,
                      y: -12,
                      filter: "brightness(.8)",
                      ease: "none",
                      scrollTrigger: {
                        trigger: stack.panels[index + 1],
                        start: () =>
                          naturalTop(stack, index + 1) - viewportHeight * 0.9,
                        end: () =>
                          naturalTop(stack, index + 1) - stack.tops[index + 1],
                        scrub: 0.45,
                        invalidateOnRefresh: true,
                      },
                    },
                  );
                }),
              );
            }, page);
          }
          ScrollTrigger.refresh();
        };
        const schedule = () => {
          if (!disposed && !frame) frame = requestAnimationFrame(measure);
        };
        const resize = new ResizeObserver(schedule);
        resize.observe(page);
        panels.forEach((panel) => {
          resize.observe(panel);
          resize.observe(panel.querySelector(".service-surface")!);
        });
        if (header) resize.observe(header);
        window.addEventListener("resize", schedule);
        window.visualViewport?.addEventListener("resize", schedule);
        document.fonts.addEventListener("loadingdone", schedule);
        document.fonts.ready.then(schedule);
        measure();
        return () => {
          disposed = true;
          cancelAnimationFrame(frame);
          resize.disconnect();
          window.removeEventListener("resize", schedule);
          window.visualViewport?.removeEventListener("resize", schedule);
          document.fonts.removeEventListener("loadingdone", schedule);
          motion?.revert();
          delete page.dataset.servicesStackActive;
          panels.forEach((panel) =>
            panel.style.removeProperty("--service-sticky-top"),
          );
        };
      },
      root,
    );
    return () => {
      media.revert();
      visibility.disconnect();
      panels.forEach((panel) => delete panel.dataset.visualActive);
    };
  }, []);

  return (
    <main id="main" className="services-experience" ref={root}>
      <section className="services-hero">
        <div className="container services-hero-grid">
          <div className="services-hero-copy">
            <span className="services-eyebrow">
              EXPERTISE THAT MOVES YOUR BUSINESS FORWARD
            </span>
            <h1>
              Build what your
              <br />
              business needs.
              <br />
              <span>
                Support everything
                <br />
                it runs.
              </span>
            </h1>
            <p>
              A new product. A more connected enterprise. A stronger cloud
              foundation. Bring us the challenge, and we will help you turn it
              into a practical plan, a well-built solution and a clearer way
              forward.
            </p>
            <div className="services-hero-actions">
              <Link className="button services-primary-action" href="/contact">
                Talk through your priorities <ArrowUpRight size={20} />
              </Link>
              <a href="#cloud" className="services-text-action">
                Explore our expertise <ArrowDown size={18} />
              </a>
            </div>
          </div>
          <div
            className="services-hero-journey"
            aria-label="One connected approach: understand, build, evolve"
          >
            <span className="services-visual-kicker">
              FROM AMBITION TO EVERYDAY IMPACT
            </span>
            <div className="services-hero-path">
              <div>
                <Lightbulb />
                <span>01 / UNDERSTAND</span>
                <strong>
                  Start with
                  <br />
                  the right problem.
                </strong>
              </div>
              <i aria-hidden="true" />
              <div>
                <Blocks />
                <span>02 / BUILD</span>
                <strong>
                  Make technology
                  <br />
                  work for you.
                </strong>
              </div>
              <i aria-hidden="true" />
              <div>
                <RefreshCw />
                <span>03 / EVOLVE</span>
                <strong>
                  Keep moving.
                  <br />
                  Keep improving.
                </strong>
              </div>
            </div>
            <p>
              Strategy, engineering and operations.
              <br />
              <strong>Connected from the start.</strong>
            </p>
          </div>
        </div>
        <div className="container services-wayfinding">
          <nav className="services-jump-nav" aria-label="Service areas">
            {groups.map((group) => (
              <a key={group.id} href={`#${group.id}`}>
                <span>{group.number}</span>
                {group.label}
                <ArrowDown size={17} />
              </a>
            ))}
          </nav>
          <div className="services-cloud-shortcuts">
            <span>EXPLORE YOUR CLOUD</span>
            <div>
              {serviceCatalog
                .filter((service) => service.vendor)
                .map((service) => (
                  <a
                    key={service.id}
                    href={`#${service.id}`}
                    aria-label={`Explore ${service.title}`}
                  >
                    <VendorBrand vendor={service.vendor!} />
                  </a>
                ))}
            </div>
          </div>
        </div>
      </section>

      {groups.map((group) => (
        <section
          className={`services-group services-group-${group.id}`}
          id={group.id}
          key={group.id}
          aria-labelledby={`services-heading-${group.id}`}
        >
          <div className="container services-group-heading">
            <span className="services-eyebrow">
              {group.number} / {group.label}
            </span>
            <div>
              <h2 id={`services-heading-${group.id}`}>{group.title}</h2>
              <p>{group.text}</p>
            </div>
          </div>
          <div className="container services-stack">
            {serviceCatalog
              .filter((service) => service.group === group.id)
              .map((service, index) => {
                const Icon = icons[service.icon as keyof typeof icons] ?? Code2;
                return (
                  <article
                    className={`service-panel ${service.vendor ? `service-vendor-${service.vendor}` : `service-kind-${service.icon}`}`}
                    id={service.id}
                    key={service.id}
                    style={{ zIndex: index + 1 }}
                    aria-labelledby={`service-title-${service.id}`}
                  >
                    <div className="service-surface">
                      <div className="service-copy">
                        <div className="service-card-eyebrow">
                          <span className="service-card-number">
                            {String(
                              serviceCatalog.indexOf(service) + 1,
                            ).padStart(2, "0")}
                          </span>
                          <Icon size={19} />
                          <span>{service.eyebrow}</span>
                        </div>
                        <h3 id={`service-title-${service.id}`}>
                          {service.title}
                        </h3>
                        <p className="service-summary">{service.summary}</p>
                        <div className="service-points">
                          {service.points.map((point) => (
                            <div className="service-point" key={point.title}>
                              <span>
                                <Check size={16} />
                              </span>
                              <div>
                                <h4>{point.title}</h4>
                                <p>{point.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="service-outcome">
                          <span>THE BUSINESS VALUE</span>
                          <p>{service.outcome}</p>
                        </div>
                        <Link
                          className="service-card-cta"
                          href={`/contact?service=${encodeURIComponent(service.id)}`}
                        >
                          {service.cta}
                          <ArrowUpRight size={20} />
                        </Link>
                        {service.related && (
                          <div className="service-related">
                            <span>Explore further</span>
                            {service.related.map((link) => (
                              <Link key={link.href} href={link.href}>
                                {link.label}
                                <ArrowUpRight size={15} />
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="service-visual">
                        {service.vendor ? (
                          <CloudArchitecture service={service} />
                        ) : (
                          <ApplicationVisual service={service} />
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
          </div>
        </section>
      ))}

      <section className="services-closing">
        <div className="container">
          <div>
            <span className="services-eyebrow">
              YOUR REQUIREMENT. OUR NEXT CONVERSATION.
            </span>
            <h2>
              A new build. An existing system.
              <br />
              <span>A challenge to solve.</span>
            </h2>
            <p>
              Whether you are a startup creating your first product or an
              enterprise improving existing software, bring us your technical
              and functional requirements. We will help define the right next
              step and bring delivery and ongoing support into the same
              conversation.
            </p>
          </div>
          <Link href="/contact" className="services-closing-link">
            <span>
              Let’s talk about
              <br />
              your business
            </span>
            <ArrowUpRight size={34} />
          </Link>
        </div>
      </section>
    </main>
  );
}
