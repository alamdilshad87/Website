import { useEffect, useRef, useState } from 'react';
import { asset } from '../data/site';
import { scrollToId, useReduced } from '../lib/hooks';

/**
 * "X-ray" landing. Two identical layouts are stacked: the designer layer (colour, type,
 * stickers) and the developer layer (blueprint, wireframe type, code). The cursor is a
 * lens that reveals the code underneath; clicking flips the whole hero to code view.
 * Before the visitor moves, the lens drifts on its own so the idea is obvious.
 */
export function HeroXray() {
  const root = useRef<HTMLElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const touched = useRef(false);
  const [flipped, setFlipped] = useState(false);
  const reduced = useReduced();

  const place = (x: number, y: number) => {
    const el = root.current;
    if (!el) return;
    el.style.setProperty('--x', `${x}px`);
    el.style.setProperty('--y', `${y}px`);
    if (label.current) label.current.textContent = `x ${Math.round(x)} · y ${Math.round(y)}`;
  };

  // idle drift until the visitor takes over (keeps drifting on touch screens)
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (reduced) { place(el.clientWidth * 0.66, el.clientHeight * 0.42); return; }
    let raf = 0;
    const loop = (t: number) => {
      if (!touched.current) {
        const w = el.clientWidth, h = el.clientHeight;
        place(w * (0.55 + 0.25 * Math.sin(t * 0.0005)), h * (0.45 + 0.2 * Math.sin(t * 0.0008 + 1)));
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [reduced]);

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    touched.current = true;
    const r = root.current!.getBoundingClientRect();
    place(e.clientX - r.left, e.clientY - r.top);
  };

  return (
    <section
      id="top" ref={root}
      className={`xr ${flipped ? 'flipped' : ''}`}
      onPointerMove={onMove}
      onClick={() => setFlipped((f) => !f)}
      data-cursor={flipped ? 'design' : 'code'}
    >
      {/* ---------- designer layer ---------- */}
      <div className="xr-layer xr-design">
        <div className="xr-in">
          <div className="xr-copy">
            <p className="xr-k">Md Dilshad Alam · developer + designer · Chennai</p>
            <h1 className="xr-h">I make it<br /><em>beautiful.</em></h1>
            <p className="xr-p">Posters, merch and identities for AARUUSH, and the interfaces that go with them. Hover around: there’s code under all of it.</p>
          </div>
          <div className="xr-art">
            <div className="xr-blob" aria-hidden="true" />
            <img className="xr-ph" src={asset('design/dilshad-720.webp')} alt="Md Dilshad Alam smiling with arms crossed" />
            <span className="xr-s s1">posters ✶</span>
            <span className="xr-s s2">merch</span>
            <span className="xr-s s3">8.99 cgpa</span>
            <span className="xr-star" aria-hidden="true">✺</span>
          </div>
        </div>
      </div>

      {/* ---------- developer layer (revealed by the lens) ---------- */}
      <div className="xr-layer xr-code" aria-hidden="true">
        <div className="xr-in">
          <div className="xr-copy">
            <p className="xr-k">{'// md_dilshad_alam.tsx · chennai, IN'}</p>
            <h1 className="xr-h">I make it<br /><em>work.</em></h1>
            <p className="xr-p"><span className="kw">const</span> stack = [<span className="st">'.NET'</span>, <span className="st">'Angular'</span>, <span className="st">'FastAPI'</span>, <span className="st">'RAG'</span>];<br /><span className="cm">{'// offline AI, reviewed specs, shipped.'}</span></p>
            <span className="xr-dim d1">h1 · 800 · clamp(3.4rem, 9vw, 8.6rem)</span>
          </div>
          <div className="xr-art">
            <div className="xr-blob" />
            <img className="xr-ph" src={asset('design/dilshad-720.webp')} alt="" />
            <span className="xr-box"><b>&lt;img&gt;</b> 360 × 450 · object-fit: cover</span>
            <span className="xr-s s1">{'<Poster />'}</span>
            <span className="xr-s s2">{'<Merch />'}</span>
            <span className="xr-s s3">{'{ cgpa: 8.99 }'}</span>
            <span className="xr-star">{'/* todo: hire him */'}</span>
          </div>
        </div>
      </div>

      <div className="xr-lens" aria-hidden="true"><span ref={label} /></div>

      <div className="xr-ui" onClick={(e) => e.stopPropagation()}>
        <div className="xr-cta">
          <button type="button" className="btn primary" onClick={() => scrollToId('projects')}>See projects</button>
          <button type="button" className="btn" onClick={() => scrollToId('contact')}>Say hello</button>
        </div>
        <button type="button" className="xr-mode" aria-pressed={flipped} onClick={() => setFlipped((f) => !f)}>
          <i className={flipped ? '' : 'on'}>design</i><i className={flipped ? 'on' : ''}>code</i>
        </button>
        <p className="xr-hint">move the lens · click anywhere to flip</p>
      </div>
    </section>
  );
}
