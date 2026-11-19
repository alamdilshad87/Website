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
          <p className="sh-note">{CHAPTERS.length} chapters for AARUUSH and campus clubs at SRMIST, 2023 to 2025, in Photoshop and Illustrator. {pinMode ? 'Keep scrolling to move through the reel' : 'Swipe through the reel'}, or tap a slide to open it.</p>
        </div>
      </div>

      {pinMode ? (
        <div ref={pinRef} className="hpin" style={{ height: `calc(${Math.round(dist * RATE)}px + 100vh)` }}>
          <div className="hsticky">
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
