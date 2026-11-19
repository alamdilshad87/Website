import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { PROJECTS } from '../data/projects';
import { asset, SECTIONS, SITE } from '../data/site';
import { SKILLS } from '../data/skills';
import { copyText, emit, scrollToId, useBus } from '../lib/hooks';

interface Item { id: string; group: string; label: string; hint: string; run: () => void }

/** ⌘K / Ctrl+K palette (also "/" when not typing). Built on <dialog> for focus handling. */
export function CommandPalette() {
  const ref = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [act, setAct] = useState(0);

  const items = useMemo<Item[]>(() => {
    const all: Item[] = [
      ...SECTIONS.map((s) => ({ id: `s-${s.id}`, group: 'Sections', label: s.label, hint: `#${s.id}`, run: () => scrollToId(s.id) })),
      ...PROJECTS.map((p) => ({ id: `p-${p.id}`, group: 'Projects', label: p.title, hint: p.tag, run: () => { scrollToId('projects'); setTimeout(() => emit('open-project', p.id), 450); } })),
      ...[...new Set(SKILLS.flatMap((g) => g.i.map((s) => s.name)))].map((n) => ({ id: `k-${n}`, group: 'Skills', label: n, hint: 'filter toolbox', run: () => { emit('grep', n); scrollToId('stack'); } })),
      { id: 'l-gh', group: 'Links', label: 'GitHub', hint: 'github.com/alamdilshad87', run: () => window.open(SITE.github, '_blank', 'noopener') },
      { id: 'l-li', group: 'Links', label: 'LinkedIn', hint: 'in/alamdilshad87', run: () => window.open(SITE.linkedin, '_blank', 'noopener') },
      { id: 'l-be', group: 'Links', label: 'Behance', hint: 'behance.net/alamdilshad87', run: () => window.open(SITE.behance, '_blank', 'noopener') },
      { id: 'a-theme', group: 'Actions', label: 'Toggle light / dark theme', hint: 'theme', run: () => emit('theme') },
    ];
    if (SITE.resume) all.push({ id: 'd-cv', group: 'Downloads', label: 'Download résumé', hint: 'tech side · PDF', run: () => window.open(asset(SITE.resume), '_blank', 'noopener') });
    if (SITE.portfolio) all.push({ id: 'd-pf', group: 'Downloads', label: 'Download design portfolio', hint: 'creative side · PDF', run: () => window.open(asset(SITE.portfolio), '_blank', 'noopener') });
    if (SITE.email) all.push({ id: 'a-mail', group: 'Actions', label: 'Copy email address', hint: SITE.email, run: () => void copyText(SITE.email) });
    return all;
  }, []);

  const query = q.trim().toLowerCase();
  const list = query ? items.filter((i) => `${i.label} ${i.hint} ${i.group}`.toLowerCase().includes(query)) : items.filter((i) => i.group !== 'Skills');

  const show = useCallback((v: boolean) => { setOpen(v); if (v) { setQ(''); setAct(0); } }, []);
  useBus('palette', show);

  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      const typing = /INPUT|TEXTAREA|SELECT/.test((e.target as HTMLElement).tagName);
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); show(!open); }
      else if (e.key === '/' && !typing && !open) { e.preventDefault(); show(true); }
    };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [open, show]);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  useEffect(() => {
    document.getElementById(`cmd-${list[act]?.id}`)?.scrollIntoView({ block: 'nearest' });
  }, [act, list]);

  // run after the dialog has closed, so page scrolling is unlocked again
  const run = (i?: Item) => { if (!i) return; setOpen(false); setTimeout(i.run, 50); };

  let lastGroup = '';
  return (
    <dialog ref={ref} className="palette" aria-label="Search the site" onClose={() => setOpen(false)}
      onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}>
      {open && (
        <>
          <div className="in">
            <span aria-hidden="true">›</span>
            <input autoFocus value={q} placeholder="Search projects, skills, sections…" aria-label="Search" role="combobox" aria-expanded="true" aria-controls="cmd-list"
              aria-activedescendant={list[act] ? `cmd-${list[act].id}` : undefined}
              onChange={(e) => { setQ(e.target.value); setAct(0); }}
              onKeyDown={(e) => {
                if (e.key === 'ArrowDown') { e.preventDefault(); setAct((a) => Math.min(list.length - 1, a + 1)); }
                if (e.key === 'ArrowUp') { e.preventDefault(); setAct((a) => Math.max(0, a - 1)); }
                if (e.key === 'Enter') { e.preventDefault(); run(list[act]); }
              }} />
          </div>
          {list.length ? (
            <ul id="cmd-list" role="listbox" aria-label="Results">
              {list.map((i, k) => {
                const head = i.group !== lastGroup ? (lastGroup = i.group) : null;
                return (
                  <li key={i.id} role="presentation">
                    {head && <div className="grp" role="presentation">{head}</div>}
                    <div id={`cmd-${i.id}`} role="option" aria-selected={k === act} onPointerMove={() => setAct(k)} onClick={() => run(i)}>
                      <span>{i.label}</span><small>{i.hint}</small>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : <p className="none">No results for “{q}”.</p>}
          <div className="foot"><span>↑↓ move</span><span>↵ open</span><span>esc close</span></div>
        </>
      )}
    </dialog>
  );
}
