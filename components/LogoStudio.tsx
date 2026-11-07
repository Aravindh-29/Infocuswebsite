"use client";
import { useEffect, useRef, useState } from "react";
import InfocusWordmarkAnimation, {
  InfocusWordmarkHandle,
} from "./InfocusWordmarkAnimation";
declare global {
  interface Window {
    infocusLogo?: InfocusWordmarkHandle;
    logoReady?: boolean;
  }
}
export default function LogoStudio() {
  const ref = useRef<InfocusWordmarkHandle>(null);
  const [loop, setLoop] = useState(true),
    [mode, setMode] = useState<"intro" | "idle">("intro");
  useEffect(() => {
    window.infocusLogo = ref.current || undefined;
    window.logoReady = true;
    return () => {
      delete window.infocusLogo;
      delete window.logoReady;
    };
  }, [mode]);
  return (
    <main id="main" className="logo-studio container section">
      <span className="eyebrow">INFOCUS / MOTION IDENTITY</span>
      <h1>
        Always moving.
        <br />
        Always in focus.
      </h1>
      <div id="logo-export-stage">
        <InfocusWordmarkAnimation ref={ref} mode={mode} loop={loop} />
      </div>
      <div className="logo-controls">
        <button onClick={() => ref.current?.play()}>Play</button>
        <button onClick={() => ref.current?.pause()}>Pause</button>
        <button onClick={() => ref.current?.restart()}>Restart</button>
        <button
          aria-pressed={loop}
          onClick={() => {
            setLoop(!loop);
            ref.current?.setLoop(!loop);
          }}
        >
          Loop {loop ? "on" : "off"}
        </button>
        <button onClick={() => setMode(mode === "intro" ? "idle" : "intro")}>
          {mode === "intro" ? "Use idle mode" : "Use intro mode"}
        </button>
      </div>
      <p>
        The seven original INFOCUS letters fall into place, settle with a
        playful wobble and catch a travelling gold highlight. The website uses
        this native animation with your supplied artwork.
      </p>
      <a className="text-link" href="/brand/infocus-wordmark.svg" download>
        Download static SVG
      </a>
    </main>
  );
}
