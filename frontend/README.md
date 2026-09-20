# Ayush Patidar — Developer Portfolio

An interactive developer portfolio built around a terminal/developer-console aesthetic. The site functions as a living resume — visitors navigate via a terminal-style menu, explore projects, inspect an architecture diagram, interact with developer tools, and view a GitHub activity visualization, all within a themed interface that responds to mouse, scroll, and theme preferences.

## Live Portfolio

> **URL:** _Add deployed URL here once available._

The project is a static Vite frontend and can be deployed to any static hosting provider (Vercel, Netlify, GitHub Pages, Cloudflare Pages, etc.).

---

## Features

| Feature | Description |
|---|---|
| **Terminal boot sequence** | A PowerShell-style loading animation runs on first visit, simulating a `git clone` → `npm install` → `npm run dev` flow before revealing the site. |
| **Terminal-style navigation** | Navbar links are rendered as terminal commands (`[HOME]`, `[ABOUT]`, etc.). A mobile menu expands into a full-screen terminal panel. |
| **Interactive 3D Hero** | A wireframe code cube with orbiting nodes and particles rendered with Three.js. Reacts to mouse movement with smooth lerp-based rotation and floating animation. |
| **Custom cursor** | A small accent-colored dot and a subtly expanding outer ring follow the mouse on desktop devices. Disabled entirely on touch devices and reduced-motion mode. |
| **Dark / Light theme** | Full theme toggle with CSS custom properties. Defaults to dark mode and persists the choice in `localStorage`. |
| **Projects section** | Cards for each project with status, year, tech tags, and key features. Clicking opens a detailed modal with full architecture breakdown. |
| **About section** | Terminal-style `whoami` profile card with bio, education, and current focus. |
| **Skills / tech stack** | Rendered as a Unix-style directory tree with categorized technology groups. |
| **Experience timeline** | Career history displayed as a `git log --graph` with commit icons and tagged entries. |
| **Architecture Lab** | Interactive full-stack system diagram (CLIENT → FRONTEND → API → BACKEND → DATABASE / SERVICES). Hovering a node highlights connected edges and shows detail. |
| **Developer Lab** | Interactive tools including a working terminal emulator (with commands like `help`, `ls`, `whoami`, `neofetch`, `theme`), a JSON formatter, a simulated system monitor, a mock API inspector, and a git graph visualization. |
| **GitHub Activity** | A contribution heatmap visualization. **Note:** this is simulated/demo data, not live GitHub API data. It is clearly labeled as such in the UI. |
| **Contact section** | Contact channels (email, LinkedIn, GitHub, resume) and a contact form that opens the visitor's email client via `mailto:`. |
| **Resume link** | Points to `/resume.pdf`. The actual PDF must be supplied separately (see [Deployment](#deployment)). |
| **Responsive design** | All layouts adapt from 375px mobile to wide desktop with no horizontal scrolling. |
| **Reduced-motion support** | Respects `prefers-reduced-motion` — disables 3D animations, scroll-triggered reveals, custom cursor, and floating effects. |
| **WebGL fallback** | If WebGL is unavailable, the 3D hero is replaced with a static `</>` terminal glyph. |

---

## Projects

### 1. TestNexus
**Status:** Active · **Year:** 2024

An online examination platform with live coding execution and anti-cheat proctoring. Supports automated grading, sandboxed code execution in Docker containers, and WebSocket-driven anti-cheating proctoring (tab-switch, focus loss detection).

**Technologies:** React, TypeScript, Spring Boot, MongoDB, SQL, WebSocket, Docker

**Key features:**
- Role-based authentication (student, proctor, admin)
- Timed exams with auto-submission
- Automated grading for MCQ and coding questions
- Live code execution in sandboxed containers
- WebSocket-based anti-cheat proctoring
- Dockerized backend for horizontal scaling

**GitHub:** [https://github.com/aaupatel/testnexus](https://github.com/aaupatel/testnexus)

---

### 2. StreakTrack
**Status:** Prototype · **Year:** 2024

A computer-vision attendance tracking system that uses a Raspberry Pi camera and OpenCV face recognition to log presence automatically. Designed for small classroom and lab deployments — no manual roll call or card taps required.

**Technologies:** Next.js, React, TypeScript, OpenCV, Raspberry Pi

**Key features:**
- Face detection and recognition via OpenCV
- Edge deployment on Raspberry Pi
- Automatic attendance logging with timestamps
- Dashboard for streak and presence analytics

**GitHub:** [https://github.com/aaupatel/streaktrack](https://github.com/aaupatel/streaktrack)

---

### 3. Goushala Donation Platform
**Status:** Completed · **Year:** 2025

A MERN-stack donation platform for cattle shelters (goushalas) with OTP-based authentication, Razorpay payment integration, AWS S3 media storage, and an admin dashboard. Delivered as a freelance project (Jun – Dec 2025).

**Technologies:** MongoDB, Express, React, Node.js, Razorpay, AWS S3

**Key features:**
- OTP-based donor authentication
- Razorpay payment integration with receipts
- AWS S3 media storage for campaign images
- Admin dashboard for campaign and donor management
- Donation workflow with status tracking

**GitHub:** [https://github.com/aaupatel/goushala](https://github.com/aaupatel/goushala)

---

## Tech Stack

### Frontend
- **React 18** — UI library
- **TypeScript** — type safety
- **React Router 7** — client-side routing (HashRouter)
- **Lucide React** — icon system

### 3D / Animation
- **Three.js** — WebGL rendering
- **@react-three/fiber** — React renderer for Three.js
- **@react-three/drei** — Three.js helpers (Float, Line)
- **GSAP** — scroll-triggered animations, cursor movement, magnetic buttons

### Styling
- **Tailwind CSS 3** — utility-first styling with CSS custom property theming
- **JetBrains Mono / Inter / Space Grotesk** — typography

### Development Tools
- **Vite 5** — build tool and dev server
- **ESLint 9** — linting
- **PostCSS / Autoprefixer** — CSS processing

---

## Project Structure

```
project/
├── public/
│   ├── favicon.svg
│   ├── robots.txt
│   └── sitemap.xml
├── src/
│   ├── components/
│   │   ├── 3d/
│   │   │   ├── Hero3D.tsx          # Three.js scene (code cube, particles)
│   │   │   └── LazyHero3D.tsx      # WebGL detection + lazy load + fallback
│   │   ├── navigation/
│   │   │   └── Navbar.tsx          # Terminal-style nav + mobile menu
│   │   ├── sections/
│   │   │   ├── Hero.tsx            # Hero with 3D scene
│   │   │   ├── About.tsx           # Terminal profile + bio + education
│   │   │   ├── Skills.tsx          # Tech stack tree
│   │   │   ├── Projects.tsx        # Project grid + cards
│   │   │   ├── ProjectCard.tsx     # Individual project card
│   │   │   ├── ProjectDetail.tsx   # Project detail modal content
│   │   │   ├── ArchitectureLab.tsx # Interactive system diagram
│   │   │   ├── Experience.tsx      # Git-log-style timeline
│   │   │   ├── GitHubActivity.tsx  # Simulated contribution heatmap
│   │   │   ├── DeveloperLab.tsx    # Interactive dev tools panel
│   │   │   └── Contact.tsx         # Contact channels + form
│   │   ├── terminal/
│   │   │   ├── TerminalLoader.tsx       # Boot sequence animation
│   │   │   └── InteractiveTerminal.tsx  # Working terminal emulator
│   │   └── ui/
│   │       ├── Background.tsx      # Grid + noise overlay
│   │       ├── Cursor.tsx          # Custom GSAP cursor
│   │       ├── Footer.tsx          # Footer with links + status
│   │       ├── MagneticButton.tsx  # Magnetic hover button
│   │       ├── MatrixOverlay.tsx   # Matrix rain easter egg
│   │       ├── ScrollProgress.tsx  # Scroll progress bar
│   │       ├── Section.tsx         # Section wrapper
│   │       ├── SectionHeading.tsx  # Command + title + subtitle
│   │       └── ThemeToggle.tsx     # Dark/light switch
│   ├── data/
│   │   ├── profile.ts              # Personal info, bio, education, stack
│   │   ├── projects.ts             # Project entries
│   │   ├── experience.ts           # Career timeline entries
│   │   ├── skills.ts               # Skill groupings
│   │   ├── github.ts               # GitHub username + simulated heatmap
│   │   └── navigation.ts           # Nav items + terminal commands
│   ├── hooks/
│   │   ├── ThemeContext.tsx        # Theme provider
│   │   ├── useTheme.ts             # Theme hook
│   │   ├── useReducedMotion.ts     # prefers-reduced-motion detection
│   │   ├── useIsTouch.ts           # Touch device detection
│   │   ├── useIsMobile.ts          # Mobile breakpoint detection
│   │   ├── useLockBodyScroll.ts    # Body scroll lock for modals
│   │   └── useInView.ts            # Intersection observer hook
│   ├── pages/
│   │   ├── HomePage.tsx            # Full single-page layout
│   │   ├── AboutPage.tsx           # About + Skills
│   │   ├── ProjectsPage.tsx        # Projects + Architecture + GitHub
│   │   ├── LabPage.tsx             # Developer Lab
│   │   └── ContactPage.tsx         # Contact
│   ├── types/
│   │   └── index.ts                # TypeScript type definitions
│   ├── utils/
│   │   ├── animations.ts           # GSAP animation helpers
│   │   └── cn.ts                   # Class name utility
│   ├── App.tsx                     # Root: router, loader, shell
│   ├── main.tsx                    # Entry point
│   └── index.css                   # Global styles, theme variables
├── index.html
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

---

## Getting Started

### Prerequisites

- **Node.js** 18 or higher
- **npm** (comes with Node.js)

### Installation & Development

```bash
# 1. Clone the repository
git clone https://github.com/aaupatel/portfolio.git
cd portfolio

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

The dev server starts at `http://localhost:5173/`.

### Production Build

```bash
# Create an optimized production build
npm run build

# Preview the production build locally
npm run preview
```

### Typecheck

```bash
npm run typecheck
```

### Lint

```bash
npm run lint
```

---

## Scripts

| Script | Command | Description |
|---|---|---|
| `dev` | `vite` | Start the Vite development server |
| `build` | `vite build` | Create a production build in `dist/` |
| `preview` | `vite preview` | Preview the production build locally |
| `typecheck` | `tsc --noEmit -p tsconfig.app.json` | Run TypeScript type checking without emitting files |
| `lint` | `eslint .` | Run ESLint across the project |

---

## Environment Variables

No environment variables are currently required for the portfolio to run. The project includes an optional `.env.example` with the following placeholders, none of which block local development:

| Variable | Purpose | Required |
|---|---|---|
| `VITE_SITE_URL` | Public site URL (used for SEO metadata) | No |
| `VITE_CONTACT_ENDPOINT` | Optional contact form delivery endpoint (falls back to `mailto:` if empty) | No |
| `VITE_GITHUB_USERNAME` | GitHub username for activity links | No (defaults to `aaupatel` in source) |

---

## Deployment

This is a static Vite frontend — the `npm run build` command outputs optimized assets to the `dist/` directory, which can be deployed to any static hosting provider:

- **Vercel:** Import the repo, framework preset set to Vite
- **Netlify:** Build command `npm run build`, publish directory `dist`
- **GitHub Pages:** Push the contents of `dist/` to a `gh-pages` branch
- **Cloudflare Pages:** Build command `npm run build`, output directory `dist`

### Resume PDF

The portfolio links to `/resume.pdf`. For this link to work in production, place the actual resume PDF file at:

```
public/resume.pdf
```

The PDF file is **not** included in this repository and must be supplied separately.

---

## Contact

| Channel | Details |
|---|---|
| **Email** | [ayushpatidar2810@gmail.com](mailto:ayushpatidar2810@gmail.com) |
| **LinkedIn** | [https://www.linkedin.com/in/ayush-patidar-nagra](https://www.linkedin.com/in/ayush-patidar-nagra) |
| **GitHub** | [https://github.com/aaupatel](https://github.com/aaupatel) |

---

## Personal Information

| | |
|---|---|
| **Name** | Ayush Patidar |
| **Role** | Full Stack Developer |
| **Location** | India |
| **Degree** | B.Tech in Electronics & Communication Engineering |
| **Institution** | Samrat Ashok Technological Institute (SATI), Vidisha |
| **Education period** | 2018 — 2025 |
| **Freelance timeline** | June 2025 — December 2025 |

---

## Design Philosophy

The portfolio is built around a terminal/developer-console visual language. Every section is framed as a command or developer tool — the hero opens with `./start --env=production`, skills are rendered as a directory tree, experience as a git log, and the Developer Lab houses working interactive tools. The goal is to make the portfolio feel like an interactive developer environment rather than a static resume website. A cohesive color system using CSS custom properties drives both dark and light themes, with JetBrains Mono for terminal text, Space Grotesk for display headings, and Inter for body copy.

---

## Accessibility & Performance

| Area | Implementation |
|---|---|
| **Responsive layout** | All sections use mobile-first responsive grids that stack to single column below the `lg` breakpoint. Tested down to 375px viewport width with no horizontal scrolling. |
| **Reduced motion** | `prefers-reduced-motion` is detected globally. When active: 3D animations stop, GSAP scroll triggers are skipped, custom cursor is disabled, floating effects freeze. Content remains fully visible. |
| **WebGL fallback** | Before loading the Three.js scene, the app checks for WebGL support. If unavailable, a static `</>` glyph is shown with a message indicating 3D is unavailable. |
| **Touch / mobile** | The custom cursor is completely disabled on touch devices. Native touch behavior is preserved. The mobile menu uses a full-screen terminal-style panel. |
| **Semantic elements** | Interactive elements use appropriate ARIA labels, `role` attributes, and keyboard support (Enter to open project cards, Escape-aware modals, focus-visible outlines). |
| **Scroll-triggered animations** | GSAP ScrollTrigger animations include a 2-second fallback timer that forces content visible if the trigger fails to fire, preventing invisible content. |

---

## Notes / Limitations

- **GitHub Activity is simulated.** The contribution heatmap on the GitHub Activity section uses procedurally generated demo data, not live GitHub API data. It is labeled as "simulated" in the UI. The GitHub username and profile link are real.
- **Resume PDF is not included.** The `/resume.pdf` link is wired up but the actual PDF file must be added to `public/resume.pdf` separately.
- **Contact form uses `mailto:`.** The contact form does not send messages server-side. It composes a `mailto:` link that opens the visitor's email client with a pre-filled message. An optional `VITE_CONTACT_ENDPOINT` environment variable is supported but not configured.
- **Hash-based routing.** The app uses `HashRouter` (URLs like `/#/projects`) for compatibility with static hosting without server-side rewrite configuration.

---

## License

No license has currently been specified for this repository.
