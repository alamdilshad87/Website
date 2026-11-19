import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { SECTIONS, SITE } from '../data/site';
import { scrollToId } from '../lib/hooks';
import { Stickers } from './Stickers';

function Clock() {
  const [t, setT] = useState('--:--:--');
  const [up, setUp] = useState('00:00');
  useEffect(() => {
    const t0 = Date.now();
    const tick = () => {
      try { setT(new Date().toLocaleTimeString('en-GB', { timeZone: 'Asia/Kolkata', hour12: false })); } catch { setT(new Date().toTimeString().slice(0, 8)); }
      const s = Math.floor((Date.now() - t0) / 1000);
      setUp(`${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`);
    };
    tick();
    const i = setInterval(tick, 1000);
    return () => clearInterval(i);
  }, []);
  return <><span>CHENNAI <b>{t}</b> IST</span><span>SESSION <b>{up}</b></span></>;
}

export function Footer() {
  const wm = useRef<HTMLParagraphElement>(null);

  // size the cropped wordmark to the full viewport width
  useLayoutEffect(() => {
    const p = wm.current;
    if (!p) return;
    const fit = () => {
      const s = p.querySelector('span')!;
      p.style.setProperty('--wf', '100px');
      const w = s.getBoundingClientRect().width;
      if (w) p.style.setProperty('--wf', `${Math.floor((100 * p.clientWidth * 0.98) / w)}px`);
    };
    fit();
    document.fonts?.ready.then(fit);
    const ro = new ResizeObserver(fit);
    ro.observe(p);
    return () => ro.disconnect();
  }, []);

  return (
    <footer className="foot">
      <Stickers a={['Let’s make something loud', 'Design with purpose', 'Open to roles', 'India and abroad']} b={['Backend', 'Frontend', 'AI / ML', 'Visual identity', 'Social media', 'Merchandise']} />
      <div className="wrap">
        <div className="sys">
          <p className="ps" style={{ margin: 0 }}><b>dilshad@portfolio</b>:<i>~</i>$ ./exit --code 0<span className="caret" aria-hidden="true" /></p>
          <div className="mt"><Clock /><span>BUILD <b>{SITE.build}</b></span><span className="ok"><i className="dot" aria-hidden="true" />ALL SYSTEMS GO</span></div>
        </div>
        <div className="frow">
          <span>© 2026 {SITE.name} · Chennai, India</span>
          <nav aria-label="Footer">
            {SECTIONS.map((s) => <a key={s.id} href={`#${s.id}`} onClick={(e) => { e.preventDefault(); scrollToId(s.id); }}>{s.label}</a>)}
            <a href={SITE.behance} target="_blank" rel="noopener noreferrer">behance ↗</a>
          </nav>
          <a href="#top" onClick={(e) => { e.preventDefault(); scrollToId('top'); }}>back to top ↑</a>
        </div>
      </div>
      <p ref={wm} className="wordmark" aria-hidden="true"
        onPointerMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); e.currentTarget.style.setProperty('--fx', `${e.clientX - r.left}px`); e.currentTarget.style.setProperty('--fy', `${e.clientY - r.top}px`); }}>
        <span>Dilshad</span>
      </p>
    </footer>
  );
}
