"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, UserRound, X } from "lucide-react";

const prompt = "How can we help with your next project?";

export function DeepuAvatar({ className = "" }: { className?: string }) {
  const [unavailable, setUnavailable] = useState(false);
  return (
    <span className={`deepu-avatar ${className}`} aria-hidden="true">
      {unavailable ? (
        <UserRound strokeWidth={1.5} />
      ) : (
        <img
          src="/images/deepu-avatar.png"
          alt=""
          onError={() => setUnavailable(true)}
        />
      )}
    </span>
  );
}

type Controls = {
  dismiss: () => void;
};
const noControls: Controls = { dismiss() {} };

export default function DeepuWelcome({
  chatOpen,
  onStartChat,
}: {
  chatOpen: boolean;
  onStartChat: () => void;
}) {
  const [visible, setVisible] = useState(false);
  const controls = useRef<Controls>(noControls);

  useEffect(() => {
    let disposed = false;
    let dismissed = false;
    let shown = false;
    let activated = false;
    let pending = true;
    let isMuted = false;
    let playback = 0;
    let context: AudioContext | null = null;
    let closeTimer: ReturnType<typeof setTimeout> | undefined;
    let resumeTimer: ReturnType<typeof setTimeout> | undefined;
    const oscillators = new Set<OscillatorNode>();
    try {
      isMuted = localStorage.getItem("deepu-muted") === "true";
    } catch {}
    const audioContext = () => {
      if (!context || context.state === "closed") {
        const Constructor =
          window.AudioContext ||
          (
            window as typeof window & {
              webkitAudioContext?: typeof AudioContext;
            }
          ).webkitAudioContext;
        if (Constructor) context = new Constructor();
      }
      return context;
    };
    const stop = (close = true) => {
      playback++;
      clearTimeout(closeTimer);
      clearTimeout(resumeTimer);
      oscillators.forEach((oscillator) => {
        try {
          oscillator.stop();
        } catch {}
        oscillator.disconnect();
      });
      oscillators.clear();
      if (close && context && context.state !== "closed") {
        void context.close().catch(() => {});
        context = null;
      }
    };
    const play = async () => {
      if (disposed || dismissed || isMuted) return;
      pending = false;
      stop(false);
      const run = playback;
      try {
        const audio = audioContext();
        if (!audio) return;
        // A blocked resume must not leave a sound queued for an unrelated
        // later interaction. The welcome remains usable without audio.
        resumeTimer = setTimeout(() => {
          if (!disposed && run === playback) {
            stop();
          }
        }, 1500);
        await audio.resume();
        if (disposed || dismissed || isMuted || run !== playback) return;
        clearTimeout(resumeTimer);
        if (audio.state !== "running") {
          stop();
          return;
        }
        [659.25, 880].forEach((frequency, index) => {
          const oscillator = audio.createOscillator();
          const gain = audio.createGain();
          const start = audio.currentTime + index * 0.12;
          oscillator.type = "sine";
          oscillator.frequency.value = frequency;
          gain.gain.setValueAtTime(0.0001, start);
          gain.gain.exponentialRampToValueAtTime(0.045, start + 0.018);
          gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.23);
          oscillator.connect(gain);
          gain.connect(audio.destination);
          oscillators.add(oscillator);
          oscillator.onended = () => {
            oscillators.delete(oscillator);
            oscillator.disconnect();
            gain.disconnect();
          };
          oscillator.start(start);
          oscillator.stop(start + 0.25);
        });
        closeTimer = setTimeout(() => {
          if (disposed || run !== playback) return;
          stop();
        }, 700);
      } catch {
        if (disposed || run !== playback) return;
        stop();
      }
    };
    const dismiss = () => {
      dismissed = true;
      pending = false;
      shown = false;
      setVisible(false);
      stop();
    };
    controls.current = { dismiss };
    const onGesture = (event: MouseEvent | KeyboardEvent) => {
      if (!event.isTrusted || dismissed) return;
      if (event instanceof KeyboardEvent && event.key === "Escape") {
        if (shown) dismiss();
        return;
      }
      if ((event.target as Element | null)?.closest?.("[data-deepu-control]"))
        return;
      activated = true;
      if (shown && pending && !isMuted) void play();
      else if (!shown && !isMuted) {
        // An early trusted interaction can unlock the context before the
        // welcome appears, without playing anything or opening the chat.
        try {
          void audioContext()
            ?.resume()
            .catch(() => {});
        } catch {}
      }
    };
    document.addEventListener("click", onGesture);
    document.addEventListener("keydown", onGesture);
    const timer = setTimeout(() => {
      if (disposed || dismissed) return;
      shown = true;
      setVisible(true);
      const playbackAllowed =
        activated ||
        context?.state === "running" ||
        navigator.userActivation?.hasBeenActive;
      if (playbackAllowed && pending && !isMuted) void play();
    }, 1200);
    return () => {
      disposed = true;
      clearTimeout(timer);
      document.removeEventListener("click", onGesture);
      document.removeEventListener("keydown", onGesture);
      controls.current = noControls;
      stop();
    };
  }, []);

  useEffect(() => {
    if (chatOpen) controls.current.dismiss();
  }, [chatOpen]);

  if (!visible || chatOpen) return null;
  return (
    <aside className="deepu-welcome" aria-label="Welcome from Deepu">
      <button
        className="deepu-dismiss"
        type="button"
        aria-label="Dismiss Deepu welcome"
        data-deepu-control
        onClick={() => controls.current.dismiss()}
      >
        <X size={17} />
      </button>
      <div className="deepu-welcome-intro">
        <DeepuAvatar />
        <div>
          <span className="deepu-kicker">YOUR INFOCUS GUIDE</span>
          <p role="status">{prompt}</p>
        </div>
      </div>
      <button
        className="deepu-start"
        type="button"
        data-deepu-control
        onClick={() => {
          controls.current.dismiss();
          onStartChat();
        }}
      >
        Chat with Deepu <ArrowUpRight size={17} />
      </button>
    </aside>
  );
}
