import { useEffect } from 'react';
import Lenis from 'lenis';
import { usePayload } from './ContextResolver';

export function SmoothScroll() {
  const payload = usePayload();

  useEffect(() => {
    if (!payload) return;
    if (payload.atmosphere.reduceMotion) return;
    if (payload.state.saveData) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    let rafId = 0;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, [payload]);

  return null;
}
