import Lenis from 'lenis';
import { MotionConfig } from 'motion/react';
import { useEffect } from 'react';
import { About } from './components/About';
import { CommandPalette } from './components/CommandPalette';
import { Contact } from './components/Contact';
import { Cursor } from './components/Cursor';
import { DesignReel } from './components/DesignReel';
import { Footer } from './components/Footer';
import { HeroXray as Hero } from './components/HeroXray';
import { Journey } from './components/Journey';
import { Nav } from './components/Nav';
import { Stack } from './components/Stack';
import { Stickers } from './components/Stickers';
import { Projects } from './components/Projects';
import { useReduced } from './lib/hooks';

export default function App() {
  const reduced = useReduced();

  // Smooth, inertial scrolling. Off for reduced motion, where native scrolling is kept.
  useEffect(() => {
    if (reduced) return;
    // `prevent` hands wheel/touch back to the browser inside dialogs and horizontal scrollers,
    // so the case-study panel, command palette and reel strip scroll natively.
    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.12,
      prevent: (node: HTMLElement) => !!node.closest?.('dialog, [data-lenis-prevent], .hscroll'),
    });
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;
    // pause page scrolling while a modal dialog is open
    const mo = new MutationObserver(() => {
      if (document.querySelector('dialog[open]')) lenis.stop(); else lenis.start();
    });
    mo.observe(document.body, { subtree: true, attributes: true, attributeFilter: ['open'] });
    return () => { mo.disconnect(); lenis.destroy(); delete (window as unknown as { __lenis?: Lenis }).__lenis; };
  }, [reduced]);

  return (
    <MotionConfig reducedMotion="user">
      <div className="bgfx" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />
      <Cursor />
      <Nav />
      <main>
        <Hero />
        <Stickers
          a={['Design with purpose', 'Building ideas, designing experiences', 'Full-stack', 'RAG', 'Event branding']}
          b={['.NET', 'Angular', 'Python', 'FastAPI', 'Photoshop', 'Illustrator', 'Figma', 'Docker', 'Posters', 'Merch']}
        />
        <About />
        <Projects />
        <DesignReel />
        <Journey />
        <Stack />
        <Contact />
      </main>
      <Footer />
      <CommandPalette />
    </MotionConfig>
  );
}
