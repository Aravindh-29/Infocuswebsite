"use client";

import {
  memo,
  useEffect,
  useId,
  useRef,
  type CSSProperties,
  type PointerEvent,
  type KeyboardEvent,
} from "react";
import Link from "next/link";
import { RotateCcw } from "lucide-react";
import VendorBrand from "./VendorBrand";

const cloudImage = "/images/hero-cloud-light.png";
const cloudShape =
  "M54 130C29 130 11 116 11 95C11 77 22 63 40 59C40 31 61 10 87 10C112 10 132 23 141 44C152 36 165 35 178 39C196 43 207 57 208 73C222 78 231 89 231 104C231 120 218 130 199 130Z";
const platforms = [
  { slug: "oracle", name: "Oracle", className: "node-oracle" },
  { slug: "azure", name: "Microsoft Azure", className: "node-azure" },
  { slug: "aws", name: "Amazon Web Services", className: "node-aws" },
  { slug: "google-cloud", name: "Google Cloud", className: "node-google" },
];
const spokes = [
  "M145 145C233 201 297 261 378 327",
  "M865 142C789 190 726 246 655 317",
  "M127 562C208 528 288 481 379 440",
  "M868 590C794 539 719 490 650 452",
];

function PlatformCloud({
  slug,
  name,
  className,
  id,
}: {
  slug: string;
  name: string;
  className: string;
  id: string;
}) {
  const uid = id + "-" + slug;
  return (
    <Link
      href={"/platforms/" + slug}
      className={"cloud-platform-node " + className}
      aria-label={"Explore " + name}
    >
      <div className="cloud-node-body">
        <svg
          className="cloud-node-shell"
          viewBox="0 0 240 150"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id={uid + "-glass"} x1="0" y1="0" x2=".8" y2="1">
              <stop stopColor="#ffffff" stopOpacity=".98" />
              <stop offset=".45" stopColor="#f5faff" stopOpacity=".94" />
              <stop offset=".76" stopColor="#d8e7fc" stopOpacity=".95" />
              <stop offset="1" stopColor="#fcffff" />
            </linearGradient>
            <linearGradient id={uid + "-edge"} x1="0" x2="1">
              <stop stopColor="#d0dcf5" />
              <stop offset=".18" stopColor="#ffffff" />
              <stop offset=".5" stopColor="#83a7dc" />
              <stop offset=".72" stopColor="#c9e5ff" />
              <stop offset="1" stopColor="#337bd0" />
            </linearGradient>
            <linearGradient id={uid + "-sheen"}>
              <stop stopColor="white" stopOpacity="0" />
              <stop offset=".5" stopColor="white" stopOpacity=".65" />
              <stop offset="1" stopColor="white" stopOpacity="0" />
            </linearGradient>
            <clipPath id={uid + "-shape"}>
              <path d={cloudShape} />
            </clipPath>
          </defs>
          <path
            d={cloudShape}
            transform="translate(1 7)"
            fill={"url(#" + uid + "-edge)"}
            stroke="#adc9ee"
            strokeWidth="1.2"
          />
          <path
            d={cloudShape}
            fill={"url(#" + uid + "-glass)"}
            stroke="#8fb8e9"
            strokeWidth="1.4"
          />
          <path
            d="M21 91C23 78 33 69 47 66C46 36 64 17 88 17C110 17 129 31 136 54C151 43 163 42 175 46"
            fill="none"
            stroke="white"
            strokeWidth="2.8"
            strokeLinecap="round"
            opacity=".95"
          />
          <path
            d="M29 115C42 125 62 125 82 125H196C210 125 221 116 223 105"
            fill="none"
            stroke="#68dcff"
            strokeWidth="1.2"
            opacity=".5"
          />
          <g clipPath={"url(#" + uid + "-shape)"}>
            <rect
              className="cloud-node-sheen"
              x="-100"
              y="0"
              width="65"
              height="150"
              fill={"url(#" + uid + "-sheen)"}
              transform="skewX(-20)"
            />
          </g>
        </svg>
        <VendorBrand vendor={slug} />
      </div>
    </Link>
  );
}

function CloudUniverse() {
  const root = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const reduced = useRef(false);
  const yaw = useRef(0);
  const pointer = useRef<{
    id: number;
    x: number;
    y: number;
    initialYaw: number;
    dragging: boolean;
  } | null>(null);
  const id = useId().replaceAll(":", "");

  const setPose = (value: number) => {
    const next = Math.round(value * 100) / 100;
    yaw.current = next;
    root.current?.style.setProperty("--user-yaw", next + "deg");
  };

  const finishDrag = (event?: PointerEvent<HTMLDivElement>) => {
    if (event && pointer.current && event.pointerId !== pointer.current.id)
      return;
    const active = pointer.current;
    pointer.current = null;
    if (root.current) root.current.dataset.dragging = "false";
    if (active && stage.current?.hasPointerCapture(active.id))
      stage.current.releasePointerCapture(active.id);
  };

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => {
      reduced.current = motion.matches;
      el.dataset.reducedMotion = String(motion.matches);
      if (motion.matches) {
        finishDrag();
        setPose(0);
      }
    };
    let visible = true;
    const updateActivity = () => {
      el.dataset.active = String(visible && !document.hidden);
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        updateActivity();
      },
      { threshold: 0.05 },
    );
    observer.observe(el);
    motion.addEventListener("change", updateMotion);
    document.addEventListener("visibilitychange", updateActivity);
    updateMotion();
    updateActivity();
    return () => {
      observer.disconnect();
      motion.removeEventListener("change", updateMotion);
      document.removeEventListener("visibilitychange", updateActivity);
      finishDrag();
    };
  }, []);

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (
      reduced.current ||
      event.button !== 0 ||
      (event.target as HTMLElement).closest("a,button")
    )
      return;
    pointer.current = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      initialYaw: yaw.current,
      dragging: false,
    };
    if (event.pointerType === "mouse")
      event.currentTarget.setPointerCapture(event.pointerId);
  };
  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const active = pointer.current;
    if (!active || event.pointerId !== active.id || reduced.current) return;
    const dx = event.clientX - active.x;
    const dy = event.clientY - active.y;
    if (!active.dragging) {
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 7) return;
      if (event.pointerType === "touch" && Math.abs(dy) > Math.abs(dx)) {
        finishDrag(event);
        return;
      }
      active.dragging = true;
      event.currentTarget.setPointerCapture(event.pointerId);
      if (root.current) root.current.dataset.dragging = "true";
    }
    if (event.cancelable) event.preventDefault();
    const width = event.currentTarget.clientWidth || 600;
    setPose(active.initialYaw + (dx / width) * 360);
  };
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget || reduced.current) return;
    if (
      event.key === "ArrowLeft" ||
      event.key === "ArrowRight" ||
      event.key === "Home"
    ) {
      event.preventDefault();
      setPose(
        event.key === "Home"
          ? 0
          : yaw.current + (event.key === "ArrowRight" ? 15 : -15),
      );
    }
  };

  return (
    <div
      className="cloud-universe"
      ref={root}
      data-active="true"
      data-dragging="false"
      style={{ "--user-yaw": "0deg" } as CSSProperties}
    >
      <div
        className="cloud-universe-stage"
        ref={stage}
        tabIndex={0}
        role="group"
        aria-label="Interactive cloud scene"
        aria-describedby={id + "-instructions"}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={finishDrag}
        onPointerCancel={finishDrag}
        onLostPointerCapture={finishDrag}
        onKeyDown={onKeyDown}
      >
        <div className="cloud-universe-world">
          <div className="cloud-auto-turn">
            <div className="cloud-ground-halo" aria-hidden="true" />
            <svg
              className="cloud-pedestal"
              viewBox="0 0 1000 850"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id={id + "-silver"} x1="0" x2="1">
                  <stop stopColor="#91afd1" />
                  <stop offset=".07" stopColor="#edf6ff" />
                  <stop offset=".28" stopColor="#c3d3e5" />
                  <stop offset=".5" stopColor="#f4fbff" />
                  <stop offset=".76" stopColor="#b9cee7" />
                  <stop offset=".93" stopColor="#f5faff" />
                  <stop offset="1" stopColor="#91b1d5" />
                </linearGradient>
                <linearGradient
                  id={id + "-pearl"}
                  x1=".1"
                  y1=".1"
                  x2=".8"
                  y2="1"
                >
                  <stop stopColor="#f8fcff" />
                  <stop offset=".4" stopColor="#e8f3ff" />
                  <stop offset=".75" stopColor="#c3dff9" />
                  <stop offset="1" stopColor="#f5fbff" />
                </linearGradient>
                <radialGradient id={id + "-well"}>
                  <stop stopColor="#dbffff" />
                  <stop offset=".35" stopColor="#6de9ff" stopOpacity=".75" />
                  <stop offset=".72" stopColor="#92d5f7" stopOpacity=".35" />
                  <stop offset="1" stopColor="#c7e1f7" stopOpacity=".15" />
                </radialGradient>
                <linearGradient id={id + "-rim"}>
                  <stop stopColor="#d7f9ff" />
                  <stop offset=".22" stopColor="#16cfff" />
                  <stop offset=".45" stopColor="#faffff" />
                  <stop offset=".7" stopColor="#35dfff" />
                  <stop offset="1" stopColor="#e1ffff" />
                </linearGradient>
              </defs>
              <g className="cloud-plinth-base">
                <path
                  d="M40 707A460 87 0 0 1 960 707V748A460 87 0 0 1 40 748Z"
                  fill={"url(#" + id + "-silver)"}
                  stroke="#aac9e6"
                  strokeWidth="1"
                />
                <ellipse
                  cx="500"
                  cy="707"
                  rx="460"
                  ry="87"
                  fill={"url(#" + id + "-pearl)"}
                  stroke="#ffffff"
                  strokeWidth="2"
                />
                <ellipse
                  cx="500"
                  cy="707"
                  rx="447"
                  ry="80"
                  fill="none"
                  stroke={"url(#" + id + "-rim)"}
                  strokeWidth="3"
                />
                <path
                  d="M43 749C112 852 888 852 957 749"
                  fill="none"
                  stroke="#f7fdff"
                  strokeWidth="2"
                  opacity=".8"
                />
              </g>
              <g>
                <path
                  d="M124 674A376 65 0 0 1 876 674V715A376 65 0 0 1 124 715Z"
                  fill={"url(#" + id + "-silver)"}
                  stroke="#b5d0ed"
                />
                <ellipse
                  cx="500"
                  cy="674"
                  rx="376"
                  ry="65"
                  fill={"url(#" + id + "-pearl)"}
                  stroke="#ffffff"
                  strokeWidth="1.6"
                />
                <ellipse
                  cx="500"
                  cy="676"
                  rx="366"
                  ry="61"
                  fill="none"
                  stroke="#78e2fa"
                  strokeWidth="1.4"
                />
              </g>
              <g>
                <path
                  d="M209 639A291 48 0 0 1 791 639V678A291 48 0 0 1 209 678Z"
                  fill={"url(#" + id + "-silver)"}
                  stroke="#b0cbea"
                />
                <ellipse
                  cx="500"
                  cy="639"
                  rx="291"
                  ry="48"
                  fill={"url(#" + id + "-pearl)"}
                  stroke="#faffff"
                  strokeWidth="2"
                />
                <ellipse
                  cx="500"
                  cy="639"
                  rx="272"
                  ry="42"
                  fill={"url(#" + id + "-well)"}
                  stroke="#bbf6ff"
                />
              </g>
            </svg>
            <svg
              className="cloud-energy-network"
              viewBox="0 0 1000 850"
              aria-hidden="true"
            >
              <defs>
                <filter
                  id={id + "-current-glow"}
                  x="-50%"
                  y="-50%"
                  width="200%"
                  height="200%"
                >
                  <feGaussianBlur stdDeviation="2.3" />
                </filter>
              </defs>
              <g className="cloud-orbit-lines">
                <ellipse
                  cx="500"
                  cy="355"
                  rx="472"
                  ry="155"
                  transform="rotate(-15 500 355)"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                  opacity=".95"
                />
                <ellipse
                  cx="500"
                  cy="439"
                  rx="471"
                  ry="121"
                  transform="rotate(11 500 439)"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="1.4"
                  opacity=".8"
                />
                <ellipse
                  cx="500"
                  cy="406"
                  rx="450"
                  ry="205"
                  transform="rotate(-5 500 406)"
                  fill="none"
                  stroke="#78c7f5"
                  strokeWidth=".7"
                  opacity=".4"
                />
                <g fill="#ecffff" stroke="#8ae8ff" strokeWidth="1.5">
                  <circle cx="52" cy="439" r="3.5" />
                  <circle cx="306" cy="162" r="3" />
                  <circle cx="730" cy="200" r="3.5" />
                  <circle cx="959" cy="459" r="3" />
                  <circle cx="676" cy="586" r="3" />
                </g>
              </g>
              <g className="cloud-energy-spokes">
                {spokes.map((path, i) => (
                  <g
                    key={path}
                    style={
                      { "--current-delay": -i * 1.3 + "s" } as CSSProperties
                    }
                  >
                    <path
                      d={path}
                      fill="none"
                      stroke="#62dbff"
                      strokeWidth="5"
                      opacity=".4"
                      filter={"url(#" + id + "-current-glow)"}
                    />
                    <path
                      d={path}
                      fill="none"
                      stroke="#56d4f8"
                      strokeWidth="1.6"
                      opacity=".9"
                    />
                    <path
                      className="cloud-current"
                      d={path}
                      pathLength="100"
                      fill="none"
                      stroke="#f5ffff"
                      strokeWidth="2.8"
                      strokeLinecap="round"
                      strokeDasharray="10 90"
                    />
                  </g>
                ))}
              </g>
            </svg>
            <div className="cloud-main-float">
              <div className="cloud-main-spin">
                <div className="cloud-main-art">
                  <img
                    className="hero-cloud-image"
                    src={cloudImage}
                    alt="A luminous glass cloud connecting Oracle, AWS, Microsoft Azure and Google Cloud"
                    fetchPriority="high"
                    draggable={false}
                  />
                  <svg
                    className="cloud-interior-effects"
                    viewBox="0 0 1000 666.6667"
                    aria-hidden="true"
                  >
                    <defs>
                      <filter
                        id={id + "-alpha-interior"}
                        x="0"
                        y="0"
                        width="100%"
                        height="100%"
                        colorInterpolationFilters="sRGB"
                      >
                        <feComponentTransfer>
                          <feFuncA
                            type="discrete"
                            tableValues="0 0 0 0 0 0 0 1"
                          />
                        </feComponentTransfer>
                        <feMorphology operator="erode" radius="12" />
                      </filter>
                      <mask
                        id={id + "-cloud-mask"}
                        x="0"
                        y="0"
                        width="1000"
                        height="666.6667"
                        maskUnits="userSpaceOnUse"
                        style={{ maskType: "alpha" }}
                      >
                        <image
                          href={cloudImage}
                          x="0"
                          y="0"
                          width="1000"
                          height="666.6667"
                          preserveAspectRatio="xMidYMid meet"
                          filter={"url(#" + id + "-alpha-interior)"}
                        />
                      </mask>
                      <filter
                        id={id + "-inner-glow"}
                        x="-30%"
                        y="-30%"
                        width="160%"
                        height="160%"
                      >
                        <feGaussianBlur stdDeviation="7" />
                      </filter>
                      <radialGradient id={id + "-inner-flash"}>
                        <stop stopColor="#ffffff" stopOpacity=".8" />
                        <stop
                          offset=".3"
                          stopColor="#b8f9ff"
                          stopOpacity=".65"
                        />
                        <stop
                          offset=".7"
                          stopColor="#22caff"
                          stopOpacity=".22"
                        />
                        <stop offset="1" stopColor="#0d9dff" stopOpacity="0" />
                      </radialGradient>
                      <linearGradient id={id + "-inner-flow"}>
                        <stop stopColor="#138eff" stopOpacity=".1" />
                        <stop offset=".3" stopColor="#15bfff" />
                        <stop offset=".6" stopColor="#b9ffff" />
                        <stop
                          offset="1"
                          stopColor="#178aff"
                          stopOpacity=".15"
                        />
                      </linearGradient>
                    </defs>
                    <g
                      className="cloud-inner-energy"
                      mask={"url(#" + id + "-cloud-mask)"}
                    >
                      <g transform="translate(0 -166.6667)">
                        <g filter={"url(#" + id + "-inner-glow)"} opacity=".58">
                          <path
                            d="M150 630C315 720 380 435 525 495S715 618 860 391"
                            fill="none"
                            stroke="#0ccaff"
                            strokeWidth="20"
                          />
                          <path
                            d="M163 680C345 585 533 726 700 489S805 375 895 347"
                            fill="none"
                            stroke="#3288ff"
                            strokeWidth="13"
                          />
                        </g>
                        <path
                          className="cloud-inner-current current-one"
                          d="M150 630C315 720 380 435 525 495S715 618 860 391"
                          fill="none"
                          stroke={"url(#" + id + "-inner-flow)"}
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          pathLength="100"
                          strokeDasharray="18 82"
                        />
                        <path
                          className="cloud-inner-current current-two"
                          d="M163 680C345 585 533 726 700 489S805 375 895 347"
                          fill="none"
                          stroke="#b8f9ff"
                          strokeWidth="2"
                          strokeLinecap="round"
                          pathLength="100"
                          strokeDasharray="10 90"
                        />
                        <g className="cloud-inner-flash">
                          <ellipse
                            cx="540"
                            cy="545"
                            rx="370"
                            ry="280"
                            fill={"url(#" + id + "-inner-flash)"}
                          />
                          <path
                            d="M370 445L447 509L422 524L527 588L503 541L577 557L646 468"
                            fill="none"
                            stroke="#deffff"
                            strokeWidth="4"
                            strokeLinejoin="round"
                            filter={"url(#" + id + "-inner-glow)"}
                          />
                        </g>
                      </g>
                    </g>
                  </svg>
                </div>
              </div>
            </div>
            {platforms.map((platform) => (
              <PlatformCloud key={platform.slug} {...platform} id={id} />
            ))}
          </div>
        </div>
      </div>
      <div className="cloud-universe-guidance">
        <p id={id + "-instructions"} className="cloud-keyboard-hint">
          Drag left or right to rotate the cloud. Use left and right arrow keys
          to rotate, or Home to reset.
        </p>
        <button
          className="cloud-reset"
          type="button"
          aria-label="Reset cloud view"
          onClick={() => setPose(0)}
        >
          <RotateCcw size={15} />
        </button>
      </div>
    </div>
  );
}
export default memo(CloudUniverse);
