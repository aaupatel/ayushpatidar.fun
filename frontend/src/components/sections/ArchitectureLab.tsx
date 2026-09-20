import { useEffect, useMemo, useRef, useState } from 'react';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/utils/cn';
import { projects } from '@/data/projects';

interface ArchLayer {
  label: string;
  tech: string;
  purpose: string;
}

export function ArchitectureLab() {
  const root = useRef<HTMLDivElement>(null);
  const [selectedSlug, setSelectedSlug] = useState(projects[0]?.slug ?? '');
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [traceIdx, setTraceIdx] = useState<number | null>(null);
  const [tracing, setTracing] = useState(false);
  const reduced = useReducedMotion();
  const traceTimer = useRef<number | null>(null);

  const project = useMemo(
    () => projects.find((p) => p.slug === selectedSlug),
    [selectedSlug],
  );

  const layers = useMemo<ArchLayer[]>(() => {
    if (!project) return [];
    return project.architecture.map((a) => ({
      label: a.label,
      tech: a.tech,
      purpose: a.purpose,
    }));
  }, [project]);

  const activeLayer = activeIdx !== null ? layers[activeIdx] : null;

  const onProjectChange = (slug: string) => {
    setSelectedSlug(slug);
    setActiveIdx(null);
    setTraceIdx(null);
    setTracing(false);
    if (traceTimer.current) {
      clearTimeout(traceTimer.current);
      traceTimer.current = null;
    }
  };

  const runTrace = () => {
    if (tracing || layers.length === 0) return;
    setTracing(true);
    setActiveIdx(null);

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
        traceTimer.current = window.setTimeout(advance, 280);
      } else {
        setActiveIdx(step);
        setTracing(false);
        traceTimer.current = null;
      }
    };
    advance();
  };

  const stopTrace = () => {
    if (traceTimer.current) {
      clearTimeout(traceTimer.current);
      traceTimer.current = null;
    }
    setTracing(false);
    setTraceIdx(null);
  };

  useEffect(() => {
    return () => {
      if (traceTimer.current) clearTimeout(traceTimer.current);
    };
  }, []);

  const breadcrumb = useMemo(() => {
    if (activeIdx === null) return null;
    return layers
      .slice(0, activeIdx + 1)
      .map((l) => l.label.toLowerCase())
      .join(' / ');
  }, [activeIdx, layers]);

  return (
    <Section id="architecture">
      <div ref={root}>
        <SectionHeading
          command="cat architecture.md"
          title="Architecture Lab"
          subtitle="Follow a request through a real project. Select a layer to inspect it."
        />

        <div className="panel rounded-lg overflow-hidden max-w-2xl mx-auto">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-terminal-border bg-terminal-panel">
            <span className="mono text-xs text-terminal-dim">architecture-trace — flow</span>
            <span className="mono text-[10px] text-terminal-dim/60">
              {layers.length} layers
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 px-4 py-2.5 border-b border-terminal-border">
            <label htmlFor="arch-project-select" className="mono text-[11px] text-terminal-dim sr-only">
              Select project architecture
            </label>
            <select
              id="arch-project-select"
              value={selectedSlug}
              onChange={(e) => onProjectChange(e.target.value)}
              className="mono text-[12px] bg-terminal-bg text-terminal-text border border-terminal-border rounded px-2 py-1 outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-terminal-accent cursor-pointer"
            >
              {projects.map((p) => (
                <option key={p.slug} value={p.slug}>
                  {p.title} — {p.year}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={runTrace}
              disabled={tracing || layers.length === 0}
              className="mono text-[11px] px-3 py-1 border border-terminal-border rounded text-terminal-green hover:bg-terminal-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-1 focus-visible:outline-terminal-accent"
              aria-label="Trace request through architecture"
            >
              {tracing ? 'TRACING' : 'TRACE'}
            </button>
            {(tracing || traceIdx !== null) && (
              <button
                type="button"
                onClick={stopTrace}
                className="mono text-[11px] px-2.5 py-1 border border-terminal-border rounded text-terminal-dim hover:text-terminal-text hover:bg-terminal-hover transition-colors focus-visible:outline focus-visible:outline-1 focus-visible:outline-terminal-accent"
                aria-label="Stop trace"
              >
                Reset
              </button>
            )}
          </div>

          {breadcrumb && (
            <div className="px-4 py-1.5 border-b border-terminal-border/50 mono text-[10px] text-terminal-dim">
              <span className="text-terminal-dim/50">request / </span>
              <span className="text-terminal-accent">{breadcrumb}</span>
            </div>
          )}

          <div className="p-4 sm:p-5">
            <div className="flex flex-col">
              {layers.map((layer, i) => {
                const isActive = activeIdx === i;
                const isTraced = traceIdx !== null && i <= traceIdx;
                const isCurrentTrace = traceIdx === i;

                return (
                  <div key={i}>
                    <button
                      type="button"
                      onClick={() => {
                        stopTrace();
                        setActiveIdx(isActive ? null : i);
                      }}
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
                  Tracing request through architecture...
                </div>
              ) : (
                <p className="mono text-[12px] text-terminal-dim">
                  <span className="text-terminal-green">$</span> Select a layer or press TRACE to follow a request.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
