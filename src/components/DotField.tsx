import { useEffect, useRef } from 'react';
import { useReduced } from '../lib/hooks';

/**
 * Canvas dot grid behind the hero. Dots near the pointer push outward, grow and warm to orange;
 * a click sends a ripple across the grid. With reduced motion it draws once and stays still.
 */
export function DotField() {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduced = useReduced();

  useEffect(() => {
    const cv = ref.current;
    const ctx = cv?.getContext('2d');
    if (!cv || !ctx) return;
    const host = cv.parentElement!;
    const GAP = 26;
    let W = 0, H = 0, dpr = 1, raf = 0, visible = true;
    let px = -1e4, py = -1e4;
    const ripples: { x: number; y: number; t: number }[] = [];
    let fg = '242,239,233';

    const readColor = () => {
      const c = getComputedStyle(host).color; // rgb(r, g, b)
      const m = c.match(/\d+/g);
      if (m) fg = m.slice(0, 3).join(',');
    };
    const size = () => {
      const r = host.getBoundingClientRect();
      dpr = Math.min(2, window.devicePixelRatio || 1);
      W = r.width; H = r.height;
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      readColor();
      if (reduced) draw(0);
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, W, H);
      const R = 170;
      for (let y = GAP / 2; y < H; y += GAP) {
        for (let x = GAP / 2; x < W; x += GAP) {
          let dx = 0, dy = 0, k = 0;
          const ddx = x - px, ddy = y - py, d = Math.hypot(ddx, ddy);
          if (d < R) {
            k = 1 - d / R;
            const push = k * k * 14;
            dx = (ddx / (d || 1)) * push; dy = (ddy / (d || 1)) * push;
          }
          for (const rp of ripples) {
            const age = (t - rp.t) / 1000, ring = age * 520, rd = Math.hypot(x - rp.x, y - rp.y);
            const w = Math.max(0, 1 - Math.abs(rd - ring) / 50) * Math.max(0, 1 - age / 1.6);
            k = Math.max(k, w);
          }
          // a slow diagonal shimmer so the grid is alive without a pointer
          const idle = reduced ? 0 : Math.max(0, Math.sin(t * 0.0009 - (x + y) * 0.006)) ** 12 * 0.5;
          const kk = Math.max(k, idle);
          ctx.fillStyle = kk > 0.05 ? `rgba(255,90,31,${0.18 + kk * 0.8})` : `rgba(${fg},0.16)`;
          ctx.beginPath();
          ctx.arc(x + dx, y + dy, 1 + kk * 2.2, 0, 6.283);
          ctx.fill();
        }
      }
      while (ripples.length && t - ripples[0].t > 1600) ripples.shift();
    };

    const loop = (t: number) => { raf = requestAnimationFrame(loop); if (visible) draw(t); };
    const move = (e: PointerEvent) => { const r = cv.getBoundingClientRect(); px = e.clientX - r.left; py = e.clientY - r.top; };
    const leave = () => { px = -1e4; py = -1e4; };
    const down = (e: PointerEvent) => { const r = cv.getBoundingClientRect(); ripples.push({ x: e.clientX - r.left, y: e.clientY - r.top, t: performance.now() }); };

    size();
    const ro = new ResizeObserver(size); ro.observe(host);
    const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; }); io.observe(host);
    const mo = new MutationObserver(readColor); mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    if (!reduced) {
      host.addEventListener('pointermove', move);
      host.addEventListener('pointerleave', leave);
      host.addEventListener('pointerdown', down);
      raf = requestAnimationFrame(loop);
    }
    return () => {
      cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); mo.disconnect();
      host.removeEventListener('pointermove', move);
      host.removeEventListener('pointerleave', leave);
      host.removeEventListener('pointerdown', down);
    };
  }, [reduced]);

  return <canvas ref={ref} className="dotfield" aria-hidden="true" />;
}
