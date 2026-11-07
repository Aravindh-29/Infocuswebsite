"use client";
import ContactJourney from "./ContactJourney";
import Link from "next/link";
import InfocusWordmarkAnimation from "./InfocusWordmarkAnimation";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";
import DeepuWelcome, { DeepuAvatar } from "./DeepuWelcome";
import { useState, useEffect, useRef } from "react";
import {
  ArrowUpRight,
  ArrowRight,
  ChevronDown,
  Menu,
  X,
  Plus,
  Send,
  Sparkles,
  Check,
  Cloud,
  Layers,
  Network,
  Shield,
  MoveUpRight,
} from "lucide-react";
import { solutions, services, industries } from "@/lib/content";
export function Icon({ name, size = 24 }: { name: string; size?: number }) {
  const C =
    (
      {
        cloud: Cloud,
        layers: Layers,
        network: Network,
        sparkles: Sparkles,
        shield: Shield,
      } as Record<string, typeof Cloud>
    )[name] || Cloud;
  return <C size={size} strokeWidth={1.5} />;
}
export function Brand() {
  return (
    <Link href="/" className="brand" aria-label="Infocus home">
      <InfocusWordmarkAnimation mode="intro" />
    </Link>
  );
}
const nav = [
  ["Solutions", "/solutions"],
  ["Services", "/services"],
  ["Industries", "/industries"],
  ["Platforms", "/platforms"],
  ["Careers", "/careers"],
  ["About", "/about"],
];
export function Header() {
  const [open, setOpen] = useState(false),
    [mega, setMega] = useState(false);
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const f = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setMega(false);
      }
    };
    const outside = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setMega(false);
    };
    document.addEventListener("keydown", f);
    document.addEventListener("pointerdown", outside);
    return () => {
      document.removeEventListener("keydown", f);
      document.removeEventListener("pointerdown", outside);
    };
  }, []);
  return (
    <header ref={ref} className="header">
      <div className="nav-wrap">
        <Brand />
        <nav aria-label="Main navigation" className={open ? "nav open" : "nav"}>
          {nav.map(([name, url]) => (
            <div className="nav-item" key={name}>
              <Link
                href={url}
                onClick={() => {
                  setOpen(false);
                  setMega(false);
                }}
              >
                {name}
              </Link>
              {name === "Solutions" && (
                <button
                  aria-label="Show solutions menu"
                  aria-expanded={mega}
                  onClick={() => setMega(!mega)}
                >
                  <ChevronDown size={12} />
                </button>
              )}
            </div>
          ))}
          <Link
            className="mobile-contact"
            href="/contact"
            onClick={() => setOpen(false)}
          >
            Contact us <ArrowUpRight size={16} />
          </Link>
        </nav>
        <Link className="contact-nav" href="/contact">
          Let’s talk <ArrowUpRight size={16} />
        </Link>
        <ThemeToggle />
        <button
          className="menu-toggle"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {mega && (
        <div className="mega">
          <div>
            <span className="eyebrow">BUILT AROUND YOUR AMBITION</span>
            <h3>
              The right technology.
              <br />A world of possibilities.
            </h3>
            <Link href="/solutions" onClick={() => setMega(false)}>
              Explore all solutions <ArrowRight size={16} />
            </Link>
          </div>
          <div className="mega-links">
            {solutions.map((s) => (
              <Link
                onClick={() => setMega(false)}
                key={s.slug}
                href={"/solutions/" + s.slug}
              >
                <Icon name={s.icon} />
                <span>
                  {s.title}
                  <small>{s.short}</small>
                </span>
                <ArrowUpRight size={16} />
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
export function Button({
  href,
  children,
  secondary = false,
}: {
  href: string;
  children: React.ReactNode;
  secondary?: boolean;
}) {
  return (
    <Link
      className={"button " + (secondary ? "button-secondary" : "")}
      href={href}
    >
      {children}
      <ArrowUpRight size={17} />
    </Link>
  );
}
export function MotionProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let cleanup = () => {};
    let cancelled = false;
    Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(
      ([{ gsap }, { ScrollTrigger }]) => {
        if (cancelled) return;
        gsap.registerPlugin(ScrollTrigger);
        const ctx = gsap.context(() => {
          gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) =>
            gsap.fromTo(
              el,
              { y: 32, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.85,
                ease: "power2.out",
                scrollTrigger: { trigger: el, start: "top 94%", once: true },
              },
            ),
          );
          if (document.querySelector(".hero"))
            gsap.to(".hero-art", {
              scale: 1.1,
              y: 60,
              ease: "none",
              scrollTrigger: {
                trigger: ".hero",
                start: "top top",
                end: "bottom top",
                scrub: 1,
              },
            });
        });
        cleanup = () => ctx.revert();
      },
    );
    return () => {
      cancelled = true;
      cleanup();
    };
  }, [pathname]);
  return <>{children}</>;
}
export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-top">
        <div>
          <Brand />
          <p>
            Intelligent technology.
            <br />
            Extraordinary possibilities.
          </p>
          <span className="footer-location">
            INDIA · USA · SINGAPORE · MALAYSIA
          </span>
        </div>
        <div>
          <h4>Explore</h4>
          <Link href="/solutions">Solutions</Link>
          <Link href="/services">Services</Link>
          <Link href="/industries">Industries</Link>
          <Link href="/platforms">Platforms</Link>
        </div>
        <div>
          <h4>Infocus</h4>
          <Link href="/about">Our story</Link>
          <Link href="/careers">Careers</Link>
          <Link href="/contact">Contact us</Link>
          <Link href="/about#presence">Global presence</Link>
        </div>
        <div>
          <h4>Let’s build what’s next.</h4>
          <p>Bring us your next challenge.</p>
          <Link className="footer-cta" href="/contact">
            Start a conversation <ArrowUpRight size={20} />
          </Link>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>
          © {new Date().getFullYear()} Infocus Consulting Services. All rights
          reserved.
        </span>
        <Link href="/privacy">Privacy policy</Link>
        <a href="#main">Back to top ↑</a>
      </div>
    </footer>
  );
}
type Message = { role: "assistant" | "user"; text: string };
const initial: Message = {
  role: "assistant",
  text: "Tell us what you want to build, connect or support. Explore our cloud, application development and support services, or ask about Infocus offices and careers.",
};
export function faqAnswer(q: string) {
  const t = q.toLowerCase();
  if (/career|job|hiring|apply/.test(t))
    return "Explore our Careers page for areas of expertise. To ask about current opportunities, email hr@infocuscs.com. We do not list unverified vacancies. Infocus recruiters use Infocus email addresses.";
  if (/contact|sales|email|talk|office|location/.test(t))
    return "Visit our Contact page to choose an office in India, the United States, Singapore or Malaysia. Share your project and contact details, review your answers, then choose Send email to open a completed draft in Gmail. Review the message and click Send in Gmail to email our team. You can also use your preferred email app.";
  if (/oracle/.test(t))
    return "Yes. Infocus builds and supports Oracle Cloud Infrastructure, landing zones, resilient workloads and recovery plans, alongside Oracle Integration Cloud, ERP, integration solutions and Communications RODOD. Explore Services or contact us to discuss your requirements.";
  if (/industr/.test(t))
    return "Infocus works across banking and finance, healthcare, education, oil and gas, manufacturing, agriculture, telecommunications, retail, automotive, and media and entertainment.";
  if (/cloud|azure|aws|gcp|google/.test(t))
    return "Infocus builds and supports Oracle Cloud, Microsoft Azure, AWS and Google Cloud environments. Services include infrastructure from scratch, landing zones, migration, high availability, reliability, disaster recovery planning, application integrations and ongoing operations. Visit Services to explore each platform.";
  if (/database|\bdb\b|data platform/.test(t))
    return "We design, migrate and manage databases and data platforms, including performance tuning, access controls, backup and restore planning, and ongoing support. Tell us about your data, applications and availability requirements through Contact.";
  if (/application|software|full.?stack|startup|mobile|website|develop/.test(t))
    return "We build full-stack and enterprise applications, startup MVPs, websites and mobile apps. Our work includes discovery, interface design, APIs, integrations, databases, testing, deployment and ongoing application support. Bring your idea or existing system to our team through Contact.";
  if (/support|infra|technical|training/.test(t))
    return "Infocus supports applications, infrastructure and the people using them. Discuss incident resolution, maintenance, monitoring, technical troubleshooting, functional support and user guidance with us. We will define the scope and support arrangements around your requirements.";
  if (/ai|automation/.test(t))
    return "Our published capabilities include Oracle Integration Cloud process automation, visual low-code workflows, application connectivity and integration insight. Ask our team about the scope of a specific AI project.";
  if (/service|solution|offer|help/.test(t))
    return "Explore our Services page for Oracle Cloud, Azure, AWS and Google Cloud, full-stack and enterprise applications, startup products, websites, mobile apps, databases, and application and infrastructure support. We also help teams with functional questions and everyday software use. What would you like to build or improve?";
  return "I can guide you through our cloud platforms, application development, websites, mobile apps, databases and support services, plus industries, careers and office locations. For your specific requirement, visit Contact. I’m a company FAQ guide, so I can’t quote pricing or confirm project availability.";
}
export function Assistant() {
  const [open, setOpen] = useState(false),
    [messages, setMessages] = useState<Message[]>([initial]),
    [input, setInput] = useState(""),
    [typing, setTyping] = useState(false),
    [historyLoaded, setHistoryLoaded] = useState(false);
  const end = useRef<HTMLDivElement>(null),
    timer = useRef<ReturnType<typeof setTimeout> | null>(null),
    panel = useRef<HTMLElement>(null);
  useEffect(() => {
    try {
      const saved =
        sessionStorage.getItem("deepu-chat") ||
        sessionStorage.getItem("asthara-chat");
      if (saved) {
        const history: unknown = JSON.parse(saved);
        if (
          Array.isArray(history) &&
          history.length &&
          history.every(
            (message) =>
              message &&
              (message.role === "assistant" || message.role === "user") &&
              typeof message.text === "string",
          )
        ) {
          const migrated: Message[] = history.map((message: Message) => ({
            ...message,
            text:
              message.role === "assistant"
                ? /^Hi, this is Deepu\./.test(message.text)
                  ? initial.text
                  : message.text.replace(/Asthara/g, "Deepu")
                : message.text,
          }));
          setMessages(migrated);
          sessionStorage.setItem("deepu-chat", JSON.stringify(migrated));
          sessionStorage.removeItem("asthara-chat");
        }
      }
    } catch {}
    setHistoryLoaded(true);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);
  useEffect(() => {
    if (!historyLoaded) return;
    try {
      sessionStorage.setItem("deepu-chat", JSON.stringify(messages));
    } catch {}
    end.current?.scrollIntoView({ block: "nearest" });
  }, [messages, typing, historyLoaded]);
  useEffect(() => {
    if (open) panel.current?.querySelector("input")?.focus();
  }, [open]);
  function ask(q: string) {
    if (!q.trim() || typing) return;
    setMessages((m) => [...m, { role: "user", text: q.trim() }]);
    setInput("");
    setTyping(true);
    timer.current = setTimeout(() => {
      setMessages((m) => [...m, { role: "assistant", text: faqAnswer(q) }]);
      setTyping(false);
    }, 650);
  }
  return (
    <>
      <DeepuWelcome chatOpen={open} onStartChat={() => setOpen(true)} />
      <button
        className={"assistant-launch deepu-launch " + (open ? "is-open" : "")}
        onClick={() => setOpen(!open)}
        aria-label={open ? "Close Deepu assistant" : "Open Deepu assistant"}
        aria-expanded={open}
        data-deepu-control
      >
        {open ? (
          <X size={22} />
        ) : (
          <>
            <DeepuAvatar />
            <span>
              Ask Deepu <small>GUIDE</small>
            </span>
            <Plus size={15} />
          </>
        )}
      </button>
      {open && (
        <aside
          ref={panel}
          className="chat deepu-chat"
          aria-label="Deepu Infocus assistant"
          onKeyDown={(e) => {
            if (e.key === "Escape") setOpen(false);
          }}
        >
          <div className="chat-head">
            <DeepuAvatar />
            <div>
              <strong>DEEPU</strong>
              <small>
                <i /> Your Infocus assistant
              </small>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close assistant">
              <X size={20} />
            </button>
          </div>
          <div className="chat-messages" role="log" aria-live="polite">
            {messages.map((m, i) => (
              <p key={i} className={"message " + m.role}>
                {m.text}
              </p>
            ))}
            {typing && (
              <p className="message assistant typing">
                Thinking<span>···</span>
              </p>
            )}
            <div ref={end} />
          </div>
          {messages.length < 3 && (
            <div className="suggestions">
              {[
                "What services do you offer?",
                "Tell me about cloud solutions",
                "Do you provide Oracle services?",
                "Which industries do you serve?",
                "How do I contact your team?",
                "Explore career opportunities",
              ].map((q) => (
                <button key={q} onClick={() => ask(q)}>
                  {q}
                  <ArrowUpRight size={12} />
                </button>
              ))}
            </div>
          )}
          <form
            className="chat-form"
            onSubmit={(e) => {
              e.preventDefault();
              ask(input);
            }}
          >
            <input
              aria-label="Your question"
              placeholder="Ask about Infocus…"
              value={input}
              maxLength={500}
              onChange={(e) => setInput(e.target.value)}
            />
            <button
              type="submit"
              disabled={typing || !input.trim()}
              aria-label="Send question"
            >
              <Send size={17} />
            </button>
          </form>
          <div className="chat-note">
            Company FAQ guide · No live AI connection
          </div>
        </aside>
      )}
    </>
  );
}
export function IndustryExplorer() {
  const [selected, setSelected] = useState(0);
  const industry = industries[selected];
  return (
    <div className="industry-explorer">
      <div className="industry-tabs" role="tablist" aria-label="Industries">
        {industries.map((item, i) => (
          <button
            role="tab"
            id={"industry-tab-" + i}
            aria-controls="industry-panel"
            aria-selected={selected === i}
            tabIndex={selected === i ? 0 : -1}
            key={item.name}
            onClick={() => setSelected(i)}
            onKeyDown={(e) => {
              if (
                [
                  "ArrowDown",
                  "ArrowUp",
                  "ArrowRight",
                  "ArrowLeft",
                  "Home",
                  "End",
                ].includes(e.key)
              ) {
                e.preventDefault();
                const next =
                  e.key === "Home"
                    ? 0
                    : e.key === "End"
                      ? industries.length - 1
                      : (selected +
                          (["ArrowUp", "ArrowLeft"].includes(e.key) ? -1 : 1) +
                          industries.length) %
                        industries.length;
                setSelected(next);
                document.getElementById("industry-tab-" + next)?.focus();
              }
            }}
          >
            <span>{String(i + 1).padStart(2, "0")}</span>
            <img
              src={
                "/images/" +
                [
                  "bank.webp",
                  "heart.webp",
                  "mortarboard.webp",
                  "petroleum (1).webp",
                  "manufacture.webp",
                  "wheat-grain (1).webp",
                  "sg.webp",
                  "q2.webp",
                  "q3.webp",
                  "q4.webp",
                ][i]
              }
              alt=""
            />
            {item.name}
            <ArrowUpRight size={16} />
          </button>
        ))}
      </div>
      <div
        id="industry-panel"
        role="tabpanel"
        aria-labelledby={"industry-tab-" + selected}
        className="industry-panel"
        key={selected}
      >
        <div
          className="industry-illustration"
          role="img"
          aria-label={industry.name + " technology ecosystem"}
          style={{
            backgroundPosition: `${(selected % 5) * 25}% ${selected < 5 ? 0 : 100}%`,
          }}
        />
        <div className="industry-overlay">
          <span className="eyebrow">{industry.tag}</span>
          <h3>{industry.name}</h3>
          <p>{industry.description}</p>
          <div className="tags">
            {industry.focus.map((f) => (
              <span key={f}>{f}</span>
            ))}
          </div>
          <Link href="/contact">
            Explore possibilities <ArrowUpRight size={17} />
          </Link>
        </div>
      </div>
    </div>
  );
}
export function ContactForm() {
  return <ContactJourney />;
}
export function CareersList() {
  const [query, setQuery] = useState("");
  const areas = [
    "Oracle Integration Cloud",
    "Visual Builder Cloud Service",
    "Oracle Cloud Infrastructure",
    "Enterprise Resource Planning",
    "Cloud Computing",
    "Service-Oriented Architecture",
    "Oracle Database Administration",
    "Project Management",
  ];
  const list = areas.filter((s) =>
    s.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <div className="careers-list">
      <input
        aria-label="Search career areas"
        placeholder="Search your area of expertise…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <p className="muted">
        Areas of expertise · Contact HR for current openings
      </p>
      {list.map((a, i) => (
        <a
          key={a}
          href={
            "mailto:hr@infocuscs.com?subject=" +
            encodeURIComponent("Career enquiry — " + a)
          }
        >
          <span className="muted">{String(i + 1).padStart(2, "0")}</span>
          <h3>{a}</h3>
          <span>
            Enquire with HR <ArrowUpRight size={18} />
          </span>
        </a>
      ))}
      {!list.length && (
        <p>
          No matching area. Email{" "}
          <a href="mailto:hr@infocuscs.com">hr@infocuscs.com</a> to discuss your
          experience.
        </p>
      )}
    </div>
  );
}
