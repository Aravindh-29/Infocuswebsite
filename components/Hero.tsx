"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Button } from "./Interface";
import CloudServiceNetwork from "./CloudServiceNetwork";

const lines = ["Behind every", "bold dream,", "a world of possibility."];
const headline = lines.join(" ");
const offsets = lines.map(
  (_, index) => lines.slice(0, index).join(" ").length + (index ? 1 : 0),
);

export default function Hero() {
  const hero = useRef<HTMLElement>(null);
  const [letters, setLetters] = useState(headline.length);
  const [typing, setTyping] = useState(false);
  useEffect(() => {
    const header = document.querySelector<HTMLElement>(".header");
    if (!header) return;
    const measureHeader = () => {
      hero.current?.style.setProperty(
        "--hero-header-height",
        `${header.offsetHeight}px`,
      );
    };
    const observer = new ResizeObserver(measureHeader);
    observer.observe(header);
    measureHeader();
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    function animate() {
      cancelAnimationFrame(frame);
      if (preference.matches) {
        setLetters(headline.length);
        setTyping(false);
        return;
      }
      setLetters(0);
      setTyping(true);
      const start = performance.now() + 400;
      const tick = (now: number) => {
        const count = Math.max(
          0,
          Math.min(headline.length, Math.floor((now - start) / 75)),
        );
        setLetters(count);
        if (count === headline.length) {
          setTyping(false);
          return;
        }
        frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    }
    animate();
    preference.addEventListener("change", animate);
    return () => {
      cancelAnimationFrame(frame);
      preference.removeEventListener("change", animate);
    };
  }, []);
  const activeLine =
    letters >= headline.length
      ? 2
      : Math.max(
          0,
          offsets.findLastIndex((offset) => letters >= offset),
        );
  return (
    <section className="immersive-hero" ref={hero}>
      <div className="immersive-atmosphere" aria-hidden="true">
        <svg viewBox="0 0 1600 900" preserveAspectRatio="none">
          <defs>
            <linearGradient id="hero-atmosphere-ink">
              <stop stopColor="#fff" stopOpacity="0" />
              <stop offset=".45" stopColor="#9defff" stopOpacity=".6" />
              <stop offset=".65" stopColor="#fff" stopOpacity=".85" />
              <stop offset="1" stopColor="#91d5ff" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d="M-200 260C180 70 240 245 460 120S850 90 1120-80" />
          <path d="M-200 790C250 590 500 890 950 580S1500 620 1800 310" />
          <path d="M-120 900C320 640 620 940 1080 710S1500 590 1800 730" />
        </svg>
      </div>
      <div className="immersive-inner">
        <div className="immersive-copy">
          <h1
            aria-label={headline}
            data-typing-state={typing ? "typing" : "complete"}
          >
            {lines.map((line, index) => (
              <span
                aria-hidden="true"
                className={
                  "quote-line " + (index === 2 ? "quote-gradient" : "")
                }
                key={line}
              >
                <span className="quote-layout">{line}</span>
                <span className="quote-typed">
                  {line.slice(0, Math.max(0, letters - offsets[index]))}
                  {activeLine === index && (
                    <i
                      className={typing ? "type-caret typing" : "type-caret"}
                    />
                  )}
                </span>
              </span>
            ))}
          </h1>
          <p>
            Bring your ambition. We’ll connect the technology, people and
            possibilities to move it forward.
          </p>
          <div className="immersive-actions">
            <Button href="/contact">Build your next chapter</Button>
            <Link className="immersive-explore" href="/solutions">
              Explore our expertise <ArrowUpRight size={20} />
            </Link>
          </div>
        </div>
        <div className="immersive-visual">
          <CloudServiceNetwork />
        </div>
      </div>
      <div className="immersive-signoff">
        <span>YOUR VISION. OUR SHARED PURPOSE.</span>
        <a href="#possibilities">
          Explore the possibilities <span aria-hidden="true">↓</span>
        </a>
      </div>
    </section>
  );
}
