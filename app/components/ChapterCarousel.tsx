"use client";

import { useEffect, useRef, useState } from "react";
import { themes, type Chapter } from "@/lib/content";

const pad = (n: number) => String(n).padStart(2, "0");
const host = (url: string) => new URL(url).host;
const SWIPE = 50; // px of drag needed to change card
const CLICK_SLOP = 8; // px of drag after which a release no longer counts as a click
const WHEEL_COOLDOWN_MS = 420;

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
  const drag = useRef<{ x: number; id: number; captured: boolean } | null>(null);
  const dragged = useRef(false);
  const lastWheelAt = useRef(0);
  const carouselRef = useRef<HTMLDivElement | null>(null);
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
        if (!(el instanceof HTMLAnchorElement || el instanceof HTMLButtonElement)) {
          cards.current[active]?.click();
        }
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
    if (drag.current.captured && carouselRef.current?.hasPointerCapture(drag.current.id)) {
      carouselRef.current.releasePointerCapture(drag.current.id);
    }
    if (dragX <= -SWIPE) go(active + 1);
    else if (dragX >= SWIPE) go(active - 1);
    drag.current = null;
    setDragX(0);
  }

  function handleCardPointerMove(e: React.PointerEvent<HTMLAnchorElement>, isActive: boolean) {
    if (!isActive || drag.current || e.pointerType !== "mouse") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const ry = ((x - 0.5) * 9).toFixed(2);
    const rx = (-(y - 0.5) * 9).toFixed(2);
    el.style.setProperty("--rx", `${rx}deg`);
    el.style.setProperty("--ry", `${ry}deg`);
    el.style.setProperty("--mx", `${(x * 100).toFixed(1)}%`);
    el.style.setProperty("--my", `${(y * 100).toFixed(1)}%`);
  }

  function resetCardTilt(el: HTMLAnchorElement) {
    el.style.removeProperty("--rx");
    el.style.removeProperty("--ry");
  }

  function handleWheel(e: React.WheelEvent<HTMLDivElement>) {
    if (Math.abs(e.deltaX) <= Math.abs(e.deltaY) || Math.abs(e.deltaX) < 28) return;
    const now = performance.now();
    if (now - lastWheelAt.current < WHEEL_COOLDOWN_MS) return;
    lastWheelAt.current = now;
    go(e.deltaX > 0 ? active + 1 : active - 1);
  }

  return (
    <section aria-roledescription="carousel" aria-label="Chapters" className="w-full">
      <div
        ref={carouselRef}
        className="carousel relative w-full overflow-hidden py-5 sm:py-7"
        onWheel={handleWheel}
        onPointerDown={(e) => {
          if (e.button !== 0) return;
          drag.current = { x: e.clientX, id: e.pointerId, captured: false };
          dragged.current = false;
        }}
        onPointerMove={(e) => {
          if (!drag.current || drag.current.id !== e.pointerId) return;
          const dx = e.clientX - drag.current.x;
          if (Math.abs(dx) > CLICK_SLOP) {
            dragged.current = true;
            if (!drag.current.captured && carouselRef.current) {
              try {
                carouselRef.current.setPointerCapture(e.pointerId);
                drag.current.captured = true;
              } catch {
                // Ignore if pointer capture is unavailable
              }
            }
          }
          setDragX(dx);
        }}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={(e) => {
          if (!drag.current?.captured) endDrag();
          else if (e.pointerType === "mouse") endDrag();
        }}
      >
        <ol
          className="track flex"
          data-dragging={dragX !== 0}
          style={{ "--active": active, "--drag": `${dragX}px` } as React.CSSProperties}
        >
          {chapters.map((ch, i) => {
            const on = i === active;
            const meta = themes[ch.theme];
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
                  data-card-theme={ch.theme}
                  draggable={false}
                  tabIndex={on ? 0 : -1}
                  aria-current={on ? "true" : undefined}
                  onPointerMove={(e) => handleCardPointerMove(e, on)}
                  onPointerLeave={(e) => resetCardTilt(e.currentTarget)}
                  onClick={(e) => {
                    if (dragged.current || !on) {
                      e.preventDefault();
                      if (!dragged.current) onSelect(i);
                    }
                  }}
                  className={`card panel flex h-full flex-col justify-between p-5 sm:p-6 ${
                    ch.theme === "library" ? "pb-8 sm:pb-7" : ""
                  }`}
                >
                  {/* Theme-specific craft accents */}
                  {ch.theme === "d2" && (
                    <span aria-hidden className="d2-top-stripe absolute top-0 left-0 right-0" />
                  )}
                  {ch.theme === "library" && (
                    <span
                      aria-hidden
                      className="card-inner-frame pointer-events-none absolute inset-2"
                    />
                  )}
                  {ch.theme === "space" && (
                    <svg
                      width="68"
                      height="68"
                      viewBox="0 0 68 68"
                      fill="none"
                      aria-hidden="true"
                      className="pointer-events-none absolute -right-2 top-9 opacity-20"
                    >
                      <circle cx="34" cy="34" r="24" stroke="currentColor" strokeWidth="0.75" strokeDasharray="3 3" />
                      <circle cx="34" cy="34" r="12" stroke="currentColor" strokeWidth="0.75" />
                      <line x1="34" y1="4" x2="34" y2="14" stroke="currentColor" strokeWidth="0.75" />
                      <line x1="34" y1="54" x2="34" y2="64" stroke="currentColor" strokeWidth="0.75" />
                      <line x1="4" y1="34" x2="14" y2="34" stroke="currentColor" strokeWidth="0.75" />
                      <line x1="54" y1="34" x2="64" y2="34" stroke="currentColor" strokeWidth="0.75" />
                    </svg>
                  )}

                  {/* Card top metadata */}
                  <div className="relative flex items-baseline justify-between text-[11px] tracking-[0.22em] text-[var(--card-faint)]">
                    <span className="font-bold">{`${meta.codePrefix}.${pad(i + 1)}`}</span>
                    <span aria-hidden>{meta.ornament}</span>
                  </div>

                  {/* Card main title & tagline */}
                  <div className="relative my-auto py-2">
                    <div className="flex flex-wrap items-center gap-2 mb-2.5">
                      <span className="border border-[var(--card-line)] px-1.5 py-0.5 text-[10px] tracking-[0.18em] text-[var(--card-faint)] uppercase">
                        {ch.note}
                      </span>
                      <span className="text-[10px] tracking-[0.16em] text-[var(--card-faint)] uppercase opacity-80">
                        {meta.worldLabel}
                      </span>
                    </div>
                    <p className="card-title">{ch.title}</p>
                    <p className="mt-2.5 text-[12px] leading-relaxed text-[var(--card-faint)] max-w-[30ch]">
                      {ch.tagline}
                    </p>
                  </div>

                  {/* Card footer */}
                  <div className="relative flex items-center justify-between gap-3 border-t border-dashed border-[var(--card-line)] pt-3 text-[12px]">
                    <span className="truncate opacity-75">{host(ch.url)}</span>
                    <span className="enter shrink-0 px-2.5 py-1 text-[11px] font-bold tracking-[0.18em]">
                      {meta.cta} <span className="cursor-mark">▶</span>
                    </span>
                  </div>

                  {ch.theme === "library" && (
                    <span
                      aria-hidden
                      className="card-hole pointer-events-none absolute bottom-1.5 left-1/2 -translate-x-1/2"
                    />
                  )}
                </a>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Carousel controls */}
      <div className="mt-2 flex items-center justify-center gap-4 text-[var(--ink-faint)]">
        <button type="button" onClick={() => go(active - 1)} aria-label="Previous chapter" className="arrow">
          ◀
        </button>

        <div className="flex items-center gap-1.5" role="group" aria-label="Jump to chapter">
          {chapters.map((ch, i) => {
            const isActive = i === active;
            return (
              <button
                key={ch.url}
                type="button"
                onClick={() => onSelect(i)}
                data-active={isActive}
                aria-label={`Jump to ${ch.title}`}
                aria-pressed={isActive}
                className="dot-btn text-[12px]"
              >
                {isActive ? "■" : "□"}
              </button>
            );
          })}
        </div>

        <span className="text-[11px] tracking-[0.25em] tabular-nums" aria-live="polite">
          {pad(active + 1)} / {pad(n)}
        </span>

        <button type="button" onClick={() => go(active + 1)} aria-label="Next chapter" className="arrow">
          ▶
        </button>
      </div>
    </section>
  );
}
