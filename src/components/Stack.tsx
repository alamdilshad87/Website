import { motion } from 'motion/react';
import { useCallback, useState } from 'react';
import { SKILLS, usedIn } from '../data/skills';
import { emit, useBus, useReduced } from '../lib/hooks';

export function Stack() {
  const [q, setQ] = useState('');
  const reduced = useReduced();
  const query = q.trim().toLowerCase();
  const hits = SKILLS.reduce((n, g) => n + g.i.filter((s) => s.name.toLowerCase().includes(query)).length, 0);

  const onGrep = useCallback((v: string) => setQ(v), []);
  useBus('grep', onGrep);

  return (
    <section id="stack" className="sec">
      <div className="wrap">
        <div className="sh">
          <div><span className="eyebrow">stack.json</span><h2 className="h2">The <em>toolbox</em></h2></div>
          <label className="grep">
            <span>grep -i</span>
            <input id="grep" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="docker, angular, figma…" autoComplete="off" spellCheck={false} aria-label="Filter skills" />
          </label>
        </div>
        <p className="tline" aria-live="polite">
          {query
            ? <><b>$</b> grep -i "{q}" stack/* <em>→ {hits} match{hits === 1 ? '' : 'es'}</em>{hits === 0 && ' · try a shorter term'}</>
            : <><b>$</b> ls stack/ <em>→ {SKILLS.length} groups, {SKILLS.reduce((n, g) => n + g.i.length, 0)} tools</em> · hover a tool to see where it was used</>}
        </p>

        <div className="bento">
          {SKILLS.map((g, gi) => {
            const groupHits = query ? g.i.filter((s) => s.name.toLowerCase().includes(query)).length : g.i.length;
            return (
              <motion.article key={g.c} className={`bcard ${g.span === 'one' ? '' : g.span}${query && !groupHits ? ' miss' : ''}`}
                style={{ ['--tc' as string]: g.tone }} data-glyph={g.glyph}
                initial={reduced ? false : { opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, delay: (gi % 4) * 0.06, ease: [0.2, 0.8, 0.2, 1] }}
                onPointerMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); e.currentTarget.style.setProperty('--px', `${e.clientX - r.left}px`); e.currentTarget.style.setProperty('--py', `${e.clientY - r.top}px`); }}>
                <div className="hd">
                  <div><h3>{g.c}</h3><span className="ct">{groupHits}/{g.i.length} tools</span></div>
                  <span className="gl" aria-hidden="true">{g.glyph}</span>
                </div>
                <div className="sk">
                  {g.i.map((s) => {
                    const u = usedIn(s.name);
                    const match = query && s.name.toLowerCase().includes(query);
                    return (
                      <button key={s.name} type="button" className={`skill${match ? ' hit' : ''}${query && !match ? ' miss' : ''}`}>
                        {s.name}{s.level && <span className="lv">{s.level}</span>}
                        <span className="tip" role="tooltip">{u.length ? `used in: ${u.join(', ')}` : 'learning, practice and coursework'}</span>
                      </button>
                    );
                  })}
                </div>
              </motion.article>
            );
          })}
          <button type="button" className="bcard cmdk" onClick={() => emit('palette', true)} data-cursor="search">
            <span className="mono" style={{ fontSize: '.78rem' }}>can’t find it?</span>
            <kbd>⌘K</kbd>
            <span>Search skills, projects and sections from anywhere on the page.</span>
          </button>
        </div>
      </div>
    </section>
  );
}
