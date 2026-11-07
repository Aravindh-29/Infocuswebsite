"use client";
import Link from "next/link";
import InfocusLogoAnimation from "./InfocusLogoAnimation";
import ThemeToggle from "./ThemeToggle";
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
      <InfocusLogoAnimation mode="intro" />
      <span className="brand-wordmark">
        <img src="/brand/infocus-wordmark.png" alt="INFOCUS" />
        <small>CONSULTING SERVICES</small>
      </span>
    </Link>
  );
}
const nav = [
  ["Solutions", "/solutions"],
  ["Industries", "/industries"],
  ["Platforms", "/platforms"],
  ["Services", "/services"],
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
  }, []);
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
          <Link href="/industries">Industries</Link>
          <Link href="/platforms">Platforms</Link>
          <Link href="/services">Services</Link>
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
  text: "Hello, I’m Asthara, your Infocus guide. I can help you explore our services, technology platforms, offices and careers. What would you like to know?",
};
export function faqAnswer(q: string) {
  const t = q.toLowerCase();
  if (/career|job|hiring|apply/.test(t))
    return "Explore our Careers page for areas of expertise. To ask about current opportunities, email hr@infocuscs.com. We do not list unverified vacancies. Infocus recruiters use Infocus email addresses.";
  if (/contact|sales|email|talk|office|location/.test(t))
    return "Visit our Contact page to choose an office in India, the United States, Singapore or Malaysia and prepare your enquiry. The form opens your email application; it does not submit to a server.";
  if (/oracle/.test(t))
    return "Yes. Infocus offers Oracle Integration Cloud, Oracle ERP solutions, Oracle Integration solutions and Oracle Communications RODOD. Explore Services for capabilities and speak with the team about your requirements.";
  if (/industr/.test(t))
    return "Infocus works across banking and finance, healthcare, education, oil and gas, manufacturing, agriculture, telecommunications, retail, automotive, and media and entertainment.";
  if (/cloud|azure|aws/.test(t))
    return "Our cloud offerings include strategy, migration, multicloud, private cloud and ongoing optimization. Our published technology ecosystem includes Azure, AWS, Google Cloud and Oracle Cloud Infrastructure.";
  if (/ai|automation/.test(t))
    return "Our published capabilities include Oracle Integration Cloud process automation, visual low-code workflows, application connectivity and integration insight. Ask our team about the scope of a specific AI project.";
  if (/service|solution|offer|help/.test(t))
    return "Infocus offers cloud solutions, application modernization, enterprise applications, Oracle integration, process automation and managed services. Which area would you like to explore?";
  return "I can answer questions about Infocus services, Oracle, cloud platforms, industries, careers and office locations. For a project-specific answer, please use our Contact page. I’m a company FAQ guide, so I can’t quote pricing or confirm project availability.";
}
export function Assistant() {
  const [open, setOpen] = useState(false),
    [messages, setMessages] = useState<Message[]>([initial]),
    [input, setInput] = useState(""),
    [typing, setTyping] = useState(false);
  const end = useRef<HTMLDivElement>(null),
    timer = useRef<ReturnType<typeof setTimeout> | null>(null),
    panel = useRef<HTMLElement>(null);
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("asthara-chat");
      if (saved) setMessages(JSON.parse(saved));
    } catch {}
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);
  useEffect(() => {
    try {
      sessionStorage.setItem("asthara-chat", JSON.stringify(messages));
    } catch {}
    end.current?.scrollIntoView({ block: "nearest" });
  }, [messages, typing]);
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
      <button
        className={"assistant-launch " + (open ? "is-open" : "")}
        onClick={() => setOpen(!open)}
        aria-label={open ? "Close Asthara assistant" : "Open Asthara assistant"}
        aria-expanded={open}
      >
        {open ? (
          <X size={22} />
        ) : (
          <>
            <span className="orb">
              <Sparkles size={20} />
            </span>
            <span>
              Ask Asthara <small>AI</small>
            </span>
            <Plus size={15} />
          </>
        )}
      </button>
      {open && (
        <aside
          ref={panel}
          className="chat"
          aria-label="Asthara Infocus assistant"
          onKeyDown={(e) => {
            if (e.key === "Escape") setOpen(false);
          }}
        >
          <div className="chat-head">
            <span className="orb">
              <Sparkles />
            </span>
            <div>
              <strong>ASTHARA</strong>
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
  const [ready, setReady] = useState(false),
    [emailLink, setEmailLink] = useState("");
  return (
    <form
      className="contact-form"
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        const office = data.get("office") as string;
        const body = `Name: ${data.get("name")}\nWork email: ${data.get("email")}\nCompany: ${data.get("company")}\nOffice: ${office}\nInterest: ${data.get("interest")}\n\n${data.get("message")}`;
        setEmailLink(
          `mailto:hr@infocuscs.com?subject=${encodeURIComponent("Infocus enquiry — " + data.get("interest"))}&body=${encodeURIComponent(body)}`,
        );
        setReady(true);
      }}
    >
      <span className="eyebrow">START SOMETHING EXTRAORDINARY</span>
      <h2>Tell us what’s next.</h2>
      <div className="form-grid">
        <label>
          Your name
          <input
            required
            name="name"
            autoComplete="name"
            placeholder="Full name"
          />
        </label>
        <label>
          Work email
          <input
            required
            type="email"
            name="email"
            autoComplete="email"
            placeholder="you@company.com"
          />
        </label>
      </div>
      <label>
        Company
        <input
          required
          name="company"
          autoComplete="organization"
          placeholder="Company name"
        />
      </label>
      <div className="form-grid">
        <label>
          I’m interested in
          <select name="interest">
            {solutions.map((s) => (
              <option key={s.slug}>{s.title}</option>
            ))}
            <option>Oracle services</option>
            <option>Careers</option>
          </select>
        </label>
        <label>
          Preferred office
          <select name="office">
            {[
              "Hyderabad",
              "Newark",
              "Singapore",
              "Petaling Jaya",
              "Guntur",
            ].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
      </div>
      <label>
        Your challenge
        <textarea
          required
          name="message"
          rows={4}
          placeholder="What would you like to make possible?"
        />
      </label>
      <label className="checkbox">
        <input type="checkbox" required />I agree to the{" "}
        <Link href="/privacy">privacy policy</Link> for this enquiry.
      </label>
      <button className="button" type="submit">
        Prepare enquiry <ArrowUpRight size={17} />
      </button>
      <p className="form-note">
        This static site prepares an email draft. Review and send it to
        hr@infocuscs.com in your email app; no enquiry is sent or stored here.
      </p>
      {ready && (
        <div className="form-result" role="status">
          <Check size={20} />
          <div>
            <strong>Your enquiry is ready.</strong>
            <p>
              Review your draft and send it to the published Infocus contact
              from your email app.
            </p>
            <a href={emailLink}>
              Open email draft <ArrowUpRight size={14} />
            </a>
          </div>
        </div>
      )}
    </form>
  );
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
