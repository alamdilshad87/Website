import { useEffect, useRef } from 'react';
import { asset } from '../data/site';
import { useReduced } from '../lib/hooks';

export type RenderMode = 'code' | 'halftone';

interface P { hx: number; hy: number; x: number; y: number; vx: number; vy: number; lv: number; sx: number; sy: number }

const GLYPHS = ' .:-=+*#%@';
const LEVELS = GLYPHS.length - 1;

const hex = (h: string) => { const n = parseInt(h.slice(1), 16); return [n >> 16, (n >> 8) & 255, n & 255]; };
const mix = (a: number[], b: number[], t: number) => `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * t)).join(',')})`;

/**
 * The hero portrait, rebuilt from particles sampled out of the photo.
 * "code" draws each sample as an ASCII glyph, "halftone" as a print dot.
 * Particles flee the pointer, scatter on click or mode change, spring home,
 * and drift apart as the hero scrolls away (scrollRef is 0..1).
 */
export function PortraitField({ mode, burst, scrollRef }: { mode: RenderMode; burst: number; scrollRef: React.RefObject<number> }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduced = useReduced();
  const modeRef = useRef(mode);
  const api = useRef<{ explode: (x?: number, y?: number, f?: number) => void } | null>(null);

  useEffect(() => { if (modeRef.current !== mode) { modeRef.current = mode; api.current?.explode(undefined, undefined, 26); } }, [mode]);
  useEffect(() => { if (burst) api.current?.explode(undefined, undefined, 60); }, [burst]);

  useEffect(() => {
    const cv = ref.current;
    const ctx = cv?.getContext('2d');
    if (!cv || !ctx) return;
    const host = cv.parentElement!;
    let size = 0, cell = 0, dpr = 1, cols = 0, raf = 0, visible = true, alive = true;
    let pts: P[] = [];
    let px = -1e4, py = -1e4;
    const atlas = document.createElement('canvas');
    const actx = atlas.getContext('2d')!;
    const img = new Image();
    img.src = asset('design/dilshad-720.webp');

    // sprite atlas: rows = [code base, code hot, halftone base, halftone hot], columns = levels 1..9
    const buildAtlas = () => {
      const s = Math.ceil(cell * dpr);
      atlas.width = s * LEVELS; atlas.height = s * 4;
      actx.clearRect(0, 0, atlas.width, atlas.height);
      const light = document.documentElement.dataset.theme === 'light'
        || (!document.documentElement.dataset.theme && matchMedia('(prefers-color-scheme: light)').matches);
      const lo = hex(light ? '#9AA8FF' : '#4E5BB8'), hi = hex(light ? '#0A0B12' : '#F2EFE9');
      const orange = hex('#FF5A1F'), peach = hex('#FFB08A');
      actx.textAlign = 'center'; actx.textBaseline = 'middle';
      actx.font = `600 ${s * 1.05}px "DM Mono", ui-monospace, monospace`;
      for (let l = 1; l <= LEVELS; l++) {
        const t = l / LEVELS, x = (l - 1) * s + s / 2;
        actx.fillStyle = mix(lo, hi, t); actx.fillText(GLYPHS[l], x, s / 2);
        actx.fillStyle = mix(orange, peach, t); actx.fillText(GLYPHS[l], x, s * 1.5);
        const r = (s / 2) * Math.sqrt(t) * 0.98;
        actx.fillStyle = mix(orange, light ? hex('#7A2400') : peach, t * 0.9);
        actx.beginPath(); actx.arc(x, s * 2.5, r, 0, 6.283); actx.fill();
        actx.fillStyle = mix(hi, lo, 0.15);
        actx.beginPath(); actx.arc(x, s * 3.5, r, 0, 6.283); actx.fill();
      }
    };

    const sample = () => {
      const off = document.createElement('canvas');
      off.width = cols; off.height = cols;
      const o = off.getContext('2d', { willReadFrequently: true })!;
      o.drawImage(img, 0, 0, cols, cols);
      const d = o.getImageData(0, 0, cols, cols).data;
      const next: P[] = [];
      for (let j = 0; j < cols; j++) {
        for (let i = 0; i < cols; i++) {
          const k = (j * cols + i) * 4;
          let lum = (0.2126 * d[k] + 0.7152 * d[k + 1] + 0.0722 * d[k + 2]) / 255;
          lum = Math.min(1, Math.max(0, (lum - 0.12) / 0.8));
          // soft circular mask so the square photo melts into the page
          const dx = i / cols - 0.5, dy = j / cols - 0.47, r = Math.hypot(dx, dy * 0.92);
          const mask = Math.min(1, Math.max(0, (0.5 - r) / 0.14));
          const lv = Math.round(lum * mask * LEVELS);
          if (lv < 1) continue;
          const hx = i * cell + cell / 2, hy = j * cell + cell / 2;
          const a = Math.random() * 6.283, far = size * (0.6 + Math.random() * 0.8);
          next.push({ hx, hy, lv, x: reduced ? hx : size / 2 + Math.cos(a) * far, y: reduced ? hy : size / 2 + Math.sin(a) * far, vx: 0, vy: 0,
            sx: Math.cos(a) * (0.5 + Math.random()), sy: Math.sin(a) * (0.5 + Math.random()) });
        }
      }
      pts = next;
    };

    const layout = () => {
      const r = host.getBoundingClientRect();
      size = Math.min(r.width, r.height);
      if (!size) return;
      dpr = Math.min(2, window.devicePixelRatio || 1);
      cols = size < 420 ? 62 : size < 640 ? 76 : 88;
      cell = size / cols;
      cv.width = Math.round(size * dpr); cv.height = Math.round(size * dpr);
      cv.style.width = `${size}px`; cv.style.height = `${size}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      buildAtlas();
      if (img.complete && img.naturalWidth) { sample(); if (reduced) draw(); }
    };

    const draw = () => {
      ctx.clearRect(0, 0, cv.width, cv.height);
      const s = Math.ceil(cell * dpr), row = modeRef.current === 'code' ? 0 : 2;
      for (const p of pts) {
        const moved = Math.abs(p.x - p.hx) + Math.abs(p.y - p.hy) > cell * 1.2;
        ctx.drawImage(atlas, (p.lv - 1) * s, (row + (moved ? 1 : 0)) * s, s, s, p.x * dpr - s / 2, p.y * dpr - s / 2, s, s);
      }
    };

    const step = (t: number) => {
      const R = size * 0.16, R2 = R * R, sc = (scrollRef.current ?? 0);
      const spread = sc * sc * size * 0.9;
      for (const p of pts) {
        const tx = p.hx + p.sx * spread + Math.sin(t * 0.0012 + p.hy * 0.05) * 0.6;
        const ty = p.hy + p.sy * spread + Math.cos(t * 0.001 + p.hx * 0.05) * 0.6;
        const dx = p.x - px, dy = p.y - py, d2 = dx * dx + dy * dy;
        if (d2 < R2) {
          const d = Math.sqrt(d2) || 1, f = (1 - d / R) * 3.2;
          p.vx += (dx / d) * f; p.vy += (dy / d) * f;
        }
        p.vx += (tx - p.x) * 0.045; p.vy += (ty - p.y) * 0.045;
        p.vx *= 0.84; p.vy *= 0.84;
        p.x += p.vx; p.y += p.vy;
      }
    };

    const loop = (t: number) => {
      if (!alive) return;
      raf = requestAnimationFrame(loop);
      if (!visible || !pts.length) return;
      step(t); draw();
    };

    api.current = {
      explode: (x = size / 2, y = size / 2, f = 40) => {
        if (reduced) { draw(); return; }
        for (const p of pts) {
          const dx = p.x - x, dy = p.y - y, d = Math.hypot(dx, dy) || 1;
          const k = f * (0.4 + Math.random() * 0.8) * Math.exp(-d / (size * 0.45));
          p.vx += (dx / d) * k; p.vy += (dy / d) * k;
        }
      },
    };

    const pos = (e: PointerEvent) => { const r = cv.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
    const move = (e: PointerEvent) => { [px, py] = pos(e); };
    const leave = () => { px = -1e4; py = -1e4; };
    const down = (e: PointerEvent) => { const [x, y] = pos(e); api.current?.explode(x, y, 70); };

    img.onload = () => { layout(); };
    const ro = new ResizeObserver(layout); ro.observe(host);
    const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; }); io.observe(host);
    const mo = new MutationObserver(() => { buildAtlas(); if (reduced) draw(); });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    document.fonts?.ready.then(() => { buildAtlas(); if (reduced) draw(); });
    if (!reduced) {
      cv.addEventListener('pointermove', move);
      cv.addEventListener('pointerleave', leave);
      cv.addEventListener('pointerdown', down);
      raf = requestAnimationFrame(loop);
    }
    return () => {
      alive = false; cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); mo.disconnect();
      cv.removeEventListener('pointermove', move); cv.removeEventListener('pointerleave', leave); cv.removeEventListener('pointerdown', down);
      api.current = null;
    };
  }, [reduced, scrollRef]);

  // redraw once on mode change when motion is reduced
  useEffect(() => { if (reduced) api.current?.explode(); }, [mode, reduced]);

  return (
    <canvas ref={ref} className="pfield" role="img" data-cursor="click"
      aria-label="Portrait of Md Dilshad Alam drawn from animated characters" />
  );
}
