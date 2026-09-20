import type { Project } from '@/types';

export const projects: Project[] = [
  {
    slug: 'testnexus',
    title: 'TestNexus',
    status: 'Active',
    year: '2024',
    summary: 'Online examination platform with live coding execution and anti-cheat proctoring.',
    description:
      'A full-stack online examination system supporting automated grading, live code execution, and WebSocket-driven anti-cheating proctoring. Built to handle concurrent exam sessions with a containerized backend.',
    technologies: ['React', 'TypeScript', 'Spring Boot', 'MongoDB', 'SQL', 'WebSocket', 'Docker'],
    features: [
      'Role-based authentication (student, proctor, admin)',
      'Timed exams with auto-submission',
      'Automated grading for MCQ and coding questions',
      'Live code execution in sandboxed containers',
      'WebSocket-based anti-cheat proctoring (tab-switch, focus loss)',
      'Dockerized backend for horizontal scaling',
    ],
    architecture: [
      { label: 'Frontend', tech: 'React + TypeScript', purpose: 'Exam UI, code editor, live timer' },
      { label: 'API Layer', tech: 'Spring Boot REST', purpose: 'Routing, validation, rate limiting' },
      { label: 'Backend', tech: 'Java services', purpose: 'Grading engine, session management' },
      { label: 'Auth', tech: 'JWT + Spring Security', purpose: 'Role-based access, session tokens' },
      { label: 'Database', tech: 'MongoDB + SQL', purpose: 'Questions, submissions, user records' },
      { label: 'Execution', tech: 'Docker sandbox', purpose: 'Isolated code run, output capture' },
    ],
    github: 'https://github.com/aaupatel/Online-Examination-System',
    media: { image: '/assets/projects/TestNexus.png' },
    accent: '#58a6ff',
  },
  {
    slug: 'streaktrack',
    title: 'StreakTrack',
    status: 'Prototype',
    year: '2024',
    summary: 'Computer-vision attendance tracking on Raspberry Pi using OpenCV.',
    description:
      'An attendance system that uses a Raspberry Pi camera and OpenCV face recognition to log presence automatically — no manual roll call, no card taps. Designed for small classroom and lab deployments.',
    technologies: ['Next.js', 'React', 'TypeScript', 'OpenCV', 'Raspberry Pi'],
    features: [
      'Face detection and recognition via OpenCV',
      'Edge deployment on Raspberry Pi',
      'Automatic attendance logging with timestamps',
      'Dashboard for streak and presence analytics',
    ],
    architecture: [
      { label: 'Edge', tech: 'Raspberry Pi + OpenCV', purpose: 'Face capture and recognition' },
      { label: 'Frontend', tech: 'Next.js + React', purpose: 'Attendance dashboard' },
      { label: 'API Layer', tech: 'Next.js API routes', purpose: 'Log presence, query records' },
      { label: 'Database', tech: 'SQLite', purpose: 'Attendance records, face embeddings' },
    ],
    github: 'https://github.com/aaupatel/streaktrack',
    media: { image: '/assets/projects/StreakTrack.png' },
    accent: '#3fb950',
  },
  {
    slug: 'goushala',
    title: 'Goushala Donation Platform',
    status: 'Completed',
    year: '2025',
    summary: 'MERN donation platform with Razorpay payments, OTP auth, and admin dashboard.',
    description:
      'A donation platform for cattle shelters (goushalas) with OTP-based authentication, Razorpay payment integration, AWS S3 media storage, and an admin dashboard for managing campaigns and donors. Delivered as a freelance project (Jun – Dec 2025).',
    technologies: ['MongoDB', 'Express', 'React', 'Node.js', 'Razorpay', 'AWS S3'],
    features: [
      'OTP-based donor authentication',
      'Razorpay payment integration with receipts',
      'AWS S3 media storage for campaign images',
      'Admin dashboard for campaign and donor management',
      'Donation workflow with status tracking',
    ],
    architecture: [
      { label: 'Frontend', tech: 'React', purpose: 'Campaign browsing, donation flow' },
      { label: 'API Layer', tech: 'Express REST', purpose: 'Campaigns, donors, payments' },
      { label: 'Auth', tech: 'OTP via SMS', purpose: 'Phone-based donor verification' },
      { label: 'Database', tech: 'MongoDB', purpose: 'Campaigns, donors, transactions' },
      { label: 'Payments', tech: 'Razorpay', purpose: 'Checkout, verification, receipts' },
      { label: 'Storage', tech: 'AWS S3', purpose: 'Campaign image media' },
    ],
    github: 'https://github.com/aaupatel/goushala-mern-app',
    media: { image: '/assets/projects/Goushala.png' },
    accent: '#d29922',
  },
];

export const getProject = (slug: string): Project | undefined =>
  projects.find((p) => p.slug === slug);
