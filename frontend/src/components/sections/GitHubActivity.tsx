import { useMemo, useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { projects } from '@/data/projects';
import { githubStats } from '@/data/github';
import { cn } from '@/utils/cn';

const statusColor: Record<string, string> = {
  Production: 'text-terminal-green',
  Active: 'text-terminal-green',
  Prototype: 'text-terminal-amber',
  Completed: 'text-terminal-blue',
};

export function GitHubActivity() {
  const [selectedSlug, setSelectedSlug] = useState(projects[0]?.slug ?? '');

  const project = useMemo(
    () => projects.find((p) => p.slug === selectedSlug),
    [selectedSlug],
  );

  const repoPath = useMemo(() => {
    if (!project?.github) return null;
    const url = new URL(project.github);
    return url.pathname.replace(/^\//, '');
  }, [project]);

  const structure = useMemo(() => {
    if (!project) return [];
    return project.architecture.map((a) => ({
      label: a.label.toLowerCase().replace(/\s+/g, '-'),
      tech: a.tech,
    }));
  }, [project]);

  return (
    <Section id="github">
      <SectionHeading
        command="git log --repos"
        title="Repository Explorer"
        subtitle="Explore the projects behind the portfolio."
      />

      <div className="panel rounded-lg overflow-hidden max-w-2xl mx-auto">
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-terminal-border bg-terminal-panel">
          <span className="mono text-xs text-terminal-dim">repository-explorer</span>
          <span className="mono text-[10px] text-terminal-dim/60 ml-auto">
            @{githubStats.username}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 px-4 py-2.5 border-b border-terminal-border">
          <label htmlFor="repo-project-select" className="mono text-[11px] text-terminal-dim sr-only">
            Select repository
          </label>
          <select
            id="repo-project-select"
            value={selectedSlug}
            onChange={(e) => setSelectedSlug(e.target.value)}
            className="mono text-[12px] bg-terminal-bg text-terminal-text border border-terminal-border rounded px-2 py-1 outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-terminal-accent cursor-pointer"
          >
            {projects.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.title} — {p.year}
              </option>
            ))}
          </select>

          {project?.github ? (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="mono text-[11px] px-3 py-1 border border-terminal-border rounded text-terminal-green hover:bg-terminal-hover transition-colors focus-visible:outline focus-visible:outline-1 focus-visible:outline-terminal-accent inline-flex items-center gap-1.5"
              aria-label={`Open ${project.title} repository on GitHub (opens in new tab)`}
            >
              Open Repository
              <ExternalLink size={12} className="shrink-0" />
            </a>
          ) : null}
        </div>

        {project && (
          <div className="p-4 sm:p-5 space-y-3 mono text-[12px]">
            <div className="space-y-1.5">
              <div className="text-[10px] text-terminal-dim/60 tracking-wider uppercase">
                Repository
              </div>
              <div className="text-terminal-text break-all">
                {repoPath ? (
                  <span>
                    <span className="text-terminal-dim">{githubStats.username}</span>
                    <span className="text-terminal-dim/50"> / </span>
                    <span className="text-terminal-green">{repoPath.split('/')[1] ?? repoPath}</span>
                  </span>
                ) : (
                  <span className="text-terminal-amber">Not linked</span>
                )}
              </div>
            </div>

            <div className="border-t border-terminal-border/50 pt-2.5 space-y-1">
              <div className="flex items-baseline gap-3 min-w-0">
                <span className="text-terminal-dim shrink-0 w-16">status</span>
                <span className={statusColor[project.status] ?? 'text-terminal-dim'}>{project.status}</span>
              </div>
              <div className="flex items-baseline gap-3 min-w-0">
                <span className="text-terminal-dim shrink-0 w-16">year</span>
                <span className="text-terminal-dim">{project.year}</span>
              </div>
              <div className="flex items-baseline gap-3 min-w-0">
                <span className="text-terminal-dim shrink-0 w-16">stack</span>
                <span className="text-terminal-green break-all">
                  {project.technologies.join(' · ')}
                </span>
              </div>
            </div>

            <div className="border-t border-terminal-border/50 pt-2.5">
              <div className="text-[10px] text-terminal-dim/60 tracking-wider uppercase mb-1.5">
                Structure
              </div>
              <div className="space-y-0.5 text-terminal-text/80">
                <div className="text-terminal-text">{project.title}</div>
                {structure.map((s, i) => (
                  <div key={i} className="flex items-baseline gap-1.5 min-w-0">
                    <span className="text-terminal-dim/50 shrink-0">
                      {i === structure.length - 1 ? '└──' : '├──'}
                    </span>
                    <span className="text-terminal-text/70 truncate min-w-0">{s.label}</span>
                    <span className="text-terminal-dim/50 text-[10px] truncate min-w-0">
                      {s.tech}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-terminal-border/50 pt-2.5">
              <div className="text-[10px] text-terminal-dim/60 tracking-wider uppercase mb-1">
                Readme
              </div>
              <p className="text-terminal-dim leading-relaxed text-[12px]">
                {project.summary}
              </p>
            </div>

            {project.github ? (
              <div className="border-t border-terminal-border/50 pt-2.5">
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    'mono text-[11px] px-3 py-1.5 border border-terminal-border rounded',
                    'text-terminal-green hover:bg-terminal-hover transition-colors',
                    'focus-visible:outline focus-visible:outline-1 focus-visible:outline-terminal-accent',
                    'inline-flex items-center gap-1.5',
                  )}
                  aria-label={`Open ${project.title} on GitHub (opens in new tab)`}
                >
                  View on GitHub
                  <ExternalLink size={12} className="shrink-0" />
                </a>
              </div>
            ) : (
              <div className="border-t border-terminal-border/50 pt-2.5 mono text-[11px] text-terminal-dim">
                No public repository linked for this project.
              </div>
            )}
          </div>
        )}
      </div>
    </Section>
  );
}
