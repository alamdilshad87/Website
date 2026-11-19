import { motion, useMotionValue, useSpring } from 'motion/react';
import { useRef, type ReactNode } from 'react';
import { useFinePointer, useReduced } from '../lib/hooks';
import { srcSet } from '../data/site';

/** Pulls its child toward the pointer while hovered (magnetic button). */
export function Magnetic({ children, strength = 0.3 }: { children: ReactNode; strength?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const fine = useFinePointer();
  const reduced = useReduced();
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 16 });
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 16 });
  const on = fine && !reduced;
  return (
    <motion.span
      ref={ref}
      style={{ x, y, display: 'inline-block' }}
      onPointerMove={(e) => {
        if (!on || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        x.set((e.clientX - r.left - r.width / 2) * strength);
        y.set((e.clientY - r.top - r.height / 2) * strength);
      }}
      onPointerLeave={() => { x.set(0); y.set(0); }}
    >
      {children}
    </motion.span>
  );
}

/** Filter chip row with a sliding active pill. */
export function Chips<T extends string>({ items, value, onChange, label, id }: {
  items: { f: T; label: string }[]; value: T; onChange: (v: T) => void; label: string; id: string;
}) {
  return (
    <div className="chips" role="group" aria-label={label}>
      {items.map((it) => (
        <button key={it.f} type="button" className="chip" aria-pressed={value === it.f} onClick={() => onChange(it.f)}>
          {value === it.f && <motion.span layoutId={`pill-${id}`} className="pill" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />}
          {it.label}
        </button>
      ))}
    </div>
  );
}

/** Responsive WebP image from scripts/optimize-images.mjs. */
export function Pic({ base, widths = [640, 1280], sizes, alt, className, loading = 'lazy', style }: {
  base: string; widths?: number[]; sizes: string; alt: string; className?: string; loading?: 'lazy' | 'eager'; style?: React.CSSProperties;
}) {
  const set = srcSet(base, widths);
  const src = set.split(', ')[0].split(' ')[0];
  return <img src={src} srcSet={set} sizes={sizes} alt={alt} className={className} loading={loading} decoding="async" style={style} />;
}
