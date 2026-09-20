import { useEffect, useRef } from 'react';
import { magnetic } from '@/utils/animations';
import { useReducedMotion } from '@/hooks/useReducedMotion';

type Props = {
  children: React.ReactNode;
  className?: string;
  strength?: number;
  as?: 'button' | 'a' | 'div';
  href?: string;
  onClick?: () => void;
  'data-cursor'?: string;
};

export function MagneticButton({
  children,
  className = '',
  strength = 0.25,
  as = 'button',
  href,
  onClick,
  ...rest
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const cleanup = magnetic(ref, strength);
    return cleanup;
  }, [reduced, strength]);

  const Tag = as as React.ElementType;
  return (
    <Tag
      ref={ref as React.Ref<HTMLButtonElement>}
      href={href}
      onClick={onClick}
      className={className}
      data-cursor="button"
      {...rest}
    >
      {children}
    </Tag>
  );
}
