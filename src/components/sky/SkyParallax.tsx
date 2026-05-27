import { useEffect, useRef, type ReactNode } from 'react';
import { animate } from 'motion';
import { usePayload } from '../layout/ContextResolver';

export function SkyParallax({ children }: { children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const payload = usePayload();

  useEffect(() => {
    if (!payload) return;
    if (payload.atmosphere.reduceMotion) return;

    const el = containerRef.current;
    if (!el) return;

    let raf = 0;
    let targetX = 0, targetY = 0, curX = 0, curY = 0;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) - 0.5;
      const ny = ((e.clientY - rect.top) / rect.height) - 0.5;
      targetX = -nx * 6;
      targetY = -ny * 4;
    };

    const onOrient = (e: DeviceOrientationEvent) => {
      const g = e.gamma ?? 0;
      const b = e.beta ?? 0;
      targetX = Math.max(-12, Math.min(12, -g * 0.18));
      targetY = Math.max(-6, Math.min(6, -(b - 30) * 0.04));
    };

    const tick = () => {
      curX += (targetX - curX) * 0.06;
      curY += (targetY - curY) * 0.06;
      const moon = el.querySelector<HTMLElement>('.moon-wrap');
      const mtnFar = el.querySelector<HTMLElement>('.mountain-far');
      const mtnMid = el.querySelector<HTMLElement>('.mountain-mid');
      if (moon) moon.style.transform = `translate(${curX * 0.9}px, ${curY * 0.5}px)`;
      if (mtnFar) mtnFar.style.transform = `translate(${curX * 0.25}px, 0)`;
      if (mtnMid) mtnMid.style.transform = `translate(${curX * 0.5}px, 0)`;
      raf = requestAnimationFrame(tick);
    };

    if (payload.embodiment.pointer === 'fine') {
      window.addEventListener('mousemove', onMove);
    } else if (payload.embodiment.hasGyro && !payload.state.saveData) {
      window.addEventListener('deviceorientation', onOrient);
    }
    raf = requestAnimationFrame(tick);

    const heroCopy = el.querySelector<HTMLElement>('.hero-copy');
    if (heroCopy) {
      animate(heroCopy, { opacity: [0, 1], transform: ['translateY(12px)', 'translateY(0)'] }, { duration: 1.2, ease: 'easeOut' });
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('deviceorientation', onOrient);
    };
  }, [payload]);

  return <div ref={containerRef}>{children}</div>;
}
