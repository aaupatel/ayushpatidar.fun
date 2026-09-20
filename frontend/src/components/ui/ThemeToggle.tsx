import { Moon, Sun } from 'lucide-react';
import { useThemeContext } from '@/hooks/ThemeContext';
import { cn } from '@/utils/cn';

export function ThemeToggle() {
  const { theme, toggle } = useThemeContext();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggle}
      data-cursor="button"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
      className="group mono flex items-center gap-0 border border-terminal-border rounded-md overflow-hidden transition-colors hover:border-terminal-border-strong focus-visible:outline focus-visible:outline-1 focus-visible:outline-terminal-accent"
    >
      <span
        className={cn(
          'flex items-center gap-1.5 px-2 py-1.5 text-[10px] font-medium tracking-wider transition-colors',
          isDark
            ? 'bg-terminal-accent/10 text-terminal-accent'
            : 'text-terminal-muted',
        )}
      >
        <Moon size={11} />
        <span className="hidden sm:inline">DARK</span>
      </span>
      <span className="w-px h-4 bg-terminal-border" />
      <span
        className={cn(
          'flex items-center gap-1.5 px-2 py-1.5 text-[10px] font-medium tracking-wider transition-colors',
          !isDark
            ? 'bg-terminal-accent/10 text-terminal-accent'
            : 'text-terminal-muted',
        )}
      >
        <Sun size={11} />
        <span className="hidden sm:inline">LIGHT</span>
      </span>
    </button>
  );
}
