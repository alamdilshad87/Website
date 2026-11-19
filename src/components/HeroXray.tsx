import { useEffect, useRef, useState } from 'react';
import { asset } from '../data/site';
import { scrollToId, useReduced } from '../lib/hooks';

/**
 * "X-ray" landing. Two identical layouts are stacked: the developer layer (blueprint,
 * mono type, code) shows first, and the lens reveals the designer layer (colour, serif,
 * stickers) on top of it. Clicking flips the whole hero to design. Until the visitor
 * takes over, the lens drifts on its own. On touch, a tap moves the lens there and the
 * code/design switch does the flip.
 */
export function HeroXray() {
  const root = useRef<HTMLElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const target = useRef({ x: 0, y: 0, user: false });
  const lastPointer = useRef('mouse');
  const [flipped, setFlipped] = useState(false);
  const reduced = useReduced();

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const cur = { x: el.clientWidth * 0.66, y: el.clientHeight * 0.42 };
    const paint = () => {
      el.style.setProperty('--x', `${cur.x}px`);
      el.style.setProperty('--y', `${cur.y}px`);
      if (label.current) label.current.textContent = `x ${Math.round(cur.x)} · y ${Math.round(cur.y)}`;
    };
    if (reduced) { paint(); return; }
    let raf = 0;
    const loop = (t: number) => {
      const tg = target.current;
      if (!tg.user) {
        const w = el.clientWidth, h = el.clientHeight;
        tg.x = w * (w < 700 ? 0.5 + 0.2 * Math.sin(t * 0.00045) : 0.58 + 0.24 * Math.sin(t * 0.00045));
        tg.y = h * (0.46 + 0.18 * Math.sin(t * 0.0007 + 1));
      }
      cur.x += (tg.x - cur.x) * 0.16;
      cur.y += (tg.y - cur.y) * 0.16;
      paint();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [reduced]);

  const aim = (e: React.PointerEvent) => {
    const r = root.current!.getBoundingClientRect();
    target.current = { x: e.clientX - r.left, y: e.clientY - r.top, user: true };
  };
  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    aim(e);
    root.current!.toggleAttribute('data-zoom', !!(e.target as Element).closest('.xr-art'));
  };
  const onDown = (e: React.PointerEvent) => {
    lastPointer.current = e.pointerType;
    if (e.pointerType !== 'mouse') aim(e);
  };
  const onLeave = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    target.current.user = false;
    root.current!.removeAttribute('data-zoom');
  };

  return (
    <section
      id="top" ref={root}
      className={`xr ${flipped ? 'flipped' : ''}`}
      onPointerMove={onMove}
      onPointerDown={onDown}
      onPointerLeave={onLeave}
      onClick={() => { if (lastPointer.current === 'mouse') setFlipped((f) => !f); }}
    >
      {/* ---------- developer layer (base) ---------- */}
      <div className="xr-layer xr-code">
        <div className="xr-in">
          <div className="xr-copy">
            <p className="xr-k">{'// md_dilshad_alam.tsx'}</p>
            <h1 className="xr-h"><span>I make it</span><em>work.<i className="caret" aria-hidden="true" /></em></h1>
            <pre className="xr-p" aria-label="Stack: .NET, Angular, Python, FastAPI, RAG, LLMs, offline-first AI, Docker, Git">
              <code>
                <span className="ln">1</span><span className="kw">const</span> dilshad = {'{'}{'\n'}
                <span className="ln">2</span>  build: [<span className="st">'.NET'</span>, <span className="st">'Angular'</span>, <span className="st">'Python'</span>, <span className="st">'FastAPI'</span>],{'\n'}
                <span className="ln">3</span>  ai:    [<span className="st">'RAG'</span>, <span className="st">'LLMs'</span>, <span className="st">'offline-first'</span>],{'\n'}
                <span className="ln">4</span>  ship:  [<span className="st">'Docker'</span>, <span className="st">'Git'</span>],{'\n'}
                <span className="ln">5</span>{'}'}; <span className="cm">{'// reviewed, tested, shipped.'}</span>
              </code>
            </pre>
            <span className="xr-dim" aria-hidden="true">h1 · JetBrains Mono 700</span>
          </div>
          <div className="xr-art" aria-hidden="true">
            <div className="xr-blob" />
            <img className="xr-ph" src={asset('design/dilshad-720.webp')} alt="" />
            <span className="xr-box"><b>&lt;img&gt;</b> 360 × 450 · object-fit: cover</span>
            <span className="xr-s s1">✓ build passed</span>
            <span className="xr-s s2">200 OK</span>
            <span className="xr-s s3">git push origin main</span>
            <span className="xr-star">{'/* todo: hire him */'}</span>
          </div>
        </div>
      </div>

      {/* ---------- designer layer (revealed by the lens) ---------- */}
      <div className="xr-layer xr-design" aria-hidden={!flipped}>
        <div className="xr-in">
          <div className="xr-copy">
            <p className="xr-k">Md Dilshad Alam · designer + developer</p>
            <p className="xr-h"><span>I make it</span><em>beautiful.</em></p>
            <p className="xr-p">Event identities, posters and merch for AARUUSH, and interfaces people actually enjoy using. Every pixel on purpose.</p>
          </div>
          <div className="xr-art">
            <div className="xr-blob" aria-hidden="true" />
            <img className="xr-ph" src={asset('design/dilshad-720.webp')} alt="Md Dilshad Alam smiling with arms crossed" />
            <span className="xr-s s1">identity ✶</span>
            <span className="xr-s s2">UI / UX</span>
            <span className="xr-s s3">AARUUSH ’25</span>
            <span className="xr-star" aria-hidden="true">✺</span>
          </div>
        </div>
      </div>

      <div className="xr-lens" aria-hidden="true"><span ref={label} /></div>

      <div className="xr-ui" onClick={(e) => e.stopPropagation()}>
        <div className="xr-cta">
          <button type="button" className="btn primary" onClick={() => scrollToId('projects')}>See projects</button>
          <button type="button" className="btn" onClick={() => scrollToId('contact')}>Say hello</button>
        </div>
        <button type="button" className="xr-mode" aria-pressed={flipped} aria-label="Show the design view" onClick={() => setFlipped((f) => !f)}>
          <i className={flipped ? '' : 'on'}>code</i><i className={flipped ? 'on' : ''}>design</i>
        </button>
        <p className="xr-hint"><span className="fine">move the lens · click anywhere to flip</span><span className="touch">tap to move the lens</span></p>
      </div>
    </section>
  );
}
