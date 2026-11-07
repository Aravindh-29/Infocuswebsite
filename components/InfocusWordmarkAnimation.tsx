"use client";
import {
  type CSSProperties,
  forwardRef,
  useId,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
} from "react";
import { gsap } from "gsap";
export type InfocusWordmarkHandle = {
  play(): void;
  pause(): void;
  restart(): void;
  setLoop(value: boolean): void;
  seek(seconds: number): void;
};
// Clip the actual uploaded artwork, preserving its seven original letterforms.
const letters = [
  [0, 49],
  [49, 152],
  [152, 233],
  [233, 323],
  [323, 411],
  [411, 500],
  [500, 590],
];
const InfocusWordmarkAnimation = forwardRef<
  InfocusWordmarkHandle,
  {
    mode?: "intro" | "idle";
    loop?: boolean;
    className?: string;
  }
>(function InfocusWordmarkAnimation(
  { mode = "intro", loop = true, className = "" },
  ref,
) {
  const root = useRef<SVGSVGElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const idle = useRef<gsap.core.Timeline | null>(null);
  const looping = useRef(loop),
    reduced = useRef(false);
  const id = useId().replaceAll(":", "");
  useImperativeHandle(
    ref,
    () => ({
      play() {
        if (!reduced.current) {
          timeline.current?.play();
          idle.current?.play();
        }
      },
      pause() {
        timeline.current?.pause();
        idle.current?.pause();
      },
      restart() {
        if (!reduced.current) {
          timeline.current?.restart();
          idle.current?.restart();
        }
      },
      setLoop(value) {
        looping.current = value;
        idle.current?.repeat(value ? -1 : 0);
      },
      seek(seconds) {
        timeline.current?.pause().seek(seconds);
        idle.current?.pause().seek(seconds);
      },
    }),
    [],
  );
  useLayoutEffect(() => {
    const media = gsap.matchMedia();
    media.add(
      {
        motion: "(prefers-reduced-motion: no-preference)",
        reduced: "(prefers-reduced-motion: reduce)",
      },
      (context) => {
        reduced.current = Boolean(context.conditions?.reduced);
        if (reduced.current) return;
        const glyphs = root.current!.querySelectorAll("[data-letter]");
        const intro = gsap.timeline();
        timeline.current = intro;
        if (mode === "intro") {
          intro
            .fromTo(
              glyphs,
              {
                y: -155,
                x: (i) => (i % 2 ? 14 : -14),
                rotation: (i) => (i % 2 ? 16 : -16),
                opacity: 0,
                transformOrigin: "50% 85%",
              },
              {
                y: 0,
                x: 0,
                rotation: 0,
                opacity: 1,
                stagger: 0.115,
                duration: 1.35,
                ease: "bounce.out",
              },
            )
            .to(
              glyphs,
              {
                rotation: (i) => (i % 2 ? -3 : 3),
                duration: 0.12,
                stagger: 0.045,
                yoyo: true,
                repeat: 1,
              },
              2.1,
            );
        }
        idle.current = gsap
          .timeline({ repeat: looping.current ? -1 : 0, repeatDelay: 3.2 })
          .fromTo(
            root.current!.querySelector("[data-shine]"),
            { x: -200 },
            { x: 760, duration: 1.8, ease: "power1.inOut" },
            mode === "intro" ? 2.2 : 0.3,
          )
          .fromTo(
            root.current!.querySelectorAll("[data-spark]"),
            { scale: 0, opacity: 0, rotation: -35, transformOrigin: "50% 50%" },
            {
              scale: 1,
              opacity: 0.9,
              rotation: 35,
              duration: 0.45,
              stagger: 0.28,
              yoyo: true,
              repeat: 1,
            },
            mode === "intro" ? 2.6 : 0.7,
          );
      },
      root,
    );
    return () => {
      media.revert();
      timeline.current = null;
      idle.current = null;
    };
  }, [mode]);
  return (
    <svg
      ref={root}
      className={"infocus-wordmark " + className}
      viewBox="0 0 590 152"
      role="img"
      aria-label="INFOCUS"
      style={{ "--night-ink": "url(#" + id + "-night)" } as CSSProperties}
      data-mode={mode}
    >
      <defs>
        <filter id={id + "-night"} colorInterpolationFilters="sRGB">
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 .73 0 0 0 0 .66 0 0 0 0 1 0 0 0 1 0"
          />
        </filter>
        {letters.map(([start, end], i) => (
          <clipPath key={i} id={id + "-letter-" + i}>
            <rect x={start} y="0" width={end - start} height="152" />
          </clipPath>
        ))}
        <mask id={id + "-word"} style={{ maskType: "alpha" }}>
          <image href="/brand/infocus-wordmark.png" width="590" height="152" />
        </mask>
        <linearGradient id={id + "-shine"}>
          <stop stopColor="#fff3ba" stopOpacity="0" />
          <stop offset=".5" stopColor="#fff6cd" stopOpacity=".92" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
      </defs>
      {letters.map((_, i) => (
        <g key={i} data-letter={"INFOCUS"[i]}>
          <image
            href="/brand/infocus-wordmark.png"
            width="590"
            height="152"
            clipPath={"url(#" + id + "-letter-" + i + ")"}
          />
        </g>
      ))}
      <g mask={"url(#" + id + "-word)"}>
        <rect
          data-shine
          x="-60"
          y="0"
          width="110"
          height="152"
          fill={"url(#" + id + "-shine)"}
          transform="translate(-200 0)"
        />
      </g>
      <g fill="#ffe6a0" opacity=".9">
        <path
          data-spark
          opacity="0"
          d="M211 13l3 10 10 3-10 3-3 10-3-10-10-3 10-3z"
        />
        <path
          data-spark
          opacity="0"
          d="M478 115l2 8 8 2-8 2-2 8-2-8-8-2 8-2z"
        />
      </g>
    </svg>
  );
});
export default InfocusWordmarkAnimation;
