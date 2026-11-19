import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { CHAPTERS } from '../data/chapters';
import { fmt, ROLES } from '../data/journey';
import { PROJECTS } from '../data/projects';
import { asset, getEmail, SECTIONS, SITE } from '../data/site';
import { SKILLS } from '../data/skills';
import { copyText, emit, scrollToId, useReduced } from '../lib/hooks';

/**
 * The footer terminal. `run` turns a command into output lines plus an optional
 * side effect (clear, matrix rain, scroll to top, start the hire flow). Output can
 * contain <Run> buttons that execute another command when clicked.
 */

type Kind = 'in' | 'out' | 'err' | 'ok';
type Out = { kind?: Kind; text: ReactNode };
type Fx = 'clear' | 'matrix' | 'top' | 'hire';
type Result = { out: Out[]; fx?: Fx };
interface Ctx { exec: (cmd: string) => void }

const o = (text: ReactNode): Out => ({ text });
const er = (text: ReactNode): Out => ({ kind: 'err', text });
const ok = (text: ReactNode): Out => ({ kind: 'ok', text });

function Run({ c, ctx, children }: { c: string; ctx: Ctx; children?: ReactNode }) {
  return <button type="button" className="tlink" onClick={(e) => { e.stopPropagation(); ctx.exec(c); }}>{children ?? c}</button>;
}

/* ---------------- data for the commands ---------------- */

const COMMANDS = [
  'help', 'hi', 'hello', 'about', 'whoami', 'neofetch', 'projects', 'open', 'experience', 'git log', 'education', 'skills', 'tree',
  'certs', 'resume', 'portfolio', 'contact', 'hire', 'email', 'copy email', 'goto', 'ls', 'theme', 'clear', 'coffee', 'joke', 'fortune', 'cowsay',
  'matrix', 'weather', 'ping', 'date', 'echo', 'exit', 'sudo hire-me',
];

const HELP: [string, [string, string][]][] = [
  ['basics', [['help', 'this list'], ['about', 'who I am'], ['contact', 'ways to reach me'], ['hire', 'send me a message, right here'], ['clear', 'clear the screen']]],
  ['portfolio', [['neofetch', 'the system card'], ['projects [--ai|--web|--hw]', 'what I’ve built'], ['open <name>', 'a project, or github · linkedin · behance'],
    ['experience', 'roles, as a git log'], ['education', 'degree and grades'], ['skills · tree', 'the toolbox'], ['certs', 'certifications'], ['resume · portfolio', 'download the PDFs'], ['goto <section>', 'jump around the page']]],
  ['fun', [['hi', 'say hello'], ['coffee · joke · fortune', 'breaks'], ['cowsay <text>', 'moo'], ['matrix', 'follow the white rabbit'], ['weather', 'Chennai, live-ish'], ['…', 'and a few secrets']]],
];

const JOKES = [
  'There are 10 kinds of people: those who read binary and those who don’t.',
  'I told my designer the button should pop. Now it has a drop shadow, a gradient and a sound effect.',
  'A SQL query walks into a bar, walks up to two tables and asks: “Can I join you?”',
  'My code doesn’t have bugs. It has surprise features.',
  'Why do Java developers wear glasses? Because they don’t C#.',
  'I’d tell you a UDP joke, but you might not get it.',
  'Kerning: the art of making “click” not look like something else.',
  'It works on my machine. So we’re shipping my machine. (That’s Docker.)',
];
const FORTUNES = [
  'Ship it small, ship it often.',
  'The best design is the one you don’t notice until it’s gone.',
  'Today’s TODO is tomorrow’s legacy code.',
  'Whitespace is free. Use it.',
  'Read the error message. Then read it again.',
  'A good poster is read in three seconds and remembered for three days.',
];
let jokeI = 0, fortuneI = 0;

const LOGO = [
  '  ▄██████████▄  ',
  '  ██        ▀██ ',
  '  ██  ▀▄     ██ ',
  '  ██    ▀▄   ██ ',
  '  ██    ▄▀   ██ ',
  '  ██  ▄▀     ██ ',
  '  ██        ▄██ ',
  '  ▀██████████▀  ',
].join('\n');

const COFFEE = [
  '      ( (',
  '       ) )',
  '    ........',
  '    |      |]',
  '    \\      /',
  '     `----’',
].join('\n');

const hash7 = (s: string) => {
  let h = 5381;
  for (const ch of s) h = ((h << 5) + h + ch.charCodeAt(0)) >>> 0;
  return h.toString(16).padStart(8, '0').slice(0, 7);
};

const istHour = () => {
  try { return Number(new Date().toLocaleString('en-GB', { timeZone: 'Asia/Kolkata', hour: '2-digit', hour12: false })) % 24; } catch { return new Date().getHours(); }
};
const istTime = () => {
  try { return new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: 'numeric', minute: '2-digit' }); } catch { return ''; }
};

function dist(a: string, b: string) {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[a.length][b.length];
}
const suggest = (c: string) => COMMANDS.map((x) => [x, dist(c, x)] as const).filter(([, n]) => n <= 2).sort((a, b) => a[1] - b[1])[0]?.[0];

const findProject = (q: string) => PROJECTS.find((p) => p.id === q || p.title.toLowerCase() === q) ?? PROJECTS.find((p) => p.title.toLowerCase().includes(q) || p.id.includes(q));

/* ---------------- the command engine ---------------- */

function run(raw: string, ctx: Ctx): Result {
  const input = raw.trim();
  const low = input.toLowerCase().replace(/[!?.]+$/, '');
  const [cmd = '', ...rest] = low.split(/\s+/);
  const arg = rest.join(' ');
  const argRaw = input.split(/\s+/).slice(1).join(' ');

  // multi-word phrases first
  if (!low) return { out: [] };
  if (/^(how are you|how r u|sup|what'?s up)/.test(low)) return { out: [o('Running at 60 fps, thanks for asking. You?'), o(<>Ask me about <Run c="projects" ctx={ctx} /> or say <Run c="hire" ctx={ctx} />.</>)] };
  if (/^(who are you|who r u)/.test(low)) return { out: [o('You’re a visitor. I’m Dilshad’s portfolio, and I talk back.'), o(<>Try <Run c="whoami" ctx={ctx} /> for the human.</>)] };
  if (/^(thanks|thank you|thx|ty)\b/.test(low)) return { out: [o('Anytime. Come back soon ✶')] };
  if (low === 'git log' || low === 'experience' || low === 'git log --oneline') {
    const roles = [...ROLES].sort((a, b) => b.s.localeCompare(a.s));
    return { out: roles.map((r) => o(<><b className="y">{hash7(r.id + r.s)}</b> <i>({fmt(r.s)})</i> {r.role} <b>@ {r.org}</b>{r.e === 'now' && <i> · HEAD</i>}</>)) };
  }
  if (/^rm -rf/.test(low)) return {
    out: [er('deleting /projects ...'), er('deleting /design ...'), er('deleting /coffee ...'), ok('just kidding. Everything is safe on GitHub ✓')],
  };
  if (low === 'cd ..' || low === 'cd ~' || low === 'cd') return { out: [o('You’re already home.')] };
  if (/^(up up down down|↑↑↓↓|konami)/.test(low)) { emit('theme'); return { out: [ok('+30 lives. Cheat code accepted: theme flipped.')] }; }
  if (low === ':q' || low === ':wq' || low === ':q!') return { out: [ok('Freed. Welcome back to the outside world.')] };

  switch (cmd) {
    case 'help': case '?': case 'man':
      return {
        out: [
          ...HELP.flatMap(([g, rows]) => [o(<i className="hg">{g}</i>), ...rows.map(([c, d]) => o(<><b>{c.padEnd(28, ' ')}</b>{d}</>))]),
          o(<i>psst: try <Run c="neofetch" ctx={ctx} /> · Tab completes · ↑↓ history</i>),
        ],
      };

    case 'hi': case 'hello': case 'hey': case 'hii': case 'yo': case 'namaste': case 'hola': case 'sup': {
      const h = istHour();
      const part = h < 5 ? 'Still up?' : h < 12 ? 'Good morning!' : h < 17 ? 'Good afternoon!' : h < 21 ? 'Good evening!' : 'Burning the midnight oil?';
      return { out: [o(<>{cmd === 'namaste' ? 'Namaste 🙏' : 'Hey there 👋'} {part} It’s {istTime()} in Chennai.</>), o(<>I’m Dilshad’s terminal. Try <Run c="about" ctx={ctx} />, <Run c="projects" ctx={ctx} /> or <Run c="neofetch" ctx={ctx} />.</>)] };
    }

    case 'about': case 'whoami':
      return { out: [o(`${SITE.name}. Software developer and graphic designer in ${SITE.city}. B.Tech CSE, SRMIST ’26. I build .NET services, Angular frontends and offline AI, and design identities for AARUUSH. Open to roles in India and abroad.`)] };

    case 'neofetch': case 'fastfetch': {
      const rows: [string, ReactNode][] = [
        ['OS', `dilshad-os ${SITE.build}`], ['Host', 'SRMIST, Chennai'], ['Role', 'developer + designer'],
        ['Uptime', '4 yrs B.Tech · 3 yrs AARUUSH'], ['Shell', 'zsh + chai'], ['Stack', '.NET · Angular · FastAPI · RAG'],
        ['Design', 'Photoshop · Illustrator · Figma'], ['Projects', `${PROJECTS.length} built · ${CHAPTERS.length} design chapters`], ['Status', 'open to roles ✓'],
      ];
      return {
        out: [o(
          <div className="nf">
            <pre className="nf-logo" aria-hidden="true">{LOGO}</pre>
            <div>
              <p><b className="o">dilshad</b>@<b className="o">portfolio</b></p>
              <p className="dim">-----------------</p>
              {rows.map(([k, v]) => <p key={k}><b className="o">{k}</b>: {v}</p>)}
              <p className="sw" aria-hidden="true"><span /><span /><span /><span /><span /><span /></p>
            </div>
          </div>,
        )],
      };
    }

    case 'projects': case 'ls': {
      if (cmd === 'ls' && !arg) return { out: [o(<>{SECTIONS.map((s) => <Run key={s.id} c={`goto ${s.id}`} ctx={ctx}>{s.id}/</Run>)} <Run c="resume" ctx={ctx}>resume.pdf</Run> <Run c="portfolio" ctx={ctx}>portfolio.pdf</Run></>)] };
      const f = /--?(ai|web|hw)/.exec(arg)?.[1] as 'ai' | 'web' | 'hw' | undefined;
      const list = f ? PROJECTS.filter((p) => p.cats.includes(f)) : PROJECTS;
      return {
        out: [
          ...list.map((p) => o(<><b>{String(PROJECTS.indexOf(p) + 1).padStart(2, '0')}</b> <Run c={`open ${p.id}`} ctx={ctx}>{p.title}</Run> <i>· {p.tag}</i></>)),
          o(<i>click a name, or type open &lt;name&gt; · filter with --ai --web --hw</i>),
        ],
      };
    }

    case 'open': case 'cat': {
      const links: Record<string, string> = { github: SITE.github, linkedin: SITE.linkedin, behance: SITE.behance, credly: SITE.credly };
      for (const c of SITE.coding) links[c.label.toLowerCase()] = c.href;
      if (links[arg]) { window.open(links[arg], '_blank', 'noopener'); return { out: [ok(`opening ${arg} ↗`)] }; }
      if (arg === 'resume' || arg === 'resume.pdf') return run('resume', ctx);
      if (arg === 'portfolio' || arg === 'portfolio.pdf') return run('portfolio', ctx);
      const p = arg && findProject(arg);
      if (p) { scrollToId('projects'); setTimeout(() => emit('open-project', p.id), 450); return { out: [ok(`opening ${p.title} case study…`)] }; }
      return { out: [er(`usage: open <project> | github | linkedin | behance | leetcode`)] };
    }

    case 'education': case 'edu':
      return { out: [o(<><b>SRMIST, Kattankulathur</b> · B.Tech, Computer Science and Engineering</>), o(<>2022 → 2026 · CGPA <b>8.99</b></>)] };

    case 'skills':
      return { out: SKILLS.map((g) => o(<><b>{g.c.padEnd(16, ' ')}</b>{g.i.slice(0, 5).map((s) => s.name).join(', ')}…</>)) };

    case 'tree':
      return {
        out: [o(<b>stack/</b>), ...SKILLS.map((g, i) => o(<><i>{i === SKILLS.length - 1 ? '└── ' : '├── '}</i><b>{g.c.toLowerCase().replace(/ \+ | \/ | /g, '-')}/</b> <i>({g.i.length})</i> {g.i.slice(0, 4).map((s) => s.name).join(' · ')}</>)),
          o(<i>{SKILLS.length} directories, {SKILLS.reduce((n, g) => n + g.i.length, 0)} files</i>)],
      };

    case 'certs': case 'certifications':
      return { out: [...SITE.certs.map((c) => o(<>✓ {c}</>)), o(<>more on <a href={SITE.credly} target="_blank" rel="noopener noreferrer">Credly ↗</a></>)] };

    case 'resume': case 'cv':
      if (SITE.resume) { window.open(asset(SITE.resume), '_blank', 'noopener'); return { out: [ok('opening the résumé (tech side) ↗')], }; }
      return { out: [o('The résumé is getting a fresh coat of paint.'), o(<>Meanwhile: <Run c="neofetch" ctx={ctx} /> or <Run c="hire" ctx={ctx} />.</>)] };

    case 'portfolio': case 'design':
      if (SITE.portfolio) { window.open(asset(SITE.portfolio), '_blank', 'noopener'); return { out: [ok('opening the design portfolio (creative side) ↗')] }; }
      return { out: [o('The design portfolio is on its way.')] };

    case 'email':
      return SITE.emailEnc ? { out: [o(<>email     <b>{getEmail()}</b></>)] } : { out: [er('no email set')] };

    case 'contact':
      return {
        out: [
          o(<>linkedin  <a href={SITE.linkedin} target="_blank" rel="noopener noreferrer">in/alamdilshad87</a></>),
          o(<>github    <a href={SITE.github} target="_blank" rel="noopener noreferrer">alamdilshad87</a></>),
          o(<>behance   <a href={SITE.behance} target="_blank" rel="noopener noreferrer">alamdilshad87</a></>),
          ...(SITE.emailEnc ? [o(<>email     <i>hidden from bots ·</i> <Run c="email" ctx={ctx}>show</Run><Run c="copy email" ctx={ctx}>copy</Run></>)] : []),
          o(<i>or type <Run c="hire" ctx={ctx} /> to write to me from here</i>),
        ],
      };

    case 'hire': case 'mail': case 'message':
      return { out: [ok('Let’s write to Dilshad. (type cancel anytime)'), o('What’s your name?')], fx: 'hire' };

    case 'copy':
      if (arg === 'email' && SITE.emailEnc) { void copyText(getEmail()); return { out: [ok('email copied to clipboard ✓')] }; }
      return { out: [er('usage: copy email')] };

    case 'goto': case 'cd': {
      const s = SECTIONS.find((x) => x.id === arg.replace(/^#|\/$/g, ''));
      if (s) { scrollToId(s.id); return { out: [ok(`→ ${s.label}`)] }; }
      return { out: [er(`usage: goto ${SECTIONS.map((x) => x.id).join(' | ')}`)] };
    }

    case 'theme': emit('theme'); return { out: [ok('theme toggled')] };
    case 'clear': case 'cls': return { out: [], fx: 'clear' };

    case 'coffee': case 'chai': case 'tea':
      return { out: [o(<pre className="art">{COFFEE}</pre>), ok(`${cmd === 'coffee' ? 'Coffee' : 'Chai'} brewed. Productivity +40%.`)] };
    case 'joke': { const j = JOKES[jokeI++ % JOKES.length]; return { out: [o(j)] }; }
    case 'fortune': { const f = FORTUNES[fortuneI++ % FORTUNES.length]; return { out: [o(<>🥠 {f}</>)] }; }
    case 'cowsay': {
      const t = argRaw || 'hire Dilshad';
      const bar = '-'.repeat(t.length + 2);
      return { out: [o(<pre className="art">{` ${'_'.repeat(t.length + 2)}\n< ${t} >\n ${bar}\n        \\   ^__^\n         \\  (oo)\\_______\n            (__)\\       )\\/\\\n                ||----w |\n                ||     ||`}</pre>)] };
    }
    case 'matrix': return { out: [ok('Wake up, visitor…')], fx: 'matrix' };
    case 'weather':
      return { out: [o(<>Chennai: ☀ 32°C, humidity 78%, chance of filter coffee 100%.</>)] };
    case 'ping':
      return { out: [o(`PING ${arg || 'dilshad'}: 56 data bytes`), o('64 bytes: icmp_seq=1 time=fast'), o('64 bytes: icmp_seq=2 time=faster'), ok('pong. Usually replies within 24h.')] };
    case 'date': return { out: [o(new Date().toString())] };
    case 'echo': return { out: [o(argRaw)] };
    case 'pwd': return { out: [o('/home/visitor/dilshad-portfolio')] };
    case '42': return { out: [o('The answer. But what was the question?')] };
    case 'vim': case 'vi': case 'nano': case 'emacs':
      return { out: [er(`${cmd} opened. You are now trapped.`), o(<i>hint: type :q</i>)] };
    case 'exit': case 'quit': case 'bye': case 'logout':
      return { out: [o('Bye! Taking you back to the top ↑')], fx: 'top' };
    case 'sudo':
      if (arg.startsWith('hire')) return { out: [ok('permission granted ✓'), o(<>Let’s do this properly: <Run c="hire" ctx={ctx} /></>)] };
      return { out: [er('visitor is not in the sudoers file. This incident will be reported.'), o(<i>(hint: sudo hire-me)</i>)] };
    case 'hack': return { out: [ok('Access granted… to my public GitHub.'), o(<a href={SITE.github} target="_blank" rel="noopener noreferrer">github.com/alamdilshad87 ↗</a>)] };

    default: {
      const s = suggest(low) ?? suggest(cmd);
      return { out: [er(<>command not found: {cmd}.{s ? <> Did you mean <Run c={s} ctx={ctx} />?</> : <> Type <Run c="help" ctx={ctx} />.</>}</>)] };
    }
  }
}

/* ---------------- matrix rain ---------------- */

let seed = 7;
const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

function Matrix({ onDone }: { onDone: () => void }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current;
    const g = cv?.getContext('2d');
    if (!cv || !g) { onDone(); return; }
    const w = (cv.width = cv.offsetWidth), h = (cv.height = cv.offsetHeight);
    const cols = Math.floor(w / 14);
    const y = Array.from({ length: cols }, () => rnd() * -40);
    const chars = 'アカサタナハマヤラ0123456789DILSHAD{}<>/';
    let raf = 0;
    const draw = () => {
      g.fillStyle = 'rgba(11,13,22,.12)';
      g.fillRect(0, 0, w, h);
      g.fillStyle = '#2BE8B0';
      g.font = '13px monospace';
      y.forEach((v, i) => {
        g.fillText(chars[Math.floor(rnd() * chars.length)], i * 14, v * 14);
        y[i] = v * 14 > h && rnd() > 0.95 ? 0 : v + 1;
      });
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    const t = setTimeout(onDone, 3800);
    return () => { cancelAnimationFrame(raf); clearTimeout(t); };
  }, [onDone]);
  return <canvas ref={ref} className="term-matrix" aria-hidden="true" />;
}

/* ---------------- the terminal UI ---------------- */

type Line = { id: number; kind: Kind; text: ReactNode; d: number };
type Hire = null | { step: 'name' } | { step: 'msg'; name: string };

export function Terminal() {
  const reduced = useReduced();
  const nextId = useRef(1);
  const [lines, setLines] = useState<Line[]>([{ id: 0, kind: 'out', d: 0, text: <>dilshad-os {SITE.build} · say <b>hi</b>, or type <b>help</b></> }]);
  const [val, setVal] = useState('');
  const [hist, setHist] = useState<string[]>([]);
  const [hi, setHi] = useState(-1);
  const [hire, setHire] = useState<Hire>(null);
  const [matrix, setMatrix] = useState(false);
  const screen = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const stopMatrix = useCallback(() => setMatrix(false), []);

  useEffect(() => { screen.current?.scrollTo({ top: screen.current.scrollHeight, behavior: 'smooth' }); }, [lines]);

  const push = (echo: string | null, out: Out[], prompt = '$') => {
    const add: Line[] = [];
    if (echo !== null) add.push({ id: nextId.current++, kind: 'in', text: <><span className="pr">{prompt}</span> {echo}</>, d: 0 });
    out.forEach((l, i) => add.push({ id: nextId.current++, kind: l.kind ?? 'out', text: l.text, d: i + 1 }));
    setLines((ls) => [...ls, ...add].slice(-120));
  };

  const ctx: Ctx = { exec: (c) => submit(c) };

  function submit(cmd: string) {
    setVal('');
    setHi(-1);
    // hire flow: name, then message, then open the mail app
    if (hire) {
      const t = cmd.trim();
      if (t.toLowerCase() === 'cancel' || t === '') { setHire(null); push(t || 'cancel', [o('Cancelled. No message sent.')], '›'); return; }
      if (hire.step === 'name') { setHire({ step: 'msg', name: t }); push(t, [o(`Nice to meet you, ${t}. What would you like to say?`)], 'name ›'); return; }
      setHire(null);
      const subject = encodeURIComponent(`Hello from ${hire.name} (via your portfolio)`);
      const body = encodeURIComponent(`${t}\n\n— ${hire.name}`);
      push(t, [ok('Opening your mail app with the message ready to send ✓'), o(<i>nothing opened? type email to see the address</i>)], 'msg ›');
      window.location.href = `mailto:${getEmail()}?subject=${subject}&body=${body}`;
      return;
    }
    if (cmd.trim()) setHist((h) => [cmd, ...h.filter((x) => x !== cmd)].slice(0, 30));
    const r = run(cmd, ctx);
    if (r.fx === 'clear') { setLines([]); return; }
    push(cmd, r.out);
    if (r.fx === 'hire') setHire({ step: 'name' });
    if (r.fx === 'matrix' && !reduced) setMatrix(true);
    if (r.fx === 'top') setTimeout(() => scrollToId('top'), 600);
  }

  const complete = () => {
    const v = val.toLowerCase();
    if (!v) return;
    const m = COMMANDS.filter((c) => c.startsWith(v));
    if (m.length === 1) setVal(m[0] + (['open', 'goto', 'cowsay', 'echo', 'ping'].includes(m[0]) ? ' ' : ''));
    else if (m.length > 1) push(null, [o(<i>{m.join('   ')}</i>)]);
  };

  const prompt = hire ? (hire.step === 'name' ? 'name ›' : 'msg ›') : '$';

  return (
    <div className="term" onClick={() => input.current?.focus()}>
      <div className="term-bar"><i /><i /><i /><span>dilshad@portfolio: ~</span></div>
      <div className="term-body">
      {matrix && <Matrix onDone={stopMatrix} />}
      <div ref={screen} className="term-screen" data-lenis-prevent role="log" aria-live="polite" aria-label="Terminal output">
        {lines.map((l) => (
          <div key={l.id} className={`tl ${l.kind}`} style={{ ['--d' as string]: l.d }}>{l.text}</div>
        ))}
        <form className="term-in" onSubmit={(e) => { e.preventDefault(); submit(val); }}>
          <label htmlFor="term-input" className="pr">{prompt}</label>
          <input id="term-input" ref={input} value={val} onChange={(e) => setVal(e.target.value)} autoComplete="off" spellCheck={false}
            aria-label={hire ? (hire.step === 'name' ? 'Your name' : 'Your message') : 'Type a command'}
            placeholder={hire ? (hire.step === 'name' ? 'your name' : 'your message') : 'say hi, or type help'}
            onKeyDown={(e) => {
              if (e.key === 'Tab' && !hire) { e.preventDefault(); complete(); }
              if (e.key === 'Escape' && hire) { e.preventDefault(); submit('cancel'); }
              if (e.key.toLowerCase() === 'l' && e.ctrlKey) { e.preventDefault(); setLines([]); }
              if (e.key === 'ArrowUp' && !hire) { e.preventDefault(); const n = Math.min(hist.length - 1, hi + 1); if (hist[n]) { setHi(n); setVal(hist[n]); } }
              if (e.key === 'ArrowDown' && !hire) { e.preventDefault(); const n = hi - 1; setHi(Math.max(-1, n)); setVal(n >= 0 ? hist[n] : ''); }
            }} />
        </form>
      </div>
      </div>
      <div className="term-chips" aria-label="Try a command">
        {['hi', 'neofetch', 'projects', 'hire', 'help'].map((c) => (
          <button key={c} type="button" onClick={(e) => { e.stopPropagation(); submit(c); }}>{c}</button>
        ))}
      </div>
    </div>
  );
}
