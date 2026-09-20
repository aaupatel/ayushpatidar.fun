import { type ReactNode, useRef } from 'react';
import { reveal } from '@/utils/animations';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useEffect } from 'react';

type Props = {
  id?: string;
  className?: string;
  children: ReactNode;
  animate?: boolean;
};

export function Section({ id, className = '', children, animate = true }: Props) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || !animate) return;
    reveal(ref);
  }, [reduced, animate]);

  return (
    <section
      id={id}
      ref={ref}
      className={`relative w-full max-w-full overflow-x-hidden scroll-mt-14 px-4 sm:px-6 md:px-10 lg:px-16 py-10 sm:py-12 md:py-14 lg:py-16 ${className}`}
    >
      <div className="mx-auto max-w-6xl w-full">{children}</div>
    </section>
  );
}
