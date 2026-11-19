import { motion, useMotionValue, useScroll, useSpring, useTransform, type MotionValue } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { asset, SITE } from '../data/site';
import { scrollToId, useReduced } from '../lib/hooks';
import { Magnetic } from './ui';

/**
 * "Vista" landing: a quiet layered landscape. Sky, ridges, sun or moon all
 * follow the visitor's clock (dawn, day, golden hour, night). Ridges drift at
 * different depths with the pointer and the scroll, clouds pass slowly.
 */

type Phase = 'dawn' | 'day' | 'golden' | 'night';
const phaseOf = (h: number): Phase => (h >= 5 && h < 8 ? 'dawn' : h >= 8 && h < 16.5 ? 'day' : h >= 16.5 && h < 19.5 ? 'golden' : 'night');
const GREETING: Record<Phase, string> = { dawn: 'Good morning', day: 'Good afternoon', golden: 'Good evening', night: 'Good night' };
const LABEL: Record<Phase, string> = { dawn: 'dawn', day: 'daylight', golden: 'golden hour', night: 'night' };
const arc = (h: number) => (h >= 5 && h < 19.5 ? (h - 5) / 14.5 : (h >= 19.5 ? h - 19.5 : h + 4.5) / 9.5);
const fmt = (d: Date, tz?: string) => { try { return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: tz }); } catch { return ''; } };

/** A ridge line across a 1600-wide box, from layered sines so each layer has its own skyline. */
function ridge(seed: number, base: number, amp: number) {
  const pts: string[] = [];
  for (let x = 0; x <= 1600; x += 20) {
    const y = base
      - Math.sin(x * 0.0021 + seed) * amp
      - Math.sin(x * 0.0057 + seed * 2.3) * amp * 0.45
      - Math.sin(x * 0.013 + seed * 4.1) * amp * 0.14;
    pts.push(`${x},${y.toFixed(1)}`);
  }
  return `M0,600 L${pts.join(' L')} L1600,600 Z`;
}
const LAYERS = [
  { d: ridge(1.3, 330, 70), depth: 0.15 },
  { d: ridge(4.2, 380, 60), depth: 0.3 },
  { d: ridge(7.9, 430, 52), depth: 0.5 },
  { d: ridge(2.6, 480, 44), depth: 0.75 },
  { d: ridge(5.5, 535, 30), depth: 1 },
];

function Layer({ d, depth, i, mx, sy }: { d: string; depth: number; i: number; mx: MotionValue<number>; sy: MotionValue<number> }) {
  const x = useTransform(mx, (v) => v * -60 * depth);
  const y = useTransform(sy, (v) => v * 220 * (1 - depth * 0.7));
  return (
    <motion.svg className={`vs-ridge r${i}`} viewBox="0 0 1600 600" preserveAspectRatio="none" style={{ x, y }} aria-hidden="true">
      <path d={d} />
    </motion.svg>
  );
}

export function HeroVista() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReduced();
  const [now, setNow] = useState(() => new Date());
  useEffect(() => { const i = setInterval(() => setNow(new Date()), 30_000); return () => clearInterval(i); }, []);
  const h = now.getHours() + now.getMinutes() / 60;
  const phase = phaseOf(h);
  const p = arc(h);

  const mx = useSpring(useMotionValue(0), { stiffness: 35, damping: 16 });
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const textY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const textO = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const soft = (delay: number) => (reduced ? {} : {
    initial: { opacity: 0, y: 16, filter: 'blur(8px)' },
    animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
    transition: { duration: 1.2, delay, ease: [0.22, 1, 0.36, 1] as const },
  });

  return (
    <section ref={ref} id="top" className={`vs vs-${phase}`}
      onPointerMove={(e) => { if (!reduced) mx.set(e.clientX / window.innerWidth - 0.5); }}
      onPointerLeave={() => mx.set(0)}>
      <div className="vs-sky" aria-hidden="true" />
      {phase === 'night' && <div className="vs-stars" aria-hidden="true" />}
      <motion.div className={`vs-orb ${phase === 'night' ? 'moon' : 'sun'}`} aria-hidden="true"
        style={{ left: `${10 + p * 80}%` }}
        initial={reduced ? { top: `${62 - Math.sin(p * Math.PI) * 44}%` } : { top: '70%', opacity: 0 }}
        animate={{ top: `${62 - Math.sin(p * Math.PI) * 44}%`, opacity: 1 }}
        transition={{ duration: 2.6, ease: [0.22, 1, 0.36, 1] }} />
      <div className="vs-clouds" aria-hidden="true"><i /><i /><i /></div>
      <div className="vs-land">
        {LAYERS.map((l, i) => <Layer key={i} i={i} d={l.d} depth={l.depth} mx={mx} sy={scrollYProgress} />)}
      </div>

      <motion.div className="wrap vs-copy" style={reduced ? undefined : { y: textY, opacity: textO }}>
        <motion.p className="vs-kicker" {...soft(0.2)}>
          <img src={asset('design/dilshad-360.webp')} alt="" width="28" height="28" />
          {SITE.name} · developer &amp; designer · {SITE.city}
        </motion.p>
        <h1 className="vs-title">
          <motion.span className="hello" {...soft(0.4)}>{GREETING[phase]},</motion.span>
          <motion.span className="name" {...soft(0.55)}>I’m Dilshad.</motion.span>
        </h1>
        <motion.p className="vs-line" {...soft(0.8)}>
          I build calm, dependable software and design the way it looks: .NET and Angular, offline AI, and the visual identity of AARUUSH.
        </motion.p>
        <motion.div className="vs-cta" {...soft(1)}>
          <Magnetic><a className="btn primary" href="#projects" onClick={(e) => { e.preventDefault(); scrollToId('projects'); }}>See my projects</a></Magnetic>
          <Magnetic><a className="btn" href="#contact" onClick={(e) => { e.preventDefault(); scrollToId('contact'); }}>Say hello</a></Magnetic>
        </motion.div>
      </motion.div>

      <motion.p className="vs-foot" aria-hidden="true" {...soft(1.3)}>
        your sky · {fmt(now)} · {LABEL[phase]} <span>·</span> Chennai · {fmt(now, 'Asia/Kolkata')}
      </motion.p>
    </section>
  );
}
