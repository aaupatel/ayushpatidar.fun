import { useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import { ArrowRight } from 'lucide-react';
import { profile } from '@/data/profile';
import { LazyHero3D } from '@/components/3d/LazyHero3D';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const EXPLORE_TARGETS = [
  { cmd: 'explore --profile', label: 'explore --profile', target: 'about', desc: 'About' },
  { cmd: 'explore --projects', label: 'explore --projects', target: 'projects', desc: 'Projects' },
  { cmd: 'explore --stack', label: 'explore --stack', target: 'skills', desc: 'Skills' },
] as const;

export function Hero() {
  const root = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || !root.current) return;
    const ctx = gsap.context(() => {
      gsap.from('[data-hero-line]', {
        opacity: 0,
        y: 24,
        duration: 0.7,
        stagger: 0.08,
        ease: 'power3.out',
        delay: 0.15,
      });
      gsap.from('[data-hero-cmd]', {
        opacity: 0,
        y: 8,
        duration: 0.5,
        stagger: 0.06,
        ease: 'power2.out',
        delay: 0.45,
      });
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  return (
    <section
      ref={root}
      className="relative min-h-[88vh] sm:min-h-[90vh] flex items-center px-4 sm:px-6 md:px-10 lg:px-16 pt-20 pb-10 sm:pb-12 overflow-hidden"
    >
      <div className="mx-auto max-w-7xl w-full grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 items-center">
        {/* Left: text */}
        <div className="relative z-10 order-1 min-w-0">
          <div data-hero-line className="mono text-xs sm:text-sm text-terminal-green mb-4">
            <span className="text-terminal-dim">$</span> ./start --env=production
          </div>

          <h1 className="font-display text-[2.25rem] leading-[1.05] sm:text-5xl md:text-6xl lg:text-[4rem] font-semibold tracking-tight">
            <span data-hero-line className="block text-terminal-text">AYUSH</span>
            <span data-hero-line className="block text-terminal-text">PATIDAR</span>
          </h1>

          <div data-hero-line className="mono text-base sm:text-lg md:text-xl text-terminal-accent mt-3 sm:mt-4 font-medium">
            Full Stack Developer
          </div>

          <p data-hero-line className="mt-4 sm:mt-5 text-terminal-dim text-sm sm:text-base md:text-lg max-w-lg leading-relaxed">
            {profile.tagline}
          </p>

          {/* Explore controls */}
          <div data-hero-cmd className="mt-6 sm:mt-7">
            <div className="border-l border-terminal-border/60 pl-3 space-y-0.5">
              {EXPLORE_TARGETS.map((t) => (
                <button
                  key={t.cmd}
                  type="button"
                  onClick={() => scrollTo(t.target)}
                  className="group flex items-center gap-2 mono text-[12px] sm:text-[13px] text-terminal-dim hover:text-terminal-text transition-colors focus-visible:outline focus-visible:outline-1 focus-visible:outline-terminal-accent rounded px-1 py-0.5 w-full sm:w-auto"
                  aria-label={`Scroll to ${t.desc} section`}
                >
                  <span className="text-terminal-green/70 select-none">&gt;</span>
                  <span className="select-none">{t.label}</span>
                  <ArrowRight
                    size={12}
                    className="text-terminal-dim/40 group-hover:text-terminal-accent group-hover:translate-x-0.5 transition-all shrink-0"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Workspace label */}
          <div data-hero-line className="mt-6 mono text-[10px] text-terminal-dim/60 select-none">
            workspace://ayushpatidar.fun
          </div>
        </div>

        {/* Right: 3D architecture visualization */}
        <div className="relative h-[220px] sm:h-[280px] md:h-[380px] lg:h-[480px] order-2 min-w-0 overflow-hidden rounded-lg border border-terminal-border/40">
          <div className="absolute top-2.5 left-3 z-10 mono text-[9px] text-terminal-dim/40 tracking-wider pointer-events-none select-none">
            system-graph
          </div>
          <LazyHero3D />
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 mono text-[10px] text-terminal-dim flex-col items-center gap-1 hidden lg:flex">
        <span>SCROLL</span>
        <span className="w-px h-8 bg-terminal-border" />
      </div>
    </section>
  );
}
