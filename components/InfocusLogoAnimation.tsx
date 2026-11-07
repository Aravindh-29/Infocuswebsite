"use client";
import {
  forwardRef,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
} from "react";
import { gsap } from "gsap";
import { logoSvgMarkup } from "@/lib/logo";
export type InfocusLogoHandle = {
  play: () => void;
  pause: () => void;
  restart: () => void;
  setLoop: (enabled: boolean) => void;
  seek: (seconds: number) => void;
};
type Props = {
  mode?: "intro" | "idle";
  loop?: boolean;
  className?: string;
  label?: string;
};
/** Native transparent SVG; construction draws one continuous path from top-right to mid-right. */
const InfocusLogoAnimation = forwardRef<InfocusLogoHandle, Props>(
  function InfocusLogoAnimation(
    {
      mode = "intro",
      loop = true,
      className = "",
      label = "Infocus animated logo",
    },
    ref,
  ) {
    const svg = useRef<SVGSVGElement>(null),
      timeline = useRef<gsap.core.Timeline | null>(null),
      repeat = useRef(loop);
    const id = "if-" + useId().replace(/[^a-zA-Z0-9]/g, "");
    useImperativeHandle(
      ref,
      () => ({
        play: () => timeline.current?.play(),
        pause: () => timeline.current?.pause(),
        restart: () => timeline.current?.restart(),
        setLoop: (enabled) => {
          repeat.current = enabled;
          timeline.current?.repeat(enabled ? -1 : 0);
        },
        seek: (seconds) => {
          timeline.current?.pause().totalTime(seconds, false);
        },
      }),
      [],
    );
    useEffect(() => {
      const root = svg.current;
      if (!root) return;
      const media = matchMedia("(prefers-reduced-motion: reduce)");
      let ctx: gsap.Context | undefined;
      const initialize = () => {
        ctx?.revert();
        const paths = Array.from(
          root.querySelectorAll<SVGPathElement>("[data-draw]"),
        );
        const sphere = root.querySelector("[data-sphere]"),
          shine = root.querySelector("[data-shine]"),
          color = root.querySelector("[data-sphere-color]");
        if (media.matches) {
          timeline.current = null;
          return;
        }
        ctx = gsap.context(() => {
          const full = gsap.timeline({ repeat: repeat.current ? -1 : 0 });
          timeline.current = full;
          const drawTime = mode === "intro" ? 2.6 : 0;
          if (mode === "intro") {
            paths.forEach((p) => {
              const length = p.getTotalLength();
              gsap.set(p, {
                strokeDasharray: length,
                strokeDashoffset: length,
              });
              full.to(
                p,
                { strokeDashoffset: 0, duration: drawTime, ease: "none" },
                0,
              );
            });
            gsap.set(sphere, {
              y: -130,
              scaleX: 0.8,
              scaleY: 1.2,
              opacity: 0,
              svgOrigin: "64 110",
            });
            full
              .set(sphere, { opacity: 1 }, 1.9)
              .to(
                sphere,
                {
                  y: 0,
                  scaleX: 0.85,
                  scaleY: 1.18,
                  duration: 0.6,
                  ease: "power2.in",
                },
                1.9,
              )
              .to(sphere, { scaleX: 1.18, scaleY: 0.82, duration: 0.1 }, 2.5)
              .to(
                sphere,
                {
                  y: -30,
                  x: 5,
                  scaleX: 0.94,
                  scaleY: 1.06,
                  duration: 0.25,
                  ease: "power2.out",
                },
                2.6,
              )
              .to(
                sphere,
                {
                  y: 0,
                  x: -3,
                  scaleX: 1.08,
                  scaleY: 0.92,
                  duration: 0.25,
                  ease: "power2.in",
                },
                2.85,
              )
              .to(
                sphere,
                {
                  y: -8,
                  x: 2,
                  scaleX: 0.98,
                  scaleY: 1.02,
                  duration: 0.18,
                  ease: "power1.out",
                },
                3.1,
              )
              .to(
                sphere,
                {
                  y: 0,
                  x: 0,
                  scaleX: 1,
                  scaleY: 1,
                  duration: 0.25,
                  ease: "bounce.out",
                },
                3.28,
              );
          }
          const start = mode === "intro" ? 3.55 : 0;
          full.addLabel("idle", start);
          const colors = [
            "#f18b18",
            "#ffd12e",
            "#21d7e5",
            "#2479ed",
            "#8953ea",
            "#df43c0",
            "#f18b18",
          ];
          colors.slice(1).forEach((c, i) =>
            full.to(
              color,
              {
                attr: { "stop-color": c },
                duration: 1.25,
                ease: "sine.inOut",
              },
              start + i * 1.25,
            ),
          );
          full.to(
            sphere,
            {
              scaleX: 1.06,
              scaleY: 1.06,
              duration: 1.25,
              ease: "sine.inOut",
              repeat: 5,
              yoyo: true,
              svgOrigin: "64 110",
            },
            start,
          );
          full
            .fromTo(
              shine,
              { x: 0, opacity: 0 },
              { x: 650, opacity: 0.8, duration: 1.4, ease: "power1.inOut" },
              start + 0.5,
            )
            .set(shine, { opacity: 0 });
          // Only the idle segment repeats; the completed logo geometry stays stationary.
          full.eventCallback("onRepeat", () => {
            if (mode === "intro") full.time(start, true);
          });
        }, root);
      };
      initialize();
      media.addEventListener("change", initialize);
      return () => {
        media.removeEventListener("change", initialize);
        ctx?.revert();
        timeline.current = null;
      };
    }, [mode]);
    useEffect(() => {
      repeat.current = loop;
      timeline.current?.repeat(loop ? -1 : 0);
    }, [loop]);
    return (
      <svg
        ref={svg}
        className={"infocus-logo-animation " + className}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 400 420"
        role="img"
        aria-label={label}
        dangerouslySetInnerHTML={{ __html: logoSvgMarkup(id) }}
      />
    );
  },
);
export default InfocusLogoAnimation;
