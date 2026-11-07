"use client";

import { useId } from "react";
import { Database, MonitorSmartphone, Workflow } from "lucide-react";

export default function EnterpriseApplicationVisual() {
  const id = useId().replaceAll(":", "");
  const paint = (name: string) => `url(#${id}-${name})`;
  return (
    <div className="enterprise-application-visual">
      <svg
        className="enterprise-application-art"
        viewBox="0 0 560 530"
        role="img"
        aria-labelledby={`${id}-title ${id}-description`}
      >
        <title id={`${id}-title`}>
          A connected enterprise application, from screen to system
        </title>
        <desc id={`${id}-description`}>
          A desktop business workspace and mobile app connect through APIs and
          workflows to a database and ERP, CRM and HCM systems. The interfaces
          are illustrative, not a live customer dashboard.
        </desc>
        <defs>
          <linearGradient id={`${id}-frame`} x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#f6fcff" />
            <stop offset=".45" stopColor="#9ebfef" />
            <stop offset=".72" stopColor="#eff8ff" />
            <stop offset="1" stopColor="#6c9ad9" />
          </linearGradient>
          <linearGradient id={`${id}-blue`} x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#5fbdeb" />
            <stop offset=".45" stopColor="#3879d4" />
            <stop offset="1" stopColor="#5663c8" />
          </linearGradient>
          <linearGradient id={`${id}-pale`} x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="var(--enterprise-screen)" />
            <stop offset="1" stopColor="var(--enterprise-panel)" />
          </linearGradient>
          <linearGradient id={`${id}-sheen`} x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#fff" stopOpacity=".65" />
            <stop offset=".55" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <linearGradient id={`${id}-database`} x1="0" x2="1">
            <stop stopColor="#77a3db" />
            <stop offset=".35" stopColor="#d7edff" />
            <stop offset=".65" stopColor="#b3d6f8" />
            <stop offset="1" stopColor="#608fc7" />
          </linearGradient>
          <radialGradient id={`${id}-halo`}>
            <stop stopColor="#77c5ff" stopOpacity=".27" />
            <stop offset="1" stopColor="#77c5ff" stopOpacity="0" />
          </radialGradient>
          <filter
            id={`${id}-shadow`}
            x="-25%"
            y="-25%"
            width="160%"
            height="165%"
          >
            <feDropShadow
              dx="0"
              dy="13"
              stdDeviation="11"
              floodColor="#244e82"
              floodOpacity=".17"
            />
          </filter>
        </defs>

        <ellipse cx="285" cy="280" rx="265" ry="244" fill={paint("halo")} />
        <ellipse cx="286" cy="486" rx="237" ry="29" fill={paint("halo")} />
        <g
          className="enterprise-art-connections"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path
            d="M252 287V319Q252 332 273 341M450 311V329Q450 371 378 371M182 373H145Q120 373 120 399V431M280 404V422Q280 446 324 446"
            className="enterprise-link-base"
          />
          <path
            d="M252 287V319Q252 332 273 341M450 311V329Q450 371 378 371M182 373H145Q120 373 120 399V431M280 404V422Q280 446 324 446"
            className="enterprise-link-current"
          />
        </g>

        <g transform="rotate(-4 247 174)" filter={paint("shadow")}>
          <rect
            x="45"
            y="48"
            width="401"
            height="252"
            rx="20"
            fill={paint("frame")}
            stroke="#8bb2df"
          />
          <rect
            x="51"
            y="53"
            width="389"
            height="238"
            rx="15"
            fill="var(--enterprise-screen)"
            stroke="var(--enterprise-edge)"
          />
          <path
            d="M66 54H425Q439 54 439 68V89H52V68Q52 54 66 54"
            fill="var(--enterprise-panel)"
          />
          <circle cx="70" cy="72" r="4" fill="#ffad9e" />
          <circle cx="84" cy="72" r="4" fill="#f1c770" />
          <circle cx="98" cy="72" r="4" fill="#86c8b4" />
          <rect
            x="162"
            y="64"
            width="161"
            height="17"
            rx="8.5"
            fill="var(--enterprise-screen)"
          />
          <path d="M180 69V75M177 72H183" stroke="#6395c6" strokeWidth="1.5" />
          <text x="193" y="76" className="enterprise-svg-micro">
            BUSINESS WORKSPACE
          </text>
          <path d="M52 90H135V290H67Q52 290 52 275Z" fill={paint("blue")} />
          <rect
            x="67"
            y="107"
            width="50"
            height="27"
            rx="7"
            fill="#fff"
            fillOpacity=".21"
          />
          <path
            d="M78 118H84V124H78ZM88 118H94V124H88ZM98 118H104V124H98Z"
            fill="#fff"
          />
          {[154, 183, 212, 241].map((y, i) => (
            <g key={y} opacity={i === 0 ? 1 : 0.65}>
              <rect x="68" y={y} width="9" height="9" rx="2" fill="#eef8ff" />
              <path
                d={`M86 ${y + 2}H116M86 ${y + 7}H106`}
                stroke="#e1f3ff"
                strokeWidth="2.6"
                strokeLinecap="round"
              />
            </g>
          ))}
          <text x="154" y="118" className="enterprise-svg-heading">
            A clearer working day.
          </text>
          <path
            d="M154 131H298"
            stroke="var(--enterprise-edge)"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <g>
            <rect
              x="153"
              y="147"
              width="83"
              height="52"
              rx="9"
              fill="var(--enterprise-panel)"
              stroke="var(--enterprise-edge)"
            />
            <rect
              x="244"
              y="147"
              width="83"
              height="52"
              rx="9"
              fill="var(--enterprise-panel)"
              stroke="var(--enterprise-edge)"
            />
            <rect
              x="335"
              y="147"
              width="83"
              height="52"
              rx="9"
              fill="var(--enterprise-panel)"
              stroke="var(--enterprise-edge)"
            />
            <rect
              x="164"
              y="157"
              width="17"
              height="13"
              rx="3"
              fill="#7ea7ee"
            />
            <path
              d="M168 164H177M172 160V168"
              stroke="#fff"
              strokeWidth="1.4"
            />
            <path
              d="M258 164L263 169L273 158"
              fill="none"
              stroke="#5ba994"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <path
              d="M348 169V163M355 169V157M362 169V159"
              stroke="#9a83d0"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            <text x="164" y="187" className="enterprise-svg-small">
              Projects
            </text>
            <text x="255" y="187" className="enterprise-svg-small">
              Approvals
            </text>
            <text x="347" y="187" className="enterprise-svg-small">
              Insights
            </text>
          </g>
          <rect
            x="153"
            y="211"
            width="163"
            height="63"
            rx="9"
            fill="var(--enterprise-panel)"
            stroke="var(--enterprise-edge)"
          />
          <path
            d="M166 258L187 242L210 249L232 231L255 237L280 224L303 228"
            fill="none"
            stroke="#4b91d5"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M166 258L187 242L210 249L232 231L255 237L280 224L303 228V264H166Z"
            fill="#6fb0ec"
            fillOpacity=".14"
          />
          <rect
            x="326"
            y="211"
            width="92"
            height="63"
            rx="9"
            fill="var(--enterprise-panel)"
            stroke="var(--enterprise-edge)"
          />
          {[225, 242, 259].map((y, i) => (
            <g key={y}>
              <circle
                cx="340"
                cy={y}
                r="3"
                fill={i === 1 ? "#8d9fe1" : "#73bca7"}
              />
              <path
                d={`M350 ${y}H${i === 1 ? 398 : 405}`}
                stroke="var(--enterprise-edge)"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </g>
          ))}
          <path
            d="M206 300H286L292 318H199Z"
            fill={paint("frame")}
            stroke="#95b5df"
          />
          <rect
            x="176"
            y="315"
            width="139"
            height="7"
            rx="3.5"
            fill={paint("frame")}
            stroke="#9fbee5"
          />
          <path
            d="M67 54H425Q439 54 439 68V112L56 253V68Q56 54 67 54"
            fill={paint("sheen")}
            opacity=".2"
          />
        </g>

        <g className="enterprise-art-phone" filter={paint("shadow")}>
          <g transform="rotate(7 445 247)">
            <rect
              x="391"
              y="145"
              width="112"
              height="203"
              rx="22"
              fill={paint("frame")}
              stroke="#91b4de"
            />
            <rect
              x="397"
              y="151"
              width="100"
              height="190"
              rx="17"
              fill="var(--enterprise-screen)"
            />
            <rect
              x="430"
              y="158"
              width="33"
              height="5"
              rx="2.5"
              fill="var(--enterprise-edge)"
            />
            <text x="409" y="188" className="enterprise-svg-small">
              On the move.
            </text>
            <rect
              x="409"
              y="201"
              width="76"
              height="47"
              rx="10"
              fill={paint("blue")}
            />
            <circle cx="426" cy="217" r="6" fill="#fff" fillOpacity=".4" />
            <path
              d="M440 215H473M420 233H465"
              stroke="#fff"
              strokeOpacity=".8"
              strokeWidth="3"
              strokeLinecap="round"
            />
            {[263, 285].map((y) => (
              <g key={y}>
                <rect
                  x="409"
                  y={y - 4}
                  width="15"
                  height="15"
                  rx="4"
                  fill="var(--enterprise-panel)"
                />
                <path
                  d={`M413 ${y + 3}L416 ${y + 6}L421 ${y}`}
                  fill="none"
                  stroke="#4f9e8b"
                  strokeWidth="1.7"
                />
                <path
                  d={`M432 ${y}H483M432 ${y + 7}H470`}
                  stroke="var(--enterprise-edge)"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </g>
            ))}
            <path d="M411 318H483" stroke="var(--enterprise-edge)" />
            <circle cx="420" cy="328" r="3" fill="#6b9bd5" />
            <circle cx="446" cy="328" r="3" fill="#8baccf" />
            <circle cx="473" cy="328" r="3" fill="#8baccf" />
          </g>
        </g>

        <g filter={paint("shadow")}>
          <rect
            x="183"
            y="344"
            width="195"
            height="63"
            rx="21"
            fill={paint("blue")}
            stroke="#91cfff"
          />
          <path
            d="M210 365L201 375L210 385M228 365L237 375L228 385M221 361L216 389"
            fill="none"
            stroke="#e8f7ff"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <text x="250" y="373" fill="#fff" className="enterprise-svg-api">
            API & workflows
          </text>
          <text
            x="250"
            y="391"
            className="enterprise-svg-small enterprise-svg-api-detail"
          >
            Connect the business
          </text>
          <path
            d="M202 349H357"
            stroke="#d0f5ff"
            strokeWidth="1.5"
            strokeOpacity=".7"
            strokeLinecap="round"
          />
        </g>

        <g filter={paint("shadow")}>
          <path
            d="M76 441C76 427 166 427 166 441V483C166 498 76 498 76 483Z"
            fill={paint("database")}
            stroke="#709dcc"
          />
          <ellipse
            cx="121"
            cy="441"
            rx="45"
            ry="11"
            fill="#e8f5ff"
            stroke="#86add8"
          />
          <path
            d="M76 457C76 472 166 472 166 457M76 472C76 487 166 487 166 472"
            fill="none"
            stroke="#6c9ccc"
            strokeWidth="1.5"
          />
          <ellipse
            cx="121"
            cy="439"
            rx="34"
            ry="5"
            fill="#bfddf5"
            fillOpacity=".7"
          />
          <circle cx="151" cy="454" r="2" fill="#f3fbff" />
          <circle cx="151" cy="470" r="2" fill="#f3fbff" />
        </g>
        <text
          x="121"
          y="518"
          textAnchor="middle"
          className="enterprise-svg-system-label"
        >
          DATABASE
        </text>
        <g filter={paint("shadow")}>
          {[
            { x: 324, label: "ERP", color: "#6b94d7" },
            { x: 389, label: "CRM", color: "#6caeaa" },
            { x: 454, label: "HCM", color: "#9381cd" },
          ].map(({ x, label, color }) => (
            <g key={label}>
              <rect
                x={x}
                y="428"
                width="56"
                height="62"
                rx="13"
                fill={paint("pale")}
                stroke="var(--enterprise-edge)"
              />
              <path
                d={`M${x + 16} 444H${x + 24}V452H${x + 16}ZM${x + 31} 444H${x + 39}V452H${x + 31}ZM${x + 16} 455H${x + 24}V461H${x + 16}ZM${x + 31} 455H${x + 39}V461H${x + 31}Z`}
                fill={color}
              />
              <text
                x={x + 28}
                y="480"
                textAnchor="middle"
                className="enterprise-svg-small"
              >
                {label}
              </text>
            </g>
          ))}
        </g>
        <text
          x="417"
          y="518"
          textAnchor="middle"
          className="enterprise-svg-system-label"
        >
          ENTERPRISE SYSTEMS
        </text>
      </svg>
      <div
        className="enterprise-application-layers"
        aria-label="Three connected application layers"
      >
        <div>
          <span>
            <MonitorSmartphone size={22} />
          </span>
          <p>
            <strong>Web & mobile experiences</strong>
            <span>Useful interfaces for customers and teams.</span>
          </p>
        </div>
        <div>
          <span>
            <Workflow size={22} />
          </span>
          <p>
            <strong>APIs & business workflows</strong>
            <span>Connect processes, services and integrations.</span>
          </p>
        </div>
        <div>
          <span>
            <Database size={22} />
          </span>
          <p>
            <strong>Data & enterprise systems</strong>
            <span>Bring information and access together.</span>
          </p>
        </div>
      </div>
    </div>
  );
}
