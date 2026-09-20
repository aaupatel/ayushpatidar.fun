import { useState } from 'react';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { experience } from '@/data/experience';
import { cn } from '@/utils/cn';

const typeLabel: Record<string, string> = {
  role: 'ROLE',
  project: 'PROJECT',
  milestone: 'MILESTONE',
};

const typeColor: Record<string, string> = {
  role: 'text-terminal-accent',
  project: 'text-terminal-green',
  milestone: 'text-terminal-amber',
};

const typeDot: Record<string, string> = {
  role: 'bg-terminal-accent',
  project: 'bg-terminal-green',
  milestone: 'bg-terminal-amber',
};

export function Experience() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const selected = experience[selectedIdx];

  return (
    <Section id="experience">
      <SectionHeading
        command="inspect --experience"
        title="Experience"
        subtitle="Select an entry to inspect the work log."
      />

      <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1fr] gap-4 sm:gap-5">
        {/* LEFT: Entry list */}
        <div className="panel rounded-lg overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-terminal-border bg-terminal-panel">
            <span className="mono text-xs text-terminal-dim">work-log — entries</span>
            <span className="mono text-[10px] text-terminal-dim/60">
              {experience.length} records
            </span>
          </div>

          <div className="p-2 sm:p-2.5">
            {experience.map((entry, i) => {
              const isSelected = i === selectedIdx;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedIdx(i)}
                  aria-pressed={isSelected}
                  aria-label={`Inspect ${entry.title}`}
                  className={cn(
                    'w-full text-left rounded px-3 py-2.5 transition-colors border-l-2 mb-0.5 last:mb-0 focus-visible:outline focus-visible:outline-1 focus-visible:outline-terminal-accent',
                    isSelected
                      ? 'border-terminal-accent bg-terminal-accent/8 text-terminal-text'
                      : 'border-transparent text-terminal-dim hover:text-terminal-text hover:bg-terminal-hover/40',
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        'shrink-0 w-1.5 h-1.5 rounded-full transition-colors',
                        isSelected ? typeDot[entry.type] : 'bg-terminal-dim/30',
                      )}
                    />
                    <span className="text-sm font-medium truncate">
                      {entry.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 pl-3.5">
                    <span className={cn(
                      'mono text-[10px] tracking-wider shrink-0',
                      isSelected ? typeColor[entry.type] : 'text-terminal-dim/40',
                    )}>
                      {typeLabel[entry.type]}
                    </span>
                    <span className="mono text-[10px] text-terminal-dim/50 truncate">
                      {entry.year}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* RIGHT: Inspection panel */}
        <div className="panel rounded-lg overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-terminal-border bg-terminal-panel">
            <span className="mono text-xs text-terminal-dim">inspect — detail</span>
            <span className="mono text-[10px] text-terminal-dim/60">
              {String(selectedIdx + 1).padStart(2, '0')} / {String(experience.length).padStart(2, '0')}
            </span>
          </div>

          <div className="p-4 sm:p-5">
            {/* Entry number + type */}
            <div className="flex items-center gap-2 mb-3">
              <span className="mono text-[10px] text-terminal-dim/40 tracking-wider">
                {String(selectedIdx + 1).padStart(2, '0')}
              </span>
              <span className={cn('mono text-[10px] tracking-wider', typeColor[selected.type])}>
                ● {typeLabel[selected.type]}
              </span>
              <span className="flex-1 border-t border-terminal-border/50" />
            </div>

            {/* Title */}
            <h3 className="font-display text-xl sm:text-2xl font-semibold text-terminal-text leading-tight">
              {selected.title}
            </h3>

            {/* Organization + year */}
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span className="mono text-xs text-terminal-dim">
                {selected.organization}
              </span>
              <span className="text-terminal-border">·</span>
              <span className="mono text-[11px] text-terminal-accent">
                {selected.year}
              </span>
            </div>

            {/* Description */}
            <div className="border-t border-terminal-border pt-3 mt-4">
              <div className="mono text-[10px] text-terminal-green tracking-wider mb-2">
                DESCRIPTION
              </div>
              <p className="text-sm text-terminal-text leading-relaxed">
                {selected.description}
              </p>
            </div>

            {/* Tags */}
            <div className="border-t border-terminal-border pt-3 mt-3">
              <div className="mono text-[10px] text-terminal-green tracking-wider mb-2">
                TAGS
              </div>
              <div className="flex flex-wrap gap-1.5">
                {selected.tags.map((tag) => (
                  <span
                    key={tag}
                    className="mono text-[10px] px-2 py-0.5 border border-terminal-border rounded text-terminal-dim"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
