import { useEffect, useMemo, useState } from 'react';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { InteractiveTerminal } from '@/components/terminal/InteractiveTerminal';
import { projects } from '@/data/projects';
import { cn } from '@/utils/cn';
import { useReducedMotion } from '@/hooks/useReducedMotion';

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

/* ─── shared workbench primitives ─────────────────────────────── */

interface ToolDef {
  id: string;
  num: string;
  label: string;
  descriptor: string;
}

const TOOLS: ToolDef[] = [
  { id: 'terminal', num: '01', label: 'TERMINAL', descriptor: 'interactive command shell' },
  { id: 'json', num: '02', label: 'JSON WORKBENCH', descriptor: 'structured data inspection' },
  { id: 'request', num: '03', label: 'REQUEST INSPECTOR', descriptor: 'local project data lookup' },
  { id: 'system', num: '04', label: 'SYSTEM INFO', descriptor: 'browser environment diagnostics' },
  { id: 'history', num: '05', label: 'PROJECT HISTORY', descriptor: 'architecture milestone timeline' },
];

function WorkbenchHeader({
  num,
  name,
  descriptor,
  status,
}: {
  num: string;
  name: string;
  descriptor: string;
  status: string;
}) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 border-b border-terminal-border bg-terminal-panel">
      <span className="mono text-[10px] text-terminal-accent tracking-wider shrink-0">
        {num}
      </span>
      <span className="mono text-[11px] text-terminal-dim/40 select-none">/</span>
      <span className="mono text-[11px] text-terminal-text font-medium tracking-wide truncate">
        {name}
      </span>
      <span className="mono text-[10px] text-terminal-dim/50 truncate hidden sm:inline">
        {descriptor}
      </span>
      <span className="mono text-[9px] text-terminal-green tracking-wider shrink-0 ml-auto flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-terminal-green/70" />
        {status}
      </span>
    </div>
  );
}

function ToolbarButton({
  children,
  onClick,
  disabled,
  variant = 'default',
  active,
  ariaLabel,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'default';
  active?: boolean;
  ariaLabel?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={cn(
        'mono text-[11px] px-2.5 py-1 border rounded transition-colors',
        'focus-visible:outline focus-visible:outline-1 focus-visible:outline-terminal-accent',
        'disabled:opacity-40 disabled:cursor-not-allowed',
        variant === 'primary'
          ? 'text-terminal-green border-terminal-border hover:bg-terminal-hover'
          : active
            ? 'text-terminal-accent border-terminal-accent/40 bg-terminal-accent/8'
            : 'text-terminal-dim border-terminal-border hover:text-terminal-text hover:bg-terminal-hover',
      )}
    >
      {children}
    </button>
  );
}

function ToolSelect({
  id,
  value,
  onChange,
  label,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  label: string;
}) {
  return (
    <>
      <label htmlFor={id} className="mono text-[11px] text-terminal-dim sr-only">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mono text-[12px] bg-terminal-bg text-terminal-text border border-terminal-border rounded px-2 py-1 outline-none cursor-pointer focus-visible:outline focus-visible:outline-1 focus-visible:outline-terminal-accent"
      >
        {projects.map((p) => (
          <option key={p.slug} value={p.slug}>
            {p.title} — {p.year}
          </option>
        ))}
      </select>
    </>
  );
}

function Toolbar({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2 px-3 py-2 border-b border-terminal-border">
      {children}
    </div>
  );
}

function StatusBar({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-3 py-1.5 border-b border-terminal-border/50">
      {children}
    </div>
  );
}

/* ─── JSON workbench ──────────────────────────────────────────── */

interface TreeNodeProps {
  name: string | null;
  value: JsonValue;
  depth: number;
  collapsedPaths: Set<string>;
  togglePath: (path: string) => void;
  reduced: boolean;
}

function isCollapsible(value: JsonValue): boolean {
  return (typeof value === 'object' && value !== null);
}

function TreeNode({ name, value, depth, collapsedPaths, togglePath, reduced }: TreeNodeProps) {
  const path = `${name ?? ''}`;
  const collapsed = collapsedPaths.has(path);
  const collapsible = isCollapsible(value);

  const renderKey = (key: string) => (
    <span className="text-terminal-accent">"{key}"</span>
  );

  const renderValue = (val: JsonValue) => {
    if (val === null) return <span className="text-terminal-dim italic">null</span>;
    if (typeof val === 'string') return <span className="text-terminal-green">"{val}"</span>;
    if (typeof val === 'number') return <span className="text-terminal-amber">{val}</span>;
    if (typeof val === 'boolean') return <span className="text-terminal-amber">{val.toString()}</span>;
    return null;
  };

  const renderCollapsibleHeader = () => {
    const isArray = Array.isArray(value);
    const len = isArray ? (value as JsonValue[]).length : Object.keys(value as object).length;
    const opener = isArray ? '[' : '{';
    const collapsedPreview = isArray ? ` [${len} items]` : ` {${len} keys}}`;
    return (
      <button
        type="button"
        onClick={() => togglePath(path)}
        className="inline-flex items-center gap-1 text-left hover:bg-terminal-hover/30 rounded px-0.5 focus-visible:outline focus-visible:outline-1 focus-visible:outline-terminal-accent"
        aria-label={`${collapsed ? 'Expand' : 'Collapse'} ${name ?? 'node'}`}
      >
        <span className="text-terminal-dim select-none w-3 inline-block">{collapsed ? '▸' : '▾'}</span>
        {name !== null && <>{renderKey(name)}: </>}
        <span className="text-terminal-dim">{opener}</span>
        {collapsed && <span className="text-terminal-dim text-[11px]">{collapsedPreview}</span>}
        {collapsed && <span className="text-terminal-dim">{isArray ? ']' : '}'}</span>}
      </button>
    );
  };

  if (!collapsible) {
    return (
      <div className="whitespace-nowrap">
        {name !== null && <>{renderKey(name)}: </>}
        {renderValue(value)}
      </div>
    );
  }

  const isArray = Array.isArray(value);
  const entries = isArray
    ? (value as JsonValue[]).map((v, i) => [String(i), v] as [string, JsonValue])
    : Object.entries(value as { [key: string]: JsonValue });

  return (
    <div>
      {renderCollapsibleHeader()}
      {!collapsed && (
        <div className={cn('ml-4 border-l border-terminal-border/40 pl-2', reduced ? '' : 'animate-terminalLine')}>
          {entries.map(([key, val]) => (
            <TreeNode
              key={key}
              name={key}
              value={val}
              depth={depth + 1}
              collapsedPaths={collapsedPaths}
              togglePath={togglePath}
              reduced={reduced}
            />
          ))}
        </div>
      )}
      {!collapsed && (
        <div className="text-terminal-dim">{isArray ? ']' : '}'}</div>
      )}
    </div>
  );
}

function JsonWorkbench() {
  const [selectedSlug, setSelectedSlug] = useState(projects[0]?.slug ?? '');
  const [collapsedPaths, setCollapsedPaths] = useState<Set<string>>(new Set());
  const [copied, setCopied] = useState(false);
  const reduced = useReducedMotion();

  const project = useMemo(
    () => projects.find((p) => p.slug === selectedSlug),
    [selectedSlug],
  );

  const jsonText = useMemo(() => {
    if (!project) return '';
    return JSON.stringify(project, null, 2);
  }, [project]);

  const togglePath = (path: string) => {
    setCollapsedPaths((prev) => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  };

  const handleCopy = async () => {
    if (!jsonText) return;
    try {
      await navigator.clipboard.writeText(jsonText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  const handleReset = () => {
    setCollapsedPaths(new Set());
    setSelectedSlug(projects[0]?.slug ?? '');
  };

  return (
    <div className="panel rounded-lg overflow-hidden">
      <WorkbenchHeader
        num="02"
        name="JSON WORKBENCH"
        descriptor="structured data inspection"
        status="READY"
      />

      <Toolbar>
        <ToolSelect
          id="project-select"
          value={selectedSlug}
          onChange={(v) => {
            setSelectedSlug(v);
            setCollapsedPaths(new Set());
          }}
          label="Select project"
        />
        <div className="flex gap-1.5 sm:ml-auto">
          <ToolbarButton onClick={handleCopy} ariaLabel="Copy JSON to clipboard">
            {copied ? 'Copied' : 'Copy'}
          </ToolbarButton>
          <ToolbarButton onClick={handleReset} ariaLabel="Reset to default project and expand all">
            Reset
          </ToolbarButton>
        </div>
      </Toolbar>

      <StatusBar>
        <p className="mono text-[11px] text-terminal-dim">
          <span className="text-terminal-dim/60">project</span>
          <span className="text-terminal-dim/40 mx-1">→</span>
          <span className="text-terminal-accent">{project?.slug}</span>
          <span className="text-terminal-dim/40 mx-1.5">·</span>
          <span className="text-terminal-dim/70">{project?.summary}</span>
        </p>
      </StatusBar>

      <div className="mono text-[12px] sm:text-[13px] p-3 h-64 overflow-auto terminal-scroll bg-terminal-bg/30">
        {project && (
          <TreeNode
            name={null}
            value={project as unknown as JsonValue}
            depth={0}
            collapsedPaths={collapsedPaths}
            togglePath={togglePath}
            reduced={reduced}
          />
        )}
      </div>
    </div>
  );
}

/* ─── system info ─────────────────────────────────────────────── */

interface SystemSnapshot {
  viewport: string;
  device: string;
  browser: string;
  webgl: string;
  theme: string;
  motion: string;
}

function detectWebGL(): string {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    return gl ? 'Available' : 'Unavailable';
  } catch {
    return 'Unknown';
  }
}

function detectBrowser(): string {
  if (typeof navigator === 'undefined') return 'Unknown';
  const ua = navigator.userAgent;
  if (/Edg\//.test(ua)) return 'Edge';
  if (/Chrome\//.test(ua)) return 'Chrome';
  if (/Firefox\//.test(ua)) return 'Firefox';
  if (/Safari\//.test(ua)) return 'Safari';
  return 'Unknown';
}

function detectDevice(): string {
  if (typeof window === 'undefined') return 'Unknown';
  const w = window.innerWidth;
  if (w < 768) return 'Mobile';
  if (w < 1024) return 'Tablet';
  return 'Desktop';
}

function detectTheme(): string {
  if (typeof document === 'undefined') return 'Unknown';
  return document.documentElement.classList.contains('dark') ? 'Dark' : 'Light';
}

function takeSnapshot(): SystemSnapshot {
  if (typeof window === 'undefined') {
    return {
      viewport: 'Unknown',
      device: 'Unknown',
      browser: 'Unknown',
      webgl: 'Unknown',
      theme: 'Unknown',
      motion: 'Unknown',
    };
  }
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  return {
    viewport: `${window.innerWidth} × ${window.innerHeight}`,
    device: detectDevice(),
    browser: detectBrowser(),
    webgl: detectWebGL(),
    theme: detectTheme(),
    motion: reduced ? 'Reduced' : 'Full',
  };
}

function SystemInfo() {
  const [snapshot, setSnapshot] = useState<SystemSnapshot>(() => takeSnapshot());
  const [scanning, setScanning] = useState(false);
  const [copied, setCopied] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const onResize = () => setSnapshot((prev) => ({ ...prev, viewport: `${window.innerWidth} × ${window.innerHeight}`, device: detectDevice() }));
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const rescan = () => {
    setScanning(true);
    window.setTimeout(() => {
      setSnapshot(takeSnapshot());
      setScanning(false);
    }, reduced ? 0 : 200);
  };

  const handleCopy = async () => {
    const report = [
      'AYUSH PORTFOLIO — SYSTEM REPORT',
      `Browser: ${snapshot.browser}`,
      `Device: ${snapshot.device}`,
      `Viewport: ${snapshot.viewport}`,
      `WebGL: ${snapshot.webgl}`,
      `Theme: ${snapshot.theme}`,
      `Motion: ${snapshot.motion}`,
    ].join('\n');
    try {
      await navigator.clipboard.writeText(report);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  const rows: { label: string; value: string; group: string }[] = [
    { label: 'browser', value: snapshot.browser, group: 'RUNTIME' },
    { label: 'device', value: snapshot.device, group: 'RUNTIME' },
    { label: 'viewport', value: snapshot.viewport, group: 'RUNTIME' },
    { label: 'webgl', value: snapshot.webgl, group: 'CAPABILITY' },
    { label: 'theme', value: snapshot.theme, group: 'CLIENT' },
    { label: 'motion', value: snapshot.motion, group: 'CLIENT' },
  ];

  let lastGroup = '';

  return (
    <div className="panel rounded-lg overflow-hidden">
      <WorkbenchHeader
        num="04"
        name="SYSTEM INFO"
        descriptor="browser environment diagnostics"
        status={scanning ? 'SCANNING' : 'READY'}
      />

      <Toolbar>
        <ToolbarButton onClick={rescan} disabled={scanning} variant="primary" ariaLabel="Rescan browser environment">
          {scanning ? 'SCANNING...' : 'RESCAN'}
        </ToolbarButton>
        <div className="flex gap-1.5 sm:ml-auto">
          <ToolbarButton onClick={handleCopy} ariaLabel="Copy system report">
            {copied ? 'Copied' : 'Copy'}
          </ToolbarButton>
        </div>
      </Toolbar>

      <div className="p-3 mono text-[12px]">
        {rows.map((row) => {
          const showGroup = row.group !== lastGroup;
          lastGroup = row.group;
          return (
            <div key={row.label}>
              {showGroup && (
                <div className="mono text-[9px] text-terminal-dim/50 tracking-wider uppercase mt-3 mb-1.5 first:mt-0">
                  {row.group}
                </div>
              )}
              <div className="flex items-baseline gap-3 min-w-0 py-0.5">
                <span className="text-terminal-dim shrink-0 w-20">{row.label}</span>
                <span className="text-terminal-dim/30 select-none shrink-0">→</span>
                <span className="text-terminal-text break-all">{row.value}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── request inspector ───────────────────────────────────────── */

type RequestPhase = 'idle' | 'resolving' | 'done';
type ViewTab = 'response' | 'summary';

function RequestInspector() {
  const [selectedSlug, setSelectedSlug] = useState(projects[0]?.slug ?? '');
  const [phase, setPhase] = useState<RequestPhase>('idle');
  const [view, setView] = useState<ViewTab>('response');
  const [copied, setCopied] = useState(false);
  const reduced = useReducedMotion();

  const project = useMemo(
    () => projects.find((p) => p.slug === selectedSlug),
    [selectedSlug],
  );

  const requestPath = `/projects/${selectedSlug}`;

  const responseBody = useMemo(() => {
    if (!project) return '';
    return JSON.stringify(project, null, 2);
  }, [project]);

  const sendRequest = () => {
    if (!project) return;
    setPhase('resolving');
    setView('response');
    window.setTimeout(() => {
      setPhase('done');
    }, reduced ? 0 : 350);
  };

  const handleCopy = async () => {
    if (!responseBody) return;
    try {
      await navigator.clipboard.writeText(responseBody);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  const handleReset = () => {
    setPhase('idle');
    setView('response');
    setCopied(false);
    setSelectedSlug(projects[0]?.slug ?? '');
  };

  const onProjectChange = (slug: string) => {
    setSelectedSlug(slug);
    setPhase('idle');
    setCopied(false);
  };

  const phases: { key: RequestPhase; label: string }[] = [
    { key: 'idle', label: 'REQUEST' },
    { key: 'resolving', label: 'RESOLVING' },
    { key: 'done', label: 'RESPONSE' },
  ];

  return (
    <div className="panel rounded-lg overflow-hidden">
      <WorkbenchHeader
        num="03"
        name="REQUEST INSPECTOR"
        descriptor="local project data lookup"
        status={phase === 'idle' ? 'IDLE' : phase === 'resolving' ? 'RESOLVING' : '200 OK'}
      />

      <Toolbar>
        <ToolSelect
          id="req-project-select"
          value={selectedSlug}
          onChange={onProjectChange}
          label="Select project to inspect"
        />
        <ToolbarButton onClick={sendRequest} disabled={phase === 'resolving'} variant="primary" ariaLabel="Send local inspection request">
          {phase === 'resolving' ? 'RESOLVING' : 'SEND'}
        </ToolbarButton>
        <div className="flex gap-1.5 sm:ml-auto">
          <ToolbarButton onClick={handleCopy} disabled={phase !== 'done'} ariaLabel="Copy response body">
            {copied ? 'Copied' : 'Copy'}
          </ToolbarButton>
          <ToolbarButton onClick={handleReset} ariaLabel="Reset request inspector">
            Reset
          </ToolbarButton>
        </div>
      </Toolbar>

      <div className="px-3 py-2 border-b border-terminal-border flex items-center gap-2 flex-wrap mono text-[12px]">
        <span className="text-terminal-green font-medium px-1.5 py-0.5 border border-terminal-green/30 rounded text-[11px]">GET</span>
        <span className="text-terminal-text break-all">{requestPath}</span>
        <span className="mono text-[9px] px-1.5 py-0.5 border border-terminal-border rounded text-terminal-dim shrink-0">
          LOCAL
        </span>
      </div>

      <div className="px-3 py-1.5 border-b border-terminal-border/50">
        <div className="flex items-center gap-2 mono text-[10px]">
          {phases.map((p, i) => (
            <span key={p.key} className="flex items-center gap-2">
              {i > 0 && <span className="text-terminal-dim/40 select-none">→</span>}
              <span
                className={cn(
                  'tracking-wider transition-colors',
                  phase === p.key
                    ? p.key === 'resolving'
                      ? 'text-terminal-amber'
                      : p.key === 'done'
                        ? 'text-terminal-green'
                        : 'text-terminal-text'
                    : 'text-terminal-dim/40',
                )}
              >
                {p.label}
              </span>
            </span>
          ))}
          <span className="text-terminal-dim/40 ml-auto select-none hidden sm:inline">
            static project data — no network call
          </span>
        </div>
      </div>

      {phase === 'done' && project && (
        <div className="flex border-b border-terminal-border">
          <button
            type="button"
            onClick={() => setView('response')}
            className={cn(
              'mono text-[11px] px-3 py-1.5 border-b-2 transition-colors focus-visible:outline focus-visible:outline-1 focus-visible:outline-terminal-accent',
              view === 'response'
                ? 'border-terminal-accent text-terminal-text'
                : 'border-transparent text-terminal-dim hover:text-terminal-text',
            )}
            aria-label="Show response body"
          >
            Response
          </button>
          <button
            type="button"
            onClick={() => setView('summary')}
            className={cn(
              'mono text-[11px] px-3 py-1.5 border-b-2 transition-colors focus-visible:outline focus-visible:outline-1 focus-visible:outline-terminal-accent',
              view === 'summary'
                ? 'border-terminal-accent text-terminal-text'
                : 'border-transparent text-terminal-dim hover:text-terminal-text',
            )}
            aria-label="Show project summary"
          >
            Summary
          </button>
        </div>
      )}

      <div className="mono text-[12px] sm:text-[13px] p-3 h-40 overflow-auto terminal-scroll bg-terminal-bg/30">
        {phase === 'idle' && (
          <div className="text-terminal-dim text-[12px]">
            <span className="text-terminal-green">$</span> Select a project and press SEND to inspect its data.
          </div>
        )}
        {phase === 'resolving' && (
          <div className="text-terminal-amber text-[12px]">
            Resolving local project data...
          </div>
        )}
        {phase === 'done' && project && view === 'response' && (
          <pre className="text-terminal-green whitespace-pre-wrap break-words">{responseBody}</pre>
        )}
        {phase === 'done' && project && view === 'summary' && (
          <div className="space-y-1.5 text-[12px]">
            <div className="flex gap-2"><span className="text-terminal-accent shrink-0 w-24">title</span><span className="text-terminal-dim/40">→</span><span className="text-terminal-green">{project.title}</span></div>
            <div className="flex gap-2"><span className="text-terminal-accent shrink-0 w-24">status</span><span className="text-terminal-dim/40">→</span><span className="text-terminal-amber">{project.status}</span></div>
            <div className="flex gap-2"><span className="text-terminal-accent shrink-0 w-24">year</span><span className="text-terminal-dim/40">→</span><span className="text-terminal-amber">{project.year}</span></div>
            <div className="flex gap-2"><span className="text-terminal-accent shrink-0 w-24">stack</span><span className="text-terminal-dim/40">→</span><span className="text-terminal-green">{project.technologies.join(', ')}</span></div>
            <div className="pt-1.5 mt-1.5 border-t border-terminal-border/40"><span className="text-terminal-dim">{project.summary}</span></div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── project history ─────────────────────────────────────────── */

function ProjectHistory() {
  const [selectedSlug, setSelectedSlug] = useState(projects[0]?.slug ?? '');
  const [activeIdx, setActiveIdx] = useState(0);

  const project = useMemo(
    () => projects.find((p) => p.slug === selectedSlug),
    [selectedSlug],
  );

  const milestones = useMemo(() => {
    if (!project) return [];
    return project.architecture.map((layer) => ({
      label: layer.label,
      tech: layer.tech,
      purpose: layer.purpose,
    }));
  }, [project]);

  const active = milestones[activeIdx];

  const onProjectChange = (slug: string) => {
    setSelectedSlug(slug);
    setActiveIdx(0);
  };

  return (
    <div className="panel rounded-lg overflow-hidden">
      <WorkbenchHeader
        num="05"
        name="PROJECT HISTORY"
        descriptor="architecture milestone timeline"
        status={project ? `${milestones.length} STEPS` : 'EMPTY'}
      />

      <Toolbar>
        <ToolSelect
          id="hist-project-select"
          value={selectedSlug}
          onChange={onProjectChange}
          label="Select project history"
        />
      </Toolbar>

      <div className="grid sm:grid-cols-[200px_1fr] divide-y sm:divide-y-0 sm:divide-x divide-terminal-border">
        <div className="p-2 space-y-0.5" role="list" aria-label="Project milestones">
          {milestones.map((m, i) => {
            const isActive = i === activeIdx;
            return (
              <button
                key={i}
                type="button"
                role="listitem"
                onClick={() => setActiveIdx(i)}
                aria-pressed={isActive}
                aria-label={`Milestone ${i + 1}: ${m.label}`}
                className={cn(
                  'flex items-center gap-2 w-full text-left px-2 py-1.5 rounded transition-colors mono text-[12px] focus-visible:outline focus-visible:outline-1 focus-visible:outline-terminal-accent',
                  isActive ? 'bg-terminal-hover/40' : 'hover:bg-terminal-hover/20',
                )}
              >
                <span className={cn(
                  'shrink-0 mono text-[10px] tabular-nums',
                  isActive ? 'text-terminal-accent' : 'text-terminal-dim/40',
                )}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className={cn(
                  'truncate',
                  isActive ? 'text-terminal-text' : 'text-terminal-dim',
                )}>
                  {m.label}
                </span>
              </button>
            );
          })}
        </div>

        {active && (
          <div className="p-3 sm:p-4 space-y-2 mono text-[12px]">
            <div className="flex items-center gap-2">
              <span className="mono text-[10px] text-terminal-accent tracking-wider">
                STEP {String(activeIdx + 1).padStart(2, '0')}
              </span>
              <span className="text-terminal-dim/40">/</span>
              <span className="text-terminal-text font-medium tracking-wide">
                {active.label}
              </span>
            </div>
            <div className="text-terminal-dim text-[12px] leading-relaxed">{active.purpose}</div>
            <div className="pt-1.5 border-t border-terminal-border/50 flex items-baseline gap-2">
              <span className="text-terminal-dim/60 text-[10px] tracking-wider uppercase">stack</span>
              <span className="text-terminal-green">{active.tech}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── tool navigation ─────────────────────────────────────────── */

function ToolNav({
  active,
  onSelect,
}: {
  active: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div
      className="flex items-stretch gap-0 overflow-x-auto terminal-scroll border-b border-terminal-border"
      role="tablist"
      aria-label="Developer Lab tools"
    >
      {TOOLS.map((tool) => {
        const isActive = tool.id === active;
        return (
          <button
            key={tool.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onSelect(tool.id)}
            className={cn(
              'mono text-[11px] px-3 py-2 border-r border-terminal-border shrink-0 transition-colors',
              'focus-visible:outline focus-visible:outline-1 focus-visible:outline-terminal-accent',
              isActive
                ? 'text-terminal-accent bg-terminal-hover/50 border-b-2 border-b-terminal-accent -mb-px'
                : 'text-terminal-dim hover:text-terminal-text hover:bg-terminal-hover/30',
            )}
          >
            <span className={cn('select-none', isActive ? 'text-terminal-accent' : 'text-terminal-dim/40')}>
              {tool.num}
            </span>
            <span className="ml-1.5">{tool.label}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ─── main export ─────────────────────────────────────────────── */

export function DeveloperLab({ onMatrix }: { onMatrix?: () => void }) {
  const [activeTool, setActiveTool] = useState('terminal');

  return (
    <Section id="lab">
      <SectionHeading
        command="cd ./lab && run"
        title="Developer Lab"
        subtitle="Small tools for exploring the portfolio."
      />

      <div className="max-w-5xl mx-auto">
        <div className="panel rounded-lg overflow-hidden">
          <div className="flex items-center gap-2 px-3 py-1.5 border-b border-terminal-border bg-terminal-panel">
            <span className="w-1.5 h-1.5 rounded-full bg-terminal-green/70" />
            <span className="mono text-[10px] text-terminal-dim/70 tracking-wider">LOCAL WORKSPACE</span>
            <span className="mono text-[10px] text-terminal-dim/40">·</span>
            <span className="mono text-[10px] text-terminal-dim/60">{TOOLS.length} TOOLS</span>
            <span className="mono text-[10px] text-terminal-dim/40 ml-auto hidden sm:inline">
              all interactions run in your browser
            </span>
          </div>

          <ToolNav active={activeTool} onSelect={setActiveTool} />

          <div className="p-3 sm:p-4">
            {activeTool === 'terminal' && (
              <div className="panel rounded-lg overflow-hidden">
                <WorkbenchHeader
                  num="01"
                  name="TERMINAL"
                  descriptor="interactive command shell"
                  status="READY"
                />
                <InteractiveTerminal onMatrix={onMatrix} hideHeader />
              </div>
            )}
            {activeTool === 'json' && <JsonWorkbench />}
            {activeTool === 'request' && <RequestInspector />}
            {activeTool === 'system' && <SystemInfo />}
            {activeTool === 'history' && <ProjectHistory />}
          </div>
        </div>
      </div>
    </Section>
  );
}
