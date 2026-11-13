/**
 * Ported from PersonalD2 (features/shell/halftone.ts + HalftoneBackground.tsx), the
 * background of d2.thisnot.my.id: a halftone dot field where green (wins) rises from the
 * bottom-left and red (losses) from the top-right. Dot size follows slowly drifting noise,
 * so the two sides meet along a ragged, moving edge.
 */
import type { VectorSceneFactory } from "./dither";

const HALFTONE = {
  /** Grid pitch in CSS pixels; each dot sits in one cell. */
  cell: 11,
  /** Overall opacity of the dots. */
  strength: 0.5,
  win: "#00E436",
  loss: "#FF004D",
  /** Size of the noise blobs, in CSS pixels. */
  blob: 260,
  /** How fast the pattern drifts, in noise units per second. */
  drift: 0.06,
} as const;

const fract = (n: number) => n - Math.floor(n);
const hash = (i: number, j: number, k: number) => fract(Math.sin(i * 127.1 + j * 311.7 + k * 74.7) * 43758.5453);
const smooth = (t: number) => t * t * (3 - 2 * t);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Smooth value noise in three dimensions (x, y, time), 0 to 1. */
function noise(x: number, y: number, z: number): number {
  const i = Math.floor(x), j = Math.floor(y), k = Math.floor(z);
  const fx = smooth(x - i), fy = smooth(y - j), fz = smooth(z - k);
  const plane = (kk: number) =>
    lerp(lerp(hash(i, j, kk), hash(i + 1, j, kk), fx), lerp(hash(i, j + 1, kk), hash(i + 1, j + 1, kk), fx), fy);
  return lerp(plane(k), plane(k + 1), fz);
}

/** Two octaves: big soft shapes with a little ragged detail. */
const fbm = (x: number, y: number, z: number) => noise(x, y, z) * 0.65 + noise(x * 2.1, y * 2.1, z * 1.3) * 0.35;

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);

/** How strongly a corner owns a point, 1 at the corner fading to 0 across the screen. */
const cornerReach = (dx: number, dy: number) => Math.pow(Math.max(0, 1 - Math.hypot(dx, dy) / 1.15), 1.2);

/** The dot at screen fraction (u, v); noise pushes green and red in opposite directions. */
function dotAt(u: number, v: number, n: number) {
  const green = clamp01(cornerReach(u, 1 - v) * 1.3 + n * 1.5 - 0.15);
  const red = clamp01(cornerReach(1 - u, v) * 1.3 - n * 1.5 - 0.15);
  return green >= red ? { value: green, win: true } : { value: red, win: false };
}

/** Bigger dots are also brighter; rounded to tenths so dots batch into few fills. */
const dotAlpha = (value: number) => Math.round((0.35 + 0.65 * value) * 10) / 10;

export const halftone: VectorSceneFactory = (width, height) => {
  // Dots are grouped by colour and brightness so each group is one path and one fill.
  const groups = new Map<string, number[]>();

  return {
    draw(t, ctx) {
      const seconds = t / 1000;
      const { cell, strength, blob, drift, win, loss } = HALFTONE;
      const half = cell / 2;
      const largest = cell * 0.46;
      const offset = seconds * drift;

      for (const dots of groups.values()) dots.length = 0;
      for (let y = half; y < height + half; y += cell) {
        for (let x = half; x < width + half; x += cell) {
          const n = fbm(x / blob + offset, y / blob - offset * 0.6, seconds * 0.04) - 0.5;
          const dot = dotAt(x / width, y / height, n);
          const size = Math.round(dot.value * largest * 2);
          if (size < 1) continue;
          const key = `${dot.win ? "w" : "l"}${dotAlpha(dot.value)}`;
          let dots = groups.get(key);
          if (!dots) groups.set(key, (dots = []));
          dots.push(Math.round(x - size / 2), Math.round(y - size / 2), size);
        }
      }

      ctx.clearRect(0, 0, width, height);
      for (const [key, dots] of groups) {
        if (dots.length === 0) continue;
        ctx.globalAlpha = Number(key.slice(1)) * strength;
        ctx.fillStyle = key[0] === "w" ? win : loss;
        ctx.beginPath();
        for (let i = 0; i < dots.length; i += 3) ctx.rect(dots[i], dots[i + 1], dots[i + 2], dots[i + 2]);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    },
  };
};
