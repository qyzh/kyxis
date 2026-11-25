import { BAYER, fbm, rgb, type SceneFactory } from "./dither";

const PALETTE = [0x050505, 0x1c1c1c, 0x4f4f4f, 0xededed].map(rgb);
const CORE = rgb(0xffffff); // brightest white for the galactic core
const LEVELS = PALETTE.length - 1;

/** Tilted spiral galaxy over a faint nebula, with twinkling stars. */
export const galaxy: SceneFactory = (w, h) => {
  const n = w * h;
  // Per-pixel precomputed terms so each frame is just one cos() per pixel.
  const phase = new Float32Array(n);
  const armGain = new Float32Array(n);
  const base = new Float32Array(n);
  const core = new Float32Array(n);

  const portrait = h > w;
  const cx = w * (portrait ? 0.5 : 0.66);
  const cy = h * (portrait ? 0.3 : 0.48);
  const R = Math.min(w, h) * (portrait ? 0.62 : 0.52);
  const tilt = -0.42, cos = Math.cos(tilt), sin = Math.sin(tilt);
  const ns = 14 / Math.max(w, h);

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = y * w + x;
      const dx = x - cx, dy = y - cy;
      const u = dx * cos + dy * sin;
      const v = (-dx * sin + dy * cos) * 2.3; // inclination
      const r = Math.hypot(u, v) / R;
      const cloud = fbm(x * ns, y * ns);
      const dust = fbm(x * ns * 2.7 + 40, y * ns * 2.7 + 40);
      phase[i] = 2 * Math.atan2(v, u) - 5.2 * Math.log(r + 0.04);
      armGain[i] = Math.exp(-r * 2.1) * (0.35 + 0.9 * dust);
      core[i] = Math.exp(-r * r * 90);
      base[i] = 0.16 * cloud * cloud * cloud + Math.exp(-r * 3.2) * 0.12;
    }
  }

  const stars = Array.from({ length: Math.floor(n / 260) }, () => ({
    i: Math.floor(Math.random() * n),
    p: Math.random() * Math.PI * 2,
    s: 0.6 + Math.random() * 2.2,
    big: Math.random() < 0.06,
  }));

  return {
    draw(t, buf) {
      const rot = t * 0.0001;
      for (let y = 0; y < h; y++) {
        const row = y * w;
        const by = (y & 3) << 2;
        for (let x = 0; x < w; x++) {
          const i = row + x;
          const s = Math.cos(phase[i] + rot) * 0.5 + 0.5;
          const b = base[i] + armGain[i] * s * s * s * s + core[i] * 1.3;
          let lvl = Math.floor(b * LEVELS + BAYER[by | (x & 3)]);
          if (lvl > LEVELS) lvl = LEVELS;
          buf[i] = lvl === LEVELS && core[i] > 0.6 ? CORE : PALETTE[lvl];
        }
      }

      const sec = t / 1000;
      for (const star of stars) {
        const tw = Math.sin(sec * star.s + star.p);
        if (tw < -0.55) continue;
        buf[star.i] = PALETTE[tw > 0.2 ? 3 : 2];
        if (star.big && tw > 0.5) {
          const x = star.i % w;
          if (x > 0) buf[star.i - 1] = PALETTE[2];
          if (x < w - 1) buf[star.i + 1] = PALETTE[2];
          if (star.i - w >= 0) buf[star.i - w] = PALETTE[2];
          if (star.i + w < n) buf[star.i + w] = PALETTE[2];
        }
      }
    },
  };
};
