"use client";

import { useEffect, useRef, useState } from "react";
import { themes, type Chapter } from "@/lib/content";

const pad = (n: number) => String(n).padStart(2, "0");
const host = (url: string) => new URL(url).host;
const SWIPE = 50; // px of drag needed to change card
const CLICK_SLOP = 8; // px of drag after which a release no longer counts as a click

export default function ChapterCarousel({
  chapters,
  active,
  onSelect,
}: {
  chapters: Chapter[];
  active: number;
  onSelect: (i: number) => void;
}) {
  const n = chapters.length;
  const [dragX, setDragX] = useState(0);
  const drag = useRef<{ x: number; id: number } | null>(null);
  const dragged = useRef(false);
  const cards = useRef<(HTMLAnchorElement | null)[]>([]);

  const go = (i: number) => onSelect(((i % n) + n) % n);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const k = e.key;
      let next: number | null = null;
      if (k === "ArrowRight" || k === "ArrowDown" || k === "l" || k === "j") next = active + 1;
      else if (k === "ArrowLeft" || k === "ArrowUp" || k === "h" || k === "k") next = active - 1;
      else if (/^[1-9]$/.test(k) && Number(k) <= n) next = Number(k) - 1;
      else if (k === "Enter") {
        const el = document.activeElement;
        if (!(el instanceof HTMLAnchorElement || el instanceof HTMLButtonElement)) cards.current[active]?.click();
        return;
      }
      if (next === null) return;
      e.preventDefault();
      onSelect(((next % n) + n) % n);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, n, onSelect]);

  function endDrag() {
    if (!drag.current) return;
    if (dragX <= -SWIPE) go(active + 1);
    else if (dragX >= SWIPE) go(active - 1);
    drag.current = null;
    setDragX(0);
  }

  return (
    <section aria-roledescription="carousel" aria-label="Chapters" className="w-full">
      <div
        className="carousel relative w-full overflow-hidden py-6"
        onPointerDown={(e) => {
          if (e.button !== 0) return;
          drag.current = { x: e.clientX, id: e.pointerId };
          dragged.current = false;
        }}
        onPointerMove={(e) => {
          if (!drag.current || drag.current.id !== e.pointerId) return;
          const dx = e.clientX - drag.current.x;
          if (Math.abs(dx) > CLICK_SLOP) dragged.current = true;
          setDragX(dx);
        }}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={endDrag}
      >
        <ol
          className="track flex"
          data-dragging={dragX !== 0}
          style={{ "--active": active, "--drag": `${dragX}px` } as React.CSSProperties}
        >
          {chapters.map((ch, i) => {
            const on = i === active;
            return (
              <li
                key={ch.url}
                className="slide"
                data-active={on}
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${n}: ${ch.title}`}
              >
                <a
                  ref={(el) => {
                    cards.current[i] = el;
                  }}
                  href={ch.url}
                  draggable={false}
                  tabIndex={on ? 0 : -1}
                  aria-current={on ? "true" : undefined}
                  onClick={(e) => {
                    if (dragged.current || !on) {
                      e.preventDefault();
                      if (!dragged.current) onSelect(i);
                    }
                  }}
                  className="card panel flex h-full flex-col justify-between p-5 sm:p-6"
                >
                  <div className="relative flex items-baseline justify-between text-[11px] tracking-[0.25em] text-[var(--panel-faint)]">
                    <span>CH.{pad(i + 1)}</span>
                    <span aria-hidden>{themes[ch.theme].ornament}</span>
                  </div>

                  <div className="relative">
                    <p className="card-title">{ch.title}</p>
                    <p className="mt-2 text-[12px] tracking-[0.2em] text-[var(--panel-faint)] uppercase">
                      {ch.note}
                    </p>
                  </div>

                  <div className="relative flex items-center justify-between gap-3 border-t border-dashed border-[var(--panel-line)] pt-3 text-[12px]">
                    <span className="truncate opacity-70">{host(ch.url)}</span>
                    <span className="enter shrink-0 px-2 py-1 font-bold tracking-[0.2em]">
                      ENTER <span className="cursor-mark">▶</span>
                    </span>
                  </div>
                </a>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="mt-2 flex items-center justify-center gap-5 text-[var(--ink-faint)]">
        <button type="button" onClick={() => go(active - 1)} aria-label="Previous chapter" className="arrow">
          ◀
        </button>
        <span className="flex gap-2" aria-hidden>
          {chapters.map((ch, i) => (
            <span key={ch.url} className={i === active ? "text-[var(--ink)]" : "opacity-50"}>
              {i === active ? "■" : "□"}
            </span>
          ))}
        </span>
        <span className="text-[11px] tracking-[0.25em]" aria-live="polite">
          {pad(active + 1)} / {pad(n)}
        </span>
        <button type="button" onClick={() => go(active + 1)} aria-label="Next chapter" className="arrow">
          ▶
        </button>
      </div>
    </section>
  );
}
