import { motion, useMotionValueEvent, useScroll, useTransform } from 'motion/react';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { CAT_LABEL, CHAPTERS, pad2 } from '../data/chapters';
import { asset, SITE } from '../data/site';
import { useMedia } from '../lib/hooks';
import { Icon } from './icons';
import { Pic } from './ui';

/** One slide per image; multi-image chapters become consecutive slides. */
const SLIDES = CHAPTERS.flatMap((c) => c.img.map((img, k) => ({ c, img, k, key: `${c.n}-${k}` })));
const N = SLIDES.length;
/** Vertical scroll per pixel of sideways travel. Below 1 the strip moves faster than the page. */
const RATE = 0.6;

/**
 * Desktop: the section pins and vertical scrolling drives the strip sideways.
 * Chapter chips, arrows and the keyboard jump the page scroll to a slide, so scroll
 * position and the visible slide never disagree. Phones get a native swipe strip.
 * Any slide opens a full-screen viewer.
 */
export function DesignReel() {
  const pinMode = useMedia('(min-width: 860px)', true);
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const [dist, setDist] = useState(0);
  const [cur, setCur] = useState(0);
  const [lb, setLb] = useState<number | null>(null);
  const dlg = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);

  const { scrollYProgress } = useScroll({ target: pinRef, offset: ['start start', 'end end'] });
  const x = useTransform(scrollYProgress, (p) => -p * dist);

  // horizontal distance to travel = track width minus the viewport
  useLayoutEffect(() => {
    if (!pinMode) return;
    const t = trackRef.current;
    if (!t) return;
    const measure = () => setDist(Math.max(0, t.scrollWidth - window.innerWidth));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(t);
    window.addEventListener('resize', measure);
    return () => { ro.disconnect(); window.removeEventListener('resize', measure); };
  }, [pinMode]);

  const slideOffset = useCallback((i: number) => {
    const el = trackRef.current?.querySelectorAll<HTMLElement>('.hslide')[i];
    if (!el) return 0;
    const centre = el.offsetLeft + el.offsetWidth / 2 - window.innerWidth / 2;
    return Math.min(dist, Math.max(0, centre));
  }, [dist]);

  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    if (!pinMode) return;
    const px = p * dist;
    let best = 0, bd = Infinity;
    for (let i = 0; i < N; i++) { const d = Math.abs(slideOffset(i) - px); if (d < bd) { bd = d; best = i; } }
    setCur(best);
  });

  const jump = useCallback((i: number) => {
    const k = Math.max(0, Math.min(N - 1, i));
    if (pinMode) {
      const pin = pinRef.current;
      if (!pin) return;
      const top = pin.getBoundingClientRect().top + window.scrollY;
      const y = top + slideOffset(k) * RATE;
      const lenis = (window as unknown as { __lenis?: { scrollTo: (t: number, o?: object) => void } }).__lenis;
      if (lenis) lenis.scrollTo(y, { duration: 1.1 }); else window.scrollTo({ top: y, behavior: 'smooth' });
    } else {
      const el = stripRef.current?.querySelectorAll<HTMLElement>('.hslide')[k];
      el?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [pinMode, slideOffset]);

  // Desktop and tablets: let sideways gestures move the reel too. A trackpad swipe,
  // Shift + wheel, or dragging the slides is turned into page scroll, which is what
  // drives the strip. Lenis ignores sideways wheel input, so without this they did nothing.
  useEffect(() => {
    if (!pinMode) return;
    const el = stickyRef.current;
    if (!el) return;
    type L = { scrollTo: (t: number, o?: object) => void; targetScroll: number; limit: number };
    // Lenis updates targetScroll a frame late, so rapid events keep their own running goal
    let goal = 0, goalAt = 0;
    const nudge = (dy: number, immediate = false) => {
      const l = (window as unknown as { __lenis?: L }).__lenis;
      if (!l) { window.scrollBy(0, dy); return; }
      const now = performance.now();
      const base = now - goalAt < 250 ? goal : l.targetScroll;
      goal = Math.max(0, Math.min(l.limit, base + dy));
      goalAt = now;
      l.scrollTo(goal, { immediate, force: true });
    };
    const onWheel = (e: WheelEvent) => {
      const dx = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.shiftKey ? e.deltaY : 0;
      if (!dx) return;
      e.preventDefault();
      e.stopPropagation();
      nudge(dx * RATE);
    };
    let sx = 0, sy = 0, lx = 0, down = false, drag = false, dragged = false;
    const onDown = (e: PointerEvent) => {
      if (e.button !== 0 || (e.target as Element).closest('.hhud')) return;
      down = true; drag = false; dragged = false;
      sx = lx = e.clientX; sy = e.clientY;
    };
    const onMove = (e: PointerEvent) => {
      if (!down) return;
      if (!drag) {
        const ax = Math.abs(e.clientX - sx), ay = Math.abs(e.clientY - sy);
        if (ax > 8 && ax > ay) {
          drag = dragged = true;
          el.classList.add('dragging');
          try { el.setPointerCapture(e.pointerId); } catch { /* pointer already gone */ }
        } else if (ay > 8) { down = false; return; }
      }
      if (drag) { nudge(-(e.clientX - lx) * RATE, true); lx = e.clientX; }
    };
    const onUp = () => { down = false; drag = false; el.classList.remove('dragging'); };
    // a drag should not also count as a click that opens the full-screen viewer
    const onClick = (e: MouseEvent) => { if (dragged) { e.preventDefault(); e.stopPropagation(); dragged = false; } };
    const noGhost = (e: DragEvent) => e.preventDefault();
    el.addEventListener('wheel', onWheel, { passive: false });
    el.addEventListener('pointerdown', onDown);
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerup', onUp);
    el.addEventListener('pointercancel', onUp);
    el.addEventListener('click', onClick, true);
    el.addEventListener('dragstart', noGhost);
    return () => {
      el.removeEventListener('wheel', onWheel);
      el.removeEventListener('pointerdown', onDown);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerup', onUp);
      el.removeEventListener('pointercancel', onUp);
      el.removeEventListener('click', onClick, true);
      el.removeEventListener('dragstart', noGhost);
    };
  }, [pinMode]);

  // phone strip: track which slide is centred
  useEffect(() => {
    if (pinMode) return;
    const s = stripRef.current;
    if (!s) return;
    const io = new IntersectionObserver((en) => en.forEach((e) => { if (e.isIntersecting) setCur(Number((e.target as HTMLElement).dataset.i)); }), { root: s, threshold: 0.6 });
    s.querySelectorAll('.hslide').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pinMode]);

  useEffect(() => {
    const d = dlg.current;
    if (!d) return;
    if (lb !== null && !d.open) d.showModal();
    if (lb === null && d.open) d.close();
  }, [lb]);

  const openLb = (i: number, el: HTMLElement) => { opener.current = el; setLb(i); };
  const closeLb = () => { setLb(null); opener.current?.focus(); };
  const lbStep = (d: number) => setLb((i) => (i === null ? i : (i + d + N) % N));

  const s = SLIDES[cur];
  const slides = SLIDES.map((sl, i) => (
    <figure key={sl.key} className="hslide" data-i={i}>
      <button type="button" className="hs-img" onClick={(e) => openLb(i, e.currentTarget)} data-cursor="open"
        aria-label={`Open ${sl.c.t}${sl.c.img.length > 1 ? `, part ${sl.k + 1}` : ''} full screen`}>
        <Pic base={`design/${sl.img}`} widths={[800, 1500]} sizes="(max-width: 860px) 86vw, 70vw" alt="" />
      </button>
      <figcaption>
        <span className="no">N°{pad2(sl.c.n)}</span>
        <b>{sl.c.t}{sl.c.img.length > 1 ? ` · ${sl.k + 1}/${sl.c.img.length}` : ''}</b>
        <span>{CAT_LABEL[sl.c.cat]} · {sl.c.yr}</span>
      </figcaption>
      {sl.c.photo && sl.k === 0 && (
        <span className="hs-photo">
          <Pic base={sl.c.photo.base} sizes="150px" alt={sl.c.photo.caption} />
          <small>{sl.c.photo.caption}</small>
        </span>
      )}
    </figure>
  ));
  const endCard = (
    <div className="hslide hs-end">
      <a href={SITE.behance} target="_blank" rel="noopener noreferrer" data-cursor="behance">
        <span>more on</span><b>Behance ↗</b>
      </a>
    </div>
  );

  const hud = (
    <div className="wrap hhud">
      <div className="hh-info" aria-live="polite">
        <p className="mk">N°{pad2(s.c.n)} · {CAT_LABEL[s.c.cat]} · {s.c.sub}</p>
        <p className="d">{s.c.d}</p>
      </div>
      <div className="hh-ctl">
        <span className="ct"><b>{pad2(cur + 1)}</b> / {pad2(N)}</span>
        <button type="button" onClick={() => jump(cur - 1)} aria-label="Previous slide" disabled={cur === 0}>{Icon.prev}</button>
        <button type="button" onClick={() => jump(cur + 1)} aria-label="Next slide" disabled={cur === N - 1}>{Icon.next}</button>
      </div>
      <div className="hh-bar" aria-hidden="true"><i style={{ width: `${((cur + 1) / N) * 100}%` }} /></div>
      <div className="hh-jump" role="group" aria-label="Jump to chapter">
        {CHAPTERS.map((c) => {
          const first = SLIDES.findIndex((x) => x.c.n === c.n);
          return (
            <button key={c.n} type="button" aria-current={s.c.n === c.n} onClick={() => jump(first)} title={c.t}>
              {pad2(c.n)}<span className="sr-only"> {c.t}</span>
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <section id="design" className="w-design reel-sec"
      onKeyDown={(e) => { if (lb !== null) return; if (e.key === 'ArrowRight') { e.preventDefault(); jump(cur + 1); } if (e.key === 'ArrowLeft') { e.preventDefault(); jump(cur - 1); } }}>
      <div className="wrap reel-head">
        <div className="sh">
          <div><span className="eyebrow">design/</span><h2 className="h2">The design <em>reel</em></h2></div>
          <p className="sh-note">{CHAPTERS.length} chapters for AARUUSH and campus clubs at SRMIST, 2023 to 2025, in Photoshop and Illustrator. {pinMode ? 'Scroll, swipe sideways or drag to move through the reel' : 'Swipe through the reel'}, or tap a slide to open it.</p>
        </div>
      </div>

      {pinMode ? (
        <div ref={pinRef} className="hpin" style={{ height: `calc(${Math.round(dist * RATE)}px + 100vh)` }}>
          <div ref={stickyRef} className="hsticky">
            <motion.div ref={trackRef} className="htrack" style={{ x }}>{slides}{endCard}</motion.div>
            {hud}
          </div>
        </div>
      ) : (
        <>
          <div ref={stripRef} className="htrack hscroll">{slides}{endCard}</div>
          {hud}
        </>
      )}

      <dialog ref={dlg} className="lightbox" aria-label="Full screen slide" onClose={closeLb}
        onKeyDown={(e) => { if (e.key === 'ArrowLeft') lbStep(-1); if (e.key === 'ArrowRight') lbStep(1); }}>
        {lb !== null && (
          <>
            <div className="lbbar">
              <span>N°{pad2(SLIDES[lb].c.n)} · {SLIDES[lb].c.t} ({lb + 1}/{N})</span>
              <div>
                <button type="button" onClick={() => lbStep(-1)} aria-label="Previous slide">{Icon.prev}</button>
                <button type="button" onClick={() => lbStep(1)} aria-label="Next slide">{Icon.next}</button>
                <button type="button" onClick={closeLb} aria-label="Close" autoFocus>{Icon.close}</button>
              </div>
            </div>
            <img src={asset(`design/${SLIDES[lb].img}-1500.webp`)} alt={`${SLIDES[lb].c.t} design slide`} />
          </>
        )}
      </dialog>
    </section>
  );
}
