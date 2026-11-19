import { motion, useMotionValue, useSpring } from 'motion/react';
import { useState } from 'react';
import { asset, SITE } from '../data/site';
import { copyText, useReduced } from '../lib/hooks';
import { Magnetic } from './ui';

function Cmd({ label, url, open = true }: { label: string; url: string; open?: boolean }) {
  const [state, setState] = useState<'idle' | 'ok' | 'fail'>('idle');
  return (
    <div className="cmd">
      <code><b>$</b> {label}</code>
      <button type="button" onClick={async () => { setState((await copyText(url)) ? 'ok' : 'fail'); setTimeout(() => setState('idle'), 1600); }}>
        {state === 'ok' ? 'copied' : state === 'fail' ? 'copy failed' : 'copy'}
      </button>
      {open && <a href={url} target="_blank" rel="noopener noreferrer">open ↗</a>}
    </div>
  );
}

export function Contact() {
  const reduced = useReduced();
  const rot = useSpring(useMotionValue(0), { stiffness: 80, damping: 10 });
  return (
    <section id="contact" className="sec blk-orange">
      <div className="wrap contact">
        <div>
          <span className="eyebrow">contact.sh</span>
          <h2 className="big">Let’s make something <em>loud</em></h2>
          <p>Hiring for backend, full-stack, AI/ML, data or cloud work? Need a visual identity or event graphics? I’m open to roles in India and abroad and happy to start with a short call.</p>
          <div className="cmds">
            <Cmd label="open linkedin.com/in/alamdilshad87" url={SITE.linkedin} />
            <Cmd label="open github.com/alamdilshad87" url={SITE.github} />
            <Cmd label="open behance.net/alamdilshad87" url={SITE.behance} />
            {SITE.email && <Cmd label={`mail ${SITE.email}`} url={SITE.email} open={false} />}
          </div>
          {SITE.resume && (
            <p style={{ marginTop: 22 }}><Magnetic><a className="btn primary" href={asset(SITE.resume)} download>Download résumé ↓</a></Magnetic></p>
          )}
        </div>

        <div className="lan" aria-hidden="true"
          onPointerMove={(e) => { if (reduced) return; const r = e.currentTarget.getBoundingClientRect(); rot.set(((e.clientX - r.left) / r.width - 0.5) * 16); }}
          onPointerLeave={() => rot.set(0)}>
          <motion.div className="swing" style={{ rotate: rot }}>
            <div className="swing-in">
              <div className="strap" /><div className="clip" />
              <div className="badge">
                <div className="pic"><img src={asset('design/dilshad-360.webp')} alt="" width="150" height="150" loading="lazy" /></div>
                <p className="nm">{SITE.name}</p>
                <p className="rl">{SITE.role}</p>
                <dl><dt>base</dt><dd>{SITE.city}</dd><dt>degree</dt><dd>B.Tech CSE ’26</dd><dt>stack</dt><dd>.NET · Angular · AI</dd><dt>status</dt><dd>open to roles</dd></dl>
                <div className="bc" />
                <p className="ft">DESIGN WITH PURPOSE</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
