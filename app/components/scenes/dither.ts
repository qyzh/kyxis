// Shared types and helpers for the background scenes.

/** A pixel scene draws one frame into a w×h Uint32 (ABGR) buffer at low resolution. */
export type Scene = { draw(t: number, buf: Uint32Array): void };
/** Builds a pixel scene for a given low-res size; called again on every resize. */
export type SceneFactory = (w: number, h: number) => Scene;

/** A vector scene draws one frame with the 2D context, in CSS px (DPR is handled for it). */
export type VectorScene = { draw(t: number, ctx: CanvasRenderingContext2D): void };
export type VectorSceneFactory = (width: number, height: number) => VectorScene;

/** What Backdrop renders: a low-res pixel scene, or a full-resolution vector one. */
export type SceneDef =
  | { kind: "pixels"; create: SceneFactory }
  | { kind: "vector"; create: VectorSceneFactory };

/** 4x4 Bayer thresholds, normalised to 0..1. Index with ((y & 3) << 2) | (x & 3). */
export const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => (v + 0.5) / 16);

/** Pack 0xRRGGBB as little-endian ABGR for a Uint32 view over ImageData. */
export const rgb = (hex: number) =>
  (0xff << 24) | ((hex & 0xff) << 16) | (hex & 0xff00) | ((hex >> 16) & 0xff);

/** Seeded PRNG so a scene's layout is stable across resizes. */
export function mulberry32(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hash(x: number, y: number) {
  let h = (x * 374761393 + y * 668265263) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
}

function valueNoise(x: number, y: number) {
  const xi = Math.floor(x), yi = Math.floor(y);
  const xf = x - xi, yf = y - yi;
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
  const a = hash(xi, yi), b = hash(xi + 1, yi);
  const c = hash(xi, yi + 1), d = hash(xi + 1, yi + 1);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}

/** 4-octave fractal value noise, roughly 0..1. */
export function fbm(x: number, y: number) {
  let sum = 0, amp = 0.5, f = 1;
  for (let o = 0; o < 4; o++) {
    sum += amp * valueNoise(x * f, y * f);
    f *= 2;
    amp *= 0.5;
  }
  return sum / 0.9375;
}
