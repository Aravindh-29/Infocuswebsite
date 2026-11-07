import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Plus } from "lucide-react";
import VendorBrand from "@/components/VendorBrand";
import VendorVisual from "@/components/VendorVisual";
import { OriginalLogoStrip } from "@/components/OriginalAssets";
import CTA from "@/components/CTA";
import Journey from "@/components/Journey";
import Hero from "@/components/Hero";
import Globe from "@/components/Globe";
import {
  DeliveryApproach,
  WhyInfocus,
  ProjectQuestions,
} from "@/components/BusinessContent";
import { Button, Icon, IndustryExplorer } from "@/components/Interface";
import { solutions } from "@/lib/content";
export const metadata: Metadata = { alternates: { canonical: "/" } };
export default function Home() {
  return (
    <main id="main" className="renewed-home">
      <Hero />
      <section className="ecosystem-strip">
        <div className="container">
          <span>
            CONNECTED EXPERTISE.
            <br />
            <strong>LEADING TECHNOLOGY.</strong>
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
          <Link
            href="/services#application-infrastructure-support"
            className="ecosystem-brand ecosystem-pure-storage"
            aria-label="Pure Storage infrastructure support"
          >
            <img
              src="/images/pure-storage.png"
              alt="Pure Storage"
              width={140}
              height={32}
            />
          </Link>
        </div>
      </section>
      <section
        className="section container capability-intro"
        id="possibilities"
      >
        <div className="section-heading" data-reveal>
          <div>
            <span className="eyebrow">
              <span className="dash" /> YOUR AMBITION IS OUR STARTING POINT
            </span>
            <h2>
              Make technology
              <br />
              <span className="muted">your business advantage.</span>
            </h2>
          </div>
          <div>
            <p>
              Growth exposes the gaps between systems, teams and information. We
              help close them — connecting cloud infrastructure, business
              applications and operational expertise around the way your
              organisation needs to work.
            </p>
            <Link className="text-link" href="/solutions">
              Explore all capabilities <ArrowUpRight size={18} />
            </Link>
          </div>
        </div>
        <div className="renewed-capabilities">
          {solutions.map((s, i) => (
            <Link
              key={s.slug}
              href={"/solutions/" + s.slug}
              className={"capability-tile capability-" + s.slug}
              data-reveal
            >
              <div className="capability-tile-top">
                <span>{s.number} /</span>
                <ArrowUpRight size={22} />
              </div>
              <div className="capability-object" aria-hidden="true">
                <i />
                <i />
                <Icon name={s.icon} size={45} />
              </div>
              <span className="card-category">
                {
                  [
                    "BUILD A STRONGER FOUNDATION",
                    "REIMAGINE THE EXPERIENCE",
                    "CONNECT THE WHOLE BUSINESS",
                    "REMOVE EVERYDAY FRICTION",
                    "SUSTAIN THE MOMENTUM",
                  ][i]
                }
              </span>
              <h3>{s.title}</h3>
              <p>{s.description}</p>
              <div className="capability-bottom">
                <span>{s.capabilities[0]}</span>
                <span>
                  Explore <ArrowUpRight size={14} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <Journey />
      <section className="integration-section brand-oracle renewed-oracle">
        <div className="container integration-grid">
          <div className="integration-art" data-reveal>
            <VendorVisual vendor="oracle" />
            <div className="oracle-visual-footer">
              <span>ONE CONNECTED ECOSYSTEM</span>
              <p>Cloud + Applications + Business processes</p>
            </div>
          </div>
          <div className="integration-copy" data-reveal>
            <span className="eyebrow">
              <span className="dash" /> ORACLE EXPERTISE. BUSINESS IN FOCUS.
            </span>
            <h2>
              Less disconnected.
              <br />
              <span className="blue-text">More accomplished.</span>
            </h2>
            <p>
              When your applications work in isolation, your people carry the
              complexity. Connect your Oracle ecosystem with the processes and
              platforms around it, and create a clearer path from information to
              action.
            </p>
            <div className="oracle-accordion">
              {[
                [
                  "Unify applications and information",
                  "Connect cloud and on-premises systems through Oracle Integration Cloud. Bring application interfaces, data flows and orchestration into a coherent integration approach.",
                  "/services/oracle-integration-cloud",
                ],
                [
                  "Make core processes work together",
                  "Align Oracle ERP with the needs of finance and operations. Connect enterprise information, reduce fragmented workflows and design for the way your organisation runs.",
                  "/services/oracle-erp",
                ],
                [
                  "Connect offers, orders and fulfilment",
                  "Bring offer design and order delivery together with Oracle RODOD. Support a more connected communications service lifecycle, from configuration through fulfilment.",
                  "/services/oracle-rodod",
                ],
              ].map(([title, desc, href], i) => (
                <details key={title} open={i === 0}>
                  <summary>
                    <span>0{i + 1}</span>
                    {title}
                    <Plus size={18} />
                  </summary>
                  <p>{desc}</p>
                  <Link href={href}>
                    Explore this service <ArrowUpRight size={14} />
                  </Link>
                </details>
              ))}
            </div>
            <Button href="/services">Discover our Oracle services</Button>
          </div>
        </div>
      </section>
      <section className="section container" id="industries">
        <div className="section-heading" data-reveal>
          <div>
            <span className="eyebrow">
              <span className="dash" /> CONTEXT MAKES THE DIFFERENCE
            </span>
            <h2>
              Your industry.
              <br />
              <span className="muted">Understood from the inside out.</span>
            </h2>
          </div>
          <p>
            A connected supply chain. A more responsive service. A simpler
            operational workflow. Every industry has different priorities; the
            right technology approach starts by understanding yours.
          </p>
        </div>
        <IndustryExplorer />
      </section>
      <WhyInfocus />
      <DeliveryApproach />
      <section className="section container" id="presence">
        <Globe />
      </section>
      <section className="container culture-banner" data-reveal>
        <img
          src="/images/careers.webp"
          alt="Collaborative team culture at Infocus"
          loading="lazy"
        />
        <div>
          <span className="eyebrow">THE PEOPLE BEHIND THE POSSIBILITIES</span>
          <h2>
            Bring your perspective.
            <br />
            Build something that matters.
          </h2>
          <p>
            Curiosity opens the conversation. Collective expertise moves it
            forward. Explore a career connecting people, ideas and technology.
          </p>
          <Button href="/careers" secondary>
            Find your focus at Infocus
          </Button>
        </div>
      </section>
      <OriginalLogoStrip />
      <ProjectQuestions />
      <CTA />
    </main>
  );
}
