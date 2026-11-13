"use client";

import { useCallback, useEffect, useState } from "react";
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

export default function Landing({ name, chapters }: { name: string; chapters: Chapter[] }) {
  const [active, setActive] = useState(0);
  const select = useCallback((i: number) => setActive(i), []);
  // The theme on screen lags the selection: Backdrop swaps it mid-glitch.
  const [shown, setShown] = useState<ThemeId>(chapters[0].theme);
  const copy = themes[shown];

  // Theme colours live on <html> so the page background and overscroll follow too.
  useEffect(() => {
    document.documentElement.dataset.theme = shown;
  }, [shown]);

  return (
    <>
      <Backdrop scenes={SCENES} theme={chapters[active].theme} onSwap={setShown} />
      <div className="veil pointer-events-none fixed inset-0" aria-hidden />
      <div className="scanlines pointer-events-none fixed inset-0" aria-hidden />

      <main className="relative z-10 flex min-h-[100dvh] w-full flex-col items-center justify-center py-16">
        <header className="reveal-fade mb-4 px-5 text-center" style={delay(60)}>
          <p className="mb-4 text-[11px] tracking-[0.25em] text-[var(--ink-faint)]">
            [ {name} ] <span aria-hidden className="ml-2">{copy.ornament}</span>
          </p>
          <h1 className="hero">
            Select Chapter<span className="blink" aria-hidden>_</span>
          </h1>
        </header>

        <div className="reveal-fade w-full" style={delay(180)}>
          <ChapterCarousel chapters={chapters} active={active} onSelect={select} />
        </div>

        <footer
          className="reveal-fade mt-8 flex gap-4 px-5 text-[11px] text-[var(--ink-faint)]"
          style={delay(420)}
        >
          <span className="hidden sm:inline">←→ select · ⏎ open · drag to slide ·</span>
          <span>@qyzh</span>
        </footer>
      </main>
    </>
  );
}
