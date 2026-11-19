import { motion, useMotionValue, useSpring } from 'motion/react';
import { useState } from 'react';
import { asset, getEmail, SITE } from '../data/site';
import { copyText, useReduced } from '../lib/hooks';
import { Magnetic } from './ui';

function Cmd({ label, url }: { label: string; url: string }) {
  const [state, setState] = useState<'idle' | 'ok' | 'fail'>('idle');
  return (
    <div className="cmd">
      <code><b>$</b> {label}</code>
      <button type="button" onClick={async () => { setState((await copyText(url)) ? 'ok' : 'fail'); setTimeout(() => setState('idle'), 1600); }}>
        {state === 'ok' ? 'copied' : state === 'fail' ? 'copy failed' : 'copy'}
      </button>
      <a href={url} target="_blank" rel="noopener noreferrer">open ↗</a>
    </div>
  );
}

/** The email stays out of the page until a visitor asks for it, which keeps scrapers away. */
function MailCmd() {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'ok' | 'fail'>('idle');
  return (
    <div className="cmd">
      <code><b>$</b> mail {email || <span className="masked">•••••••••••@gmail.com</span>}</code>
      {!email && <button type="button" onClick={() => setEmail(getEmail())}>show</button>}
      <button type="button" onClick={async () => { setState((await copyText(getEmail())) ? 'ok' : 'fail'); setTimeout(() => setState('idle'), 1600); }}>
        {state === 'ok' ? 'copied' : state === 'fail' ? 'copy failed' : 'copy'}
      </button>
    </div>
  );
}

type Status = 'idle' | 'sending' | 'sent' | 'error';

/**
 * Contact form. With SITE.formKey set it posts to Web3Forms, which emails the message
 * without exposing the address. Without a key it opens the visitor's mail app instead.
 * The hidden "botcheck" box is a honeypot: people never see it, bots tick it.
 */
function ContactForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    if (data.get('botcheck')) return; // a bot filled the honeypot
    const name = String(data.get('name') ?? '').trim();
    const from = String(data.get('email') ?? '').trim();
    const message = String(data.get('message') ?? '').trim();

    if (!SITE.formKey) {
      const subject = encodeURIComponent(`Hello from ${name} (via your portfolio)`);
      const body = encodeURIComponent(`${message}\n\n${name}${from ? ` · ${from}` : ''}`);
      window.location.href = `mailto:${getEmail()}?subject=${subject}&body=${body}`;
      setStatus('sent');
      return;
    }

    setStatus('sending');
    setError('');
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ access_key: SITE.formKey, subject: `Portfolio message from ${name}`, from_name: name, name, email: from, message }),
      });
      const json = (await res.json()) as { success?: boolean; message?: string };
      if (!res.ok || !json.success) throw new Error(json.message || 'Something went wrong');
      setStatus('sent');
      form.reset();
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Something went wrong');
    }
  };

  if (status === 'sent') {
    return (
      <div className="cform sent" role="status">
        <p className="cf-done">✓ {SITE.formKey ? 'Message sent. I’ll get back to you soon.' : 'Your mail app should be open with the message ready to send.'}</p>
        <button type="button" className="btn" onClick={() => setStatus('idle')}>Write another</button>
      </div>
    );
  }

  return (
    <form className="cform" onSubmit={onSubmit} noValidate={false}>
      <p className="cf-k">$ write --to dilshad</p>
      <div className="cf-row">
        <label>
          <span>name</span>
          <input name="name" required maxLength={80} autoComplete="name" placeholder="Your name" />
        </label>
        <label>
          <span>email</span>
          <input name="email" type="email" required maxLength={120} autoComplete="email" placeholder="you@company.com" />
        </label>
      </div>
      <label>
        <span>message</span>
        <textarea name="message" required minLength={10} maxLength={3000} rows={4} placeholder="A role, a project, or just hello" />
      </label>
      <input type="checkbox" name="botcheck" className="cf-hp" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <div className="cf-foot">
        <button type="submit" className="btn primary" disabled={status === 'sending'}>{status === 'sending' ? 'Sending…' : 'Send message →'}</button>
        {status === 'error' && <p className="cf-err" role="alert">Couldn’t send: {error}. Try again, or use the email above.</p>}
      </div>
    </form>
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
          <p>Hiring for backend, full-stack or AI/ML work? Need a visual identity or event graphics? I’m open to roles in India and abroad, and happy to start with a short call.</p>
          <div className="cmds">
            <Cmd label="open linkedin.com/in/alamdilshad87" url={SITE.linkedin} />
            <Cmd label="open github.com/alamdilshad87" url={SITE.github} />
            <Cmd label="open behance.net/alamdilshad87" url={SITE.behance} />
            {SITE.emailEnc && <MailCmd />}
          </div>
          <ContactForm />
          <div className="dls">
            {SITE.resume && <Magnetic><a className="btn primary" href={asset(SITE.resume)} download>Résumé · tech ↓</a></Magnetic>}
            {SITE.portfolio && <Magnetic><a className="btn" href={asset(SITE.portfolio)} download>Design portfolio ↓</a></Magnetic>}
          </div>
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
