/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'SF Mono', 'Fira Code', 'Cascadia Code', 'Menlo', 'Consolas', 'monospace'],
        display: ['Space Grotesk', 'Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      colors: {
        terminal: {
          bg: 'var(--terminal-bg)',
          panel: 'var(--terminal-panel)',
          elevated: 'var(--terminal-elevated)',
          border: 'var(--terminal-border)',
          'border-strong': 'var(--border-strong)',
          hover: 'var(--terminal-hover)',
          text: 'var(--terminal-text)',
          dim: 'var(--terminal-dim)',
          muted: 'var(--terminal-muted)',
          green: 'var(--terminal-green)',
          blue: 'var(--terminal-blue)',
          amber: 'var(--terminal-amber)',
          red: 'var(--terminal-red)',
          accent: 'var(--terminal-accent)',
        },
        semantic: {
          surface: 'var(--surface)',
          'surface-elevated': 'var(--surface-elevated)',
          'surface-hover': 'var(--surface-hover)',
          border: 'var(--border)',
          'border-strong': 'var(--border-strong)',
          text: 'var(--text)',
          'text-secondary': 'var(--text-secondary)',
          'text-muted': 'var(--text-muted)',
          accent: 'var(--accent)',
          'accent-soft': 'var(--accent-soft)',
          'accent-secondary': 'var(--accent-secondary)',
          success: 'var(--success)',
          warning: 'var(--warning)',
        },
      },
      spacing: {
        18: '4.5rem',
        22: '5.5rem',
      },
      maxWidth: {
        terminal: '720px',
      },
      keyframes: {
        blink: {
          '0%,49%': { opacity: '1' },
          '50%,100%': { opacity: '0' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        flicker: {
          '0%,100%': { opacity: '1' },
          '50%': { opacity: '0.96' },
        },
        pulseDot: {
          '0%,100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.5', transform: 'scale(0.8)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        terminalLine: {
          '0%': { opacity: '0', transform: 'translateY(2px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        blink: 'blink 1s steps(2) infinite',
        scanline: 'scanline 6s linear infinite',
        flicker: 'flicker 3s ease-in-out infinite',
        pulseDot: 'pulseDot 2s ease-in-out infinite',
        shimmer: 'shimmer 2.5s linear infinite',
        terminalLine: 'terminalLine 0.25s ease-out',
      },
      backgroundImage: {
        'grid-dark': "linear-gradient(var(--grid-color) 1px, transparent 1px), linear-gradient(90deg, var(--grid-color) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};
