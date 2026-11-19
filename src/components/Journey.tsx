import { AnimatePresence, motion } from 'motion/react';
import { useMemo, useState } from 'react';
import { duration, endIdx, fmt, LANES, NOW_IDX, ROLES, startIdx, TOTAL, YEARS, yearPos, type Group, type Role } from '../data/journey';
import { SITE } from '../data/site';
import { useMedia, useReduced } from '../lib/hooks';
import { Chips, Pic } from './ui';

const FILTERS: { f: 'all' | Group; label: string }[] = [
  { f: 'all', label: 'all lanes' },
  { f: 'eng', label: 'engineering' },
  { f: 'cre', label: 'creative + leadership' },
  { f: 'edu', label: 'education' },
];
const laneOf = (r: Role) => LANES.find((l) => l.k === r.lane)!;
const ROW = 40;

/** Pack overlapping roles of one lane into rows. */
function pack(list: Role[]) {
  const ends: number[] = [];
  const row: Record<string, number> = {};
  [...list].sort((a, b) => startIdx(a) - startIdx(b)).forEach((r) => {
    let k = ends.findIndex((e) => e <= startIdx(r));
    if (k < 0) { ends.push(0); k = ends.length - 1; }
    ends[k] = endIdx(r);
    row[r.id] = k;
  });
  return { rows: ends.length, row };
}

function Detail({ r }: { r: Role }) {
  const l = laneOf(r);
  return (
    <div className="jdetail" style={{ ['--lc' as string]: l.c }}>
      <div>
        <span className="when">{fmt(r.s)} → {fmt(r.e)} · {duration(r)}</span>
        <h3>{r.role}</h3>
        <span className="org">{r.org} · {l.grp}</span>
        <p>{r.note}</p>
      </div>
      {r.photo && (
        <figure className="polaroid">
          <Pic base={r.photo.base} sizes="170px" alt={r.photo.caption} />
          <figcaption>{r.photo.caption}</figcaption>
        </figure>
      )}
    </div>
  );
}

export function Journey() {
  const [filter, setFilter] = useState<'all' | Group>('all');
  const [sel, setSel] = useState('r1');
  const [openM, setOpenM] = useState<string | null>(null);
  const wide = useMedia('(min-width: 760px)', true);
  const reduced = useReduced();
  const packed = useMemo(() => Object.fromEntries(LANES.map((l) => [l.k, pack(ROLES.filter((r) => r.lane === l.k))])), []);
  const selected = ROLES.find((r) => r.id === sel)!;
  const nowPct = Math.min(1, Math.max(0, (NOW_IDX + 0.5) / TOTAL));
  const dim = (g: Group) => filter !== 'all' && filter !== g;

  const sorted = [...ROLES].sort((a, b) => endIdx(b) - endIdx(a) || startIdx(b) - startIdx(a));

  return (
    <section id="journey" className="sec blk-paper">
      <div className="wrap">
        <div className="sh">
          <div><span className="eyebrow">journey.log</span><h2 className="h2">Where I’ve built and <em>led</em></h2></div>
          {wide && <Chips id="journey" label="Filter roles" items={FILTERS} value={filter} onChange={setFilter} />}
        </div>

        {wide ? (
          <>
            <div className="gantt">
              <div className="gt">
                <div className="cell axis" />
                <div className="cell axis">
                  {YEARS.map((y) => <span key={y} style={{ left: `calc(${yearPos(y) * 100}% + 8px)` }}>{y}</span>)}
                </div>
                {LANES.map((l) => {
                  const P = packed[l.k];
                  const h = P.rows * ROW + 14;
                  const roles = ROLES.filter((r) => r.lane === l.k);
                  return (
                    <div key={l.k} style={{ display: 'contents' }}>
                      <div className={`cell lab${dim(l.g) ? ' faded' : ''}`} style={{ ['--lc' as string]: l.c, height: h }}>
                        <b><i />{l.name}</b><small>{l.grp}</small>
                      </div>
                      <div className={`cell track${dim(l.g) ? ' faded' : ''}`}
                        style={{ height: h }}>
                        {YEARS.slice(1).map((y) => <i key={y} className="yl" style={{ left: `${yearPos(y) * 100}%` }} aria-hidden="true" />)}
                        {roles.map((r) => {
                          const a = startIdx(r), b = endIdx(r);
                          const left = (a / TOTAL) * 100, w = ((b - a) / TOTAL) * 100;
                          const short = w < 13;
                          return (
                            <button key={r.id} type="button" className={`gbar${short ? ' short' : ''}${r.e === 'now' ? ' live' : ''}`}
                              aria-pressed={sel === r.id} onClick={() => setSel(r.id)}
                              title={`${r.role}, ${fmt(r.s)} to ${fmt(r.e)}`}
                              style={{ ['--lc' as string]: l.c, left: `${left}%`, width: `${w}%`, top: 7 + P.row[r.id] * ROW }}>
                              <span>{r.role}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
                <div className="today" style={{ left: `calc(170px + (100% - 170px) * ${nowPct})` }} aria-hidden="true" />
              </div>
            </div>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={sel} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: reduced ? 0 : 0.3 }} aria-live="polite">
                <Detail r={selected} />
              </motion.div>
            </AnimatePresence>
          </>
        ) : (
          <ul className="jmob">
            {sorted.map((r) => {
              const l = laneOf(r), on = openM === r.id;
              return (
                <li key={r.id} style={{ ['--lc' as string]: l.c }}>
                  <button type="button" aria-expanded={on} aria-controls={`jm-${r.id}`} onClick={() => setOpenM(on ? null : r.id)}>
                    <i aria-hidden="true" />
                    <span><b>{r.role}</b><small>{r.org} · {fmt(r.s)} → {fmt(r.e)}</small></span>
                    <span className="plus" aria-hidden="true">+</span>
                  </button>
                  <AnimatePresence initial={false}>
                    {on && (
                      <motion.div id={`jm-${r.id}`} className="more" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}>
                        <p>{r.note} <em className="mono" style={{ fontStyle: 'normal', fontSize: '.78rem' }}>({duration(r)})</em></p>
                        {r.photo && <figure className="polaroid"><Pic base={r.photo.base} sizes="170px" alt={r.photo.caption} /><figcaption>{r.photo.caption}</figcaption></figure>}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>
        )}

        <div className="proof">
          <div>
            <h3>certificates + open source</h3>
            <div className="pills">{SITE.certs.map((c) => <span key={c}>{c}</span>)}<a href={SITE.credly} target="_blank" rel="noopener noreferrer">verify on Credly ↗</a></div>
          </div>
          <div>
            <h3>coding profiles · alam_dilshad87</h3>
            <div className="pills">{SITE.coding.map((c) => <a key={c.label} href={c.href} target="_blank" rel="noopener noreferrer">{c.label} ↗</a>)}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
