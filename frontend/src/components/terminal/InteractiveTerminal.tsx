import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useThemeContext } from '@/hooks/ThemeContext';
import { profile } from '@/data/profile';
import { githubStats } from '@/data/github';
import { projects } from '@/data/projects';
import { skillGroups } from '@/data/skills';
import { experience } from '@/data/experience';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface HistoryLine {
  id: number;
  text: string;
  kind: 'input' | 'output' | 'error' | 'success' | 'accent';
}

let hid = 0;

const PROMPT = 'ayush@portfolio:~$';

const CAT_TARGETS = ['profile', 'projects', 'skills', 'experience', 'contact'];

const ALL_COMMANDS = [
  'help', 'ls', 'pwd', 'whoami', 'cat', 'clear',
  'about', 'projects', 'skills', 'experience', 'contact',
  'lab', 'theme', 'github', 'resume', 'neofetch', 'echo',
  'sudo', 'matrix',
];

function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }
  return dp[m][n];
}

function suggest(input: string): string | null {
  const lower = input.toLowerCase().trim();
  if (!lower) return null;
  const [base] = lower.split(/\s+/);
  let best: string | null = null;
  let bestDist = Infinity;
  for (const cmd of ALL_COMMANDS) {
    const d = levenshtein(base, cmd);
    if (d < bestDist && d <= 2) {
      bestDist = d;
      best = cmd;
    }
  }
  return best;
}

export function InteractiveTerminal({
  className = '',
  onMatrix,
  hideHeader = false,
}: {
  className?: string;
  onMatrix?: () => void;
  hideHeader?: boolean;
}) {
  const [history, setHistory] = useState<HistoryLine[]>([
    { id: hid++, text: `Welcome to Ayush's portfolio terminal.`, kind: 'output' },
    { id: hid++, text: `Try 'help' or 'ls' to get started.`, kind: 'accent' },
  ]);
  const [input, setInput] = useState('');
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { toggle } = useThemeContext();
  const reduced = useReducedMotion();

  const push = useCallback((text: string, kind: HistoryLine['kind'] = 'output') =>
    setHistory((h) => [...h, { id: hid++, text, kind }]), []);

  const focusInput = useCallback(() => {
    requestAnimationFrame(() => inputRef.current?.focus());
  }, []);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [history]);

  const printHelp = useCallback(() => {
    push('', 'output');
    push('  portfolio/', 'accent');
    push('    about         who is Ayush?', 'output');
    push('    projects      explore projects', 'output');
    push('    skills        inspect technical skills', 'output');
    push('    experience    view career timeline', 'output');
    push('    contact       get in touch', 'output');
    push('', 'output');
    push('  system/', 'accent');
    push('    ls            list available entries', 'output');
    push('    pwd           show current location', 'output');
    push('    whoami        current user', 'output');
    push(`    cat <file>    inspect a portfolio file`, 'output');
    push('    neofetch      portfolio system info', 'output');
    push('    clear         clear terminal', 'output');
    push('', 'output');
    push('  shortcuts/', 'accent');
    push('    github        open GitHub profile', 'output');
    push('    resume        download resume', 'output');
    push('    theme         toggle light/dark', 'output');
    push('    lab           open developer lab', 'output');
    push('', 'output');
    push('  Tip: use Tab for completion, Up/Down for history.', 'accent');
    push('        Ctrl+L to clear, Ctrl+C to cancel, Esc to reset input.', 'accent');
    push('', 'output');
  }, [push]);

  const exec = useCallback(async (raw: string) => {
    const cmd = raw.trim();
    push(`${PROMPT} ${cmd}`, 'input');
    if (!cmd) return;

    setCmdHistory((c) => {
      if (c[0] === cmd) return c;
      return [cmd, ...c];
    });
    setHistIdx(-1);

    const [base, ...args] = cmd.split(/\s+/);
    switch (base) {
      case 'help':
        printHelp();
        break;
      case 'ls':
        push('about/    projects/    skills/    experience/    contact/', 'success');
        break;
      case 'pwd':
        push('/home/ayush/portfolio', 'success');
        break;
      case 'about':
        navigate('/about');
        push('→ opening about page', 'success');
        break;
      case 'projects':
        if (args[0]) {
          const p = projects.find((p) => p.slug === args[0]);
          if (p) {
            push(`${p.title} (${p.year}) — ${p.summary}`, 'success');
          } else {
            push(`projects: no project named '${args[0]}'`, 'error');
          }
        } else {
          navigate('/projects');
          push('→ opening projects page', 'success');
        }
        break;
      case 'skills':
        skillGroups.forEach((g) => push(`${g.label.padEnd(10)} ${g.items.join(', ')}`, 'success'));
        break;
      case 'experience':
        experience.forEach((e) => push(`${e.year.padEnd(20)} ${e.title}`, 'success'));
        push('Visit the experience section for the full timeline.', 'output');
        break;
      case 'contact':
        push(`Email:     ${profile.email}`, 'success');
        push(`GitHub:    ${githubStats.url}`, 'success');
        push(`LinkedIn:  ${profile.linkedin}`, 'success');
        break;
      case 'lab':
        navigate('/lab');
        push('→ opening developer lab', 'success');
        break;
      case 'theme':
        toggle();
        push('Theme toggled.', 'success');
        break;
      case 'github':
        push(`→ ${githubStats.url}`, 'success');
        window.open(githubStats.url, '_blank');
        break;
      case 'resume':
        push('→ opening resume', 'success');
        window.open(profile.resumeUrl, '_blank');
        break;
      case 'whoami':
        push(`${profile.name} — ${profile.role} — ${profile.location}`, 'success');
        break;
      case 'cat': {
        const file = args[0];
        if (!file) {
          push('cat: no file specified', 'error');
          push('available files: profile, projects, skills, experience, contact', 'output');
          break;
        }
        switch (file) {
          case 'profile':
            push('╭─ profile.json ───────────────────────╮', 'accent');
            push(`  name        ${profile.name}`, 'success');
            push(`  role        ${profile.role}`, 'success');
            push(`  location    ${profile.location}`, 'success');
            push(`  education   ${profile.education[0].degree}`, 'success');
            push(`  institute   ${profile.education[0].org}`, 'success');
            push(`  period      ${profile.education[0].period}`, 'success');
            push(`  tagline     ${profile.tagline}`, 'success');
            push(`  stack       ${profile.stack.join(', ')}`, 'success');
            push('╰──────────────────────────────────────╯', 'accent');
            break;
          case 'projects':
            push('╭─ projects.json ──────────────────────╮', 'accent');
            projects.forEach((p, i) => {
              push(`  [${i + 1}] ${p.title}  (${p.year}, ${p.status})`, 'success');
              push(`       ${p.summary}`, 'output');
              push(`       tech: ${p.technologies.join(', ')}`, 'output');
            });
            push('╰──────────────────────────────────────╯', 'accent');
            break;
          case 'skills':
            push('╭─ skills.json ────────────────────────╮', 'accent');
            skillGroups.forEach((g) => {
              push(`  ${g.label.padEnd(12)} ${g.items.join(', ')}`, 'success');
            });
            push('╰──────────────────────────────────────╯', 'accent');
            break;
          case 'experience':
            push('╭─ experience.json ────────────────────╮', 'accent');
            experience.forEach((e) => {
              push(`  ${e.year.padEnd(20)} ${e.title}`, 'success');
              push(`  ${' '.repeat(20)} @ ${e.organization}`, 'output');
            });
            push('╰──────────────────────────────────────╯', 'accent');
            break;
          case 'contact':
            push('╭─ contact.json ───────────────────────╮', 'accent');
            push(`  email       ${profile.email}`, 'success');
            push(`  github      ${githubStats.url}`, 'success');
            push(`  linkedin    ${profile.linkedin}`, 'success');
            push('╰──────────────────────────────────────╯', 'accent');
            break;
          default:
            push(`cat: '${file}' — no such file`, 'error');
            push('available files: profile, projects, skills, experience, contact', 'output');
        }
        break;
      }
      case 'neofetch':
        push('   ___      ayush@portfolio', 'accent');
        push('  /   \\     ─────────────────────────', 'accent');
        push(' |     |    site      ayushpatidar.fun', 'success');
        push(' |     |    role      Full Stack Developer', 'success');
        push('  \\___/     stack     React / TypeScript', 'success');
        push('            engine    Vite', 'success');
        push('            webgl     Three.js', 'success');
        push('            motion    GSAP', 'success');
        push('            edu       B.Tech ECE, SATI Vidisha', 'success');
        push('            status    building things', 'success');
        push('            ─────────────────────────', 'accent');
        break;
      case 'clear':
        setHistory([]);
        break;
      case 'sudo':
        if (args.join(' ') === 'hire ayush') {
          push('Permission granted.', 'success');
          push("Let's build something.", 'success');
        } else {
          push('sudo: command not found', 'error');
        }
        break;
      case 'matrix':
        push('Wake up, Neo...', 'success');
        onMatrix?.();
        break;
      case 'echo':
        push(args.join(' '), 'success');
        break;
      default: {
        push(`command not found: ${cmd}`, 'error');
        const suggestion = suggest(cmd);
        if (suggestion) {
          push(`did you mean: ${suggestion}`, 'accent');
        }
        push("type 'help' for available commands", 'output');
        break;
      }
    }
  }, [push, printHelp, navigate, toggle, onMatrix]);

  const tryComplete = useCallback((raw: string): string | null => {
    const parts = raw.split(/\s+/);
    const partial = parts[parts.length - 1].toLowerCase();

    if (parts.length === 1) {
      const matches = ALL_COMMANDS.filter((c) => c.startsWith(partial));
      if (matches.length === 1) return matches[0];
      if (matches.length > 1) {
        push(matches.join('  '), 'output');
        return null;
      }
      return null;
    }

    if (parts[0] === 'cat') {
      const matches = CAT_TARGETS.filter((t) => t.startsWith(partial));
      if (matches.length === 1) {
        parts[parts.length - 1] = matches[0];
        return parts.join(' ');
      }
      if (matches.length > 1) {
        push(matches.join('  '), 'output');
        return null;
      }
    }

    return null;
  }, [push]);

  const moveCursorToEnd = useCallback(() => {
    const el = inputRef.current;
    if (!el) return;
    const len = el.value.length;
    el.setSelectionRange(len, len);
  }, []);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      exec(input);
      setInput('');
      focusInput();
      return;
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setCmdHistory((c) => {
        const next = Math.min(histIdx + 1, c.length - 1);
        if (c[next]) {
          setHistIdx(next);
          setInput(c[next]);
          requestAnimationFrame(moveCursorToEnd);
        }
        return c;
      });
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = histIdx - 1;
      if (next < 0) {
        setHistIdx(-1);
        setInput('');
      } else {
        setCmdHistory((c) => {
          if (c[next]) {
            setHistIdx(next);
            setInput(c[next]);
            requestAnimationFrame(moveCursorToEnd);
          }
          return c;
        });
      }
      return;
    }

    if (e.key === 'Tab') {
      e.preventDefault();
      const completed = tryComplete(input);
      if (completed !== null) setInput(completed);
      focusInput();
      return;
    }

    if (e.key === 'Escape') {
      e.preventDefault();
      setInput('');
      setHistIdx(-1);
      focusInput();
      return;
    }

    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'l') {
      e.preventDefault();
      setHistory([]);
      setInput('');
      focusInput();
      return;
    }

    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'c') {
      e.preventDefault();
      push(`${PROMPT} ${input}^C`, 'input');
      setInput('');
      setHistIdx(-1);
      focusInput();
      return;
    }
  };

  const color: Record<HistoryLine['kind'], string> = {
    input: 'text-terminal-text',
    output: 'text-terminal-dim',
    error: 'text-terminal-red',
    success: 'text-terminal-green',
    accent: 'text-terminal-accent',
  };

  return (
    <div
      className={`panel rounded-lg overflow-hidden ${className}`}
      onClick={() => inputRef.current?.focus()}
    >
      {!hideHeader && (
        <div className="flex items-center gap-2 px-4 py-2 border-b border-terminal-border bg-terminal-panel">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-terminal-red/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-terminal-amber/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-terminal-green/80" />
          </div>
          <span className="mono text-xs text-terminal-dim ml-2">terminal — ayushpatidar.fun</span>
        </div>
      )}
      <div
        ref={bodyRef}
        className="mono text-[12px] sm:text-[13px] leading-relaxed p-3 sm:p-4 h-56 sm:h-64 overflow-y-auto overflow-x-hidden terminal-scroll"
        role="log"
        aria-live="polite"
        aria-label="Terminal output"
      >
        {history.map((h) => (
          <div
            key={h.id}
            className={`${color[h.kind]} ${reduced ? '' : 'animate-terminalLine'} whitespace-pre-wrap break-words`}
          >
            {h.text || '\u00A0'}
          </div>
        ))}
        <div className="flex items-center text-terminal-text">
          <span className="text-terminal-green shrink-0 select-none">{PROMPT}</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              if (histIdx !== -1) setHistIdx(-1);
            }}
            onKeyDown={onKey}
            spellCheck={false}
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            className="flex-1 min-w-[80px] bg-transparent border-none outline-none ml-2 caret-terminal-accent text-terminal-text focus-visible:outline-none"
            aria-label="Terminal command input"
            aria-description="Type a command and press Enter. Use Tab for completion, Up/Down for history, Ctrl+L to clear, Ctrl+C to cancel."
          />
        </div>
      </div>
    </div>
  );
}
