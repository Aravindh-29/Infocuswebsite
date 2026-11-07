"use client";
import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
const stages = [
  {
    label: "Build the foundation",
    title: "A cloud strategy with your business at the centre.",
    description:
      "A successful move to the cloud starts with knowing what should move, what should change, and what your people need to keep running. We connect your commercial priorities with a practical architecture across public, private and hybrid environments.",
    points: [
      "Understand workloads, dependencies and migration priorities",
      "Choose a platform around performance, control and cost",
      "Plan the transition and the operating model together",
    ],
    image: "cloud-hero.webp",
    alt: "Three-dimensional cloud infrastructure with connected orbital platforms",
    href: "/solutions/cloud",
    link: "Explore cloud transformation",
    accent: "#70c6ff",
    result: "A foundation designed to grow with you.",
  },
  {
    label: "Connect the enterprise",
    title: "From separate systems to shared momentum.",
    description:
      "Every disconnected application adds another handoff. Connect your ERP, CRM and business applications through a considered integration architecture, so information moves with the work and teams can focus on the decisions that matter.",
    points: [
      "Connect Oracle applications with cloud and on-premises systems",
      "Design consistent data flows and service orchestration",
      "Make business processes easier to monitor and manage",
    ],
    image: "integration.webp",
    alt: "Layered enterprise architecture linking applications, data and cloud systems",
    href: "/services/oracle-integration-cloud",
    link: "Discover Oracle integration",
    accent: "#c8acff",
    result: "The right information. Where it needs to be.",
  },
  {
    label: "Evolve with confidence",
    title: "Go live. Keep getting better.",
    description:
      "Transformation does not end at launch. Operational visibility, application support and ongoing optimisation help turn a new platform into a lasting business asset. We keep the focus on how technology performs in everyday use.",
    points: [
      "Bring structure to application and infrastructure operations",
      "Identify opportunities to simplify and improve",
      "Align the next improvement with a real business priority",
    ],
    image: "t1.webp",
    alt: "Enterprise operations specialists monitoring interconnected systems",
    href: "/solutions/managed",
    link: "Explore managed services",
    accent: "#8de4c0",
    result: "Operational clarity. Room to move forward.",
  },
];
export default function Journey() {
  const root = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    const story = root.current;
    if (!story) return;
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add(
      "(prefers-reduced-motion: no-preference)",
      () => {
        const panels = gsap.utils.toArray<HTMLElement>(".chapter-panel", story);
        const surfaces = panels.map((panel) =>
          panel.querySelector<HTMLElement>(".chapter-surface")!,
        );
        const header = document.querySelector<HTMLElement>(".header");
        const stack = story.querySelector<HTMLElement>(
          ".transformation-stack",
        )!;
        let motion: ReturnType<typeof gsap.context> | undefined;
        let heights: number[] = [];
        let tops: number[] = [];
        let viewportHeight = window.innerHeight;
        let measurement = "";
        let frame = 0;
        let disposed = false;

        // Sticky rectangles report their pinned positions. Derive each normal
        // flow position from the stack instead, including panel bottom spacing.
        const naturalTop = (index: number) =>
          stack.getBoundingClientRect().top +
          window.scrollY +
          (parseFloat(getComputedStyle(stack).paddingTop) || 0) +
          heights.slice(0, index).reduce((sum, height) => sum + height, 0);

        const measure = () => {
          frame = 0;
          if (disposed) return;
          viewportHeight = Math.min(
            window.innerHeight,
            window.visualViewport?.height ?? window.innerHeight,
          );
          const headerTop = (header?.offsetHeight ?? 96) + 14;
          heights = panels.map((panel) => panel.offsetHeight);
          // Oversized panels first scroll naturally through their entire copy,
          // then pin at the bottom so the following panel can slide over them.
          tops = heights.map((height) =>
            Math.min(headerTop, viewportHeight - height - 20),
          );
          const nextMeasurement = [
            headerTop,
            window.innerWidth,
            viewportHeight,
            naturalTop(0),
            ...heights,
          ].join(",");
          if (measurement === nextMeasurement) return;
          measurement = nextMeasurement;
          panels.forEach((panel, index) => {
            panel.style.setProperty("--stack-top", `${tops[index]}px`);
          });
          story.dataset.stackActive = "true";

          if (!motion) {
            motion = gsap.context(() => {
              panels.slice(0, -1).forEach((_, i) => {
                gsap.fromTo(
                  surfaces[i],
                  {
                    scale: 1,
                    y: 0,
                    filter: "brightness(1)",
                  },
                  {
                    scale: 0.93,
                    y: -20,
                    filter: "brightness(.65)",
                    ease: "none",
                    scrollTrigger: {
                      trigger: panels[i + 1],
                      start: () => naturalTop(i + 1) - viewportHeight * 0.9,
                      end: () => naturalTop(i + 1) - tops[i + 1],
                      scrub: 0.5,
                      invalidateOnRefresh: true,
                    },
                  },
                );
              });
              panels.forEach((panel, i) => {
                gsap.fromTo(
                  panel.querySelector(".chapter-visual img"),
                  { scale: 1.12 },
                  {
                    scale: 1,
                    ease: "none",
                    scrollTrigger: {
                      trigger: panel,
                      start: () => naturalTop(i) - viewportHeight,
                      end: () => naturalTop(i) - tops[i],
                      scrub: 0.5,
                      invalidateOnRefresh: true,
                    },
                  },
                );
              });
            }, story);
          }
          ScrollTrigger.refresh();
        };
        const scheduleMeasure = () => {
          if (!disposed && !frame) frame = requestAnimationFrame(measure);
        };
        const observer = new ResizeObserver(scheduleMeasure);
        panels.forEach((panel) => observer.observe(panel));
        surfaces.forEach((surface) => observer.observe(surface));
        observer.observe(story);
        if (header) observer.observe(header);
        window.addEventListener("resize", scheduleMeasure);
        window.visualViewport?.addEventListener("resize", scheduleMeasure);
        document.fonts.addEventListener("loadingdone", scheduleMeasure);
        document.fonts.ready.then(scheduleMeasure);
        measure();

        return () => {
          disposed = true;
          cancelAnimationFrame(frame);
          observer.disconnect();
          window.removeEventListener("resize", scheduleMeasure);
          window.visualViewport?.removeEventListener("resize", scheduleMeasure);
          document.fonts.removeEventListener("loadingdone", scheduleMeasure);
          motion?.revert();
          delete story.dataset.stackActive;
          panels.forEach((panel) => panel.style.removeProperty("--stack-top"));
        };
      },
      root,
    );
    return () => media.revert();
  }, []);
  return (
    <section
      className="transformation-story"
      ref={root}
      aria-label="Your transformation journey"
    >
      <div className="container story-heading" data-reveal>
        <span className="eyebrow">
          <span className="dash" /> FROM POSSIBILITY TO PROGRESS
        </span>
        <h2>
          One ambition.
          <br />
          <span className="muted">A connected way forward.</span>
        </h2>
        <p>
          Great technology decisions build on each other. We connect the
          strategy, the systems and the ongoing support that help your business
          move as one.
        </p>
      </div>
      <div className="container transformation-stack">
        {stages.map((s, i) => (
          <article
            className="chapter-panel"
            key={s.label}
            style={
              {
                zIndex: i + 1,
                "--chapter-accent": s.accent,
              } as React.CSSProperties
            }
          >
            <div className="chapter-surface">
              <div className="chapter-copy">
                <span className="chapter-number">
                  0{i + 1}
                  <i />
                  {s.label.toUpperCase()}
                </span>
                <h3>{s.title}</h3>
                <p>{s.description}</p>
                <ul>
                  {s.points.map((p) => (
                    <li key={p}>
                      <Check size={17} />
                      {p}
                    </li>
                  ))}
                </ul>
                <Link href={s.href}>
                  {s.link}
                  <ArrowUpRight size={19} />
                </Link>
                <span className="chapter-result">{s.result}</span>
              </div>
              <div className="chapter-visual">
                <img src={"/images/" + s.image} alt={s.alt} loading="lazy" />
                <div className="chapter-coordinate">
                  <span>INFOCUS / {String(i + 1).padStart(2, "0")}</span>
                  <span>{["FOUNDATION", "CONNECTION", "EVOLUTION"][i]}</span>
                </div>
                <div className="chapter-glow" aria-hidden="true" />
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
