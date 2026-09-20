export const profile = {
  name: 'Ayush Patidar',
  role: 'Full Stack Developer',
  location: 'India',
  tagline: 'Building scalable web applications, developer tools, and interactive digital experiences.',
  email: 'ayushpatidar2810@gmail.com',
  github: 'https://github.com/aaupatel',
  githubUsername: 'aaupatel',
  linkedin: 'https://www.linkedin.com/in/ayush-patidar-nagra',
  resumeUrl: '/resume.pdf',
  bio: [
    'I build software systems end-to-end — from database schema to polished interface.',
    'My focus is full-stack web applications, developer tooling, and interactive experiences.',
    'I care about clean architecture, performance budgets, and interfaces that feel considered.',
  ],
  philosophy:
    'Software should be maintainable before it is clever. I optimize for clarity, observability, and change that does not hurt.',
  currentFocus:
    'Distributed web applications, real-time systems, and 3D/webGL interfaces that stay fast on mid-range devices.',
  education: [
    {
      degree: 'B.Tech in Electronics & Communication Engineering',
      org: 'Samrat Ashok Technological Institute (SATI), Vidisha',
      period: '2018 — 2025',
    },
  ],
  interests: ['Developer tooling', 'Systems design', 'WebGL & 3D', 'Open source', 'Automation'],
  stack: ['React', 'TypeScript', 'Node.js', 'Java', 'Spring Boot', 'MongoDB', 'SQL', 'Three.js'],
};

export type Profile = typeof profile;
