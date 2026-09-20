import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { Menu, X } from 'lucide-react';
import { navItems } from '@/data/navigation';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/utils/cn';

export function Navbar() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  useLockBodyScroll(open);

  useEffect(() => {
    if (reduced || !headerRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(headerRef.current, {
        y: -60,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out',
        delay: 0.1,
      });
    });
    return () => ctx.revert();
  }, [reduced]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [location.pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const isActive = (path: string) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <>
      <header
        ref={headerRef}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled
            ? 'bg-terminal-bg/90 backdrop-blur-md border-b border-terminal-border'
            : 'bg-transparent border-b border-transparent'
        )}
      >
        <nav className="mx-auto max-w-7xl px-4 sm:px-5 md:px-10 h-14 flex items-center justify-between gap-2 sm:gap-4">
          <Link to="/" data-cursor="nav" className="mono flex items-center gap-1.5 text-sm font-semibold shrink-0 tracking-tight">
            <span className="text-terminal-text">AYUSH</span>
            <span className="text-terminal-dim/60">@</span>
            <span className="text-terminal-accent">DEV</span>
            <span className="text-terminal-dim animate-blink">_</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-0.5">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                data-cursor="nav"
                className={cn(
                  'mono relative px-3 py-1.5 text-xs font-medium tracking-wider transition-colors',
                  isActive(item.path)
                    ? 'text-terminal-accent'
                    : 'text-terminal-dim hover:text-terminal-text',
                )}
              >
                <span className="select-none">[{item.label}]</span>
                {isActive(item.path) && (
                  <span className="absolute -bottom-px left-2 right-2 h-px bg-terminal-accent" />
                )}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="hidden lg:flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-terminal-green animate-pulseDot" />
              <span className="mono text-[10px] text-terminal-dim tracking-wider">SYSTEM ONLINE</span>
            </div>
            <ThemeToggle />
            <button
              onClick={() => setOpen((o) => !o)}
              className="md:hidden p-2.5 -mr-1.5 text-terminal-dim hover:text-terminal-text transition-colors"
              aria-label="Toggle menu"
              aria-expanded={open}
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile terminal-style panel */}
      {open && (
        <div className="fixed inset-0 top-14 z-40 md:hidden bg-terminal-bg/95 backdrop-blur-md flex flex-col">
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-terminal-border bg-terminal-panel">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-terminal-red/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-terminal-amber/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-terminal-green/80" />
            </div>
            <span className="mono text-xs text-terminal-dim ml-2">menu — navigation</span>
          </div>
          <div className="flex flex-col gap-2 p-4">
            {navItems.map((item, i) => (
              <Link
                key={item.path}
                to={item.path}
                data-cursor="nav"
                className={cn(
                  'mono px-4 py-3.5 text-base font-medium tracking-wider rounded-md border-l-2 transition-colors',
                  isActive(item.path)
                    ? 'text-terminal-accent border-terminal-accent bg-terminal-accent/8'
                    : 'text-terminal-text border-transparent hover:bg-terminal-hover'
                )}
              >
                <span className="text-terminal-green text-sm mr-2">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="text-terminal-dim">$</span> {item.command}
                <span className="text-terminal-dim"> → /{item.label.toLowerCase()}</span>
              </Link>
            ))}
          </div>
          <div className="mt-auto flex items-center gap-2 px-4 py-4 border-t border-terminal-border">
            <span className="w-1.5 h-1.5 rounded-full bg-terminal-green animate-pulseDot" />
            <span className="mono text-[10px] text-terminal-dim tracking-wider">SYSTEM ONLINE</span>
          </div>
        </div>
      )}
    </>
  );
}
