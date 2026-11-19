import { useEffect, useRef, useState, type ReactNode } from 'react';
import { PROJECTS } from '../data/projects';
import { SECTIONS, SITE } from '../data/site';
import { SKILLS } from '../data/skills';
import { copyText, emit, scrollToId } from '../lib/hooks';
import { Logo } from './Nav';

type Line = { kind: 'in' | 'out' | 'err'; text: ReactNode };

const HELP = [
  ['help', 'list commands'], ['about', 'who I am'], ['projects', 'what I’ve built'], ['skills', 'my toolbox'],
  ['contact', 'ways to reach me'], ['open <name>', 'github · linkedin · behance'], ['goto <section>', 'jump to a section'],
  ['theme', 'toggle light / dark'], ['clear', 'clear the screen'],
];

function run(raw: string): Line[] | 'clear' {
  const [cmd, ...rest] = raw.trim().split(/\s+/);
  const arg = rest.join(' ').toLowerCase();
  switch ((cmd ?? '').toLowerCase()) {
    case '': return [];
    case 'help':
      return HELP.map(([c, d]) => ({ kind: 'out' as const, text: <><b>{c.padEnd(16, ' ')}</b>{d}</> }));
    case 'about': case 'whoami':
      return [{ kind: 'out', text: `${SITE.name}. Software developer and graphic designer in ${SITE.city}. B.Tech CSE, SRMIST ’26. Open to roles in India and abroad.` }];
    case 'projects': case 'ls':
      return PROJECTS.map((p, i) => ({ kind: 'out' as const, text: <><b>{String(i + 1).padStart(2, '0')}</b> {p.title} <i>· {p.tag}</i></> }));
    case 'skills':
      return SKILLS.map((g) => ({ kind: 'out' as const, text: <><b>{g.c.padEnd(16, ' ')}</b>{g.i.slice(0, 5).map((s) => s.name).join(', ')}…</> }));
    case 'contact':
      return [
        { kind: 'out', text: <>linkedin  <a href={SITE.linkedin} target="_blank" rel="noopener noreferrer">in/alamdilshad87</a></> },
        { kind: 'out', text: <>github    <a href={SITE.github} target="_blank" rel="noopener noreferrer">alamdilshad87</a></> },
        { kind: 'out', text: <>behance   <a href={SITE.behance} target="_blank" rel="noopener noreferrer">alamdilshad87</a></> },
        ...(SITE.email ? [{ kind: 'out' as const, text: <>email     {SITE.email} <i>(type “copy email”)</i></> }] : []),
      ];
    case 'copy':
      if (arg === 'email' && SITE.email) { void copyText(SITE.email); return [{ kind: 'out', text: 'email copied to clipboard ✓' }]; }
      return [{ kind: 'err', text: 'usage: copy email' }];
    case 'open': {
      const map: Record<string, string> = { github: SITE.github, linkedin: SITE.linkedin, behance: SITE.behance };
      if (map[arg]) { window.open(map[arg], '_blank', 'noopener'); return [{ kind: 'out', text: `opening ${arg}…` }]; }
      return [{ kind: 'err', text: 'usage: open github | linkedin | behance' }];
    }
    case 'goto': case 'cd': {
      const s = SECTIONS.find((x) => x.id === arg.replace(/^#|\/$/g, ''));
      if (s) { scrollToId(s.id); return [{ kind: 'out', text: `→ ${s.label}` }]; }
      return [{ kind: 'err', text: `usage: goto ${SECTIONS.map((x) => x.id).join(' | ')}` }];
    }
    case 'theme': emit('theme'); return [{ kind: 'out', text: 'theme toggled' }];
    case 'clear': return 'clear';
    case 'sudo':
      return arg.startsWith('hire')
        ? [{ kind: 'out', text: <>permission granted ✓ <a href={SITE.linkedin} target="_blank" rel="noopener noreferrer">let’s talk on LinkedIn →</a></> }]
        : [{ kind: 'err', text: 'nice try. (hint: sudo hire-me)' }];
    case 'date': return [{ kind: 'out', text: new Date().toString() }];
    case 'echo': return [{ kind: 'out', text: rest.join(' ') }];
    default:
      return [{ kind: 'err', text: `command not found: ${cmd}. type “help”` }];
  }
}

const WELCOME: Line[] = [
  { kind: 'out', text: 'dilshad-os 2026.11 · type “help” to see what this terminal can do' },
];

function Terminal() {
  const [lines, setLines] = useState<Line[]>(WELCOME);
  const [val, setVal] = useState('');
  const [hist, setHist] = useState<string[]>([]);
  const [hi, setHi] = useState(-1);
  const screen = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => { screen.current?.scrollTo({ top: screen.current.scrollHeight }); }, [lines]);

  const submit = (cmd: string) => {
    const out = run(cmd);
    if (cmd.trim()) setHist((h) => [cmd, ...h].slice(0, 30));
    setHi(-1);
    setVal('');
    if (out === 'clear') setLines([]);
    else setLines((l) => [...l, { kind: 'in' as const, text: cmd }, ...out].slice(-80));
  };

  return (
    <div className="term" onClick={() => input.current?.focus()}>
      <div className="term-bar"><i /><i /><i /><span>dilshad@portfolio: ~</span></div>
      <div ref={screen} className="term-screen" data-lenis-prevent role="log" aria-live="polite" aria-label="Terminal output">
        {lines.map((l, i) => (
          <p key={i} className={l.kind}>{l.kind === 'in' ? <><span className="pr">$</span> {l.text}</> : l.text}</p>
        ))}
        <form className="term-in" onSubmit={(e) => { e.preventDefault(); submit(val); }}>
          <label htmlFor="term-input" className="pr">$</label>
          <input id="term-input" ref={input} value={val} onChange={(e) => setVal(e.target.value)} autoComplete="off" spellCheck={false}
            aria-label="Type a command" placeholder="help"
            onKeyDown={(e) => {
              if (e.key === 'ArrowUp') { e.preventDefault(); const n = Math.min(hist.length - 1, hi + 1); if (hist[n]) { setHi(n); setVal(hist[n]); } }
              if (e.key === 'ArrowDown') { e.preventDefault(); const n = hi - 1; setHi(Math.max(-1, n)); setVal(n >= 0 ? hist[n] : ''); }
            }} />
        </form>
      </div>
      <div className="term-chips" aria-label="Try a command">
        {['help', 'projects', 'contact', 'sudo hire-me'].map((c) => (
          <button key={c} type="button" onClick={(e) => { e.stopPropagation(); submit(c); }}>{c}</button>
        ))}
      </div>
    </div>
  );
}

function Clock() {
  const [t, setT] = useState('--:--:--');
  useEffect(() => {
    const tick = () => { try { setT(new Date().toLocaleTimeString('en-GB', { timeZone: 'Asia/Kolkata', hour12: false })); } catch { setT(''); } };
    tick();
    const i = setInterval(tick, 1000);
    return () => clearInterval(i);
  }, []);
  return <>{t}</>;
}

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
          <div>
            <h3>now</h3>
            <ul className="now">
              <li><span className="dot" aria-hidden="true" /> open to roles</li>
              <li>Chennai · <b><Clock /></b> IST</li>
              <li>build {SITE.build}</li>
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
