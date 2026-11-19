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
    case 'rails':
      return svg(<><path className="st" d="M10 74H118C148 74 156 40 192 40H232" /><path className="st2" d="M118 74H232" /><circle className="pulse fo" cx="118" cy="74" r="6" /><circle className="ft" cx="30" cy="74" r="5" /></>);
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
