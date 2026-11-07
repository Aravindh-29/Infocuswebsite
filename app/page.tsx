import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, ArrowRight, Plus } from "lucide-react";
import VendorBrand from "@/components/VendorBrand";
import VendorVisual from "@/components/VendorVisual";
import { OriginalLogoStrip } from "@/components/OriginalAssets";
import CTA from "@/components/CTA";
import Journey from "@/components/Journey";
import Hero from "@/components/Hero";
import Globe from "@/components/Globe";
import { Button, Icon, IndustryExplorer } from "@/components/Interface";
import { solutions } from "@/lib/content";
export const metadata: Metadata = { alternates: { canonical: "/" } };
export default function Home() {
  return (
    <main id="main">
      <Hero />
      <section className="ecosystem-strip">
        <div className="container">
          <span>
            EXPERTISE ACROSS
            <br />
            <strong>THE TECHNOLOGY THAT MATTERS.</strong>
          </span>
          {["oracle", "microsoft", "aws", "azure", "google-cloud", "sap"].map(
            (v) => (
              <Link
                key={v}
                href={"/platforms/" + v}
                className="ecosystem-brand"
              >
                <VendorBrand
                  vendor={v}
                  withName={["microsoft", "azure", "google-cloud"].includes(v)}
                />
              </Link>
            ),
          )}
        </div>
      </section>
      <section className="section container" id="possibilities">
        <div className="section-heading" data-reveal>
          <div>
            <span className="eyebrow">
              <span className="dash" /> WHAT WE MAKE POSSIBLE
            </span>
            <h2>
              Your next advantage.
              <br />
              <span className="muted">Engineered together.</span>
            </h2>
          </div>
          <div>
            <p>
              From your cloud foundation to the experiences you create, we
              connect the right expertise with the right technology.
            </p>
            <Link className="text-link" href="/solutions">
              Discover our capabilities <ArrowUpRight size={17} />
            </Link>
          </div>
        </div>
        <div className="solution-grid">
          {solutions.slice(0, 3).map((s) => (
            <Link
              data-reveal
              className={"solution-card " + s.slug}
              key={s.slug}
              href={"/solutions/" + s.slug}
            >
              <div className="card-top">
                <span>{s.number} /</span>
                <ArrowUpRight size={20} />
              </div>
              <div
                className={"solution-sculpture " + s.slug}
                aria-hidden="true"
              >
                {s.slug === "cloud" ? (
                  <>
                    <i />
                    <i />
                    <i />
                  </>
                ) : s.slug === "applications" ? (
                  <>
                    <i />
                    <i />
                    <i />
                    <i />
                  </>
                ) : (
                  <>
                    <i />
                    <i />
                    <i />
                    <i />
                    <i />
                  </>
                )}
              </div>
              <div>
                <span className="card-category">
                  {s.slug === "cloud"
                    ? "BUILD YOUR FOUNDATION"
                    : s.slug === "applications"
                      ? "REIMAGINE YOUR APPLICATIONS"
                      : "CONNECT YOUR BUSINESS"}
                </span>
                <h3>{s.title}</h3>
                <p>{s.short}</p>
              </div>
            </Link>
          ))}
        </div>
        <div className="secondary-solutions">
          {solutions.slice(3).map((s) => (
            <Link key={s.slug} href={"/solutions/" + s.slug}>
              <Icon name={s.icon} />
              <div>
                <h3>{s.title}</h3>
                <p>{s.short}</p>
              </div>
              <ArrowUpRight size={20} />
            </Link>
          ))}
        </div>
      </section>
      <Journey />
      <section className="integration-section brand-oracle">
        <div className="container integration-grid">
          <div className="integration-art" data-reveal>
            <VendorVisual vendor="oracle" />
            <div className="art-note">
              <span className="live-dot" /> COMPLEXITY, CONNECTED.
            </div>
          </div>
          <div className="integration-copy" data-reveal>
            <span className="eyebrow">
              <span className="dash" /> ORACLE EXPERTISE. REAL BUSINESS VALUE.
            </span>
            <h2>
              Everything connected.
              <br />
              <span className="blue-text">Anything possible.</span>
            </h2>
            <p>
              Your applications should work together as seamlessly as your
              people. We bring Oracle integration, ERP and enterprise expertise
              into one connected approach.
            </p>
            <ul className="line-list">
              <li>
                <span>01</span> Unify your applications <Plus size={16} />
              </li>
              <li>
                <span>02</span> Simplify your processes <Plus size={16} />
              </li>
              <li>
                <span>03</span> Build for what comes next <Plus size={16} />
              </li>
            </ul>
            <Button href="/services">Explore our Oracle services</Button>
          </div>
        </div>
      </section>
      <section className="section container" id="industries">
        <div className="section-heading" data-reveal>
          <div>
            <span className="eyebrow">
              <span className="dash" /> INDUSTRY UNDERSTANDING. TECHNOLOGY
              DEPTH.
            </span>
            <h2>
              Your world.
              <br />
              <span className="muted">Our shared focus.</span>
            </h2>
          </div>
          <p>
            Every industry has its own challenges.
            <br />
            We start by understanding yours.
          </p>
        </div>
        <IndustryExplorer />
      </section>
      <section className="approach-section section">
        <div className="container">
          <div className="section-heading" data-reveal>
            <div>
              <span className="eyebrow">
                <span className="dash" /> THE INFOCUS APPROACH
              </span>
              <h2>
                Big thinking.
                <br />
                Purposeful execution.
              </h2>
            </div>
            <p>
              A technology partner for the whole journey.
              <br />
              From the first conversation to what comes next.
            </p>
          </div>
          <div className="approach-grid">
            {[
              [
                "Discover",
                "Your ambition is our starting point. We listen, understand your challenges and define what success looks like.",
              ],
              [
                "Design",
                "We connect business priorities with the right architecture, platforms and a practical roadmap.",
              ],
              [
                "Deliver",
                "We bring the plan to life with hands-on implementation and a focus on your business outcomes.",
              ],
              [
                "Evolve",
                "We stay focused on continuous improvement, helping your technology move with your business.",
              ],
            ].map(([t, d], i) => (
              <div key={t} data-reveal>
                <span className="step-number">
                  0{i + 1}
                  <ArrowRight size={20} />
                </span>
                <h3>{t}</h3>
                <p>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section container" id="presence">
        <Globe />
      </section>
      <section className="container culture-banner" data-reveal>
        <img
          src="/images/careers.webp"
          alt="The people and collaborative culture behind Infocus"
          loading="lazy"
        />
        <div>
          <span className="eyebrow">OUR GREATEST TECHNOLOGY IS HUMAN.</span>
          <h2>
            Great minds.
            <br />
            Greater possibilities.
          </h2>
          <p>Bring your curiosity. Build your next chapter with us.</p>
          <Button href="/careers" secondary>
            Life at Infocus
          </Button>
        </div>
      </section>
      <OriginalLogoStrip />
      <CTA />
    </main>
  );
}
