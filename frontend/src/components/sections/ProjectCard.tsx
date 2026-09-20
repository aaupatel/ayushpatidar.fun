import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Github, ExternalLink, ArrowRight, X } from 'lucide-react';
import type { Project } from '@/types';
import { ProjectDetail } from '@/components/sections/ProjectDetail';
import { ProjectMedia } from '@/components/sections/ProjectMedia';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const statusColor: Record<Project['status'], string> = {
  Production: 'text-terminal-green',
  Active: 'text-terminal-green',
  Prototype: 'text-terminal-amber',
  Completed: 'text-terminal-blue',
};

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [open, setOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  useLockBodyScroll(open);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  useEffect(() => {
    if (!open || !modalRef.current || !panelRef.current || reduced) return;
    const tl = gsap.timeline();
    tl.fromTo(modalRef.current, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: 'power2.out' })
      .fromTo(panelRef.current, { scale: 0.94, y: 20, opacity: 0 }, { scale: 1, y: 0, opacity: 1, duration: 0.4, ease: 'power3.out' }, '-=0.1');
    return () => { tl.kill(); };
  }, [open, reduced]);

  return (
    <>
      <article
        data-project-card
        data-cursor="view"
        onClick={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setOpen(true);
          }
        }}
        tabIndex={0}
        role="button"
        aria-label={`Inspect ${project.title}`}
        className="group panel rounded-lg overflow-hidden cursor-pointer transition-colors duration-200 hover:border-terminal-accent/50 focus-visible:border-terminal-accent/50 relative"
        style={{ ['--card-accent' as string]: project.accent }}
      >
        {/* Directory header */}
        <div className="flex items-center justify-between px-3.5 py-2 border-b border-terminal-border bg-terminal-panel transition-colors group-hover:bg-terminal-hover/20">
          <span className="mono text-[11px] text-terminal-dim truncate">{project.slug}/</span>
          <span className={`mono text-[10px] font-semibold ${statusColor[project.status]}`}>
            ● {project.status}
          </span>
        </div>

        {/* Preview */}
        <ProjectMedia title={project.title} media={project.media} />

        {/* Identity + summary + stack + inspect */}
        <div className="p-3.5">
          {/* Title row */}
          <div className="flex items-baseline justify-between gap-2 mb-1.5">
            <div className="flex items-baseline gap-2 min-w-0">
              <span className="mono text-[11px] text-terminal-accent font-semibold shrink-0">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className="font-display text-base font-semibold text-terminal-text truncate group-hover:text-terminal-accent transition-colors">
                {project.title}
              </h3>
            </div>
            <span className="mono text-[10px] text-terminal-dim shrink-0">{project.year}</span>
          </div>

          {/* Summary */}
          <p className="text-terminal-dim text-xs leading-relaxed mb-3">
            {project.summary}
          </p>

          {/* Stack line */}
          <div className="mb-3">
            <div className="mono text-[9px] text-terminal-dim/60 tracking-wider mb-1">stack</div>
            <div className="mono text-[10px] text-terminal-dim leading-relaxed break-words">
              {project.technologies.join(' · ')}
            </div>
          </div>

          {/* Inspect footer */}
          <div className="flex items-center justify-between border-t border-terminal-border pt-2.5">
            <div className="flex items-center gap-3">
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  data-cursor="button"
                  className="p-1.5 -m-1.5 text-terminal-dim hover:text-terminal-accent transition-colors"
                  aria-label={`${project.title} GitHub`}
                >
                  <Github size={15} />
                </a>
              )}
              {project.live && (
                <a
                  href={project.live}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  data-cursor="button"
                  className="p-1.5 -m-1.5 text-terminal-dim hover:text-terminal-accent transition-colors"
                  aria-label={`${project.title} live demo`}
                >
                  <ExternalLink size={15} />
                </a>
              )}
            </div>
            <span className="mono text-[11px] text-terminal-accent flex items-center gap-1 group-hover:gap-2 transition-all">
              inspect <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
            </span>
          </div>
        </div>
      </article>

      {open && (
        <div
          ref={modalRef}
          className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-4 md:p-8 bg-black/60 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            ref={panelRef}
            className="relative w-full max-w-3xl max-h-[92vh] sm:max-h-[88vh] panel rounded-lg overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setOpen(false)}
              data-cursor="button"
              aria-label="Close details"
              className="absolute top-2.5 right-2.5 z-10 p-2 text-terminal-dim hover:text-terminal-text hover:bg-terminal-hover rounded transition-colors"
            >
              <X size={18} />
            </button>
            <ProjectDetail project={project} />
          </div>
        </div>
      )}
    </>
  );
}
