import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Github, ExternalLink, Check } from 'lucide-react';
import type { Project } from '@/types';
import { ProjectMedia } from '@/components/sections/ProjectMedia';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/utils/cn';

export function ProjectDetail({ project }: { project: Project }) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const traceTimer = useRef<number | null>(null);

  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [traceIdx, setTraceIdx] = useState<number | null>(null);
  const [tracing, setTracing] = useState(false);

  const layers = project.architecture;
  const activeLayer = activeIdx !== null ? layers[activeIdx] : null;

  useEffect(() => {
    if (!bodyRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-detail-layer]',
        { opacity: 0, x: -20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.5,
          stagger: 0.08,
          ease: 'power2.out',
          immediateRender: false,
        },
      );
    }, bodyRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    return () => {
      if (traceTimer.current) clearTimeout(traceTimer.current);
    };
  }, []);

  const stopTrace = () => {
    if (traceTimer.current) {
      clearTimeout(traceTimer.current);
      traceTimer.current = null;
    }
    setTracing(false);
    setTraceIdx(null);
  };

  const selectLayer = (i: number) => {
    stopTrace();
    setActiveIdx((prev) => (prev === i ? null : i));
  };

  const runTrace = () => {
    if (tracing || layers.length === 0) return;
    stopTrace();
    setActiveIdx(null);
    setTracing(true);

    if (reduced) {
      setTraceIdx(layers.length - 1);
      setActiveIdx(layers.length - 1);
      setTracing(false);
      return;
    }

    let step = 0;
    const advance = () => {
      setTraceIdx(step);
      if (step < layers.length - 1) {
        step += 1;
        traceTimer.current = window.setTimeout(advance, 400);
      } else {
        setActiveIdx(step);
        setTracing(false);
        traceTimer.current = null;
      }
    };
    advance();
  };

  const breadcrumb =
    activeIdx !== null
      ? layers
          .slice(0, activeIdx + 1)
          .map((l) => l.label.toLowerCase())
          .join(' / ')
      : null;

  return (
    <div ref={bodyRef} className="overflow-y-auto terminal-scroll">
      {/* Header */}
      <div className="px-4 sm:px-5 py-3 sm:py-4 border-b border-terminal-border bg-terminal-panel">
        <div className="flex items-center gap-2 mb-1 pr-8">
          <div className="mono text-xs text-terminal-dim truncate">{project.slug}/</div>
          <span className={`mono text-[10px] font-semibold ${project.status === 'Active' || project.status === 'Production' ? 'text-terminal-green' : project.status === 'Prototype' ? 'text-terminal-amber' : 'text-terminal-blue'}`}>● {project.status}</span>
          <span className="mono text-[10px] text-terminal-dim ml-auto">{project.year}</span>
        </div>
        <h3 className="font-display text-xl sm:text-2xl font-bold text-terminal-text">{project.title}</h3>
      </div>

      <ProjectMedia title={project.title} media={project.media} loading="eager" />

      <div className="p-4 sm:p-5 space-y-5 sm:space-y-6">
        {/* Overview */}
        <div>
          <h4 className="mono text-xs text-terminal-green tracking-wider mb-3">OVERVIEW</h4>
          <p className="text-sm text-terminal-text leading-relaxed">{project.description}</p>
        </div>

        {/* Features */}
        <div>
          <h4 className="mono text-xs text-terminal-green tracking-wider mb-3">FEATURES</h4>
          <ul className="space-y-1.5">
            {project.features.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-terminal-text">
                <Check size={14} className="text-terminal-green mt-0.5 shrink-0" />
                {f}
              </li>
            ))}
          </ul>
        </div>

        {/* Tech */}
        <div>
          <h4 className="mono text-xs text-terminal-green tracking-wider mb-3">STACK</h4>
          <div className="flex flex-wrap gap-1.5">
            {project.technologies.map((t) => (
              <span
                key={t}
                className="mono text-[11px] px-2 py-1 border border-terminal-border rounded text-terminal-dim"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* How It Works — interactive architecture trace */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <h4 className="mono text-xs text-terminal-green tracking-wider">HOW IT WORKS</h4>
            <button
              type="button"
              onClick={runTrace}
              disabled={tracing || layers.length === 0}
              className="mono text-[10px] px-2.5 py-0.5 border border-terminal-border rounded text-terminal-green hover:bg-terminal-hover transition-colors disabled:opacity-50 focus-visible:outline focus-visible:outline-1 focus-visible:outline-terminal-accent"
              aria-label="Trace through architecture layers"
            >
              {tracing ? 'TRACING...' : 'TRACE'}
            </button>
            {(tracing || traceIdx !== null) && (
              <button
                type="button"
                onClick={stopTrace}
                className="mono text-[10px] px-2 py-0.5 border border-terminal-border rounded text-terminal-dim hover:text-terminal-text hover:bg-terminal-hover transition-colors focus-visible:outline focus-visible:outline-1 focus-visible:outline-terminal-accent"
                aria-label="Reset trace"
              >
                Reset
              </button>
            )}
          </div>

          {breadcrumb && (
            <div className="mono text-[10px] text-terminal-dim mb-2">
              <span className="text-terminal-dim/50">flow / </span>
              <span className="text-terminal-accent">{breadcrumb}</span>
            </div>
          )}

          {/* Layer flow */}
          <div className="flex flex-col">
            {layers.map((layer, i) => {
              const isActive = activeIdx === i;
              const isTraced = traceIdx !== null && i <= traceIdx;
              const isCurrentTrace = traceIdx === i;

              return (
                <div key={layer.label} data-detail-layer>
                  <button
                    type="button"
                    onClick={() => selectLayer(i)}
                    aria-pressed={isActive}
                    aria-label={`Inspect ${layer.label}: ${layer.purpose}`}
                    className={cn(
                      'w-full text-left rounded px-3 py-2.5 mono text-[12px] transition-colors border focus-visible:outline focus-visible:outline-1 focus-visible:outline-terminal-accent',
                      isActive
                        ? 'border-terminal-accent/60 bg-terminal-hover/40 text-terminal-text'
                        : isCurrentTrace
                          ? 'border-terminal-amber/40 bg-terminal-amber/5 text-terminal-text'
                          : isTraced
                            ? 'border-terminal-green/30 bg-terminal-green/5 text-terminal-text/80'
                            : 'border-terminal-border text-terminal-dim hover:text-terminal-text hover:border-terminal-accent/30',
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        'shrink-0 w-1.5 h-1.5 rounded-full',
                        isActive
                          ? 'bg-terminal-accent'
                          : isCurrentTrace
                            ? 'bg-terminal-amber'
                            : isTraced
                              ? 'bg-terminal-green/60'
                              : 'bg-terminal-dim/40',
                      )} />
                      <span className="font-semibold tracking-wide">{layer.label}</span>
                      <span className="text-terminal-dim/60 text-[10px] ml-auto hidden sm:inline">
                        {layer.tech}
                      </span>
                    </div>
                    <div className="text-[10px] text-terminal-dim/70 mt-0.5 sm:hidden">
                      {layer.tech}
                    </div>
                  </button>

                  {i < layers.length - 1 && (
                    <div className="flex justify-center py-1" aria-hidden="true">
                      <span className={cn(
                        'mono text-[10px] transition-colors',
                        isTraced || isActive ? 'text-terminal-accent' : 'text-terminal-dim/40',
                      )}>
                        ↓
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Detail panel */}
          <div className="mt-4 min-h-[64px] border-t border-terminal-border pt-3">
            {activeLayer ? (
              <div className="space-y-1.5">
                <div className="mono text-[11px] text-terminal-accent tracking-wider uppercase">
                  {activeLayer.label}
                </div>
                <p className="text-[12px] text-terminal-text leading-relaxed">
                  {activeLayer.purpose}
                </p>
                <div className="mono text-[11px] text-terminal-dim pt-1">
                  <span className="text-terminal-dim/60">stack </span>
                  <span className="text-terminal-green">{activeLayer.tech}</span>
                </div>
              </div>
            ) : traceIdx !== null && !tracing ? (
              <div className="mono text-[12px] text-terminal-green">
                Trace complete. Select a layer to inspect it.
              </div>
            ) : tracing ? (
              <div className="mono text-[12px] text-terminal-amber">
                Tracing flow through architecture...
              </div>
            ) : (
              <p className="mono text-[12px] text-terminal-dim">
                <span className="text-terminal-green">$</span> Select a layer or press TRACE to follow the flow.
              </p>
            )}
          </div>
        </div>

        {/* Links */}
        <div className="flex flex-wrap gap-3 pt-2 border-t border-terminal-border">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noreferrer"
              data-cursor="button"
              className="flex items-center gap-2 px-4 py-2.5 sm:py-2 border border-terminal-border rounded-md text-sm text-terminal-text hover:bg-terminal-hover transition-colors"
            >
              <Github size={14} /> GitHub
            </a>
          )}
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noreferrer"
              data-cursor="button"
              className="flex items-center gap-2 px-4 py-2.5 sm:py-2 border border-terminal-border rounded-md text-sm text-terminal-text hover:bg-terminal-hover transition-colors"
            >
              <ExternalLink size={14} /> Live Demo
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
