export interface ProjectArchitectureLayer {
  label: string;
  tech: string;
  purpose: string;
}

export interface Project {
  slug: string;
  title: string;
  status: 'Production' | 'Active' | 'Prototype' | 'Completed';
  year: string;
  summary: string;
  description: string;
  technologies: string[];
  features: string[];
  architecture: ProjectArchitectureLayer[];
  github?: string;
  live?: string;
  media?: {
    image?: string;
    video?: string;
  };
  accent: string;
}

export interface SkillGroup {
  label: string;
  icon: string;
  items: string[];
}

export interface ExperienceEntry {
  year: string;
  title: string;
  organization: string;
  description: string;
  tags: string[];
  type: 'role' | 'project' | 'milestone';
}

export interface NavItem {
  label: string;
  path: string;
  command: string;
}
