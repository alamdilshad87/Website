import { motion, useScroll, useTransform, type MotionValue } from 'motion/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { PROJECTS, projectTone, type Project } from '../data/projects';
import { SITE } from '../data/site';
import { useBus, useMedia, useReduced } from '../lib/hooks';
import { Icon } from './icons';
import { Cover } from './ProjectArt';

const SW = ['var(--c-peri)', 'var(--c-orange)', 'var(--c-teal)', 'var(--c-violet)'];
const pad = (n: number) => String(n).padStart(2, '0');

/** Right-side case-study panel on <dialog> (focus trap + Esc). data-lenis-prevent keeps its own scroll. */
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
        <motion.div className="scroll" data-lenis-prevent key={p.id} initial={reduced ? false : { x: 60, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 30 }} style={{ ['--tc' as string]: projectTone(p) }}>
          <div className="top">
            <span>projects/{p.id}</span>
            <button type="button" className="ib" onClick={onClose} aria-label="Close case study" autoFocus>{Icon.close}</button>
          </div>
          <div className="dark-frame"><Cover p={p} eager /></div>
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

function Card({ p, i, n, progress, stack, onOpen }: {
  p: Project; i: number; n: number; progress: MotionValue<number>; stack: boolean; onOpen: (p: Project, el: HTMLElement) => void;
}) {
  const reduced = useReduced();
  // each card shrinks a little as the cards after it slide over
  const scale = useTransform(progress, [i / n, 1], [1, 1 - (n - 1 - i) * 0.03]);
  const dim = useTransform(progress, [i / n, Math.min(1, (i + 1) / n)], [0, i === n - 1 ? 0 : 0.35]);
  return (
    <div className="pcard-wrap" style={stack ? { top: `calc(88px + ${i * 16}px)` } : undefined}>
      <motion.article className={`pcard blk-${p.color}`} style={stack && !reduced ? { scale } : undefined} aria-labelledby={`pt-${p.id}`}>
        <div className="pc-text">
          <div className="pc-top">
            <span className="pc-no">N°{pad(i + 1)}</span>
            <span className="pc-tag">{p.kind}</span>
            {p.featured && <span className="pc-tag solid">case study</span>}
          </div>
          <h3 id={`pt-${p.id}`}>{p.title}</h3>
          <p>{p.desc}</p>
          {p.highlights && <ul className="pc-hl">{p.highlights.slice(0, 3).map((h) => <li key={h}>{h}</li>)}</ul>}
          <div className="pc-stack">{p.stack.map((t) => <span key={t}>{t}</span>)}</div>
          <div className="pc-btns">
            <button type="button" className="btn primary" onClick={(e) => onOpen(p, e.currentTarget)} aria-haspopup="dialog">Read case study →</button>
            {p.repo && <a className="btn" href={p.repo} target="_blank" rel="noopener noreferrer">GitHub ↗</a>}
          </div>
        </div>
        <button type="button" className="pc-media dark-frame" onClick={(e) => onOpen(p, e.currentTarget)} aria-label={`Open ${p.title} case study`} data-cursor="open">
          <Cover p={p} />
        </button>
        {stack && !reduced && <motion.div className="pc-dim" style={{ opacity: dim }} aria-hidden="true" />}
      </motion.article>
    </div>
  );
}

export function Projects() {
  const [open, setOpen] = useState<Project | null>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const stack = useMedia('(min-width: 860px)', true);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ['start start', 'end end'] });

  const onOpen = (p: Project, el: HTMLElement) => { lastFocus.current = el; setOpen(p); };
  const openById = useCallback((id: string) => {
    const p = PROJECTS.find((q) => q.id === id);
    if (p) { lastFocus.current = document.activeElement as HTMLElement; setOpen(p); }
  }, []);
  useBus('open-project', openById);
  const close = () => { setOpen(null); lastFocus.current?.focus?.(); };

  return (
    <section id="projects" className="sec projects">
      <div className="wrap">
        <div className="sh">
          <div><span className="eyebrow">projects/</span><h2 className="h2">Things I’ve <em>built</em></h2></div>
          <p className="sh-note">{PROJECTS.length} projects, from API tooling and offline AI to hardware. Scroll through the stack, open any card for the full story.</p>
        </div>
        <div ref={listRef} className={`pstack${stack ? ' stacked' : ''}`}>
          {PROJECTS.map((p, i) => <Card key={p.id} p={p} i={i} n={PROJECTS.length} progress={scrollYProgress} stack={stack} onOpen={onOpen} />)}
        </div>
        <p style={{ marginTop: 40 }}>
          <a className="btn" href={SITE.github} target="_blank" rel="noopener noreferrer">All repositories on GitHub ↗</a>
        </p>
      </div>
      <CaseStudy p={open} onClose={close} />
    </section>
  );
}
