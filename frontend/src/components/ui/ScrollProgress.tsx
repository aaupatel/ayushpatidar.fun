import { useRef } from 'react';
import { useEffect } from 'react';
import { scrollProgress } from '@/utils/animations';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const target = { current: document.documentElement };
    scrollProgress(target, bar);
  }, [reduced]);

  if (reduced) return null;

  return (
    <div
      ref={ref}
      className="fixed top-0 left-0 right-0 z-[100] h-0.5 bg-transparent pointer-events-none"
    >
      <div
        ref={bar}
        className="h-full origin-left bg-terminal-accent"
        style={{ transform: 'scaleX(0)' }}
      />
    </div>
  );
}
