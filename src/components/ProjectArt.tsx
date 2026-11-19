import type { ArtKind, Project } from '../data/projects';
import { asset } from '../data/site';

/** Small drawn illustration per project, used when there is no cover image. */
export function Art({ k }: { k: ArtKind }) {
  const svg = (children: React.ReactNode) => (
    <svg className="art" viewBox="0 0 240 110" aria-hidden="true">{children}</svg>
  );
  switch (k) {
    case 'diff':
      return (
        <div className="viz" aria-hidden="true">
          <span className="cap">example: version diff</span>
          <span className="row del">- GET /users/{'{id}'}  200 {'{ name, email }'}</span>
          <span className="row add">+ GET /users/{'{id}'}  200 {'{ name }'}</span>
          <span className="row">  breaking: response field "email" removed</span>
        </div>
      );
    case 'flow':
      return (
        <div className="flow" aria-hidden="true">
          {['parse', 'chunk', 'index', 'search', 'generate'].map((s, i) => (
            <span key={s} style={{ display: 'contents' }}>{i > 0 && <i>→</i>}<span>{s}</span></span>
          ))}
        </div>
      );
    case 'notes':
      return svg(<><rect className="f1" x="30" y="24" width="78" height="62" rx="4" transform="rotate(-6 69 55)" /><rect className="f3" x="132" y="26" width="78" height="62" rx="4" transform="rotate(7 171 57)" /><rect className="f2" x="82" y="18" width="78" height="62" rx="4" /><path className="ln" d="M96 38h50M96 50h38M96 62h44" /></>);
    case 'bars':
      return svg(<><rect className="fp" x="40" y="14" width="168" height="12" rx="2" /><rect className="fo" x="40" y="34" width="138" height="12" rx="2" /><rect className="ft" x="40" y="54" width="110" height="12" rx="2" /><rect className="fv" x="40" y="74" width="84" height="12" rx="2" /><rect className="fp" opacity=".5" x="40" y="94" width="56" height="8" rx="2" /></>);
    case 'books':
      return svg(<><rect className="fo" x="52" y="30" width="16" height="64" rx="2" /><rect className="fp" x="72" y="20" width="16" height="74" rx="2" /><rect className="ft" x="92" y="36" width="16" height="58" rx="2" /><rect className="fv" x="112" y="24" width="16" height="70" rx="2" /><rect className="fo" x="132" y="40" width="16" height="54" rx="2" /><rect className="fp" x="152" y="28" width="16" height="66" rx="2" transform="rotate(8 160 94)" /><path className="st" d="M40 96h160" /></>);
    case 'rails':
      return svg(<><path className="st" d="M10 74H118C148 74 156 40 192 40H232" /><path className="st2" d="M118 74H232" /><circle className="pulse fo" cx="118" cy="74" r="6" /><circle className="ft" cx="30" cy="74" r="5" /></>);
    case 'rfid':
      return svg(<><rect className="st" x="40" y="34" width="70" height="46" rx="5" /><path className="st2" d="M54 48h22M54 60h14" /><path className="st3 pulse" d="M132 42a22 22 0 0 1 0 30M146 34a34 34 0 0 1 0 46M160 26a46 46 0 0 1 0 62" /></>);
    case 'radar':
      return svg(<><circle className="fo" cx="40" cy="55" r="5" /><path className="st3 pulse" d="M62 38a28 28 0 0 1 0 34M80 28a46 46 0 0 1 0 54M98 18a64 64 0 0 1 0 74" /><rect className="fp" x="178" y="38" width="26" height="34" rx="3" /></>);
    case 'boxes':
      return svg(<><rect className="st" x="46" y="18" width="148" height="76" rx="3" opacity=".5" /><path className="st2 draw" d="M88 36h58v44H88z" strokeDasharray="6 4" /><rect className="fo" x="88" y="26" width="40" height="10" /><path className="st3" d="M60 84l30-22 22 14 28-26 34 34" /></>);
    case 'ecg':
      return svg(<><path className="st2 draw" d="M10 62H70L82 28L96 92L108 48L118 62H232" /><circle className="ft pulse" cx="232" cy="62" r="4" /></>);
  }
}

/** Cover image when the project has one, drawn art otherwise. */
export function Cover({ p, eager }: { p: Project; eager?: boolean }) {
  return (
    <div className={`art-box${p.cover ? ' has-img' : ''}`}>
      {p.cover ? <img src={asset(p.cover)} alt={`${p.title} preview`} loading={eager ? 'eager' : 'lazy'} /> : <Art k={p.art} />}
    </div>
  );
}
