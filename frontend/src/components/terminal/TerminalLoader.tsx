import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Minus, Square, X } from 'lucide-react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { delay } from '@/utils/cn';

type LineKind = 'system' | 'prompt' | 'output' | 'success' | 'progress';

interface Line {
  id: number;
  text: string;
  kind: LineKind;
}

let lineId = 0;

export function TerminalLoader({ onDone }: { onDone: () => void }) {
  const [lines, setLines] = useState<Line[]>([]);
  const [typing, setTyping] = useState('');
  const [done, setDone] = useState(false);
  const [progress, setProgress] = useState(0);
  const screenRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const hasRun = useRef(false);
  const doneRef = useRef(false);
  const reduced = useReducedMotion();
  const transitionOutRef = useRef<(skip?: boolean) => Promise<void>>(async () => {});

  const append = (text: string, kind: LineKind = 'output') =>
    setLines((p) => [...p, { id: lineId++, text, kind }]);

  const updateLast = (text: string) =>
    setLines((p) => {
      if (!p.length) return p;
      const copy = [...p];
      copy[copy.length - 1] = { ...copy[copy.length - 1], text };
      return copy;
    });

  const typePrompt = async (prefix: string, content: string, speed = 12) => {
    let typed = '';
    for (let i = 0; i < content.length; i++) {
      typed += content[i];
      setTyping(prefix + typed);
      await delay(reduced ? 0 : speed);
    }
    append(prefix + content, 'prompt');
    setTyping('');
    await delay(reduced ? 0 : 120);
  };

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const run = async () => {
      await delay(reduced ? 0 : 250);
      append('Windows PowerShell', 'system');
      append('Microsoft Corporation. All rights reserved.', 'system');
      append('Install the latest PowerShell for new features and improvements!', 'system');
      append('', 'output');
      setProgress(5);

      await typePrompt('PS D:\\> ', 'git clone https://github.com/aaupatel/portfolio.git');
      append("Cloning into 'portfolio'...", 'output');
      append('Receiving objects: 0% (91/91)', 'progress');
      for (let i = 10; i <= 100; i += 10) {
        updateLast(`Receiving objects: ${i}% (91/91), 577.18 KiB | 1.69 MiB/s, done.`);
        setProgress(10 + i / 5);
        await delay(reduced ? 0 : 30);
      }
      append('Resolving deltas: 0% (12/12)', 'progress');
      for (let i = 10; i <= 100; i += 10) {
        updateLast(`Resolving deltas: ${i}% (12/12), done.`);
        await delay(reduced ? 0 : 25);
      }
      setProgress(35);

      await typePrompt('PS D:\\portfolio> ', 'npm install');
      append('Installing dependencies...', 'output');
      const deps = [
        ['react', 'OK'],
        ['typescript', 'OK'],
        ['tailwindcss', 'OK'],
        ['gsap', 'OK'],
        ['three', 'OK'],
        ['@react-three/fiber', 'OK'],
      ] as const;
      for (const [name, status] of deps) {
        append(`  ${name.padEnd(18)} ${status}`, 'success');
        await delay(reduced ? 0 : 60);
      }
      append('  added 312 packages in 4.2s', 'output');
      setProgress(55);

      await typePrompt('PS D:\\portfolio> ', 'npm run dev');
      append('Starting development server...', 'output');
      append('', 'output');
      const checks = [
        'Server ready',
        'Portfolio initialized',
        '3D engine initialized',
        'Animation engine initialized',
        'Theme engine initialized',
      ] as const;
      for (const c of checks) {
        append(`  \u2713 ${c}`, 'success');
        setProgress(55 + (checks.indexOf(c) + 1) * 7);
        await delay(reduced ? 0 : 90);
      }
      append('', 'output');
      append('  Local:   http://localhost:5173/', 'output');
      setProgress(95);

      await typePrompt('PS D:\\portfolio> ', '');
      append('', 'output');
      append('> ACCESS GRANTED', 'success');
      append("> WELCOME TO AYUSH PATIDAR'S DEVELOPMENT ENVIRONMENT", 'success');
      setProgress(100);

      await delay(reduced ? 200 : 700);
      if (doneRef.current) return;
      doneRef.current = true;
      setDone(true);
      await transitionOutRef.current();
      onDone();
    };

    transitionOutRef.current = async () => {
      const root = rootRef.current;
      if (!root || reduced) return;
      await delay(100);
      const tl = gsap.timeline();
      tl.to(screenRef.current, { scale: 1.04, duration: 0.3, ease: 'power2.in' })
        .to(root, { opacity: 0, scale: 1.1, filter: 'blur(8px)', duration: 0.5, ease: 'power2.inOut' })
        .set(root, { display: 'none' });
      await delay(700);
    };

    run();
  }, [onDone, reduced]);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [lines, typing]);

  const kindColor: Record<LineKind, string> = {
    system: 'text-terminal-dim',
    prompt: 'text-terminal-text',
    output: 'text-terminal-dim',
    success: 'text-terminal-green',
    progress: 'text-terminal-blue',
  };

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-terminal-bg scanlines"
    >
      <div
        ref={screenRef}
        className="relative w-full max-w-terminal mx-4 panel rounded-lg shadow-2xl overflow-hidden"
        style={{ boxShadow: '0 0 80px var(--glow)' }}
      >
        {/* Title bar */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-terminal-border bg-terminal-panel/80">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-terminal-red/80" />
              <span className="w-3 h-3 rounded-full bg-terminal-amber/80" />
              <span className="w-3 h-3 rounded-full bg-terminal-green/80" />
            </div>
            <span className="mono ml-3 text-xs text-terminal-dim">
              Windows PowerShell — ayushpatidar.fun
            </span>
          </div>
          <div className="flex items-center gap-2 text-terminal-dim">
            <Minus size={13} />
            <Square size={11} />
            <X size={14} />
          </div>
        </div>

        {/* Body */}
        <div
          ref={bodyRef}
          className="mono text-[13px] leading-relaxed p-5 h-[320px] md:h-[380px] overflow-y-auto terminal-scroll"
        >
          {lines.map((l) => (
            <div key={l.id} className={kindColor[l.kind]}>
              {l.text || '\u00A0'}
            </div>
          ))}
          {typing && <div className="text-terminal-text">{typing}</div>}
          {!done && (
            <div className="text-terminal-text">
              {typing ? '' : <span className="animate-blink">▋</span>}
            </div>
          )}
        </div>

        {/* Footer / progress / skip */}
        <div className="flex items-center justify-between gap-4 px-5 py-3 border-t border-terminal-border bg-terminal-panel/80">
          <div className="flex-1 h-1 rounded-full bg-terminal-border overflow-hidden max-w-[200px]">
            <div
              className="h-full bg-terminal-accent transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="mono text-[10px] text-terminal-dim">{Math.round(progress)}%</span>
          <button
            onClick={async () => {
              if (doneRef.current) return;
              doneRef.current = true;
              setDone(true);
              await transitionOutRef.current(true);
              onDone();
            }}
            className="mono text-[10px] text-terminal-dim hover:text-terminal-accent transition-colors focus-visible:outline focus-visible:outline-1 focus-visible:outline-terminal-accent rounded"
          >
            SKIP →
          </button>
        </div>
      </div>
    </div>
  );
}
