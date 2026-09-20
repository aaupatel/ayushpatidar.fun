import { Github, Linkedin, Mail, FileText } from 'lucide-react';
import { profile } from '@/data/profile';

export function Footer() {
  return (
    <footer className="relative border-t border-terminal-border px-4 sm:px-6 md:px-10 py-10 md:py-12 overflow-x-hidden">
      <div className="mx-auto max-w-6xl">
        <div className="grid md:grid-cols-3 gap-8 mb-10">
          <div>
            <div className="font-display flex items-center gap-1.5 text-lg font-semibold mb-3">
              <span className="text-terminal-text">AYUSH</span>
              <span className="text-terminal-dim/60">@</span>
              <span className="text-terminal-accent">DEV</span>
            </div>
            <p className="text-sm text-terminal-dim max-w-xs">
              Full Stack Developer building software systems and interactive digital experiences.
            </p>
          </div>

          <div>
            <h4 className="mono text-[11px] text-terminal-dim tracking-wider uppercase mb-3">Connect</h4>
            <div className="flex flex-col gap-2">
              <a href={profile.github} target="_blank" rel="noreferrer" data-cursor="button" className="flex items-center gap-2 text-sm text-terminal-text hover:text-terminal-accent transition-colors">
                <Github size={15} /> GitHub
              </a>
              <a href={profile.linkedin} target="_blank" rel="noreferrer" data-cursor="button" className="flex items-center gap-2 text-sm text-terminal-text hover:text-terminal-accent transition-colors">
                <Linkedin size={15} /> LinkedIn
              </a>
              <a href={`mailto:${profile.email}`} data-cursor="button" className="flex items-center gap-2 text-sm text-terminal-text hover:text-terminal-accent transition-colors">
                <Mail size={15} /> Email
              </a>
              <a href={profile.resumeUrl} target="_blank" rel="noreferrer" data-cursor="button" className="flex items-center gap-2 text-sm text-terminal-text hover:text-terminal-accent transition-colors">
                <FileText size={15} /> Resume
              </a>
            </div>
          </div>

          <div>
            <h4 className="mono text-[11px] text-terminal-dim tracking-wider uppercase mb-3">System Status</h4>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-terminal-green animate-pulseDot" />
              <span className="mono text-xs text-terminal-green">SYSTEM ONLINE</span>
            </div>
            <p className="mono text-xs text-terminal-dim">
              Built with React + TypeScript + Tailwind CSS + GSAP + Three.js
            </p>
          </div>
        </div>

        <div className="border-t border-terminal-border pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="mono text-xs text-terminal-dim">© 2026 Ayush Patidar</p>
          <p className="mono text-xs text-terminal-dim">
            <span className="text-terminal-green">PS D:\ayushpatidar.fun&gt;</span>{' '}
            <span className="animate-blink">▋</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
