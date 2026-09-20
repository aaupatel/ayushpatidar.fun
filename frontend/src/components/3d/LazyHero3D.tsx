import { lazy, Suspense, useState, useEffect } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useIsMobile } from '@/hooks/useIsMobile';

const Hero3D = lazy(() => import('@/components/3d/Hero3D').then((m) => ({ default: m.Hero3D })));

function isWebGLAvailable(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
  } catch {
    return false;
  }
}

function Fallback3D() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="text-center">
        <div className="mono text-terminal-accent text-6xl sm:text-7xl md:text-8xl font-bold text-glow animate-flicker">
          {'</>'}
        </div>
        <div className="mono text-terminal-dim text-xs sm:text-sm mt-4 opacity-60">
          [3D engine unavailable — WebGL not supported]
        </div>
      </div>
    </div>
  );
}

export function LazyHero3D() {
  const reduced = useReducedMotion();
  const isMobile = useIsMobile();
  const [webglOk, setWebglOk] = useState<boolean | null>(null);

  useEffect(() => {
    setWebglOk(isWebGLAvailable());
  }, []);

  if (webglOk === null) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="mono text-terminal-dim text-sm animate-pulse">Initializing 3D engine...</div>
      </div>
    );
  }

  if (!webglOk) return <Fallback3D />;

  if (reduced) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <div className="mono text-terminal-accent text-6xl sm:text-7xl md:text-8xl font-bold text-glow">
            {'</>'}
          </div>
          <div className="mono text-terminal-dim text-xs sm:text-sm mt-4 opacity-50">
            [3D engine — reduced motion mode]
          </div>
        </div>
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div className="w-full h-full flex items-center justify-center">
          <div className="mono text-terminal-dim text-sm animate-pulse">Initializing 3D engine...</div>
        </div>
      }
    >
      <Hero3D mobile={isMobile} reduced={reduced} />
    </Suspense>
  );
}
