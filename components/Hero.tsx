"use client";
import { ArrowDown, ArrowUpRight, Play } from "lucide-react";
import InfocusLogoAnimation from "./InfocusLogoAnimation";
import { useRef } from "react";
import dynamic from "next/dynamic";
import { Button } from "./Interface";
const Scene = dynamic(() => import("./Scene"), { ssr: false });
export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <section
      className="hero"
      ref={ref}
      onPointerMove={(e) => {
        if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        const b = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty(
          "--mx",
          `${((e.clientX - b.left) / b.width - 0.5) * 12}px`,
        );
        e.currentTarget.style.setProperty(
          "--my",
          `${((e.clientY - b.top) / b.height - 0.5) * 9}px`,
        );
      }}
    >
      <div className="hero-art">
        <img
          src="/images/cloud-hero.webp"
          alt="A luminous glass cloud connecting enterprise infrastructure in an orbital technology ecosystem"
          fetchPriority="high"
        />
        <img
          className="hero-original"
          src="/images/t1.webp"
          alt="Technology specialists monitoring enterprise systems"
          fetchPriority="high"
        />
        <Scene variant="network" />
      </div>
      <div className="hero-native-mark">
        <InfocusLogoAnimation mode="idle" />
      </div>
      <div className="hero-grain" />
      <div className="container hero-content">
        <div className="eyebrow">
          <span className="live-dot" /> TECHNOLOGY WITH PURPOSE. IMPACT WITHOUT
          LIMITS.
        </div>
        <h1>
          Transforming
          <br />
          businesses through
          <br />
          <span>intelligent</span>
          <br />
          <span>technology.</span>
        </h1>
        <p>
          Cloud innovation. Connected enterprises. New possibilities.
          <br className="desktop-break" /> We bring your next chapter into
          focus.
        </p>
        <div className="hero-actions">
          <Button href="/solutions">Explore our solutions</Button>
          <Button href="/contact" secondary>
            Talk to our experts
          </Button>
        </div>
        <div className="hero-proof">
          <span className="mini-line" /> HUMAN EXPERTISE. TECHNOLOGY THAT MOVES
          YOU.
        </div>
      </div>
      <div className="hero-label label-cloud">
        <span className="label-dot" /> CLOUD & INFRASTRUCTURE{" "}
        <ArrowUpRight size={13} />
      </div>
      <div className="hero-label label-integration">
        <span className="label-dot violet" /> CONNECTED ENTERPRISE
      </div>
      <div className="container hero-bottom">
        <a href="#possibilities">
          <span className="scroll-icon">
            <ArrowDown size={16} />
          </span>{" "}
          SCROLL TO DISCOVER
        </a>
        <span>YOUR AMBITION. OUR EXPERTISE.</span>
        <span className="hero-index">
          01 <i /> 05
        </span>
      </div>
    </section>
  );
}
