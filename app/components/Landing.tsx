"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { themes, type Chapter, type ThemeId } from "@/lib/content";
import Backdrop from "./Backdrop";
import ChapterCarousel from "./ChapterCarousel";
import type { SceneDef } from "./scenes/dither";
import { galaxy } from "./scenes/galaxy";
import { halftone } from "./scenes/halftone";
import { library } from "./scenes/library";

const SCENES: Record<ThemeId, SceneDef> = {
  space: { kind: "pixels", create: galaxy },
  library: { kind: "pixels", create: library },
  d2: { kind: "vector", create: halftone },
};
const delay = (ms: number) => ({ "--base-delay": `${ms}ms` }) as React.CSSProperties;
const pad = (n: number) => String(n).padStart(2, "0");

export default function Landing({ name, chapters }: { name: string; chapters: Chapter[] }) {
  const [active, setActive] = useState(0);
  const select = useCallback((i: number) => setActive(i), []);
  // The theme on screen lags the selection: Backdrop swaps it mid-glitch.
  const [shown, setShown] = useState<ThemeId>(chapters[0].theme);
  const [copiedHandle, setCopiedHandle] = useState(false);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const copy = themes[shown];

  // Theme colours live on <html> so the page background and overscroll follow too.
  useEffect(() => {
    document.documentElement.dataset.theme = shown;
  }, [shown]);

  useEffect(() => {
    return () => {
      if (copyTimer.current !== null) clearTimeout(copyTimer.current);
    };
  }, []);

  async function handleCopyHandle() {
    try {
      await navigator.clipboard?.writeText("@qyzh");
      setCopiedHandle(true);
      if (copyTimer.current !== null) clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopiedHandle(false), 1600);
    } catch {
      // Clipboard unavailable in restricted contexts
    }
  }

  return (
    <>
      <Backdrop scenes={SCENES} theme={chapters[active].theme} onSwap={setShown} />
      <div className="veil pointer-events-none fixed inset-0" aria-hidden />
      <div className="scanlines pointer-events-none fixed inset-0" aria-hidden />

      <div className="relative z-10 flex min-h-[100dvh] w-full flex-col justify-between">
        {/* Top ambient HUD rail */}
        <nav
          aria-label="World switcher"
          className="hud-top reveal-fade mx-auto flex w-full max-w-5xl items-center justify-between px-5 text-[11px] tracking-[0.2em] text-[var(--ink-faint)] sm:px-8"
          style={delay(40)}
        >
          <span className="inline-flex items-center gap-2 text-[var(--ink)]">
            <span
              aria-hidden
              className="inline-block h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: "var(--accent)" }}
            />
            <span>{`[ ${name} ]`}</span>
          </span>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {chapters.map((ch, i) => {
              const isSelected = i === active;
              const world = themes[ch.theme].worldLabel;
              return (
                <button
                  key={ch.url}
                  type="button"
                  onClick={() => select(i)}
                  aria-pressed={isSelected}
                  className={`min-h-[38px] min-w-[38px] sm:min-h-0 sm:min-w-0 cursor-pointer border px-2.5 py-1.5 sm:px-2 sm:py-1 text-[10px] tracking-[0.16em] uppercase transition-colors ${
                    isSelected
                      ? "border-[var(--accent)] text-[var(--ink)]"
                      : "border-transparent text-[var(--ink-faint)] hover:border-[var(--panel-line)] hover:text-[var(--ink)]"
                  }`}
                >
                  <span className="tabular-nums">{pad(i + 1)}</span>
                  <span className="hidden md:inline">{` · ${world}`}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Centered hero stage */}
        <main className="flex w-full flex-col items-center justify-center py-4 sm:py-8">
          <header className="reveal-fade mb-2 sm:mb-3 px-5 text-center" style={delay(90)}>
            <p className="mb-2.5 sm:mb-3 text-[11px] tracking-[0.25em] text-[var(--ink-faint)] uppercase">
              <span>{copy.worldLabel}</span>
              <span aria-hidden className="ml-3">
                {copy.ornament}
              </span>
            </p>
            <h1 className="hero">
              Select Chapter<span className="blink" aria-hidden>_</span>
            </h1>
          </header>

          <div className="reveal-fade w-full" style={delay(180)}>
            <ChapterCarousel chapters={chapters} active={active} onSelect={select} />
          </div>
        </main>

        {/* Bottom HUD bar */}
        <footer
          className="hud-bottom reveal-fade mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-5 text-[11px] text-[var(--ink-faint)] sm:px-8"
          style={delay(360)}
        >
          <div className="hidden sm:flex items-center gap-3">
            <span className="inline-flex items-center gap-1">
              <kbd className="kbd-key">←</kbd>
              <kbd className="kbd-key">→</kbd>
              <span className="ml-1">select</span>
            </span>
            <span aria-hidden className="opacity-40">·</span>
            <span className="inline-flex items-center gap-1">
              <kbd className="kbd-key">1</kbd>
              <span>–</span>
              <kbd className="kbd-key">{chapters.length}</kbd>
              <span className="ml-1">jump</span>
            </span>
            <span aria-hidden className="opacity-40">·</span>
            <span className="inline-flex items-center gap-1">
              <kbd className="kbd-key">⏎</kbd>
              <span className="ml-1">open</span>
            </span>
            <span aria-hidden className="opacity-40">·</span>
            <span>drag</span>
          </div>

          <span className="sm:hidden text-[10px] tracking-[0.16em] uppercase">
            swipe or tap
          </span>

          <button
            type="button"
            onClick={handleCopyHandle}
            title="Copy handle @qyzh"
            className="py-1.5 px-2 -mr-2 cursor-pointer tracking-[0.14em] text-[var(--ink-faint)] hover:text-[var(--ink)] transition-colors"
          >
            {copiedHandle ? "COPIED @qyzh" : "@qyzh"}
          </button>
        </footer>
      </div>
    </>
  );
}
