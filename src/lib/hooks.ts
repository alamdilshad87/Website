import { useEffect, useState, useSyncExternalStore } from 'react';

/** Subscribe to a media query. */
export function useMedia(query: string, fallback = false) {
  return useSyncExternalStore(
    (cb) => {
      const m = window.matchMedia(query);
      m.addEventListener('change', cb);
      return () => m.removeEventListener('change', cb);
    },
    () => window.matchMedia(query).matches,
    () => fallback,
  );
}

export const useReduced = () => useMedia('(prefers-reduced-motion: reduce)');
export const useFinePointer = () => useMedia('(hover: hover) and (pointer: fine)');

/* ---------- theme ---------- */
type Theme = 'light' | 'dark';
const KEY = 'mda-theme';
const systemTheme = (): Theme => (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    const a = document.documentElement.dataset.theme;
    return a === 'light' || a === 'dark' ? a : systemTheme();
  });
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#07080E' : '#ECEEF8');
  }, [theme]);
  const toggle = () =>
    setTheme((t) => {
      const n = t === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem(KEY, n); } catch { /* storage blocked: theme still applies for this visit */ }
      return n;
    });
  return { theme, toggle };
}

/* ---------- tiny event bus so the command palette can drive sections ---------- */
type BusEvents = { 'open-project': string; grep: string; palette: boolean; theme: void };
export function emit<K extends keyof BusEvents>(name: K, detail?: BusEvents[K]) {
  window.dispatchEvent(new CustomEvent(`mda:${name}`, { detail }));
}
export function useBus<K extends keyof BusEvents>(name: K, fn: (detail: BusEvents[K]) => void) {
  useEffect(() => {
    const h = (e: Event) => fn((e as CustomEvent<BusEvents[K]>).detail);
    window.addEventListener(`mda:${name}`, h);
    return () => window.removeEventListener(`mda:${name}`, h);
  }, [name, fn]);
}

/** Smooth-scroll to a section id, through Lenis when it is running. */
export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const lenis = (window as unknown as { __lenis?: { scrollTo: (t: Element, o?: object) => void } }).__lenis;
  if (lenis) lenis.scrollTo(el, { offset: -80, force: true });
  else el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/** Copy text, with a selection fallback for blocked clipboards. Resolves true on success. */
export async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
