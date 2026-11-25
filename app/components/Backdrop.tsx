"use client";

import { useEffect, useRef } from "react";
import type { ThemeId } from "@/lib/content";
import type { SceneDef } from "./scenes/dither";
import { drawGlitch, GLITCH_MS } from "./scenes/glitch";

// Size of one dithered "pixel" for pixel scenes, in CSS px.
const PX = 3;
// Beyond 1.5x the backdrop looks no sharper but costs more to draw.
const MAX_DPR = 1.5;
const FPS = 24;

type Live = { canvas: HTMLCanvasElement; render(t: number): void };

/** Instantiates a scene on its own offscreen canvas. */
function build(def: SceneDef, cssW: number, cssH: number, ratio: number): Live {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  if (def.kind === "pixels") {
    const w = Math.ceil(cssW / PX);
    const h = Math.ceil(cssH / PX);
    canvas.width = w;
    canvas.height = h;
    const img = ctx.createImageData(w, h);
    const buf = new Uint32Array(img.data.buffer);
    const s = def.create(w, h);
    return {
      canvas,
      render(t) {
        s.draw(t, buf);
        ctx.putImageData(img, 0, 0);
      },
    };
  }
  canvas.width = Math.round(cssW * ratio);
  canvas.height = Math.round(cssH * ratio);
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  const s = def.create(cssW, cssH);
  return { canvas, render: (t) => s.draw(t, ctx) };
}

/**
 * The full-screen background. Animates the current theme's scene; when `theme`
 * changes it plays the glitch transition into the new scene and calls `onSwap`
 * at the midpoint so the page colours cut over in step. Under
 * prefers-reduced-motion it swaps instantly and draws still frames.
 */
export default function Backdrop({
  scenes,
  theme,
  onSwap,
}: {
  scenes: Record<ThemeId, SceneDef>;
  theme: ThemeId;
  onSwap: (theme: ThemeId) => void;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const target = useRef(theme);
  const swap = useRef(onSwap);
  const kick = useRef<() => void>(() => {});

  useEffect(() => {
    swap.current = onSwap;
  }, [onSwap]);

  useEffect(() => {
    target.current = theme;
    kick.current();
  }, [theme]);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const root = document.documentElement;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let live = {} as Record<ThemeId, Live>;
    let W = 0, H = 0, ratio = 1;
    let cur = target.current;
    let tr: { from: ThemeId; to: ThemeId; start: number; swapped: boolean } | null = null;
    let raf = 0, lastScene = 0;

    // Vector scenes are transparent between their marks, so always start from a
    // cleared frame (the page background shows through) rather than painting over the last.
    const blit = (s: Live) => {
      ctx.clearRect(0, 0, W, H);
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(s.canvas, 0, 0, W, H);
    };

    function setup() {
      const cssW = window.innerWidth, cssH = window.innerHeight;
      ratio = Math.min(MAX_DPR, window.devicePixelRatio || 1);
      W = canvas!.width = Math.round(cssW * ratio);
      H = canvas!.height = Math.round(cssH * ratio);
      live = {} as Record<ThemeId, Live>;
      const now = performance.now();
      for (const id of Object.keys(scenes) as ThemeId[]) {
        live[id] = build(scenes[id], cssW, cssH, ratio);
        live[id].render(now);
      }
      blit(live[cur]);
    }

    function finish() {
      if (!tr) return;
      cur = tr.to;
      if (!tr.swapped) swap.current(cur);
      tr = null;
      delete root.dataset.glitch;
      root.style.removeProperty("--gk");
      root.style.removeProperty("--gx");
    }

    function start(to: ThemeId) {
      finish();
      if (to === cur) return;
      if (reduceMotion) {
        cur = to;
        swap.current(to);
        live[cur].render(performance.now());
        blit(live[cur]);
        return;
      }
      tr = { from: cur, to, start: performance.now(), swapped: false };
      root.dataset.glitch = "";
    }

    function frame(now: number) {
      raf = requestAnimationFrame(frame);
      const due = now - lastScene >= 1000 / FPS;
      if (due) {
        lastScene = now;
        live[cur].render(now);
        if (tr) live[tr.to].render(now);
      }
      if (!tr) {
        if (due) blit(live[cur]);
        return;
      }
      const p = (now - tr.start) / GLITCH_MS;
      if (p >= 1) {
        finish();
        blit(live[cur]);
        return;
      }
      if (p >= 0.5 && !tr.swapped) {
        tr.swapped = true;
        swap.current(tr.to);
      }
      ctx!.clearRect(0, 0, W, H);
      const k = drawGlitch(ctx!, p, live[tr.from].canvas, live[tr.to].canvas, W, H, ratio);
      root.style.setProperty("--gk", k.toFixed(3));
      root.style.setProperty("--gx", `${((Math.random() - 0.5) * k * 16).toFixed(1)}px`);
    }

    let resizeTimer: ReturnType<typeof setTimeout>;
    function onResize() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        finish();
        setup();
      }, 150);
    }

    setup();
    kick.current = () => start(target.current);
    if (!reduceMotion) raf = requestAnimationFrame(frame);
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(resizeTimer);
      finish();
      kick.current = () => {};
      window.removeEventListener("resize", onResize);
    };
  }, [scenes]);

  return <canvas ref={ref} aria-hidden className="backdrop pointer-events-none fixed inset-0 h-full w-full" />;
}
