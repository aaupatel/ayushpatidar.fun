import { useMemo, useState } from 'react';
import { Search, ArrowRight } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { skillGroups } from '@/data/skills';
import { projects } from '@/data/projects';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/utils/cn';

const statusColor: Record<string, string> = {
  Production: 'text-terminal-green',
  Active: 'text-terminal-green',
  Prototype: 'text-terminal-amber',
  Completed: 'text-terminal-blue',
};

function normalize(s: string): string {
  return s.trim().toLowerCase();
}

function findCategory(tech: string): string | undefined {
  for (const group of skillGroups) {
    if (group.items.some((item) => normalize(item) === normalize(tech))) {
      return group.label;
    }
  }
  return undefined;
}

const projectCache = new Map<string, typeof projects>();
function findProjects(tech: string) {
  const key = normalize(tech);
  const cached = projectCache.get(key);
  if (cached) return cached;
  const result = projects.filter((p) =>
    p.technologies.some((t) => normalize(t) === key),
  );
  projectCache.set(key, result);
  return result;
}

export function Skills() {
  const reduced = useReducedMotion();
  const [selected, setSelected] = useState<string | null>(skillGroups[0]?.items[0] ?? null);

  const matchingProjects = useMemo(
    () => (selected ? findProjects(selected) : []),
    [selected],
  );

  const category = useMemo(
    () => (selected ? findCategory(selected) : undefined),
    [selected],
  );

  return (
    <Section id="skills">
      <SectionHeading
        command="inspect --tech"
        title="Skills"
        subtitle="Select a technology to see where it appears in real projects."
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-4 sm:gap-5">
        {/* LEFT: Technology list */}
        <div className="panel rounded-lg overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-terminal-border bg-terminal-panel">
            <span className="mono text-xs text-terminal-dim">techstack — tree</span>
            {selected && (
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="mono text-[10px] px-2 py-0.5 border border-terminal-border rounded text-terminal-dim hover:text-terminal-text hover:bg-terminal-hover transition-colors focus-visible:outline focus-visible:outline-1 focus-visible:outline-terminal-accent"
                aria-label="Clear selection"
              >
                Clear
              </button>
            )}
          </div>

          <div className="p-3 sm:p-4 space-y-4">
            {skillGroups.map((group, groupIdx) => (
              <div key={group.label}>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="mono text-[10px] text-terminal-dim/50 select-none">
                    {String(groupIdx + 1).padStart(2, '0')}
                  </span>
                  <span className="mono text-[11px] text-terminal-green tracking-wider">
                    {group.label.toUpperCase()}
                  </span>
                  <span className="mono text-[10px] text-terminal-dim/40">
                    {group.items.length}
                  </span>
                  <span className="flex-1 border-t border-terminal-border/50 ml-1" />
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {group.items.map((item) => {
                    const isSelected = selected === item;
                    const matchCount = findProjects(item).length;
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setSelected(isSelected ? null : item)}
                        aria-pressed={isSelected}
                        aria-label={`Inspect ${item}`}
                        className={cn(
                          'mono text-[11px] px-2.5 py-1 border rounded transition-colors focus-visible:outline focus-visible:outline-1 focus-visible:outline-terminal-accent',
                          isSelected
                            ? 'border-terminal-accent bg-terminal-accent/10 text-terminal-text'
                            : 'border-terminal-border text-terminal-dim hover:text-terminal-text hover:border-terminal-accent/40',
                        )}
                      >
                        {item}
                        {matchCount > 0 && (
                          <span className={cn(
                            'ml-1.5 text-[9px]',
                            isSelected ? 'text-terminal-accent' : 'text-terminal-dim/50',
                          )}>
                            {matchCount}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: Inspection panel */}
        <div className="panel rounded-lg overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-terminal-border bg-terminal-panel">
            <Search size={12} className="text-terminal-accent shrink-0" />
            <span className="mono text-xs text-terminal-dim">used-in — inspect</span>
          </div>

          <div className="p-4 sm:p-5">
            {selected ? (
              <>
                <div className="mb-4">
                  <div className="mono text-[10px] text-terminal-dim/60 tracking-wider mb-1">
                    SELECTED
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-display text-xl font-semibold text-terminal-text">
                      {selected}
                    </span>
                    {category && (
                      <span className="mono text-[11px] text-terminal-accent">
                        / {category}
                      </span>
                    )}
                  </div>
                </div>

                <div className="border-t border-terminal-border pt-3">
                  <div className="mono text-[10px] text-terminal-green tracking-wider mb-3">
                    USED IN {matchingProjects.length > 0 && (
                      <span className="text-terminal-dim/50">({matchingProjects.length})</span>
                    )}
                  </div>

                  {matchingProjects.length > 0 ? (
                    <div className="space-y-3">
                      {matchingProjects.map((project) => (
                        <div
                          key={project.slug}
                          className="border-l-2 border-terminal-border hover:border-terminal-accent/40 transition-colors pl-3 py-0.5"
                        >
                          <div className="flex items-baseline gap-2 flex-wrap">
                            <span className="text-sm font-medium text-terminal-text">
                              {project.title}
                            </span>
                            <span className={cn(
                              'mono text-[10px] font-semibold',
                              statusColor[project.status] ?? 'text-terminal-dim',
                            )}>
                              ● {project.status}
                            </span>
                            <span className="mono text-[10px] text-terminal-dim ml-auto shrink-0">
                              {project.year}
                            </span>
                          </div>
                          <p className="text-xs text-terminal-dim mt-1 leading-relaxed">
                            {project.summary}
                          </p>
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {project.technologies.map((t) => (
                              <span
                                key={t}
                                className={cn(
                                  'mono text-[10px] px-1.5 py-0.5 border rounded',
                                  normalize(t) === normalize(selected)
                                    ? 'border-terminal-accent/50 text-terminal-accent'
                                    : 'border-terminal-border text-terminal-dim',
                                )}
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="mono text-xs text-terminal-dim py-3">
                      <span className="text-terminal-amber">$</span> No project mapping available for this technology
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex flex-col justify-center py-8 sm:py-12">
                <div className="mono text-sm text-terminal-dim mb-2">
                  <span className="text-terminal-green">$</span> inspect --tech
                </div>
                <p className="text-sm text-terminal-dim/70 leading-relaxed max-w-[260px]">
                  Select a technology from the list to see where it appears in real projects.
                </p>
                <div className="mt-4 flex items-center gap-1.5 mono text-[10px] text-terminal-dim/40">
                  <ArrowRight size={10} className="shrink-0" />
                  <span>try clicking a technology tag</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Section>
  );
}
