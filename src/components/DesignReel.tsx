import { AnimatePresence, motion, useScroll, useTransform } from 'motion/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { CAT_LABEL, CHAPTER_FILTERS, CHAPTERS, pad2, type ChapterCat } from '../data/chapters';
import { asset, SITE } from '../data/site';
import { useReduced } from '../lib/hooks';
import { Chips, Pic } from './ui';
import { Icon } from './icons';

export function DesignReel() {
  const [filter, setFilter] = useState<'all' | ChapterCat>('all');
  const [cur, setCur] = useState(0);
  const [sub, setSub] = useState(0);
  const [lb, setLb] = useState(false);
  const reduced = useReduced();
  const secRef = useRef<HTMLElement>(null);
  const dlg = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);

  // the screen grows from a card to full width as the section scrolls in
  const { scrollYProgress } = useScroll({ target: secRef, offset: ['start end', 'start 20%'] });
  const scale = useTransform(scrollYProgress, [0, 1], [0.84, 1]);
  const radius = useTransform(scrollYProgress, [0, 1], [36, 18]);

  const c = CHAPTERS[cur];
  const visible = CHAPTERS.filter((ch) => filter === 'all' || ch.cat === filter).map((ch) => ch.n - 1);

  const show = useCallback((i: number, s = 0) => { setCur(i); setSub(s); }, []);
  const step = useCallback((d: number) => {
    const k = visible.indexOf(cur);
    show(visible[k < 0 ? 0 : (k + d + visible.length) % visible.length], 0);
  }, [visible, cur, show]);
  const lbStep = useCallback((d: number) => {
    if (c.img.length > 1 && sub + d >= 0 && sub + d < c.img.length) setSub(sub + d);
    else step(d);
  }, [c, sub, step]);

  const changeFilter = (f: 'all' | ChapterCat) => {
    setFilter(f);
    const v = CHAPTERS.filter((ch) => f === 'all' || ch.cat === f).map((ch) => ch.n - 1);
    if (v.length && !v.includes(cur)) show(v[0]);
  };

  // preload the next chapter
  useEffect(() => {
    const nxt = CHAPTERS[(cur + 1) % CHAPTERS.length].img[0];
    const im = new Image(); im.src = asset(`design/${nxt}-1500.webp`);
  }, [cur]);

  useEffect(() => {
    const d = dlg.current;
    if (!d) return;
    if (lb && !d.open) d.showModal();
    if (!lb && d.open) d.close();
  }, [lb]);

  const openLb = (e: React.MouseEvent<HTMLElement>) => { opener.current = e.currentTarget; setLb(true); };
  const closeLb = () => { setLb(false); opener.current?.focus(); };

  return (
    <section id="design" ref={secRef} className="sec w-design">
      <div className="wrap">
        <div className="sh">
          <div><span className="eyebrow">design/</span><h2 className="h2">The design <em>reel</em></h2></div>
          <Chips id="design" label="Filter design chapters" items={CHAPTER_FILTERS} value={filter} onChange={changeFilter} />
        </div>
        <p className="dfacts"><span><b>{CHAPTERS.length}</b> chapters</span><span><b>2023 to 2025</b></span><span>for <b>AARUUSH</b> and campus clubs at SRMIST</span><span>tools: <b>Photoshop</b> and <b>Illustrator</b></span></p>

        <div className="reel"
          onKeyDown={(e) => { if ((e.target as HTMLElement).tagName === 'INPUT') return; if (e.key === 'ArrowLeft') step(-1); if (e.key === 'ArrowRight') step(1); }}>
          <ol className="idx" aria-label="Chapters">
            {CHAPTERS.map((ch, i) => (
              <li key={ch.n} hidden={!visible.includes(i)}>
                <button type="button" aria-current={i === cur} onClick={() => show(i)}>
                  <span className="no">{pad2(ch.n)}</span><span className="tt">{ch.t}</span>
                </button>
              </li>
            ))}
          </ol>

          <div style={{ minWidth: 0 }}>
            <motion.div className="screen" style={reduced ? undefined : { scale, borderRadius: radius }} data-cursor="expand">
              <AnimatePresence initial={false} mode="popLayout">
                <motion.div key={`${cur}-${sub}`} style={{ position: 'absolute', inset: 0 }}
                  initial={reduced ? { opacity: 0 } : { clipPath: 'inset(0 0 0 100%)', scale: 1.08 }}
                  animate={reduced ? { opacity: 1 } : { clipPath: 'inset(0 0 0 0%)', scale: 1 }}
                  transition={{ duration: reduced ? 0 : 0.7, ease: [0.7, 0, 0.2, 1] }}>
                  <Pic base={`design/${c.img[sub]}`} widths={[800, 1500]} sizes="(max-width: 900px) 92vw, 860px"
                    alt={`${c.t} design slide${c.img.length > 1 ? `, part ${sub + 1} of ${c.img.length}` : ''}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </motion.div>
              </AnimatePresence>
              <button type="button" className="open" onClick={openLb} aria-label={`Open ${c.t} full screen`} />
              {c.img.length > 1 && (
                <div className="dots">
                  {c.img.map((_, k) => <button key={k} type="button" aria-label={`Slide ${k + 1} of ${c.img.length}`} aria-current={k === sub} onClick={() => setSub(k)} />)}
                </div>
              )}
              <div className="ctl">
                <button type="button" onClick={() => step(-1)} aria-label="Previous chapter">{Icon.prev}</button>
                <button type="button" onClick={() => step(1)} aria-label="Next chapter">{Icon.next}</button>
                <button type="button" onClick={openLb} aria-label="Open full screen">{Icon.expand}</button>
              </div>
            </motion.div>

            <div className="rmeta" aria-live="polite">
              <div>
                <p className="mk">N°{pad2(c.n)} · {CAT_LABEL[c.cat]}</p>
                <h3>{c.t}</h3>
                <p className="d">{c.d}</p>
              </div>
              <dl><dt>focus</dt><dd>{c.sub}</dd><dt>year</dt><dd>{c.yr}</dd><dt>tools</dt><dd>Photoshop and Illustrator</dd></dl>
              {c.photo && (
                <figure className="polaroid">
                  <Pic base={c.photo.base} sizes="170px" alt={c.photo.caption} />
                  <figcaption>{c.photo.caption}</figcaption>
                </figure>
              )}
            </div>
          </div>
        </div>
        <p style={{ marginTop: 34 }}><a className="btn" href={SITE.behance} target="_blank" rel="noopener noreferrer">More on Behance ↗</a></p>
      </div>

      <dialog ref={dlg} className="lightbox" aria-label="Full screen slide" onClose={closeLb}
        onKeyDown={(e) => { if (e.key === 'ArrowLeft') lbStep(-1); if (e.key === 'ArrowRight') lbStep(1); }}>
        {lb && (
          <>
            <div className="lbbar">
              <span>N°{pad2(c.n)} · {c.t}{c.img.length > 1 ? ` (${sub + 1}/${c.img.length})` : ''}</span>
              <div>
                <button type="button" onClick={() => lbStep(-1)} aria-label="Previous slide">{Icon.prev}</button>
                <button type="button" onClick={() => lbStep(1)} aria-label="Next slide">{Icon.next}</button>
                <button type="button" onClick={closeLb} aria-label="Close" autoFocus>{Icon.close}</button>
              </div>
            </div>
            <img src={asset(`design/${c.img[sub]}-1500.webp`)} alt={`${c.t} design slide`} />
          </>
        )}
      </dialog>
    </section>
  );
}
