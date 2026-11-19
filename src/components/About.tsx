import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import { CHAPTERS } from '../data/chapters';
import { PROJECTS } from '../data/projects';
import { useReduced } from '../lib/hooks';
import { Pic } from './ui';

type Mode = 'dev' | 'des';

const COPY: Record<Mode, { lead: string; sub: string; tags: string[]; photo: string; widths?: number[]; alt: string; s1: string; s2: string }> = {
  dev: {
    lead: 'I build .NET services, Angular frontends and retrieval-based AI, and I can walk you through a system end to end: from the token on the request to the index behind the answer.',
    sub: 'At BridgeLabZ I spent four months shipping .NET and Angular. On my own time I built SpecGuard, an API analysis platform, and a support assistant that answers from your documents on a small local model, with no cloud calls.',
    tags: ['ASP.NET Core', 'Angular', 'FastAPI', 'PostgreSQL', 'RAG', 'Docker'],
    photo: 'photos/dev-laptop', alt: 'Md Dilshad Alam working on a laptop outdoors',
    s1: 'git push --force-with-care', s2: 'SRMIST · class of 2026',
  },
  des: {
    lead: 'I design for AARUUSH, SRMIST’s national-level techno-management fest: posters, banners, standees, Instagram stories, merch, ID cards and tickets that share one identity.',
    sub: 'Fourteen chapters of work from 2023 to 2025, made in Photoshop and Illustrator. I joined as a volunteer, went on to head the creatives team, and now mentor the people who run it.',
    tags: ['Visual identity', 'Event branding', 'Social media', 'Merchandise'],
    photo: 'design/dilshad', widths: [360, 720], alt: 'Md Dilshad Alam smiling with arms crossed in front of an orange sun mural',
    s1: 'Photoshop · Illustrator', s2: 'AARUUSH creatives',
  },
};

export function About() {
  const [mode, setMode] = useState<Mode>('dev');
  const reduced = useReduced();
  const c = COPY[mode];

  return (
    <section id="about" className={`sec about ${mode === 'dev' ? 'blk-peri' : 'blk-orange'}`} data-mode={mode}>
      <div className="wrap about-grid">
        <figure className="portrait">
          <svg className="ast" viewBox="0 0 24 24" aria-hidden="true"><g stroke="currentColor" strokeWidth="3.2" strokeLinecap="round"><path d="M12 2.5v19M3.8 7.2l16.4 9.6M3.8 16.8l16.4-9.6" /></g></svg>
          <div className="frame">
            <AnimatePresence initial={false}>
              <motion.div
                key={mode}
                style={{ position: 'absolute', inset: 0 }}
                initial={reduced ? { opacity: 0 } : { clipPath: 'inset(0 100% 0 0)' }}
                animate={reduced ? { opacity: 1 } : { clipPath: 'inset(0 0% 0 0)' }}
                exit={{ opacity: 1 }}
                transition={{ duration: reduced ? 0 : 0.7, ease: [0.7, 0, 0.2, 1] }}
              >
                <Pic base={c.photo} widths={c.widths} sizes="(max-width: 880px) 90vw, 460px" alt={c.alt} />
              </motion.div>
            </AnimatePresence>
          </div>
          <span className="stk s1">{c.s1}</span>
          <span className="stk s2">{c.s2}</span>
        </figure>

        <div>
          <div className="seg" role="group" aria-label="Choose a side of my work">
            {(['dev', 'des'] as Mode[]).map((m) => (
              <button key={m} type="button" aria-pressed={mode === m} onClick={() => setMode(m)}>
                {mode === m && <motion.span layoutId="seg-thumb" className="thumb" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />}
                {m === 'dev' ? 'Developer' : 'Designer'}
              </button>
            ))}
          </div>
          <span className="eyebrow">about/</span>
          <h2 className="h2">I build the system <em>and</em> the poster for its launch.</h2>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: reduced ? 0 : 0.35 }}
            >
              <p className="lead">{c.lead}</p>
              <p className="sub">{c.sub}</p>
              <div className="tags">{c.tags.map((t) => <span key={t}>{t}</span>)}</div>
            </motion.div>
          </AnimatePresence>
          <ul className="facts" aria-label="Quick facts">
            <li>B.Tech CSE, <b>SRMIST ’26</b></li>
            <li>CGPA <b>8.99</b></li>
            <li><b>{PROJECTS.length}</b> engineering projects</li>
            <li><b>{CHAPTERS.length}</b> design chapters</li>
            <li><b>250+</b> mentored</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
