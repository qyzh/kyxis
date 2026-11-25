// The theme-switch transition: horizontal bands tear and slide between the old and new
// scene, with red/cyan noise and the odd invert flash. Chosen from the transition
// prototypes (option 5, "Glitch tear").

export const GLITCH_MS = 800;

const smooth = (a: number, b: number, t: number) => {
  const x = Math.min(1, Math.max(0, (t - a) / (b - a)));
  return x * x * (3 - 2 * x);
};

/**
 * Draws one frame of the glitch from scene canvas `a` to `b` onto a W×H canvas.
 * `p` runs 0→1; `scale` is device px per CSS px. Returns the intensity (0..1, peaks
 * mid-way) so the caller can glitch the UI in step.
 */
export function drawGlitch(
  ctx: CanvasRenderingContext2D,
  p: number,
  a: HTMLCanvasElement,
  b: HTMLCanvasElement,
  W: number,
  H: number,
  scale: number,
) {
  const k = Math.sin(Math.PI * p);
  const toward = smooth(0.2, 0.8, p);
  ctx.imageSmoothingEnabled = false;

  // Bands: each one shows old or new (more of the new as p grows), some shoved sideways.
  for (let y = 0; y < H; ) {
    const bh = Math.min(H - y, Math.ceil((3 + Math.random() * Math.random() * 90) * scale));
    const src = Math.random() < toward ? b : a;
    const sy = src.height / H;
    const dx = Math.random() < 0.08 + 0.4 * k ? (Math.random() - 0.5) * k * 220 * scale : 0;
    for (const ox of [dx, dx - W, dx + W]) {
      ctx.drawImage(src, 0, y * sy, src.width, bh * sy, ox, y, W, bh);
    }
    y += bh;
  }

  // Chromatic noise streaks.
  ctx.globalCompositeOperation = "screen";
  for (let i = 0; i < k * 18; i++) {
    ctx.fillStyle = Math.random() < 0.5 ? "rgba(255,0,77,0.55)" : "rgba(0,229,255,0.45)";
    ctx.fillRect(
      Math.random() * W,
      Math.random() * H,
      (40 + Math.random() * 360) * scale,
      (2 + Math.random() * 10) * scale,
    );
  }

  // Occasional full-frame invert.
  if (Math.random() < k * 0.07) {
    ctx.globalCompositeOperation = "difference";
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, W, H);
  }
  ctx.globalCompositeOperation = "source-over";
  return k;
}
