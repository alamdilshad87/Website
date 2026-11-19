import { AnimatePresence, motion, useMotionValue, useScroll, useSpring, useTransform } from 'motion/react';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { SITE } from '../data/site';
import { scrollToId, useMedia, useReduced } from '../lib/hooks';
import { DotField } from './DotField';
import { Magnetic, Pic } from './ui';

const REST = { w: 560, wd: 78 };
const HOT = { w: 800, wd: 100 };

/**
 * The name, set in a variable font and fitted edge to edge. Letters near the pointer swell
 * in weight and width and warm to orange; with no pointer a slow pulse rolls through them.
 */
function VariableName() {
  const ref = useRef<HTMLHeadingElement>(null);
  const reduced = useReduced();
  const narrow = useMedia('(max-width: 640px)');
  const lines = narrow ? ['DILSHAD', 'ALAM'] : ['DILSHAD ALAM'];
  const [ready, setReady] = useState(false);

  useLayoutEffect(() => {
    const h = ref.current;
    if (!h) return;
    const fit = () => {
      const line = h.querySelector<HTMLElement>('.line');
      if (!line) return;
      h.style.setProperty('--fs', '100px');
      const w = line.getBoundingClientRect().width;
      if (w > 0) h.style.setProperty('--fs', `${Math.floor((100 * h.clientWidth * 0.9) / w)}px`);
    };
    fit();
    document.fonts?.ready.then(() => { fit(); setReady(true); });
    const ro = new ResizeObserver(fit);
    ro.observe(h);
    return () => ro.disconnect();
  }, [narrow]);

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
      const fs = parseFloat(h.style.getPropertyValue('--fs')) || 120;
      const idle = t - lastMove > 1600;
      letters.forEach((el, i) => {
        let target: number;
        if (idle) target = Math.pow(Math.max(0, Math.sin(t * 0.0016 - i * 0.5)), 8) * 0.85;
        else {
          const r = el.getBoundingClientRect();
          target = Math.max(0, 1 - Math.hypot(r.left + r.width / 2 - px, r.top + r.height / 2 - py) / (fs * 1.4)) ** 1.6;
        }
        cur[i] += (target - cur[i]) * 0.14;
        const k = cur[i];
        el.style.setProperty('--w', String(Math.round(REST.w + (HOT.w - REST.w) * k)));
        el.style.setProperty('--wd', (REST.wd + (HOT.wd - REST.wd) * k).toFixed(1));
        el.style.setProperty('--k', k.toFixed(3));
      });
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); io.disconnect(); hero.removeEventListener('pointermove', move); hero.removeEventListener('pointerleave', leave); };
  }, [reduced, narrow]);

  let n = 0;
  return (
    <h1 ref={ref} className="vname" aria-label={SITE.name}>
      {lines.map((l, li) => (
        <span key={l} className={`line${li === lines.length - 1 && narrow ? ' alt' : ''}`} aria-hidden="true">
          {l.split('').map((c, i) => {
            const idx = n++;
            if (c === ' ') return <span className="gap" key={i}> </span>;
            return (
              <span className={`ch${l.indexOf(' ') > -1 && i > l.indexOf(' ') ? ' alt' : ''}`} key={i}>
                <motion.span
                  initial={reduced ? false : { y: '105%' }}
                  animate={ready || reduced ? { y: '0%' } : undefined}
                  transition={{ duration: 0.9, delay: 0.25 + idx * 0.045, ease: [0.2, 0.8, 0.2, 1] }}
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
    <p className="statement">
      <span className="sr-only">I build {PHRASES.slice(0, -1).join(', ')} and design {PHRASES.at(-1)}.</span>
      <span aria-hidden="true">
        I build<br />
        <AnimatePresence mode="wait" initial={false}>
          <motion.span key={i} className="rot"
            initial={{ opacity: 0, filter: 'blur(12px)', y: 14 }}
            animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
            exit={{ opacity: 0, filter: 'blur(12px)', y: -14 }}
            transition={{ duration: 0.45 }}>
            {PHRASES[i]}
          </motion.span>
        </AnimatePresence>
      </span>
    </p>
  );
}

function LocalTime() {
  const [t, setT] = useState('');
  useEffect(() => {
    const tick = () => {
      try { setT(new Date().toLocaleTimeString('en-GB', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' })); } catch { setT(''); }
    };
    tick();
    const i = setInterval(tick, 15000);
    return () => clearInterval(i);
  }, []);
  return <>{t} IST</>;
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReduced();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const nameY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const cardY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const rx = useSpring(useMotionValue(0), { stiffness: 120, damping: 14 });
  const ry = useSpring(useMotionValue(0), { stiffness: 120, damping: 14 });
  const fadeIn = (d: number) => (reduced ? {} : { initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.7, delay: d, ease: [0.2, 0.8, 0.2, 1] as const } });

  return (
    <section ref={ref} id="top" className="hero">
      <DotField />

      <div className="wrap hero-meta">
        <motion.p {...fadeIn(0.1)}><span>[01]</span> Software developer<br />& graphic designer</motion.p>
        <motion.p {...fadeIn(0.18)}><span>[02]</span> Based in {SITE.city}<br /><LocalTime /></motion.p>
        <motion.p {...fadeIn(0.26)} className="avail"><span className="dot" aria-hidden="true" /> Open to roles<br />India and abroad</motion.p>
      </div>

      <div className="wrap hero-mid">
        <motion.div {...fadeIn(0.35)}>
          <Rotator />
          <p className="lede">CS graduate from SRMIST. I ship APIs, Angular interfaces and retrieval-based AI, and design the posters, identities and merch around them.</p>
          <div className="cta">
            <Magnetic><a className="btn primary" href="#projects" onClick={(e) => { e.preventDefault(); scrollToId('projects'); }}>See my projects →</a></Magnetic>
            <Magnetic><a className="btn" href="#design" onClick={(e) => { e.preventDefault(); scrollToId('design'); }}>Design reel</a></Magnetic>
          </div>
        </motion.div>

        <motion.figure className="hero-card" style={reduced ? undefined : { y: cardY, rotateX: rx, rotateY: ry }}
          initial={reduced ? false : { opacity: 0, rotate: 12, scale: 0.8 }} animate={{ opacity: 1, rotate: 4, scale: 1 }}
          transition={{ type: 'spring', stiffness: 120, damping: 16, delay: 0.5 }}
          onPointerMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); ry.set(((e.clientX - r.left) / r.width - 0.5) * 18); rx.set(-((e.clientY - r.top) / r.height - 0.5) * 18); }}
          onPointerLeave={() => { rx.set(0); ry.set(0); }}
          data-cursor="hi!">
          <Pic base="photos/dev-laptop" sizes="280px" alt="Md Dilshad Alam working on a laptop outdoors" loading="eager" />
          <figcaption><span>hi, I’m Dilshad</span><b>● online</b></figcaption>
        </motion.figure>
      </div>

      <motion.div className="hero-name" style={reduced ? undefined : { y: nameY }}>
        <VariableName />
      </motion.div>
      <p className="hero-hint" aria-hidden="true">click anywhere on the grid ✱ scroll ↓</p>
    </section>
  );
}
