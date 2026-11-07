import {
  Cloud,
  Layers,
  Network,
  Sparkles,
  Shield,
  Database,
  Activity,
  Check,
  ArrowRight,
} from "lucide-react";
export default function CapabilityVisual({ variant }: { variant: string }) {
  if (variant === "applications" || variant === "enterprise")
    return (
      <div
        className={"capability-visual visual-" + variant}
        role="img"
        aria-label={
          variant === "applications"
            ? "Layered cloud-native application architecture"
            : "Connected enterprise systems"
        }
      >
        <div className={"solution-sculpture " + variant}>
          <i />
          <i />
          <i />
          <i />
          <i />
        </div>
        <div className="visual-labels">
          {(variant === "applications"
            ? ["Experience", "APIs & services", "Cloud infrastructure"]
            : ["ERP", "Integration", "CRM"]
          ).map((s) => (
            <span key={s}>{s}</span>
          ))}
        </div>
        <span className="visual-caption">
          {variant === "applications"
            ? "APPLICATIONS, REIMAGINED."
            : "YOUR BUSINESS, WORKING AS ONE."}
        </span>
      </div>
    );
  if (variant === "automation")
    return (
      <div
        className="capability-visual visual-automation"
        role="img"
        aria-label="A workflow connecting data, intelligent processing and business outcomes"
      >
        <div className="workflow-orbit" />
        <div className="workflow-nodes">
          <span>
            <Database />
            <small>Connect</small>
          </span>
          <ArrowRight />
          <span>
            <Sparkles />
            <small>Orchestrate</small>
          </span>
          <ArrowRight />
          <span>
            <Check />
            <small>Automate</small>
          </span>
        </div>
        <span className="visual-caption">LESS FRICTION. MORE MOMENTUM.</span>
      </div>
    );
  return (
    <div
      className="capability-visual visual-managed"
      role="img"
      aria-label="Infrastructure monitoring with connected cloud and server operations"
    >
      <div className="monitor-panel">
        <div className="monitor-top">
          <Activity size={16} />
          <span>INFRASTRUCTURE OVERVIEW</span>
          <i />
        </div>
        <div className="monitor-chart">
          {[35, 60, 45, 80, 65, 90, 75, 98, 85, 110, 92, 120].map((h, i) => (
            <b key={i} style={{ height: h, animationDelay: `${i * 0.12}s` }} />
          ))}
        </div>
        <div className="monitor-status">
          <span>
            <Cloud size={18} /> Cloud
          </span>
          <span>
            <Shield size={18} /> Operations
          </span>
          <span>
            <Database size={18} /> Systems
          </span>
        </div>
      </div>
      <span className="visual-caption">VISIBILITY ACROSS YOUR TECHNOLOGY.</span>
    </div>
  );
}
