import VendorBrand from "./VendorBrand";
import { vendors } from "@/lib/vendors";
import type { CSSProperties } from "react";
export default function VendorVisual({
  vendor = "oracle",
  nodes,
}: {
  vendor?: string;
  nodes?: string[];
}) {
  const v = vendors.find((v) => v.slug === vendor) || vendors[0];
  return (
    <div
      className={"vendor-visual visual-" + vendor}
      style={{ "--vendor-color": v.color } as CSSProperties}
      role="img"
      aria-label={v.title + " connected platform architecture"}
    >
      <div className="vendor-orbit orbit-one" />
      <div className="vendor-orbit orbit-two" />
      <svg
        className="vendor-connections"
        viewBox="0 0 600 400"
        aria-hidden="true"
      >
        <path d="M300 160 Q100 160 100 300M300 160 V300M300 160 Q500 160 500 300" />
      </svg>
      <div className="vendor-core">
        <VendorBrand vendor={vendor} />
        <span>
          {vendor === "oracle" ? "ORACLE INTEGRATION" : v.title.toUpperCase()}
        </span>
      </div>
      <div className="vendor-nodes">
        {(nodes || v.nodes).map((n, i) => (
          <div key={n}>
            <i>{String(i + 1).padStart(2, "0")}</i>
            <strong>{n}</strong>
          </div>
        ))}
      </div>
      <span className="vendor-caption">
        CONNECTED TECHNOLOGY. MEANINGFUL POSSIBILITIES.
      </span>
    </div>
  );
}
