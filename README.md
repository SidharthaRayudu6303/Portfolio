# Sidhartha Rayudu — Full-Stack Developer & AI Systems Engineer

[![Next.js](https://img.shields.io/badge/Next.js-16.4-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![NestJS](https://img.shields.io/badge/NestJS-11.0-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6.5-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Neon](https://img.shields.io/badge/Neon_PostgreSQL-Serverless-00E599?style=for-the-badge&logo=postgresql&logoColor=white)](https://neon.tech/)
[![Three.js](https://img.shields.io/badge/Three.js-R3F-black?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

> A modern, high-performance, and visually immersive developer portfolio platform. Built with **Next.js 16 (React 19)**, **NestJS 11**, **Three.js / React Three Fiber**, **Prisma 6**, and **Neon PostgreSQL**, engineered under strict enterprise security practices with an interactive 3D universe, dedicated Admin CMS, AI Portfolio Assistant, and zero-cost cloud architecture.

---

## 👨‍💻 About Sidhartha Rayudu

**Madhavarapu Sidhartha Rayudu** (`SIDHARTHA RAYUDU`) is an aspiring Full-Stack Developer and Software Engineer currently pursuing a Bachelor of Engineering (B.E.) in Computer Science and Engineering at **Sathyabama Institute of Science and Technology** (2023–2027, CGPA: **8.37 / 10**).

- **Location**: Kakinada, East Godavari, Andhra Pradesh, India
- **Core Focus**: Full-Stack Web Development, Scalable Backend Architectures, Computer Vision & AI/ML
- **GitHub**: [github.com/SidharthaRayudu6303](https://github.com/SidharthaRayudu6303)
- **LinkedIn**: [linkedin.com/in/sidhartha-rayudu-madhavarapu-039b84318](https://www.linkedin.com/in/sidhartha-rayudu-madhavarapu-039b84318/)
- **LeetCode**: [leetcode.com/u/WPETOvKlww](https://leetcode.com/u/WPETOvKlww/)
- **HackerRank**: [hackerrank.com/profile/madhavarapusidh1](https://www.hackerrank.com/profile/madhavarapusidh1)
- **Contact**: `madhavarapusidhartharayudu@gmail.com` • `+91 6303075505`

---

## 🌟 Key Platform Features

### 1. Immersive 3D Experience & Visual Identity
- **Futuristic Palette**: Minimalist deep black (`#050505`) with electric cyan (`#00f0ff`) neon accents and subtle ambient glows.
- **Interactive 3D Developer Character**: Rendered using `@react-three/fiber` and `@react-three/drei` with mouse tracking, smooth orbital dampening, and reactive hover lighting.
- **Particle Universe**: Background canvas simulating spatial depth with thousands of stars and kinetic particle connections.
- **Cinematic Experience**: Ultra-smooth entrance animations, magnetic CTA buttons, and responsive layout across desktop, tablet, and mobile.

### 2. Comprehensive & Verified Portfolio Showcase
- **Projects Showcase**: Deep-dive modals and structured cards detailing problem statements, technical architecture, and individual contributions:
  - **GenVision** — AI-powered image editing, object removal, and inpainting with Diffusion Models and Transformers.
  - **BhuYanthra** — Geospatial analysis and planetary satellite data processing pipeline.
  - **Robohatch** — Full-stack hardware-software platform for automated robotics operations.
  - **SmartDonum** — Transparent donation tracking platform built with Next.js, Node.js, and SQL.
  - **Autism Screening Platform** — Machine learning early detection prototype.
  - **Smart Rental Platform** — Equipment rental tracking and fleet management operations engine.
- **Academic Foundation**: Dedicated Sathyabama Institute of Science and Technology section detailing coursework, CGPA (8.37/10), and major academic milestones.
- **Professional Experience**: React JS Developer Intern at Unstop Events.
- **Competitions & Hackathons**:
  - **Bharatiya Antariksh Hackathon 2026** — Selected for Challenge 12 (Space Applications & Geospatial Processing).
  - **CAT Hackathon** — Competitive coding and algorithmic problem-solving.
  - **National Coding Aptitude Test (NCAT) 2025** — Ranked 4,237 among 2.1 lakh+ participants.
- **Verified Certifications**: 9 authenticated credentials including CodeTantra / Sathyabama (Python), Infosys Springboard (Python, Email Writing, Time Management), TCS iON Career Edge, Udemy (Generative AI Primer), MongoDB University, and One Roadmap (Frontend).

### 3. Developer Tools & Intelligence
- **Developer Terminal (`Ctrl+\``)**: Interactive command-line interface supporting Unix-like commands (`about`, `skills`, `projects`, `education`, `experience`, `certifications`, `hackathons`, `contact`, `clear`).
- **Command Palette (`Ctrl+K` / `Cmd+K`)**: Rapid keyboard-first navigation and immediate shortcut actions.
- **AI Portfolio Assistant**: Interactive chat assistant grounded in verified portfolio facts, operating offline or powered by Gemini.

### 4. Enterprise-Grade Admin CMS
- **Secure Management**: Protected by JWT HTTP-only cookies, argon2 password hashing, and token versioning for instant session revocation.
- **Persistent Resume Management (`/admin/resume`)**:
  - Resumes stored in PostgreSQL `BYTEA` format (survives ephemeral hosting restarts at ₹0 cost).
  - Strict validation of magic byte signatures (`%PDF-` / `[0x25, 0x50, 0x44, 0x46]`) and 5MB size limit.
  - Complete version history with instant atomic rollbacks and public download endpoints.
- **Profile Personalization CMS (`/admin/profile`)**: Manage avatar preferences, bio, and social links.
- **Content CMS**: Manage projects, skills, experience, certifications, and read received contact inquiries.

---

## 🏛️ System Architecture

```text
┌─────────────────────────────────────────────────────────────┐
│                      Client Browser                         │
│   (Next.js 16 App Router + React 19 + Three.js + Tailwind)  │
└──────────────────────────────┬──────────────────────────────┘
                               │
                HTTP / JSON    │  Double-Submit CSRF + Cookie
                               ▼
┌─────────────────────────────────────────────────────────────┐
│              Next.js BFF (Backend For Frontend)             │
│        apps/web/src/app/api/* (SSR, Route Handlers)         │
└──────────────────────────────┬──────────────────────────────┘
                               │
               Internal API    │  x-internal-secret / Bearer JWT
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 NestJS 11 Core Backend API                  │
│       apps/api/src/* (Validation, Auth, Rate Limiter)       │
└──────────────────────────────┬──────────────────────────────┘
                               │
               Prisma ORM 6.5  │  SSL Direct & Pooled Conns
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 Neon Serverless PostgreSQL                  │
│     (Relational Data, BYTEA Resumes, Audit Logs, Users)     │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Monorepo Structure

```text
portfolio/
├── apps/
│   ├── api/                           # NestJS 11 Backend Application
│   │   ├── prisma/                    # Prisma Schema, Migrations, and Seed
│   │   │   ├── migrations/            # Version-controlled SQL migrations
│   │   │   ├── schema.prisma          # Database models (Projects, Resume, Auth, etc.)
│   │   │   └── seed.ts                # Verified database seed
│   │   ├── src/
│   │   │   ├── common/                # Guards, interceptors, filters, decorators
│   │   │   ├── config/                # Environment variable validation
│   │   │   ├── modules/               # Domain feature modules
│   │   │   │   ├── ai/                # AI Assistant & verified portfolio knowledge
│   │   │   │   ├── auth/              # JWT auth, rate limiting & session control
│   │   │   │   ├── resume/            # BYTEA resume storage, stream & upload
│   │   │   │   ├── projects/          # Projects API module
│   │   │   │   ├── skills/            # Skills API module
│   │   │   │   ├── experience/        # Experience API module
│   │   │   │   ├── certifications/    # Certifications API module
│   │   │   │   ├── contact/           # Contact form & honeypot verification
│   │   │   │   └── health/            # Liveness, readiness, and DB health checks
│   │   │   ├── app.module.ts
│   │   │   └── main.ts
│   │   └── tsconfig.json
│   │
│   └── web/                           # Next.js 16 Frontend Application
│       ├── public/                    # Static assets, fonts, icons
│       ├── src/
│       │   ├── app/                   # App Router pages and BFF API routes
│       │   │   ├── admin/             # Secure CMS dashboard & management pages
│       │   │   ├── api/               # BFF proxy route handlers
│       │   │   ├── blog/              # Engineering blog
│       │   │   ├── layout.tsx         # Root layout with SEO and Schema.org metadata
│       │   │   └── page.tsx           # Main single-page interactive portfolio
│       │   ├── components/            # Reusable UI & section components
│       │   │   ├── assistant/         # AI Assistant dialog
│       │   │   ├── palette/           # Command Palette (Cmd+K)
│       │   │   ├── terminal/          # Developer Terminal (Ctrl+`)
│       │   │   ├── three/             # 3D Rig, Canvas & Particle Universe
│       │   │   ├── hero.tsx           # Hero section with 3D character
│       │   │   ├── about.tsx          # About & Career narrative
│       │   │   ├── education-section.tsx
│       │   │   ├── skills-section.tsx
│       │   │   ├── projects-section.tsx
│       │   │   ├── experience-section.tsx
│       │   │   ├── hackathons-section.tsx
│       │   │   ├── certifications-section.tsx
│       │   │   └── contact-section.tsx
│       │   ├── lib/                   # Client utilities, constants, CSRF client
│       │   └── styles/                # Tailwind global CSS
│       └── next.config.ts
│
├── packages/
│   └── types/                         # Shared TypeScript types and DTO contracts
│       ├── src/index.ts
│       └── package.json
│
├── pnpm-workspace.yaml                # Monorepo workspace configuration
├── turbo.json                         # Turborepo task pipelines
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: `v20.x` or `v22.x` (LTS recommended)
- **pnpm**: `v9.x` or `v10.x` (`npm install -g pnpm`)
- **PostgreSQL Database**: Neon serverless database or local PostgreSQL instance

### 1. Clone the Repository
```bash
git clone https://github.com/SidharthaRayudu6303/Portfolio.git
cd Portfolio
```

### 2. Install Dependencies
```bash
pnpm install
```

### 3. Configure Environment Variables

**Backend (`apps/api/.env`)**:
```env
PORT=4000
NODE_ENV=development
DATABASE_URL="postgresql://user:password@ep-xyz-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require"
DIRECT_URL="postgresql://user:password@ep-xyz.us-east-2.aws.neon.tech/neondb?sslmode=require"
JWT_SECRET="replace-with-a-secure-random-64-character-secret"
IP_SALT_SECRET="replace-with-a-secure-salt-secret"
BACKUP_ENCRYPTION_KEY="replace-with-32-byte-encryption-key"
ADMIN_EMAIL="admin@portfolio.local"
ADMIN_PASSWORD="ChooseAStrongAdminPassword123!"
CORS_ORIGIN="http://localhost:3000"
```

**Frontend (`apps/web/.env.local`)**:
```env
NEXT_PUBLIC_API_URL="http://localhost:4000/api/v1"
API_INTERNAL_URL="http://localhost:4000/api/v1"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 4. Database Migration & Seed
```bash
# Generate Prisma Client
pnpm --filter api exec prisma generate

# Apply migrations
pnpm --filter api exec prisma migrate deploy

# Seed verified portfolio content
pnpm --filter api db:seed
```

### 5. Run Local Development Server
```bash
pnpm dev
```
- **Web Portfolio**: [http://localhost:3000](http://localhost:3000)
- **API Server**: [http://localhost:4000/api/v1](http://localhost:4000/api/v1)
- **Admin Dashboard**: [http://localhost:3000/admin](http://localhost:3000/admin)

---

## 🧪 Testing & Quality Assurance

The codebase includes automated test suites for security, CSRF protection, authentication guards, and AI knowledge boundaries:

```bash
# Typecheck all packages
pnpm typecheck

# Run linter
pnpm lint

# Run all unit and integration tests
pnpm test

# Build monorepo for production
pnpm build
```

---

## 🔒 Security & Privacy Commitments

- **No Credential Leakage**: `.env` and `.env.local` files are strictly git-ignored; no API secrets or credentials are ever committed.
- **Double-Submit CSRF**: All BFF state-mutating requests (`POST`, `PUT`, `PATCH`, `DELETE`) require a cryptographically verified `x-csrf-token` header.
- **Rate Limiting & Lockout**: IP-hashed rate limiting prevents credential stuffing attacks against admin authentication and contact form spam.
- **Audit Logging**: Sensitive mutations in the admin dashboard record user IP (hashed with salt), timestamp, and action performed.
- **Authentic Resumes**: Uploaded resumes must validate against the `%PDF-` file signature and cannot exceed 5MB.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE) — feel free to explore, learn from, and adapt the architecture for personal portfolios.

---

<p align="center">
  Designed &amp; Developed with 💙 by <strong>SIDHARTHA RAYUDU</strong>
</p>

