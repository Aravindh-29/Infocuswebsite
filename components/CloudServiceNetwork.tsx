"use client";

import { useLayoutEffect, useRef, type CSSProperties } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import {
  Blocks,
  Code2,
  Headphones,
  Layers3,
  LifeBuoy,
  Network,
  Server,
  Settings2,
  ShieldCheck,
  ArrowUpRight,
} from "lucide-react";
import CloudUniverse from "./CloudUniverse";
import VendorBrand from "./VendorBrand";

const services = [
  {
    id: "application-development",
    title: "Application Development",
    detail: "Build & Modernize",
    icon: Code2,
    color: "#2479cf",
    slot: "top-one",
    href: "/services#enterprise-applications",
  },
  {
    id: "application-support",
    title: "Application Support",
    detail: "L1 / L2 / L3",
    icon: Headphones,
    color: "#7255cc",
    slot: "top-two",
    href: "/contact?service=application-infrastructure-support",
  },
  {
    id: "oracle-integration",
    title: "Oracle Integration & Support",
    detail: "Oracle Cloud / EBS / Fusion",
    icon: Network,
    color: "#c35c45",
    slot: "top-three",
    href: "/services#oracle-cloud",
  },
  {
    id: "enterprise-support",
    title: "Enterprise Application Support",
    detail: "ERP / CRM / HCM",
    icon: Layers3,
    color: "#475fbc",
    slot: "left-one",
    href: "/contact?service=application-infrastructure-support",
  },
  {
    id: "custom-software",
    title: "Custom Software Development",
    detail: "Built around your business",
    icon: Blocks,
    color: "#198479",
    slot: "right-one",
    href: "/services#enterprise-applications",
  },
  {
    id: "software-maintenance",
    title: "Software Support & Maintenance",
    detail: "Keep improving. Keep moving.",
    icon: LifeBuoy,
    color: "#9654aa",
    slot: "left-two",
    href: "/contact?service=application-infrastructure-support",
  },
  {
    id: "infrastructure-build",
    title: "Infrastructure Build & Automation",
    detail: "A foundation for progress",
    icon: Settings2,
    color: "#337cb0",
    slot: "right-two",
    href: "/services#microsoft-azure",
  },
  {
    id: "infrastructure-support",
    title: "Infrastructure Support & Operations",
    detail: "Visibility. Continuity. Control.",
    icon: ShieldCheck,
    color: "#2d8270",
    slot: "left-three",
    href: "/services#application-infrastructure-support",
  },
  {
    id: "enterprise-hosting",
    title: "Enterprise Application Hosting",
    detail: "A home for critical workloads",
    icon: Server,
    color: "#ad7528",
    slot: "right-three",
    href: "/services#amazon-web-services",
  },
];

type Point = { x: number; y: number };
type EntrySide = "left" | "right" | "bottom";

function capsulePath(width: number, height: number, side: EntrySide) {
  const l = 1.5,
    t = 1.5,
    r = width - 1.5,
    b = height - 1.5;
  const radius = Math.min((height - 3) / 2, (width - 3) / 2),
    cx = width / 2,
    cy = height / 2;
  const top = `L${r - radius} ${t}A${radius} ${radius} 0 0 1 ${r} ${t + radius}`;
  const right = `L${r} ${b - radius}A${radius} ${radius} 0 0 1 ${r - radius} ${b}`;
  const bottom = `L${l + radius} ${b}A${radius} ${radius} 0 0 1 ${l} ${b - radius}`;
  const left = `L${l} ${t + radius}A${radius} ${radius} 0 0 1 ${l + radius} ${t}`;
  if (side === "right")
    return `M${r} ${cy}${right}${bottom}${left}${top}L${r} ${cy}`;
  if (side === "bottom")
    return `M${cx} ${b}${bottom}${left}${top}${right}L${cx} ${b}`;
  return `M${l} ${cy}${left}${top}${right}${bottom}L${l} ${cy}`;
}

export default function CloudServiceNetwork() {
  const root = useRef<HTMLDivElement>(null);
  const complete = useRef<() => void>(() => {});

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const links = Array.from(
      el.querySelectorAll<HTMLAnchorElement>(".cloud-service-capsule"),
    );
    const branches = Array.from(
      el.querySelectorAll<SVGPathElement>(".service-branch-path"),
    );
    const currents = Array.from(
      el.querySelectorAll<SVGPathElement>(".service-branch-current"),
    );
    const outlines = Array.from(
      el.querySelectorAll<SVGPathElement>(".service-capsule-outline"),
    );
    const junctions = Array.from(
      el.querySelectorAll<SVGCircleElement>(".service-branch-junction"),
    );
    const svg = el.querySelector<SVGSVGElement>(".service-network-lines")!;
    const cloud = el.querySelector<HTMLElement>(".cloud-universe")!;
    const float = el.querySelector<HTMLElement>(".cloud-main-float")!;
    const image = el.querySelector<HTMLImageElement>(".hero-cloud-image")!;
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    let timeline: gsap.core.Timeline | undefined;
    let context: gsap.Context | undefined;
    let frame = 0,
      disposed = false,
      visible = false,
      coreVisible = false,
      started = false,
      ticking = false,
      signature = "";
    let projection:
      | {
          left: number;
          top: number;
          fitX: number;
          fitY: number;
          branches: {
            nx: number;
            ny: number;
            path: (source: Point) => string;
          }[];
        }
      | undefined;
    let lastProjection = 0;
    let alpha:
      | {
          pixels: Uint8ClampedArray;
          width: number;
          height: number;
          cx: number;
          cy: number;
        }
      | undefined;

    const readSilhouette = () => {
      if (!image.complete || !image.naturalWidth) return;
      const canvas = document.createElement("canvas");
      canvas.width = 240;
      canvas.height = Math.round(
        (240 * image.naturalHeight) / image.naturalWidth,
      );
      const drawing = canvas.getContext("2d", { willReadFrequently: true });
      if (!drawing) return;
      drawing.drawImage(image, 0, 0, canvas.width, canvas.height);
      const pixels = drawing.getImageData(
        0,
        0,
        canvas.width,
        canvas.height,
      ).data;
      let sx = 0,
        sy = 0,
        count = 0;
      for (let y = 0; y < canvas.height; y++)
        for (let x = 0; x < canvas.width; x++) {
          if (pixels[(y * canvas.width + x) * 4 + 3] > 160) {
            sx += x;
            sy += y;
            count++;
          }
        }
      if (count)
        alpha = {
          pixels,
          width: canvas.width,
          height: canvas.height,
          cx: sx / count,
          cy: sy / count,
        };
    };

    const projectSources = (force = false) => {
      if (!projection || disposed) return;
      const now = performance.now();
      if (!force && now - lastProjection < 40) return;
      lastProjection = now;
      // One live box read tracks the existing image rotation/drag/float. Capsule
      // destinations and alpha-edge samples are cached until the layout changes.
      const rect = image.getBoundingClientRect();
      const width = rect.width * projection.fitX;
      const height = rect.height * projection.fitY;
      const left =
        rect.left - (projection.left - scrollX) + (rect.width - width) / 2;
      const top =
        rect.top - (projection.top - scrollY) + (rect.height - height) / 2;
      projection.branches.forEach((branch, index) => {
        const source = {
          x: left + branch.nx * width,
          y: top + branch.ny * height,
        };
        const path = branch.path(source);
        branches[index].setAttribute("d", path);
        currents[index].setAttribute("d", path);
        branches[index].dataset.sourceX = source.x.toFixed(2);
        branches[index].dataset.sourceY = source.y.toFixed(2);
        junctions[index].setAttribute("cx", source.x.toFixed(2));
        junctions[index].setAttribute("cy", source.y.toFixed(2));
      });
    };
    const tickSources = () => projectSources();
    const updateActivity = () => {
      const active =
        visible && !document.hidden && (started || preference.matches);
      el.dataset.active = String(active);
      if (!preference.matches && timeline && timeline.progress() < 1) {
        if (active) timeline.resume();
        else timeline.pause();
      }
      const track = active && coreVisible && !preference.matches;
      if (track !== ticking) {
        ticking = track;
        if (track) gsap.ticker.add(tickSources);
        else gsap.ticker.remove(tickSources);
      }
    };

    const draw = () => {
      frame = 0;
      if (disposed) return;
      const box = el.getBoundingClientRect();
      const cloudBox = cloud.getBoundingClientRect();
      const compact =
        getComputedStyle(el).getPropertyValue("--network-compact").trim() ===
        "1";
      const single =
        getComputedStyle(el).getPropertyValue("--network-single").trim() ===
        "1";
      const nextSignature = [
        box.width,
        box.height,
        Math.round(box.top + scrollY),
        Math.round(box.left + scrollX),
        cloudBox.width,
        float.offsetWidth,
        float.offsetHeight,
        !!alpha,
        compact,
        single,
        ...links.flatMap((link) => [link.offsetWidth, link.offsetHeight]),
      ].join(",");
      if (signature === nextSignature) return;
      signature = nextSignature;
      const previous = timeline?.progress() ?? 0;
      context?.revert();
      timeline = undefined;
      svg.setAttribute("viewBox", `0 0 ${box.width} ${box.height}`);

      // Read the PNG's alpha boundary once; the live projection below follows
      // the existing cloud rotation without touching its transform or controls.
      const iw = image.naturalWidth || 1536,
        ih = image.naturalHeight || 1024;
      const imageScale = Math.min(
        float.offsetWidth / iw,
        float.offsetHeight / ih,
      );
      const imageWidth = iw * imageScale,
        imageHeight = ih * imageScale;
      const imageLeft =
        cloudBox.left -
        box.left +
        float.offsetLeft +
        (float.offsetWidth - imageWidth) / 2;
      const imageTop =
        cloudBox.top -
        box.top +
        float.offsetTop +
        (float.offsetHeight - imageHeight) / 2;
      const edge = (angle: number): Point => {
        const radians = (angle * Math.PI) / 180;
        if (!alpha)
          return {
            x: imageLeft + imageWidth * (0.5 + Math.cos(radians) * 0.33),
            y: imageTop + imageHeight * (0.53 + Math.sin(radians) * 0.3),
          };
        let px = alpha.cx,
          py = alpha.cy;
        for (let distance = 0; distance < alpha.width; distance++) {
          const x = Math.round(alpha.cx + Math.cos(radians) * distance);
          const y = Math.round(alpha.cy + Math.sin(radians) * distance);
          if (x < 0 || y < 0 || x >= alpha.width || y >= alpha.height) break;
          if (alpha.pixels[(y * alpha.width + x) * 4 + 3] > 96) {
            px = x;
            py = y;
          }
        }
        return {
          x: imageLeft + (px / alpha.width) * imageWidth,
          y: imageTop + (py / alpha.height) * imageHeight,
        };
      };

      projection = {
        left: box.left + scrollX,
        top: box.top + scrollY,
        fitX: imageWidth / float.offsetWidth,
        fitY: imageHeight / float.offsetHeight,
        branches: [],
      };
      links.forEach((link, index) => {
        const target = link.getBoundingClientRect();
        const x = target.left - box.left,
          y = target.top - box.top;
        let side: EntrySide,
          path: (source: Point) => string,
          source: Point,
          end: Point;
        if (compact) {
          const onLeft = single || index % 2 === 0;
          side = onLeft ? "left" : "right";
          source = edge(onLeft ? 177 + (index % 3) * 3 : (index % 3) * 3);
          end = {
            x: onLeft ? x + 1.5 : x + target.width - 1.5,
            y: y + target.height / 2,
          };
          const rail = onLeft
            ? 5 + (index % 3) * 5
            : box.width - 5 - (index % 3) * 5;
          const direction = onLeft ? 1 : -1;
          path = (point) =>
            `M${point.x} ${point.y}C${point.x - direction * 35} ${point.y} ${rail} ${point.y} ${rail} ${point.y + 25}L${rail} ${end.y - 15}Q${rail} ${end.y} ${rail + direction * 15} ${end.y}L${end.x} ${end.y}`;
        } else if (index < 3) {
          side = "bottom";
          source = edge(-104 + index * 14);
          end = { x: x + target.width / 2, y: y + target.height - 1.5 };
          const railY = end.y + 25 + index * 6;
          path = (point) =>
            `M${point.x} ${point.y}C${point.x} ${railY} ${end.x} ${railY} ${end.x} ${end.y}`;
        } else {
          const onLeft = services[index].slot.startsWith("left");
          side = onLeft ? "right" : "left";
          const row = Math.floor((index - 3) / 2);
          source = edge(onLeft ? 185 - row * 8 : -5 + row * 8);
          end = {
            x: onLeft ? x + target.width - 1.5 : x + 1.5,
            y: y + target.height / 2,
          };
          const rail = box.width * (onLeft ? 0.235 : 0.765);
          path = (point) =>
            `M${point.x} ${point.y}C${rail} ${point.y} ${rail} ${end.y} ${end.x} ${end.y}`;
        }
        projection!.branches.push({
          nx: (source.x - imageLeft) / imageWidth,
          ny: (source.y - imageTop) / imageHeight,
          path,
        });
        branches[index].setAttribute("d", path(source));
        currents[index].setAttribute("d", path(source));
        branches[index].dataset.sourceX = source.x.toFixed(2);
        branches[index].dataset.sourceY = source.y.toFixed(2);
        outlines[index].setAttribute(
          "d",
          capsulePath(target.width, target.height, side),
        );
        outlines[index]
          .closest("svg")
          ?.setAttribute("viewBox", `0 0 ${target.width} ${target.height}`);
      });
      projectSources(true);

      if (preference.matches) {
        el.dataset.networkState = "complete";
        links.forEach((link) => {
          link.dataset.phase = "complete";
        });
        updateActivity();
        return;
      }
      context = gsap.context(() => {
        const shells = links.map((link) =>
          link.querySelector(".service-capsule-shell"),
        );
        gsap.set(
          el.querySelectorAll(
            ".service-capsule-fill, .service-capsule-icon, .service-capsule-copy, .service-branch-current, .service-branch-junction",
          ),
          { opacity: 0 },
        );
        gsap.set(shells, { y: 0, scale: 1 });
        branches.forEach((path) =>
          gsap.set(path, {
            strokeDasharray: 1,
            strokeDashoffset: 1,
          }),
        );
        outlines.forEach((path) =>
          gsap.set(path, {
            strokeDasharray: path.getTotalLength(),
            strokeDashoffset: path.getTotalLength(),
          }),
        );
        links.forEach((link) => {
          link.dataset.phase = "waiting";
        });
        el.dataset.networkState = "drawing";
        timeline = gsap.timeline({
          paused: true,
          onComplete: () => {
            el.dataset.networkState = "complete";
          },
        });
        links.forEach((link, index) => {
          const shell = shells[index];
          const start = 0.2 + index * 1.12;
          const phase = (value: string) => {
            link.dataset.phase = value;
          };
          timeline!
            .call(() => phase("line"), [], start)
            .to(junctions[index], { opacity: 0.9, duration: 0.12 }, start)
            .to(
              branches[index],
              {
                strokeDashoffset: 0,
                autoRound: false,
                duration: 0.48,
                ease: "power1.inOut",
              },
              start,
            )
            .call(() => phase("outline"), [], start + 0.48)
            .to(
              outlines[index],
              {
                strokeDashoffset: 0,
                autoRound: false,
                duration: 0.32,
                ease: "power1.inOut",
              },
              start + 0.48,
            )
            .call(() => phase("icon"), [], start + 0.8)
            .to(
              link.querySelector(".service-capsule-fill"),
              { opacity: 1, duration: 0.17 },
              start + 0.8,
            )
            .fromTo(
              link.querySelector(".service-capsule-icon"),
              { opacity: 0, scale: 0.65 },
              { opacity: 1, scale: 1, duration: 0.2, ease: "back.out(1.6)" },
              start + 0.8,
            )
            .call(() => phase("text"), [], start + 1)
            .fromTo(
              link.querySelector(".service-capsule-copy"),
              { opacity: 0, y: 5 },
              { opacity: 1, y: 0, duration: 0.17, ease: "power2.out" },
              start + 1,
            )
            .fromTo(
              shell,
              { scale: 0.985 },
              { scale: 1, duration: 0.33, ease: "elastic.out(1,.55)" },
              start + 1.03,
            )
            .to(currents[index], { opacity: 0.75, duration: 0.2 }, start + 1.13)
            .call(() => phase("complete"), [], start + 1.36);
        });
        timeline.progress(previous);
        if (previous >= 1) {
          el.dataset.networkState = "complete";
          links.forEach((link) => {
            link.dataset.phase = "complete";
          });
        }
      }, el);
      updateActivity();
    };
    const schedule = () => {
      if (!disposed && !frame) frame = requestAnimationFrame(draw);
    };
    const imageReady = () => {
      readSilhouette();
      schedule();
    };
    const motionChange = () => {
      signature = "";
      schedule();
    };
    const resize = new ResizeObserver(schedule);
    resize.observe(el);
    resize.observe(cloud);
    links.forEach((link) => resize.observe(link));
    const visibility = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        updateActivity();
      },
      { threshold: 0 },
    );
    visibility.observe(el);
    const coreVisibility = new IntersectionObserver(
      ([entry]) => {
        coreVisible = entry.isIntersecting;
        if (entry.intersectionRatio >= 0.35) started = true;
        updateActivity();
      },
      { threshold: [0, 0.35] },
    );
    coreVisibility.observe(cloud);
    const capsules = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          (entry.target as HTMLElement).dataset.inView = String(
            entry.isIntersecting,
          );
        }),
      { rootMargin: "20px" },
    );
    links.forEach((link) => capsules.observe(link));
    image.addEventListener("load", imageReady);
    window.addEventListener("resize", schedule);
    window.visualViewport?.addEventListener("resize", schedule);
    document.addEventListener("visibilitychange", updateActivity);
    preference.addEventListener("change", motionChange);
    document.fonts.addEventListener("loadingdone", schedule);
    document.fonts.ready.then(schedule);
    complete.current = () => {
      timeline?.progress(1);
    };
    readSilhouette();
    draw();
    updateActivity();
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      context?.revert();
      gsap.ticker.remove(tickSources);
      resize.disconnect();
      visibility.disconnect();
      coreVisibility.disconnect();
      capsules.disconnect();
      image.removeEventListener("load", imageReady);
      window.removeEventListener("resize", schedule);
      window.visualViewport?.removeEventListener("resize", schedule);
      document.removeEventListener("visibilitychange", updateActivity);
      preference.removeEventListener("change", motionChange);
      document.fonts.removeEventListener("loadingdone", schedule);
      complete.current = () => {};
    };
  }, []);

  return (
    <div
      className="cloud-service-network"
      ref={root}
      data-active="true"
      data-network-state="preparing"
      aria-label="Connected Infocus services"
    >
      <noscript>
        <style>{`.cloud-service-network .service-capsule-fill,.cloud-service-network .service-capsule-icon,.cloud-service-network .service-capsule-copy{opacity:1!important}.cloud-service-network .service-capsule-fill{border:1px solid #8ec6eb}.cloud-service-network .cloud-service-capsule{pointer-events:auto!important}`}</style>
      </noscript>
      <svg className="service-network-lines" aria-hidden="true">
        {services.map((service) => (
          <g
            key={service.id}
            style={{ "--service-color": service.color } as CSSProperties}
          >
            <path
              className="service-branch-path"
              pathLength="1"
              data-service-id={service.id}
            />
            <path className="service-branch-current" pathLength="1" />
            <circle className="service-branch-junction" r="2.6" />
          </g>
        ))}
      </svg>
      <div className="cloud-service-core">
        <CloudUniverse />
      </div>
      <div className="cloud-service-capsules">
        {services.map((service, index) => {
          const Icon = service.icon;
          return (
            <Link
              key={service.id}
              href={service.href}
              className={`cloud-service-capsule capsule-${service.slot}`}
              data-service-id={service.id}
              data-phase="waiting"
              data-in-view="true"
              aria-label={`${service.title} — ${service.detail}`}
              style={
                {
                  "--service-color": service.color,
                  "--capsule-delay": `${-index * 1.3}s`,
                } as CSSProperties
              }
              onFocus={(event) => {
                if (event.currentTarget.matches(":focus-visible"))
                  complete.current();
              }}
            >
              <div className="service-capsule-shell">
                <div className="service-capsule-fill" aria-hidden="true" />
                <svg className="service-capsule-frame" aria-hidden="true">
                  <path className="service-capsule-outline" />
                </svg>
                <span
                  className={`service-capsule-icon${service.id === "oracle-integration" ? " capsule-oracle-mark" : ""}`}
                  aria-hidden="true"
                >
                  {service.id === "oracle-integration" ? (
                    <VendorBrand vendor="oracle" />
                  ) : (
                    <Icon size={25} strokeWidth={1.7} />
                  )}
                </span>
                <span className="service-capsule-copy">
                  <strong>{service.title}</strong>
                  <span>{service.detail}</span>
                </span>
                <ArrowUpRight
                  className="service-capsule-arrow"
                  size={14}
                  aria-hidden="true"
                />
              </div>
            </Link>
          );
        })}
      </div>
      <span className="cloud-network-caption">
        ONE CONNECTED APPROACH. EVERY PART OF YOUR BUSINESS.
      </span>
    </div>
  );
}
