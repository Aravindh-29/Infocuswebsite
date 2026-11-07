"use client";
import dynamic from "next/dynamic";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { offices } from "@/lib/content";
const Scene = dynamic(() => import("./Scene"), {
  ssr: false,
  loading: () => <div className="globe-loading" />,
});
export default function Globe() {
  const [active, setActive] = useState(0);
  return (
    <div className="global-grid">
      <div className="globe-visual">
        <Scene active={active} />
        <span className="globe-caption">
          <i /> CONNECTED EXPERTISE. SHARED AMBITION.
        </span>
      </div>
      <div className="office-selector">
        <span className="eyebrow">
          LOCAL UNDERSTANDING. GLOBAL PERSPECTIVE.
        </span>
        <h2>
          Closer to your
          <br />
          next possibility.
        </h2>
        <p>
          Across borders and time zones, our people bring technology and
          business together.
        </p>
        <div className="office-tabs">
          {offices.map((o, i) => (
            <button
              aria-pressed={active === i}
              key={o.city}
              onClick={() => setActive(i)}
            >
              {o.city}
              <ArrowUpRight size={14} />
            </button>
          ))}
        </div>
        <div className="office-address" aria-live="polite">
          <small>{offices[active].country}</small>
          <h3>{offices[active].city}</h3>
          <p>{offices[active].address}</p>
          <a
            target="_blank"
            rel="noreferrer"
            href={
              "https://www.google.com/maps/search/?api=1&query=" +
              encodeURIComponent(offices[active].address)
            }
          >
            View on map <ArrowUpRight size={14} />
          </a>
        </div>
      </div>
    </div>
  );
}
