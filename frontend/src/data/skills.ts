import type { SkillGroup } from '@/types';

export const skillGroups: SkillGroup[] = [
  {
    label: 'Frontend',
    icon: 'Layout',
    items: ['React', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'Next.js'],
  },
  {
    label: 'Backend',
    icon: 'Server',
    items: ['Node.js', 'Express', 'Java', 'Spring Boot', 'REST APIs'],
  },
  {
    label: 'Database',
    icon: 'Database',
    items: ['MongoDB', 'MySQL', 'SQL', 'PostgreSQL'],
  },
  {
    label: 'Tools',
    icon: 'Wrench',
    items: ['Git', 'GitHub', 'Docker', 'Postman', 'VS Code'],
  },
];
