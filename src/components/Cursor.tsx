import { motion, useMotionValue, useSpring } from 'motion/react';
import { useEffect, useState } from 'react';
import { useFinePointer, useReduced } from '../lib/hooks';

/**
 * Dot + trailing ring. Any element with data-cursor="label" turns the ring into a label pill.
 * Only on a fine pointer with motion allowed; touch and reduced-motion users keep the system cursor.
 */
export function Cursor() {
  const fine = useFinePointer();
  const reduced = useReduced();
  const on = fine && !reduced;
  const x = useMotionValue(-100), y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 320, damping: 30, mass: 0.6 });
  const ry = useSpring(y, { stiffness: 320, damping: 30, mass: 0.6 });
  const [label, setLabel] = useState('');
  const [hover, setHover] = useState(false);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (!on) return;
    const root = document.documentElement;
    root.classList.add('has-cursor');
    const move = (e: PointerEvent) => { x.set(e.clientX); y.set(e.clientY); setShown(true); };
    const over = (e: PointerEvent) => {
      const t = e.target as Element;
      const l = t.closest?.('[data-cursor]');
      setLabel(l?.getAttribute('data-cursor') ?? '');
      setHover(!!t.closest?.('a, button, [role="button"], input, label'));
    };
    const leave = () => setShown(false);
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerover', over, { passive: true });
    document.addEventListener('pointerleave', leave);
    return () => {
      root.classList.remove('has-cursor');
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerover', over);
      document.removeEventListener('pointerleave', leave);
    };
  }, [on, x, y]);

  if (!on) return null;
  return (
    <>
      <motion.div className="cur-dot" aria-hidden="true" style={{ x, y, opacity: shown && !label ? 1 : 0 }} />
      <motion.div
        aria-hidden="true"
        className={`cur-ring${label ? ' labelled' : hover ? ' hover' : ''}`}
        style={{ x: rx, y: ry, translateX: '-50%', translateY: '-50%', opacity: shown ? 1 : 0 }}
        animate={{ scale: label ? 1 : hover ? 1.5 : 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      >
        {label}
      </motion.div>
    </>
  );
}
