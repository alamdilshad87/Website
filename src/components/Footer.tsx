import { SECTIONS, SITE } from '../data/site';
import { scrollToId } from '../lib/hooks';
import { Logo } from './Nav';
import { Terminal } from './Terminal';

export function Footer() {
  const go = (id: string) => (e: React.MouseEvent) => { e.preventDefault(); scrollToId(id); };
  return (
    <footer className="foot">
      <div className="wrap foot-grid">
        <div className="foot-term">
          <p className="foot-kicker">still scrolling? <span>talk to the terminal.</span></p>
          <Terminal />
        </div>
        <div className="foot-cols">
          <div>
            <h3>navigate</h3>
            <ul>{SECTIONS.map((s) => <li key={s.id}><a href={`#${s.id}`} onClick={go(s.id)}>{s.label}</a></li>)}</ul>
          </div>
          <div>
            <h3>elsewhere</h3>
            <ul>
              <li><a href={SITE.github} target="_blank" rel="noopener noreferrer">GitHub ↗</a></li>
              <li><a href={SITE.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a></li>
              <li><a href={SITE.behance} target="_blank" rel="noopener noreferrer">Behance ↗</a></li>
              {SITE.coding.map((c) => <li key={c.label}><a href={c.href} target="_blank" rel="noopener noreferrer">{c.label} ↗</a></li>)}
            </ul>
          </div>
        </div>
      </div>
      <div className="wrap foot-base">
        <a className="logo" href="#top" onClick={go('top')} aria-label="Back to top"><Logo /> {SITE.short}</a>
        <span>© 2026 {SITE.name} · designed and built in Chennai with React, Vite and Motion</span>
        <a href="#top" onClick={go('top')}>back to top ↑</a>
      </div>
    </footer>
  );
}
