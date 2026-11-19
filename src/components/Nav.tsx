import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react';
import { useEffect, useState } from 'react';
import { SECTIONS, SITE } from '../data/site';
import { emit, scrollToId, useReduced, useTheme } from '../lib/hooks';
import { Icon } from './icons';

export function Logo() {
  return (
    <svg viewBox="0 0 128 128" aria-hidden="true">
      <defs><mask id="lgc"><rect width="128" height="128" fill="#fff" /><path d="M47 44L69 64L47 84" fill="none" stroke="#000" strokeWidth="13" /></mask></defs>
      <path d="M20 18H62C92 18 110 38 110 64C110 90 92 110 62 110H20Z" fill="var(--c-peri)" mask="url(#lgc)" />
      <rect className="cur" x="74" y="79" width="22" height="11" fill="var(--c-orange)" />
    </svg>
  );
}

export function Nav() {
  const [active, setActive] = useState('');
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { theme, toggle } = useTheme();
  const reduced = useReduced();
  const { scrollY, scrollYProgress } = useScroll();

  // hide on scroll down, show on scroll up
  useMotionValueEvent(scrollY, 'change', (v) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(v > 400 && v > prev && !open);
  });

  useEffect(() => {
    const io = new IntersectionObserver(
      (en) => en.forEach((x) => x.isIntersecting && setActive(x.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    );
    SECTIONS.forEach((s) => { const el = document.getElementById(s.id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [open]);

  // a theme action from the command palette
  useEffect(() => {
    const h = () => toggle();
    window.addEventListener('mda:theme', h);
    return () => window.removeEventListener('mda:theme', h);
  }, [toggle]);

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    scrollToId(id);
    history.replaceState(null, '', `#${id}`);
  };

  return (
    <>
      <motion.div className="progress" style={{ scaleX: scrollYProgress }} aria-hidden="true" />
      <motion.header
        className="nav"
        animate={{ y: hidden ? -90 : 0 }}
        transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 300, damping: 32 }}
      >
        <a className="logo" href="#top" onClick={go('top')} aria-label={`${SITE.name}, back to top`}>
          <Logo /> {SITE.short}
        </a>
        <nav aria-label="Primary">
          <ul className="nav-links">
            {SECTIONS.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} onClick={go(s.id)} aria-current={active === s.id ? 'true' : undefined}>
                  {active === s.id && <motion.span layoutId="nav-act" className="act" transition={{ type: 'spring', stiffness: 380, damping: 34 }} />}
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div style={{ display: 'flex', gap: 6 }}>
          <button type="button" className="ib" onClick={() => emit('palette', true)} aria-label="Search the site" aria-keyshortcuts="Control+K Meta+K">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>{Icon.search}<kbd className="hidden sm:inline">⌘K</kbd></span>
          </button>
          <button type="button" className="ib" onClick={toggle} aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}>
            {theme === 'dark' ? Icon.sun : Icon.moon}
          </button>
          <button type="button" className="ib menu" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls="mnav" aria-label={open ? 'Close menu' : 'Open menu'}>
            {open ? Icon.close : Icon.menu}
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mnav"
            className="mnav"
            aria-label="Mobile"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: reduced ? 0 : 0.5, ease: [0.2, 0.8, 0.2, 1] }}
          >
            {SECTIONS.map((s, i) => (
              <motion.a
                key={s.id}
                href={`#${s.id}`}
                onClick={go(s.id)}
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: reduced ? 0 : 0.12 + i * 0.05 }}
              >
                <span>0{i + 1}</span>{s.label}
              </motion.a>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
