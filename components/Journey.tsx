"use client";
import { useEffect, useRef, useState } from "react";
const stages = [
  {
    label: "Build the foundation",
    title: "Start with a cloud that fits.",
    description:
      "Align your infrastructure with your ambition. Connect the right mix of public and private cloud around your business.",
  },
  {
    label: "Connect the enterprise",
    title: "Bring every part together.",
    description:
      "Connect applications, data and workflows. Turn separate systems into a shared technology foundation.",
  },
  {
    label: "Make room for what’s next",
    title: "Move forward with confidence.",
    description:
      "Simplify operations and keep improving. Give your people a connected platform to do their best work.",
  },
];
export default function Journey() {
  const root = useRef<HTMLElement>(null),
    visual = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    if (
      matchMedia("(prefers-reduced-motion: reduce)").matches ||
      innerWidth < 900
    )
      return;
    let dispose = () => {},
      cancelled = false;
    Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(
      ([{ gsap }, { ScrollTrigger }]) => {
        if (cancelled) return;
        gsap.registerPlugin(ScrollTrigger);
        const ctx = gsap.context(() => {
          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: root.current,
              start: "top 15%",
              end: "bottom 75%",
              scrub: 0.8,
              onUpdate: (self) =>
                setPhase(Math.min(2, Math.floor(self.progress * 3))),
            },
          });
          timeline
            .to(".journey-cloud", { scale: 1.22, opacity: 0, duration: 1 }, 0)
            .fromTo(
              ".journey-integration",
              { opacity: 0, scale: 0.85 },
              { opacity: 1, scale: 1, duration: 1.5 },
              0.2,
            )
            .to(".journey-orbit", { rotate: 90, scale: 1.15, duration: 2 }, 0);
        }, root);
        dispose = () => ctx.revert();
      },
    );
    return () => {
      cancelled = true;
      dispose();
    };
  }, []);
  return (
    <section className="journey-section" ref={root}>
      <div className="container">
        <div className="journey-intro" data-reveal>
          <span className="eyebrow">
            <span className="dash" /> FROM FOUNDATION TO POSSIBILITY
          </span>
          <h2>
            Transformation is a journey.
            <br />
            <span className="muted">Let’s connect the dots.</span>
          </h2>
        </div>
        <div className="journey-grid">
          <div className="journey-visual" ref={visual}>
            <div className="journey-frame">
              <img
                className="journey-cloud"
                src="/images/cloud-hero.webp"
                alt="A cloud foundation evolving into a connected enterprise"
                loading="lazy"
              />
              <img
                className="journey-integration"
                src="/images/integration.webp"
                alt="Integrated applications and infrastructure"
                loading="lazy"
              />
              <div className="journey-orbit" />
              <div className="journey-indicator">
                <span>0{phase + 1} / 03</span>
                <strong>{stages[phase].label}</strong>
                <div>
                  {stages.map((s, i) => (
                    <i key={s.label} className={phase === i ? "active" : ""} />
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="journey-steps">
            {stages.map((s, i) => (
              <article key={s.label} data-reveal>
                <span className="eyebrow">
                  0{i + 1} / {s.label.toUpperCase()}
                </span>
                <h3>{s.title}</h3>
                <p>{s.description}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
