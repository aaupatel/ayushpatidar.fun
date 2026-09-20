import { useState } from 'react';
import { MapPin, BookOpen, Briefcase, ChevronRight, ArrowRight, Quote } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { profile } from '@/data/profile';
import { experience } from '@/data/experience';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/utils/cn';

type View = 'summary' | 'details';

export function About() {
  const [view, setView] = useState<View>('summary');
  const reduced = useReducedMotion();

  return (
    <Section id="about">
      <SectionHeading command="whoami" title="About" subtitle="Developer profile and current focus." />

      {/* Toggle */}
      <div className="mb-5 sm:mb-6 flex items-center gap-1 border-b border-terminal-border">
        {(['summary', 'details'] as const).map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => setView(v)}
            aria-pressed={view === v}
            aria-label={v === 'summary' ? 'View profile summary' : 'View detailed profile'}
            className={cn(
              'mono text-[11px] px-3 py-1.5 -mb-px border-b-2 transition-colors focus-visible:outline focus-visible:outline-1 focus-visible:outline-terminal-accent',
              view === v
                ? 'border-terminal-accent text-terminal-text'
                : 'border-transparent text-terminal-dim hover:text-terminal-text',
            )}
          >
            {v.toUpperCase()}
          </button>
        ))}
      </div>

      {view === 'summary' ? (
        <SummaryView reduced={reduced} />
      ) : (
        <DetailsView reduced={reduced} />
      )}
    </Section>
  );
}

function SummaryView({ reduced }: { reduced: boolean }) {
  return (
    <div
      className={cn(
        'panel rounded-lg p-5 sm:p-6',
        !reduced && 'transition-opacity duration-300',
      )}
    >
      <div className="flex flex-col sm:flex-row sm:items-start gap-5 sm:gap-8">
        {/* Identity — structured like a profile card */}
        <div className="sm:w-52 shrink-0 space-y-3">
          <div>
            <h3 className="font-display text-xl sm:text-2xl font-semibold text-terminal-text leading-tight">
              {profile.name}
            </h3>
            <div className="mono text-xs text-terminal-accent mt-1">{profile.role}</div>
          </div>
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center gap-1.5 text-xs text-terminal-dim">
              <MapPin size={12} className="shrink-0" /> {profile.location}
            </div>
            <div className="mono text-[10px] text-terminal-dim/70">
              {profile.stack.join(' · ')}
            </div>
          </div>
        </div>

        {/* Bio + focus */}
        <div className="flex-1 min-w-0 space-y-3 text-sm text-terminal-dim leading-relaxed">
          {profile.bio.map((line, i) => (
            <p key={i}>{line}</p>
          ))}
          <div className="pt-3 border-t border-terminal-border">
            <div className="mono text-[10px] text-terminal-green tracking-wider mb-1.5">
              CURRENT FOCUS
            </div>
            <p className="text-sm text-terminal-text leading-relaxed">
              {profile.currentFocus}
            </p>
          </div>
        </div>
      </div>

      {/* Philosophy */}
      <div className="mt-5 pt-4 border-t border-terminal-border">
        <div className="flex items-start gap-2.5">
          <Quote size={14} className="text-terminal-accent/40 shrink-0 mt-0.5" />
          <p className="text-sm text-terminal-dim italic leading-relaxed">
            {profile.philosophy}
          </p>
        </div>
      </div>
    </div>
  );
}

function DetailsView({ reduced }: { reduced: boolean }) {
  return (
    <div
      className={cn(
        'space-y-4 sm:space-y-5',
        !reduced && 'transition-opacity duration-300',
      )}
    >
      {/* Education + Experience row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
        <div className="panel rounded-lg p-5">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen size={15} className="text-terminal-accent shrink-0" />
            <h3 className="mono text-xs text-terminal-green tracking-wider">EDUCATION</h3>
          </div>
          <div className="space-y-2">
            {profile.education.map((e) => (
              <div key={e.degree} className="border-l-2 border-terminal-border pl-3 py-1">
                <div className="font-medium text-terminal-text text-sm leading-snug">{e.degree}</div>
                <div className="text-terminal-dim text-xs mt-0.5">{e.org}</div>
                <div className="mono text-[11px] text-terminal-accent mt-0.5">{e.period}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="panel rounded-lg p-5">
          <div className="flex items-center gap-2 mb-3">
            <Briefcase size={15} className="text-terminal-accent shrink-0" />
            <h3 className="mono text-xs text-terminal-green tracking-wider">EXPERIENCE</h3>
          </div>
          <div className="space-y-2.5">
            {experience.slice(0, 3).map((entry, i) => (
              <div key={i} className="border-l-2 border-terminal-border pl-3 py-0.5">
                <div className="flex items-baseline gap-2">
                  <span className="text-sm text-terminal-text">{entry.title}</span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-terminal-dim">{entry.organization}</span>
                  <span className="text-terminal-border">·</span>
                  <span className="mono text-[10px] text-terminal-accent">{entry.year}</span>
                </div>
              </div>
            ))}
          </div>
          <a
            href="#experience"
            className="mt-3 inline-flex items-center gap-1 mono text-[11px] text-terminal-accent hover:gap-2 transition-all focus-visible:outline focus-visible:outline-1 focus-visible:outline-terminal-accent rounded"
          >
            full work log <ArrowRight size={11} />
          </a>
        </div>
      </div>

      {/* Stack & interests */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
        <div className="panel rounded-lg p-5">
          <h3 className="mono text-xs text-terminal-green tracking-wider mb-3">STACK</h3>
          <div className="flex flex-wrap gap-1.5">
            {profile.stack.map((t) => (
              <span
                key={t}
                className="mono text-[10px] px-2 py-1 border border-terminal-border rounded text-terminal-dim"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
        <div className="panel rounded-lg p-5">
          <h3 className="mono text-xs text-terminal-green tracking-wider mb-3">INTERESTS</h3>
          <div className="flex flex-wrap gap-x-4 gap-y-1.5">
            {profile.interests.map((interest) => (
              <div
                key={interest}
                className="flex items-center gap-1 mono text-[10px] text-terminal-dim"
              >
                <ChevronRight size={10} className="text-terminal-accent/60 shrink-0" />
                {interest}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
