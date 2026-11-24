"use client";

import { useEffect, useRef } from "react";
import { PALETTE } from "@/lib/palette";
import { FORMATIONS, setDisplayFamily, type Draw } from "./shapes";

/**
 * The Eleven particle field. Two species share one canvas:
 *  - logic: squares that step across a grid like a plotter, no easing
 *  - creative: dots that ride a curl-noise flow with a soft pull home
 * Every element with [data-formation] is a scroll stop. As you scroll from one
 * to the next, both species move to the next formation; on the way, one side
 * leads and the other follows (alternating by section).
 * [data-side] says where the particles sit: "L", "R" or "C" (centre).
 */

type Rect = { x: number; y: number; w: number; h: number };
type LState = { cx: Int16Array; cy: Int16Array };
type Stop = { el: HTMLElement; key: string; side: string; L: LState; R: Float32Array };

const clamp = (v: number, a = 0, b = 1) => (v < a ? a : v > b ? b : v);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

function hash(x: number, y: number) {
  let h = (Math.imul(x, 374761393) + Math.imul(y, 668265263)) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}
function vnoise(x: number, y: number) {
  const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
  const a = hash(xi, yi), b = hash(xi + 1, yi), c = hash(xi, yi + 1), d = hash(xi + 1, yi + 1);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}

type Cloud = { xs: number[]; ys: number[]; ex: number[]; ey: number[]; ix: number[]; iy: number[] };

function sample(off: HTMLCanvasElement, rect: Rect, draw: Draw): Cloud {
  const sc = 0.5;
  const w = Math.max(2, Math.round(rect.w * sc)), h = Math.max(2, Math.round(rect.h * sc));
  off.width = w;
  off.height = h;
  const c = off.getContext("2d", { willReadFrequently: true })!;
  c.setTransform(1, 0, 0, 1, 0, 0);
  c.globalCompositeOperation = "source-over";
  c.clearRect(0, 0, w, h);
  c.save();
  draw(c, w, h);
  c.restore();
  c.globalCompositeOperation = "source-over";
  const d = c.getImageData(0, 0, w, h).data;
  const out: Cloud = { xs: [], ys: [], ex: [], ey: [], ix: [], iy: [] };
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      if (d[i + 3] <= 128) continue;
      const X = rect.x + (x + 0.5) / sc, Y = rect.y + (y + 0.5) / sc;
      out.xs.push(X);
      out.ys.push(Y);
      const edge =
        x === 0 || y === 0 || x === w - 1 || y === h - 1 ||
        d[i - 1] <= 128 || d[i + 7] <= 128 || d[i - w * 4 + 3] <= 128 || d[i + w * 4 + 3] <= 128;
      if (edge) { out.ex.push(X); out.ey.push(Y); } else { out.ix.push(X); out.iy.push(Y); }
    }
  return out;
}

function pickR(n: number, xs: number[], ys: number[], rect: Rect, jitter = 6) {
  const pos = new Float32Array(n * 2);
  const cnt = xs.length;
  if (!cnt) {
    for (let i = 0; i < n; i++) { pos[2 * i] = rect.x + rect.w / 2; pos[2 * i + 1] = rect.y + rect.h / 2; }
    return pos;
  }
  const idx = new Uint32Array(cnt);
  for (let i = 0; i < cnt; i++) idx[i] = i;
  const m = Math.min(n, cnt);
  for (let i = 0; i < m; i++) {
    const j = i + ((Math.random() * (cnt - i)) | 0);
    const t = idx[i]; idx[i] = idx[j]; idx[j] = t;
  }
  for (let i = 0; i < n; i++) {
    const k = idx[i % m];
    pos[2 * i] = xs[k] + (Math.random() - 0.5) * jitter;
    pos[2 * i + 1] = ys[k] + (Math.random() - 0.5) * jitter;
  }
  return pos;
}

function pickL(n: number, xs: number[], ys: number[], G: number, rect: Rect): LState {
  const seen = new Set<number>(), cells: number[] = [];
  for (let i = 0; i < xs.length; i++) {
    const cx = Math.round(xs[i] / G), cy = Math.round(ys[i] / G), k = cx * 8192 + cy;
    if (!seen.has(k)) { seen.add(k); cells.push(cx, cy); }
  }
  const count = cells.length / 2;
  const order = Array.from({ length: count }, (_, i) => i).sort(() => Math.random() - 0.5);
  const cx = new Int16Array(n), cy = new Int16Array(n);
  for (let i = 0; i < n; i++) {
    if (!count) { cx[i] = Math.round((rect.x + rect.w / 2) / G); cy[i] = Math.round((rect.y + rect.h / 2) / G); continue; }
    const j = order[i % count];
    cx[i] = cells[2 * j];
    cy[i] = cells[2 * j + 1];
  }
  return { cx, cy };
}

export default function ElevenField({ fontFamily }: { fontFamily: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current!;
    const ctx = cv.getContext("2d")!;
    const off = document.createElement("canvas");
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mouse = { x: -9999, y: -9999 };
    let W = 0, H = 0, DPR = 1, mobile = false, G = 8, NL = 0, NR = 0;
    let stops: Stop[] = [], centers: number[] = [];
    let lx = new Int16Array(0), ly = new Int16Array(0), nextT = new Float32Array(0);
    let rx = new Float32Array(0), ry = new Float32Array(0), conv = new Float32Array(0);
    let flow = 0.15, lastY = scrollY, vel = 0, seamX = 0, seamRect: Rect | null = null, lastSide = 0;
    let waves: { x: number; y: number; t0: number }[] = [];
    let raf = 0, ready = false, alive = true;

    const top = () => (mobile ? 72 : 76);
    function region(side: string): Rect {
      if (mobile) return { x: 16, y: top(), w: W - 32, h: Math.max(160, H * 0.44 - top()) };
      const y = top(), h = H - y - 40;
      if (side === "R") return { x: W * 0.47, y, w: W * 0.53 - 40, h };
      if (side === "L") return { x: 40, y, w: W * 0.53 - 40, h };
      return { x: 40, y, w: W - 80, h };
    }

    function measure() {
      centers = stops.map(({ el }) => {
        const b = el.getBoundingClientRect();
        return b.top + scrollY + b.height / 2;
      });
    }
    function progress() {
      const mid = scrollY + H / 2;
      if (!centers.length || mid <= centers[0]) return 0;
      for (let i = 0; i < centers.length - 1; i++)
        if (mid < centers[i + 1]) return i + (mid - centers[i]) / (centers[i + 1] - centers[i]);
      return centers.length - 1;
    }

    function build() {
      W = innerWidth; H = innerHeight; mobile = W < 760;
      DPR = Math.min(devicePixelRatio || 1, mobile ? 1.5 : 2);
      cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      G = mobile ? 6 : 8;
      const n = mobile ? 1100 : 2400;
      const fresh = n !== NL;
      NL = NR = n;
      if (fresh) {
        lx = new Int16Array(NL); ly = new Int16Array(NL); nextT = new Float32Array(NL);
        rx = new Float32Array(NR); ry = new Float32Array(NR); conv = new Float32Array(NL + NR);
        for (let i = 0; i < NL; i++) { lx[i] = (Math.random() * W) / G; ly[i] = (Math.random() * H) / G; nextT[i] = Math.random() * 80; }
        for (let i = 0; i < NR; i++) { rx[i] = Math.random() * W; ry[i] = Math.random() * H; }
      }
      const els = [...document.querySelectorAll<HTMLElement>("[data-formation]")];
      stops = els.map((el) => {
        const key = el.dataset.formation!, side = el.dataset.side || "R";
        const f = FORMATIONS[key] ?? FORMATIONS["eleven-mixed"];
        const r = region(side);
        let L: LState, R: Float32Array;
        if (f.layers) {
          const a = sample(off, r, f.layers.logic), b = sample(off, r, f.layers.creative);
          L = pickL(NL, a.xs, a.ys, G, r);
          R = pickR(NR, b.xs, b.ys, r, 3);
        } else {
          const s = sample(off, r, f.draw!);
          if (f.split === "halves") {
            const mid = r.x + r.w / 2, Lx: number[] = [], Ly: number[] = [], Rx: number[] = [], Ry: number[] = [];
            s.xs.forEach((x, i) => (x < mid ? (Lx.push(x), Ly.push(s.ys[i])) : (Rx.push(x), Ry.push(s.ys[i]))));
            L = pickL(NL, Lx, Ly, G, r);
            R = pickR(NR, Rx, Ry, r);
            if (key === "eleven") { seamX = mid; seamRect = r; }
          } else {
            const useEdges = s.ex.length > 40;
            L = pickL(NL, useEdges ? s.ex : s.xs, useEdges ? s.ey : s.ys, G, r);
            R = pickR(NR, s.ix.length > 40 ? s.ix : s.xs, s.ix.length > 40 ? s.iy : s.ys, r);
          }
        }
        return { el, key, side, L, R };
      });
      measure();
      ready = stops.length > 0;
    }

    function step(now: number) {
      vel = scrollY - lastY; lastY = scrollY;
      const s = progress();
      const a = Math.min(stops.length - 1, Math.floor(s)), b = Math.min(stops.length - 1, a + 1), t = s - a;
      const lead = b % 2 === 1 ? "L" : "R";
      const tL = lead === "L" ? clamp(t / 0.6) : clamp((t - 0.4) / 0.6);
      const tR = lead === "R" ? clamp(t / 0.6) : clamp((t - 0.4) / 0.6);
      const Lt = tL < 0.5 ? stops[a].L : stops[b].L;
      const mOn = !reduced && mouse.x > -1000;

      for (let i = 0; i < NL; i++) {
        if (reduced) { lx[i] = Lt.cx[i]; ly[i] = Lt.cy[i]; continue; }
        if (now < nextT[i]) continue;
        nextT[i] = now + 70 + Math.random() * 30;
        let cx = lx[i], cy = ly[i];
        const dxm = cx * G - mouse.x, dym = cy * G - mouse.y;
        if (mOn && dxm * dxm + dym * dym < 4900) {
          if (Math.abs(dxm) > Math.abs(dym)) cx += Math.sign(dxm) || 1;
          else cy += Math.sign(dym) || 1;
        } else {
          const dx = Lt.cx[i] - cx, dy = Lt.cy[i] - cy;
          if (dx) cx += Math.sign(dx) * Math.max(1, Math.round(Math.abs(dx) * 0.3));
          else if (dy) cy += Math.sign(dy) * Math.max(1, Math.round(Math.abs(dy) * 0.3));
        }
        lx[i] = cx; ly[i] = cy;
      }

      const wT = 0.15 + Math.min(0.85, Math.abs(vel) * 0.04);
      flow += (wT - flow) * (wT > flow ? 0.25 : 0.03);
      const A = stops[a].R, B = stops[b].R, e = ease(tR), tm = now * 0.00006, e2 = 0.01;
      for (let i = 0; i < NR; i++) {
        const tx = lerp(A[2 * i], B[2 * i], e), ty = lerp(A[2 * i + 1], B[2 * i + 1], e);
        if (reduced) { rx[i] = tx; ry[i] = ty; continue; }
        const nx = rx[i] * 0.0028 + tm, ny = ry[i] * 0.0028;
        const cxv = (vnoise(nx, ny + e2) - vnoise(nx, ny - e2)) / (2 * e2);
        const cyv = -(vnoise(nx + e2, ny) - vnoise(nx - e2, ny)) / (2 * e2);
        let vx = cxv * flow * 2.4 + (tx - rx[i]) * 0.06, vy = cyv * flow * 2.4 + (ty - ry[i]) * 0.06;
        if (mOn) {
          const dx = rx[i] - mouse.x, dy = ry[i] - mouse.y, d2 = dx * dx + dy * dy;
          if (d2 < 40000) { const q = 160 / (d2 + 2000); vx += -dy * q; vy += dx * q; }
        }
        rx[i] += vx; ry[i] += vy;
      }

      // The seam: sweeping across the middle of the hero 11 converts particles in a wave.
      const seam = stops[0]?.key === "eleven" && s < 0.6 ? 1 - s / 0.6 : 0;
      if (seam > 0 && mOn && seamRect && mouse.y > seamRect.y && mouse.y < seamRect.y + seamRect.h) {
        const side = mouse.x < seamX ? -1 : 1;
        if (lastSide && side !== lastSide && waves.length < 4) waves.push({ x: seamX, y: mouse.y, t0: now });
        lastSide = side;
      } else lastSide = 0;
      waves = waves.filter((w) => now - w.t0 < 1100);
      for (const w of waves) {
        const rad = (now - w.t0) * 0.55, inner = rad - 34, r2 = rad * rad, i2 = inner * inner;
        for (let i = 0; i < NL; i++) {
          const dx = lx[i] * G - w.x, dy = ly[i] * G - w.y, d2 = dx * dx + dy * dy;
          if (d2 < r2 && d2 > i2) conv[i] = now + 1600;
        }
        for (let i = 0; i < NR; i++) {
          const dx = rx[i] - w.x, dy = ry[i] - w.y, d2 = dx * dx + dy * dy;
          if (d2 < r2 && d2 > i2) conv[NL + i] = now + 1600;
        }
      }
      return seam;
    }

    function draw(now: number, seam: number) {
      ctx.fillStyle = PALETTE.bg;
      ctx.fillRect(0, 0, W, H);
      if (seam > 0 && seamRect) {
        ctx.fillStyle = `rgba(${PALETTE.seamRgb},${0.2 * seam})`;
        ctx.fillRect(seamX, seamRect.y, 1, seamRect.h);
      }
      const half = G / 2 - 1, size = G - 2;
      ctx.fillStyle = PALETTE.creative;
      ctx.beginPath();
      for (let i = 0; i < NR; i++)
        if (conv[NL + i] < now) { ctx.moveTo(rx[i] + 2, ry[i]); ctx.arc(rx[i], ry[i], 2, 0, 6.2832); }
      for (let i = 0; i < NL; i++)
        if (conv[i] >= now) { const x = lx[i] * G, y = ly[i] * G; ctx.moveTo(x + 3, y); ctx.arc(x, y, 3, 0, 6.2832); }
      ctx.fill();
      ctx.fillStyle = PALETTE.logic;
      for (let i = 0; i < NL; i++) if (conv[i] < now) ctx.fillRect(lx[i] * G - half, ly[i] * G - half, size, size);
      for (let i = 0; i < NR; i++) if (conv[NL + i] >= now) ctx.fillRect(rx[i] - 3, ry[i] - 3, 6, 6);
    }

    function frame(now: number) {
      if (ready) draw(now, step(now));
      raf = requestAnimationFrame(frame);
    }

    let resizeT = 0;
    const onResize = () => { clearTimeout(resizeT); resizeT = window.setTimeout(build, 150); };
    const onMove = (e: PointerEvent) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    const onLeave = () => { mouse.x = mouse.y = -9999; };
    // Layout shifts (images loading, fonts) move the scroll stops.
    const ro = new ResizeObserver(() => measure());
    ro.observe(document.body);

    addEventListener("resize", onResize);
    addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    addEventListener("blur", onLeave);

    setDisplayFamily(fontFamily);
    const fontsReady = Promise.race([
      document.fonts.load(`800 100px ${fontFamily}`),
      new Promise((r) => setTimeout(r, 2500)),
    ]).catch(() => {});
    fontsReady.then(() => {
      if (!alive) return;
      build();
      raf = requestAnimationFrame(frame);
    });

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      removeEventListener("resize", onResize);
      removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      removeEventListener("blur", onLeave);
    };
  }, [fontFamily]);

  return <canvas ref={ref} className="work-field" aria-hidden="true" />;
}
