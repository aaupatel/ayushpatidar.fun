import { useEffect, useState } from 'react';

export function useIsTouch(): boolean {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const check = () =>
      typeof window !== 'undefined' &&
      (window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window);

    setIsTouch(check());
  }, []);

  return isTouch;
}
