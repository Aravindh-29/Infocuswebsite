"use client";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
export default function ThemeToggle() {
  const [theme, setTheme] = useState("light");
  useEffect(() => {
    setTheme(document.documentElement.dataset.theme || "light");
  }, []);
  function choose(next: string) {
    setTheme(next);
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("infocus-theme", next);
    } catch {}
  }
  return (
    <div className="theme-toggle" role="group" aria-label="Colour theme">
      <button
        onClick={() => choose("light")}
        aria-label="Switch to light mode"
        aria-pressed={theme === "light"}
        title="Light mode"
      >
        <Sun size={17} className={theme === "light" ? "active" : ""} />
      </button>
      <span />
      <button
        onClick={() => choose("dark")}
        aria-label="Switch to night mode"
        aria-pressed={theme === "dark"}
        title="Night mode"
      >
        <Moon size={17} className={theme === "dark" ? "active" : ""} />
      </button>
    </div>
  );
}
