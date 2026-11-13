import { BAYER, fbm, mulberry32, rgb, type SceneFactory } from "./dither";

// Five-step ramps (dark → light), one per material family. Level 0 is shared shadow.
const RAMPS = [
  [0x0c0806, 0x2b1b10, 0x5e3b21, 0xa06c3a, 0xeac68c], // walnut / gilt
  [0x0c0806, 0x2a0f0e, 0x5c1d19, 0x93372b, 0xd98a6a], // oxblood
  [0x0c0806, 0x12201a, 0x26402f, 0x4c6b46, 0xa9b98a], // forest
  [0x0c0806, 0x141a2b, 0x26324f, 0x46577e, 0x9fb0cf], // navy
].map((r) => r.map(rgb));
const LEVELS = 4;
const WOOD = 0;

function pickFamily(r: number) {
  if (r < 0.4) return 0;
  if (r < 0.65) return 1;
  if (r < 0.85) return 2;
  return 3;
}

/** Lamp-lit bookshelves with drifting dust motes. */
export const library: SceneFactory = (w, h) => {
  const n = w * h;
  const rnd = mulberry32(1337);
  const lum = new Float32Array(n); // material brightness 0..1
  const fam = new Uint8Array(n); // ramp index

  const shelfH = Math.min(46, Math.max(30, Math.round(h / 6)));
  const plank = 3;
  const firstTop = -Math.floor(shelfH * 0.35);

  // Back wall: dark wood with a vertical grain, shadowed under each plank.
  for (let y = 0; y < h; y++) {
    const inShelf = (((y - firstTop) % shelfH) + shelfH) % shelfH;
    const shade = inShelf < 4 ? 0.45 + inShelf * 0.14 : 1;
    for (let x = 0; x < w; x++) {
      lum[y * w + x] = (0.1 + 0.09 * fbm(x * 0.09, y * 0.012)) * shade;
    }
  }

  for (let top = firstTop; top < h; top += shelfH) {
    const floor = top + shelfH - plank;

    // Books standing on the plank.
    let x = rnd() * 4;
    while (x < w) {
      if (rnd() < 0.07) {
        x += 2 + Math.floor(rnd() * 6);
        continue;
      }
      const x0 = Math.floor(x);
      const bw = 3 + Math.floor(rnd() * 5);
      const bh = Math.floor((shelfH - plank - 4) * (0.58 + rnd() * 0.4));
      const f = pickFamily(rnd());
      const base = 0.45 + rnd() * 0.3;
      const band = 2 + Math.floor(rnd() * 3);
      const label = rnd() < 0.35 && bw > 3;

      for (let bx = 0; bx < bw && x0 + bx < w; bx++) {
        const round = 0.6 + 0.45 * Math.sin((Math.PI * (bx + 0.5)) / bw);
        for (let by = 0; by < bh; by++) {
          const py = floor - 1 - by;
          if (py < 0 || py >= h) continue;
          const i = py * w + x0 + bx;
          const fromTop = bh - 1 - by;
          let L = base * round;
          let F = f;
          if (fromTop === band || by === 3) {
            F = WOOD; // gilt band
            L = 0.85 * round;
          } else if (label && fromTop >= band + 4 && fromTop <= band + 8 && bx > 0 && bx < bw - 1) {
            F = WOOD; // paper label
            L = 0.95;
          }
          if (bx === 0) L *= 0.4; // gap between spines
          lum[i] = L;
          fam[i] = F;
        }
      }
      x += bw;
    }

    // The plank itself: lit front edge, darker face.
    for (let py = floor; py < floor + plank; py++) {
      if (py < 0 || py >= h) continue;
      const L = py === floor ? 0.78 : 0.48 - (py - floor) * 0.1;
      for (let px = 0; px < w; px++) {
        const i = py * w + px;
        lum[i] = L * (0.85 + 0.3 * fbm(px * 0.05, py * 0.5));
        fam[i] = WOOD;
      }
    }
  }

  // Warm lamp pool + vignette, baked into a static brightness map.
  const portrait = h > w;
  const lx = w * (portrait ? 0.5 : 0.22);
  const ly = h * (portrait ? 0.08 : 0.15);
  const lit = new Float32Array(n);
  const light = new Float32Array(n);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = y * w + x;
      const dx = (x - lx) / (w * (portrait ? 0.7 : 0.5));
      const dy = (y - ly) / (h * 0.62);
      const l = 0.2 + 0.8 * Math.exp(-(dx * dx + dy * dy) * 1.6);
      light[i] = l;
      lit[i] = lum[i] * l;
    }
  }

  const motes = Array.from({ length: Math.floor(n / 1800) }, () => ({
    x: rnd() * w,
    y: rnd() * h,
    vx: (rnd() - 0.5) * 0.004,
    vy: -0.002 - rnd() * 0.004,
    p: rnd() * Math.PI * 2,
  }));

  return {
    draw(t, buf) {
      const flicker = 1 + 0.03 * Math.sin(t * 0.0021) + 0.02 * Math.sin(t * 0.0057 + 1.3);
      for (let y = 0; y < h; y++) {
        const row = y * w;
        const by = (y & 3) << 2;
        for (let x = 0; x < w; x++) {
          const i = row + x;
          let lvl = Math.floor(lit[i] * flicker * LEVELS + BAYER[by | (x & 3)]);
          if (lvl > LEVELS) lvl = LEVELS;
          buf[i] = RAMPS[fam[i]][lvl];
        }
      }

      for (const m of motes) {
        const x = Math.floor(((((m.x + m.vx * t + Math.sin(t * 0.0007 + m.p) * 3) % w) + w) % w));
        const y = Math.floor(((((m.y + m.vy * t) % h) + h) % h));
        const i = y * w + x;
        const glow = light[i] * (0.6 + 0.4 * Math.sin(t * 0.002 + m.p));
        if (glow > 0.55) buf[i] = RAMPS[WOOD][glow > 0.85 ? 4 : 3];
      }
    },
  };
};
