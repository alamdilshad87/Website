import { AnimatePresence, motion, useMotionValue, useScroll, useSpring, useTransform, type MotionValue } from 'motion/react';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { asset, SITE } from '../data/site';
import { scrollToId, useReduced } from '../lib/hooks';
import { Magnetic, Pic } from './ui';

const LINES = [
  { text: 'DILSHAD', hollow: false },
  { text: 'ALAM', hollow: true },
];
const REST = { w: 560, wd: 78 };
const HOT = { w: 800, wd: 100 };

/**
 * The name is set in Bricolage Grotesque, a variable font. Letters near the pointer
 * swell in weight and width and warm to orange; away from it they relax.
 * With no pointer, a slow pulse rolls through the letters instead.
 */
function VariableName() {
  const ref = useRef<HTMLHeadingElement>(null);
  const reduced = useReduced();
  const [ready, setReady] = useState(false);

  // fit the longest line to the container at rest settings
  useLayoutEffect(() => {
    const h = ref.current;
    if (!h) return;
    const fit = () => {
      const line = h.querySelector<HTMLElement>('.line');
      const box = h.parentElement;
      if (!line || !box) return;
      h.style.setProperty('--fs', '100px');
      const w = line.getBoundingClientRect().width;
      if (w > 0) h.style.setProperty('--fs', `${Math.floor(Math.min((100 * box.clientWidth * 0.9) / w, window.innerHeight * 0.24, 280))}px`);
    };
    fit();
    document.fonts?.ready.then(() => { fit(); setReady(true); });
    const ro = new ResizeObserver(fit);
    ro.observe(h.parentElement!);
    window.addEventListener('resize', fit);
    return () => { ro.disconnect(); window.removeEventListener('resize', fit); };
  }, []);

  useEffect(() => {
    const h = ref.current;
    if (!h || reduced) return;
    const letters = Array.from(h.querySelectorAll<HTMLElement>('.ch > span'));
    const hero = h.closest('section')!;
    let px = -1e4, py = -1e4, lastMove = 0, raf = 0, visible = true;
    const move = (e: PointerEvent) => { px = e.clientX; py = e.clientY; lastMove = performance.now(); };
    const leave = () => { px = -1e4; py = -1e4; };
    hero.addEventListener('pointermove', move);
    hero.addEventListener('pointerleave', leave);
    const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; });
    io.observe(hero);
    const cur = letters.map(() => 0);

    const tick = (t: number) => {
      raf = requestAnimationFrame(tick);
      if (!visible) return;
      const fs = parseFloat(getComputedStyle(h).getPropertyValue('--fs')) || 120;
      const idle = t - lastMove > 1600;
      letters.forEach((el, i) => {
        let target: number;
        if (idle) {
          const s = Math.sin(t * 0.0016 - i * 0.55);
          target = Math.pow(Math.max(0, s), 8) * 0.85;
        } else {
          const r = el.getBoundingClientRect();
          const d = Math.hypot(r.left + r.width / 2 - px, r.top + r.height / 2 - py);
          target = Math.max(0, 1 - d / (fs * 1.5)) ** 1.6;
        }
        cur[i] += (target - cur[i]) * 0.14;
        const k = cur[i];
        el.style.setProperty('--w', String(Math.round(REST.w + (HOT.w - REST.w) * k)));
        el.style.setProperty('--wd', (REST.wd + (HOT.wd - REST.wd) * k).toFixed(1));
        el.style.setProperty('--k', k.toFixed(3));
      });
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      hero.removeEventListener('pointermove', move);
      hero.removeEventListener('pointerleave', leave);
    };
  }, [reduced]);

  let n = 0;
  return (
    <h1 ref={ref} className="vname" aria-label={SITE.name}>
      <motion.span
        className="md"
        aria-hidden="true"
        initial={reduced ? false : { opacity: 0, y: 20, rotate: -6 }}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.2, 0.8, 0.2, 1] }}
      >
        Md
      </motion.span>
      {LINES.map((l) => (
        <span key={l.text} className={`line${l.hollow ? ' hollow' : ''}`} aria-hidden="true">
          {l.text.split('').map((c, i) => {
            const idx = n++;
            return (
              <span className="ch" key={i}>
                <motion.span
                  initial={reduced ? false : { y: '105%' }}
                  animate={ready || reduced ? { y: '0%' } : undefined}
                  transition={{ duration: 0.9, delay: 0.15 + idx * 0.05, ease: [0.2, 0.8, 0.2, 1] }}
                  style={reduced ? { ['--w' as string]: 700, ['--wd' as string]: 86 } : undefined}
                >
                  {c}
                </motion.span>
              </span>
            );
          })}
        </span>
      ))}
    </h1>
  );
}

const PHRASES = ['scalable .NET backends', 'retrieval AI that runs offline', 'Angular interfaces', 'posters, identities and merch'];

function Rotator() {
  const reduced = useReduced();
  const [i, setI] = useState(0);
  useEffect(() => {
    if (reduced) return;
    const t = setInterval(() => setI((x) => (x + 1) % PHRASES.length), 2600);
    return () => clearInterval(t);
  }, [reduced]);
  return (
    <p className="role">
      <span className="sr-only">I build {PHRASES.slice(0, -1).join(', ')} and design {PHRASES.at(-1)}.</span>
      <span aria-hidden="true">
        I build{' '}
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={i}
            className="rot"
            initial={{ opacity: 0, filter: 'blur(10px)', y: 10 }}
            animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
            exit={{ opacity: 0, filter: 'blur(10px)', y: -10 }}
            transition={{ duration: 0.45 }}
          >
            {PHRASES[i]}
          </motion.span>
        </AnimatePresence>
      </span>
    </p>
  );
}

type TileDef = {
  id: string; left?: string; right?: string; top: string; w: string; ratio: string; rot: number; depth: number;
  img?: string; widths?: number[]; tag?: string; code?: boolean; cursor?: string;
};
const TILES: TileDef[] = [
  { id: 'crowd', left: '1.5%', top: '15%', w: '17vw', ratio: '3/2', rot: -6, depth: 1.2, img: 'photos/team-aaruush', tag: 'Team AARUUSH, main stage' },
  { id: 'pronite', right: '2.5%', top: '13%', w: '16vw', ratio: '16/9', rot: 5, depth: 0.8, img: 'design/pro-nite', widths: [800, 1500], tag: 'poster · Pro Nite ’24', cursor: 'design' },
  { id: 'flower', left: '5%', top: '57%', w: '10.5vw', ratio: '5/6', rot: 4, depth: 1.6, img: 'photos/candid-flower', tag: 'AARUUSH ’25' },
  { id: 'code', right: '2%', top: '50%', w: '16vw', ratio: 'auto', rot: -3, depth: 1, code: true },
  { id: 'rose', right: '18%', top: '73%', w: '8.5vw', ratio: '2/3', rot: 7, depth: 1.9, img: 'photos/portrait-rose' },
  { id: 'festive', left: '18%', top: '78%', w: '13vw', ratio: '16/9', rot: -4, depth: 1.4, img: 'design/festive-wall', widths: [800, 1500], cursor: 'design' },
];

function Tile({ t, progress, mx, my }: { t: TileDef; progress: MotionValue<number>; mx: MotionValue<number>; my: MotionValue<number> }) {
  const reduced = useReduced();
  const sy = useTransform(progress, [0, 1], [0, -260 * t.depth]);
  const px = useTransform(mx, (v) => v * 18 * t.depth);
  const y = useTransform([sy, my], ([a, b]: number[]) => a + b * 14 * t.depth);
  const go = () => scrollToId(t.cursor === 'design' ? 'design' : t.code ? 'work' : 'about');
  return (
    <motion.div
      className={`tile${t.code ? ' code' : ''}`}
      style={{ left: t.left, right: t.right, top: t.top, width: t.w, y: reduced ? 0 : y, x: reduced ? 0 : px }}
      initial={reduced ? false : { opacity: 0, scale: 0.6, rotate: t.rot * 3 }}
      animate={{ opacity: 1, scale: 1, rotate: t.rot }}
      whileHover={reduced ? undefined : { scale: 1.08, rotate: 0, zIndex: 5 }}
      transition={{ type: 'spring', stiffness: 160, damping: 18, delay: reduced ? 0 : 0.6 + t.depth * 0.15 }}
      data-cursor={t.cursor ?? (t.code ? 'work' : 'about')}
      onClick={go}
    >
      <div className="card" style={{ aspectRatio: t.ratio }}>
        {t.code ? (
          <pre style={{ margin: 0 }}>
            <div className="bar"><i /><i /><i /></div>
            <code>
              <span className="k">const</span> dilshad = {'{'}{'\n'}
              {'  '}stack: [<span className="s">".NET"</span>, <span className="s">"RAG"</span>],{'\n'}
              {'  '}cgpa: <span className="n">8.99</span>,{'\n'}
              {'  '}status: <span className="s">"open"</span>,{'\n'}
              {'}'};{'\n'}
              dilshad.<span className="k">ship</span>();
            </code>
          </pre>
        ) : (
          <Pic base={t.img!} widths={t.widths ?? [640, 1280]} sizes="18vw" alt="" loading="eager" />
        )}
      </div>
      {t.tag && <span className="tag">{t.tag}</span>}
    </motion.div>
  );
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReduced();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const mx = useSpring(useMotionValue(0), { stiffness: 60, damping: 20 });
  const my = useSpring(useMotionValue(0), { stiffness: 60, damping: 20 });
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0.2]);

  return (
    <section
      ref={ref}
      id="top"
      className="hero"
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
        e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
      }}
    >
      <div className="collage" aria-hidden="true">
        {TILES.map((t) => <Tile key={t.id} t={t} progress={scrollYProgress} mx={mx} my={my} />)}
      </div>

      <motion.div className="wrap hero-inner" style={{ opacity: reduced ? 1 : fade }}>
        <p className="hero-eyebrow">// portfolio <em>build {SITE.build}</em> · {SITE.city}</p>
        <VariableName />
        <Rotator />
        <p className="lede">
          Computer Science graduate from SRMIST who ships APIs, Angular interfaces and retrieval-based AI, and designs the posters, identities and merch around them.
        </p>
        <div className="cta">
          <Magnetic><a className="btn primary" href="#work" onClick={(e) => { e.preventDefault(); scrollToId('work'); }}>See the work →</a></Magnetic>
          <Magnetic><a className="btn" href="#design" onClick={(e) => { e.preventDefault(); scrollToId('design'); }}>Browse the design reel</a></Magnetic>
        </div>
        <p className="status"><span className="dot" aria-hidden="true" />Open to roles in India and abroad</p>
        <div className="mstrip" aria-hidden="true">
          <img src={asset('photos/team-aaruush-640.webp')} alt="" />
          <img src={asset('photos/candid-flower-640.webp')} alt="" />
          <img src={asset('design/pro-nite-800.webp')} alt="" />
        </div>
      </motion.div>

      <div className="scrollhint" aria-hidden="true"><i />scroll</div>
    </section>
  );
}
