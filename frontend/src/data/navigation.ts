export const navItems = [
  { label: 'HOME', path: '/', command: 'home' },
  { label: 'ABOUT', path: '/about', command: 'about' },
  { label: 'PROJECTS', path: '/projects', command: 'projects' },
  { label: 'LAB', path: '/lab', command: 'lab' },
  { label: 'CONTACT', path: '/contact', command: 'contact' },
] as const;

export const terminalCommands = [
  'help',
  'ls',
  'pwd',
  'whoami',
  'about',
  'projects',
  'skills',
  'experience',
  'contact',
  'lab',
  'theme',
  'github',
  'resume',
  'neofetch',
  'clear',
] as const;
