import { motion, useMotionValueEvent, useScroll } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { SITE } from '../data/site';
import { scrollToId, useReduced } from '../lib/hooks';
import { PortraitField, type RenderMode } from './PortraitField';
import { Magnetic } from './ui';

function LocalTime() {
  const [t, setT] = useState('');
  useEffect(() => {
    const tick = () => { try { setT(new Date().toLocaleTimeString('en-GB', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' })); } catch { setT(''); } };
    tick();
    const i = setInterval(tick, 15000);
    return () => clearInterval(i);
  }, []);
  return <>{t} IST</>;
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReduced();
  const [mode, setMode] = useState<RenderMode>('code');
  const [burst, setBurst] = useState(0);
  const scrollRef = useRef(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  useMotionValueEvent(scrollYProgress, 'change', (v) => { scrollRef.current = v; });

  const rise = (d: number) => (reduced ? {} : {
    initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay: d, ease: [0.2, 0.8, 0.2, 1] as const },
  });

  return (
    <section ref={ref} id="top" className="hero">
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <motion.p className="hero-tag" {...rise(0.05)}>
            <span className="dot" aria-hidden="true" /> open to roles · {SITE.city} · <LocalTime />
          </motion.p>
          <motion.h1 className="hero-title" {...rise(0.12)}>
            <span className="hello">Hi, I’m {SITE.name.replace('Md ', '')}.</span>
            I build software <em>and</em> design how it looks.
          </motion.h1>
          <motion.p className="lede" {...rise(0.2)}>
            CS graduate from SRMIST. .NET and Angular, retrieval AI that runs offline, and the posters, identities and merch for AARUUSH.
          </motion.p>

          <motion.div className="render" {...rise(0.28)}>
            <span className="render-lbl">render me as</span>
            <div className="render-seg" role="group" aria-label="Portrait style">
              {([['code', '</> code'], ['halftone', '● halftone']] as const).map(([m, label]) => (
                <button key={m} type="button" aria-pressed={mode === m} onClick={() => setMode(m)}>
                  {mode === m && <motion.span layoutId="render-pill" className="pill" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
                  {label}
                </button>
              ))}
            </div>
            <button type="button" className="render-burst" onClick={() => setBurst((b) => b + 1)} aria-label="Scatter the portrait">✱ scatter</button>
          </motion.div>

          <motion.div className="cta" {...rise(0.36)}>
            <Magnetic><a className="btn primary" href="#projects" onClick={(e) => { e.preventDefault(); scrollToId('projects'); }}>See my projects →</a></Magnetic>
            <Magnetic><a className="btn" href="#design" onClick={(e) => { e.preventDefault(); scrollToId('design'); }}>Design reel</a></Magnetic>
          </motion.div>
        </div>

        <motion.div className="viewfinder" {...(reduced ? {} : { initial: { opacity: 0, scale: 0.94 }, animate: { opacity: 1, scale: 1 }, transition: { duration: 1, delay: 0.1 } })}>
          <PortraitField mode={mode} burst={burst} scrollRef={scrollRef} />
          <i className="vf tl" aria-hidden="true" /><i className="vf tr" aria-hidden="true" /><i className="vf bl" aria-hidden="true" /><i className="vf br" aria-hidden="true" />
          <span className="vf-l t" aria-hidden="true">subject: md_dilshad_alam</span>
          <span className="vf-l r" aria-hidden="true">mode: {mode === 'code' ? 'ascii' : 'halftone'}</span>
          <span className="vf-l b" aria-hidden="true">{reduced ? 'still' : 'move · click · scroll'}</span>
        </motion.div>
      </div>
      <p className="hero-hint" aria-hidden="true">scroll ↓</p>
    </section>
  );
}
