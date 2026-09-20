import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useIsTouch } from '@/hooks/useIsTouch';

type CursorMode = 'default' | 'button' | 'view' | 'code' | 'nav';

export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<CursorMode>('default');
  const [active, setActive] = useState(false);
  const reduced = useReducedMotion();
  const isTouch = useIsTouch();

  useEffect(() => {
    if (reduced || isTouch) {
      document.documentElement.classList.remove('cursor-custom-active');
      return;
    }

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    setActive(true);

    const xToDot = gsap.quickTo(dot, 'x', { duration: 0.04, ease: 'power3.out' });
    const yToDot = gsap.quickTo(dot, 'y', { duration: 0.04, ease: 'power3.out' });
    const xToRing = gsap.quickTo(ring, 'x', { duration: 0.28, ease: 'power3.out' });
    const yToRing = gsap.quickTo(ring, 'y', { duration: 0.28, ease: 'power3.out' });

    let initialized = false;

    const onMove = (e: MouseEvent) => {
      if (!initialized) {
        initialized = true;
        document.documentElement.classList.add('cursor-custom-active');
        gsap.set([dot, ring], { x: e.clientX, y: e.clientY });
      }
      xToDot(e.clientX);
      yToDot(e.clientY);
      xToRing(e.clientX);
      yToRing(e.clientY);
    };

    const onOver = (e: MouseEvent) => {
      const t = (e.target as HTMLElement).closest<HTMLElement>('[data-cursor]');
      setMode(t ? ((t.dataset.cursor as CursorMode) || 'default') : 'default');
    };

    const onDown = () => gsap.to(ring, { scale: 0.85, duration: 0.15 });
    const onUp = () => gsap.to(ring, { scale: 1, duration: 0.15 });

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseover', onOver, { passive: true });
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);

    return () => {
      document.documentElement.classList.remove('cursor-custom-active');
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
    };
  }, [reduced, isTouch]);

  if (reduced || isTouch || !active) return null;

  const ringSize = mode === 'view' ? 64 : mode === 'button' ? 40 : mode === 'code' ? 36 : mode === 'nav' ? 28 : 24;
  const ringBg = mode === 'view' || mode === 'button' ? 'var(--terminal-accent)' : 'transparent';
  const ringOpacity = mode === 'view' || mode === 'button' ? 0.1 : 0.5;

  return (
    <>
      <div
        ref={ringRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none rounded-full flex items-center justify-center"
        style={{
          width: ringSize,
          height: ringSize,
          marginLeft: -ringSize / 2,
          marginTop: -ringSize / 2,
          border: '1px solid var(--terminal-accent)',
          background: ringBg,
          opacity: ringOpacity,
          transition: 'width 0.22s ease, height 0.22s ease, background 0.22s ease',
        }}
      />
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none rounded-full"
        style={{
          width: 5,
          height: 5,
          marginLeft: -2.5,
          marginTop: -2.5,
          background: 'var(--terminal-accent)',
        }}
      />
    </>
  );
}
