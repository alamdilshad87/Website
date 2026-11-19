import { AnimatePresence, motion, useMotionValue, useSpring } from 'motion/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { PROJECT_FILTERS, PROJECTS, projectTone, type Project, type ProjectCat } from '../data/projects';
import { useBus, useFinePointer, useReduced } from '../lib/hooks';
import { Cover } from './ProjectArt';
import { Chips } from './ui';
import { Icon } from './icons';

const SW = ['var(--c-peri)', 'var(--c-orange)', 'var(--c-teal)', 'var(--c-violet)'];
const pad = (n: number) => String(n).padStart(2, '0');

/** Right-side case-study panel built on <dialog>, which gives focus trapping and Esc for free. */
function CaseStudy({ p, onClose }: { p: Project | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const reduced = useReduced();
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (p && !d.open) d.showModal();
    if (!p && d.open) d.close();
  }, [p]);
  return (
    <dialog ref={ref} className="drawer" aria-label={p ? `${p.title} case study` : 'Case study'} onClose={onClose}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      {p && (
        <motion.div className="scroll" key={p.id} initial={reduced ? false : { x: 60, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 30 }}
          style={{ ['--tc' as string]: projectTone(p) }}>
          <div className="top">
            <span>work/{p.id}</span>
            <button type="button" className="ib" onClick={onClose} aria-label="Close case study" autoFocus>{Icon.close}</button>
          </div>
          <Cover p={p} eager />
          <div className="body">
            <span className="kind">{p.kind} · {p.tag}</span>
            <h3>{p.title}</h3>
            <p>{p.desc}</p>
            {p.highlights && <ul className="hl">{p.highlights.map((h) => <li key={h}>{h}</li>)}</ul>}
            <div className="stackchips">{p.stack.map((t, k) => <span key={t} style={{ ['--sw' as string]: SW[k % 4] }}>{t}</span>)}</div>
            <div className="links">
              {p.repo && <a className="btn primary" href={p.repo} target="_blank" rel="noopener noreferrer">View on GitHub ↗</a>}
              {p.demo && <a className="btn" href={p.demo} target="_blank" rel="noopener noreferrer">Live demo ↗</a>}
            </div>
          </div>
        </motion.div>
      )}
    </dialog>
  );
}

export function Work() {
  const [filter, setFilter] = useState<'all' | ProjectCat>('all');
  const [hover, setHover] = useState<Project | null>(null);
  const [open, setOpen] = useState<Project | null>(null);
  const fine = useFinePointer();
  const reduced = useReduced();
  const x = useSpring(useMotionValue(0), { stiffness: 260, damping: 26, mass: 0.5 });
  const y = useSpring(useMotionValue(0), { stiffness: 260, damping: 26, mass: 0.5 });
  const lastFocus = useRef<HTMLElement | null>(null);

  const list = PROJECTS.filter((p) => filter === 'all' || p.cats.includes(filter));

  const openProject = useCallback((id: string) => {
    const p = PROJECTS.find((q) => q.id === id);
    if (p) { lastFocus.current = document.activeElement as HTMLElement; setOpen(p); }
  }, []);
  useBus('open-project', openProject);

  const close = () => { setOpen(null); lastFocus.current?.focus?.(); };

  return (
    <section id="work" className="sec">
      <div className="wrap">
        <div className="sh">
          <div><span className="eyebrow">work/</span><h2 className="h2">Selected <em>work</em></h2></div>
          <Chips id="work" label="Filter projects" items={PROJECT_FILTERS} value={filter} onChange={setFilter} />
        </div>
        <p className="count" aria-live="polite">showing {list.length} of {PROJECTS.length} · click a project for the case study</p>

        <ul className="wlist" onPointerLeave={() => setHover(null)}
          onPointerMove={(e) => { if (fine) { x.set(e.clientX + 24); y.set(e.clientY - 120); } }}>
          <AnimatePresence initial={false}>
            {list.map((p) => {
              const i = PROJECTS.indexOf(p);
              return (
                <motion.li key={p.id} layout={!reduced} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: reduced ? 0 : 0.35 }}>
                  <button type="button" className="wrow" style={{ ['--tc' as string]: projectTone(p) }} data-cursor="open"
                    onPointerEnter={() => fine && setHover(p)}
                    onClick={(e) => { lastFocus.current = e.currentTarget; setOpen(p); }}
                    aria-haspopup="dialog">
                    <span className="no">{pad(i + 1)}</span>
                    <span className="tt">{p.title}</span>
                    <span className="meta">
                      {p.featured && <span className="feat">case study</span>}
                      <span>{p.tag}</span>
                    </span>
                    <span className="ar" aria-hidden="true">→</span>
                  </button>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ul>

        <p style={{ marginTop: 34 }}>
          <a className="btn" href="https://github.com/alamdilshad87" target="_blank" rel="noopener noreferrer">All repositories on GitHub ↗</a>
        </p>
      </div>

      {fine && !reduced && (
        <motion.div className="hoverprev" aria-hidden="true" style={{ x, y, ['--tc' as string]: hover ? projectTone(hover) : undefined }}
          initial={false} animate={{ opacity: hover ? 1 : 0, scale: hover ? 1 : 0.85, rotate: hover ? -3 : 0 }} transition={{ duration: 0.25 }}>
          {hover && <><Cover p={hover} /><div className="lbl"><span>{hover.kind}</span><span>{hover.stack.slice(0, 2).join(' · ')}</span></div></>}
        </motion.div>
      )}

      <CaseStudy p={open} onClose={close} />
    </section>
  );
}
