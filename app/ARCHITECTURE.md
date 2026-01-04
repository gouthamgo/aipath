# AiPath - Architecture Documentation

> AI Engineering Learning Platform built with Wasp Framework

**Last Updated:** January 2025
**Version:** 1.0.0
**Stack:** Wasp 0.19.1 + React + TypeScript + Prisma + PostgreSQL

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Directory Structure](#directory-structure)
4. [Core Modules](#core-modules)
5. [Learning Module Architecture](#learning-module-architecture)
6. [Database Schema](#database-schema)
7. [Authentication & Authorization](#authentication--authorization)
8. [API Operations](#api-operations)
9. [Component Library](#component-library)
10. [Performance Optimizations](#performance-optimizations)
11. [Development Progress](#development-progress)
12. [Future Roadmap](#future-roadmap)

---

## Project Overview

AiPath is a comprehensive AI Engineering learning platform that teaches users to build production AI systems through hands-on projects. The platform covers:

- **Phase 1:** Python Foundations (FREE)
- **Phase 2:** LLM Fundamentals (Premium)
- **Phase 3:** AI Agents (Premium)
- **Phase 4:** Production AI (Premium)

**Total Content:** 4 Phases | 15 Projects | 102 Lessons

---

## Technology Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 | UI Framework |
| TypeScript | Type Safety |
| TailwindCSS | Styling |
| Lucide React | Icons |
| React Router v6 | Routing |

### Backend
| Technology | Purpose |
|------------|---------|
| Wasp 0.19.1 | Full-Stack Framework |
| Node.js | Runtime |
| Prisma | ORM |
| PostgreSQL | Database |

### External Services
| Service | Purpose |
|---------|---------|
| Piston API | Python Code Execution |
| Stripe | Payment Processing |
| Plausible | Analytics |

---

## Directory Structure

```
aipath/app/
├── .wasp/                      # Wasp generated files (do not edit)
├── migrations/                 # Prisma migrations
├── public/                     # Static assets
│   └── images/
├── src/
│   ├── admin/                  # Admin dashboard
│   │   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx
│   │   │   └── SidebarLinkGroup.tsx
│   │   └── pages/
│   │
│   ├── auth/                   # Authentication
│   │   ├── AuthPageLayout.tsx
│   │   ├── LoginPage.tsx
│   │   └── SignupPage.tsx
│   │
│   ├── client/                 # Shared client code
│   │   ├── components/
│   │   │   ├── AiPathLogo.tsx       # Unified logo component
│   │   │   ├── NavBar/
│   │   │   └── ui/                   # shadcn/ui components
│   │   ├── hooks/
│   │   │   └── useIsLandingPage.ts
│   │   ├── static/
│   │   └── utils.ts
│   │
│   ├── landing-page/           # Marketing pages
│   │   ├── components/
│   │   │   ├── Hero.tsx
│   │   │   ├── Features.tsx
│   │   │   ├── CodePreview.tsx
│   │   │   ├── Curriculum.tsx
│   │   │   ├── Testimonials.tsx
│   │   │   ├── Pricing.tsx
│   │   │   ├── FAQ.tsx
│   │   │   └── Footer.tsx
│   │   ├── logos/
│   │   ├── contentSections.ts
│   │   └── LandingPage.tsx
│   │
│   ├── learning/               # Core learning module
│   │   ├── components/
│   │   │   ├── LearningLayout.tsx
│   │   │   └── lesson/              # Modular lesson components
│   │   │       ├── index.ts
│   │   │       ├── SyntaxHighlighter.tsx
│   │   │       ├── MarkdownRenderer.tsx
│   │   │       ├── CodeEditor.tsx
│   │   │       └── HintsPanel.tsx
│   │   ├── data/
│   │   │   ├── curriculum.ts        # Course structure
│   │   │   └── lessons/             # Modular lesson content (120 files)
│   │   │       ├── index.ts         # Lesson registry with O(1) lookup
│   │   │       ├── types.ts         # LessonContent interface
│   │   │       │
│   │   │       │   # Phase 1: Python Foundations
│   │   │       ├── python-essentials/    # 14 files
│   │   │       │   ├── index.ts
│   │   │       │   ├── variables-types.ts
│   │   │       │   ├── control-flow.ts
│   │   │       │   └── ...
│   │   │       ├── data-manipulation/    # 6 files
│   │   │       ├── apis-http/            # 6 files
│   │   │       │
│   │   │       │   # Phase 2: LLM Fundamentals
│   │   │       ├── openai-api/           # 6 files
│   │   │       ├── prompt-engineering/   # 8 files
│   │   │       ├── langchain/            # 11 files
│   │   │       ├── structured-outputs/   # 7 files
│   │   │       ├── vector-databases/     # 9 files
│   │   │       ├── rag-applications/     # 11 files
│   │   │       │
│   │   │       │   # Phase 3: AI Agents
│   │   │       ├── agents/               # 10 files
│   │   │       ├── langgraph/            # 6 files
│   │   │       ├── multi-agent/          # 6 files
│   │   │       │
│   │   │       │   # Phase 4: Production AI
│   │   │       ├── llmops/               # 6 files
│   │   │       ├── deployment/           # 6 files
│   │   │       └── advanced-patterns/    # 6 files
│   │   │
│   │   ├── hooks/                   # Custom React hooks
│   │   │   ├── index.ts
│   │   │   ├── useLesson.ts
│   │   │   ├── useCodeExecution.ts
│   │   │   └── useProgress.ts
│   │   ├── pages/
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── ProjectsPage.tsx
│   │   │   ├── ProjectDetailPage.tsx
│   │   │   └── LessonPage.tsx
│   │   └── operations.ts            # Server queries/actions
│   │
│   ├── payment/                # Stripe integration
│   │   └── operations.ts
│   │
│   ├── shared/                 # Shared utilities
│   │   └── utils.ts
│   │
│   └── user/                   # User management
│       ├── AccountPage.tsx
│       ├── UserDropdown.tsx
│       └── UserMenuItems.tsx
│
├── main.wasp                   # Wasp configuration
├── schema.prisma               # Database schema
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

---

## Core Modules

### 1. Landing Page Module (`src/landing-page/`)

Marketing pages with:
- Hero section with CTAs
- Features showcase
- Code preview demo
- Curriculum overview
- Testimonials
- Pricing tiers
- FAQ accordion
- Footer

**Key Feature:** Logged-in users are automatically redirected to `/dashboard`.

### 2. Authentication Module (`src/auth/`)

Wasp-powered email authentication with:
- Email/password login
- Email verification
- Password reset flow
- Protected routes

### 3. Learning Module (`src/learning/`)

The core of the platform - detailed below.

### 4. Admin Module (`src/admin/`)

Admin dashboard for:
- User management
- Content management
- Analytics overview

### 5. Payment Module (`src/payment/`)

Stripe integration for:
- Subscription management (Pro/Lifetime)
- Checkout flow
- Webhook handling

---

## Learning Module Architecture

### Data Layer

#### Curriculum Structure (`data/curriculum.ts`)

```typescript
interface Lesson {
  slug: string;
  title: string;
  description: string;
  order: number;
  estimatedMinutes: number;
}

interface Project {
  id: string;
  slug: string;
  title: string;
  description: string;
  longDescription: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedHours: number;
  isPremium: boolean;
  skills: string[];
  lessons: Lesson[];
}

interface Phase {
  phase: number;
  title: string;
  description: string;
  color: "emerald" | "violet" | "cyan" | "amber";
  isFree: boolean;
  projects: Project[];
}
```

#### Lesson Content Structure (`data/lessons/types.ts`)

```typescript
interface LessonContent {
  slug: string;
  problemContent: string;      // Problem statement (Markdown)
  solutionContent: string;     // Solution explanation (Markdown)
  explanationContent: string;  // Deep dive (Markdown)
  realworldContent: string;    // Real-world applications
  mistakesContent: string;     // Common mistakes
  interviewContent: string;    // Interview prep
  starterCode: string;         // Code template
  solutionCode: string;        // Working solution
  hints: string[];             // Progressive hints
}
```

#### Modular Lesson Organization

Each topic is organized into its own directory with individual lesson files:

```
lessons/
├── python-essentials/
│   ├── index.ts              # Exports pythonEssentialsLessons
│   ├── variables-types.ts    # ~200 lines
│   ├── control-flow.ts
│   └── ...
├── agents/
│   ├── index.ts              # Exports agentsLessons
│   ├── what-are-agents.ts
│   ├── react-pattern.ts
│   └── ...
└── ...
```

**Benefits:**
- Each file is 200-400 lines (readable in one go)
- Easy to edit individual lessons
- Better git diffs and code review
- Tree-shakeable for smaller bundles

#### Lesson Registry (`data/lessons/index.ts`)

Optimized O(1) lookup registry that combines all modular imports:

```typescript
// Imports from modular directories
import { pythonEssentialsLessons } from './python-essentials/index';
import { agentsLessons } from './agents/index';
// ... all other modules

const lessonRegistry: Record<string, LessonContent> = {
  ...pythonEssentialsLessons,
  ...agentsLessons,
  // ... spreads all 15 lesson collections
};

export function getAllLessonContent(slug: string): LessonContent | null {
  return lessonRegistry[slug] ?? null;  // O(1) hash lookup
}
```

### Hooks Layer (`hooks/`)

| Hook | Purpose |
|------|---------|
| `useFullLesson` | Combined lesson data, navigation, content |
| `useLessonContent` | Get lesson content by slug |
| `useLessonMeta` | Get project and lesson metadata |
| `useLessonNavigation` | Get prev/next lessons |
| `useCodeExecution` | Execute Python via Piston API |
| `useHints` | Progressive hint reveal |
| `useLessonTabs` | Tab state management |
| `useUserCode` | User code state with reset |
| `useSolutionVisibility` | Show/hide solution |

### Components Layer (`components/lesson/`)

| Component | Purpose |
|-----------|---------|
| `SyntaxHighlighter` | Python syntax highlighting |
| `MarkdownRenderer` | Markdown to JSX conversion |
| `CodeEditor` | Monaco-like editor with output |
| `HintsPanel` | Hint reveal system |
| `HintButton` | Floating hint trigger |
| `LineNumbers` | Code line numbers |

### Pages Layer (`pages/`)

| Page | Route | Description |
|------|-------|-------------|
| `DashboardPage` | `/dashboard` | User stats, recent progress |
| `ProjectsPage` | `/projects` | All projects by phase |
| `ProjectDetailPage` | `/projects/:slug` | Single project lessons |
| `LessonPage` | `/projects/:projectSlug/lessons/:lessonSlug` | Interactive lesson |

---

## Database Schema

### Core Entities

```prisma
model User {
  id                    String    @id @default(uuid())
  email                 String    @unique
  subscriptionPlan      String?   // "free" | "pro" | "lifetime"
  totalLessonsCompleted Int       @default(0)
  lastActiveAt          DateTime?
  openaiApiKey          String?
  anthropicApiKey       String?
  progress              UserProgress[]
  submissions           CodeSubmission[]
}

model Project {
  id              String   @id @default(uuid())
  slug            String   @unique
  title           String
  description     String
  longDescription String?
  difficulty      String   // "beginner" | "intermediate" | "advanced"
  estimatedHours  Int
  isPremium       Boolean  @default(false)
  isPublished     Boolean  @default(true)
  order           Int
  lessons         Lesson[]
}

model Lesson {
  id               String   @id @default(uuid())
  slug             String
  title            String
  description      String
  order            Int
  estimatedMinutes Int
  isPremium        Boolean  @default(false)
  projectId        String
  project          Project  @relation(fields: [projectId], references: [id])
  progress         UserProgress[]
  submissions      CodeSubmission[]

  @@unique([projectId, slug])
}

model UserProgress {
  id          String    @id @default(uuid())
  userId      String
  lessonId    String
  status      String    @default("not_started") // "not_started" | "in_progress" | "completed"
  savedCode   String?
  completedAt DateTime?
  updatedAt   DateTime  @updatedAt
  user        User      @relation(fields: [userId], references: [id])
  lesson      Lesson    @relation(fields: [lessonId], references: [id])

  @@unique([userId, lessonId])
}

model CodeSubmission {
  id        String   @id @default(uuid())
  userId    String
  lessonId  String
  code      String
  output    String?
  error     String?
  passed    Boolean
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id])
  lesson    Lesson   @relation(fields: [lessonId], references: [id])
}
```

---

## Authentication & Authorization

### Route Protection

```typescript
// main.wasp
route DashboardRoute { path: "/dashboard", to: DashboardPage }
page DashboardPage {
  authRequired: true,
  component: import { DashboardPage } from "@src/learning/pages/DashboardPage"
}
```

### Premium Content Access

```typescript
// Checked in getLesson operation
const canAccess =
  !lesson.isPremium ||
  user?.subscriptionPlan === "pro" ||
  user?.subscriptionPlan === "lifetime";
```

### Subscription Plans

| Plan | Access | Price |
|------|--------|-------|
| Free | Phase 1 only | $0 |
| Pro | All phases | $49/mo |
| Lifetime | All phases forever | $299 once |

---

## API Operations

### Queries (Read)

| Operation | Description | Optimization |
|-----------|-------------|--------------|
| `getProjects` | List all projects with progress | Single query with includes |
| `getProject` | Single project with lessons | Parallel progress fetch |
| `getLesson` | Lesson with premium check | 2 parallel queries (was 4) |
| `getDashboardData` | User stats, recent activity | Promise.all for 3 queries |
| `getUserProgress` | All user progress | Single query |

### Actions (Write)

| Operation | Description |
|-----------|-------------|
| `executePythonCode` | Run code via Piston API |
| `saveUserCode` | Save user's code progress |
| `markLessonComplete` | Mark lesson done, update stats |
| `updateUserApiKeys` | Store API keys for AI lessons |

---

## Component Library

### Shared UI Components (`src/client/components/ui/`)

Using shadcn/ui:
- Button
- Card
- Dialog
- Dropdown Menu
- Sheet (mobile nav)
- Skeleton
- Tabs
- Tooltip

### Custom Components

| Component | Location | Purpose |
|-----------|----------|---------|
| `AiPathLogo` | `client/components/` | Unified brand logo |
| `NavBar` | `client/components/NavBar/` | Main navigation |
| `LearningLayout` | `learning/components/` | Dashboard wrapper |

---

## Performance Optimizations

### 1. Modular File Structure

**Before:** 9 large files (1000-5000 lines each) that were slow to parse and edit

**After:** 120 small files (~200-400 lines each) organized in 15 directories

| Metric | Before | After |
|--------|--------|-------|
| Largest file | 4,944 lines | ~400 lines |
| Files per topic | 1 | 5-14 |
| Total lesson files | 9 | 120 |
| Avg file size | ~2,000 lines | ~300 lines |

### 2. Lesson Registry

```typescript
// O(1) lookup instead of O(n) search
const lessonRegistry: Record<string, LessonContent> = { ... };
export function getAllLessonContent(slug: string) {
  return lessonRegistry[slug] ?? null;  // Direct hash lookup
}
```

### 3. Database Query Optimization

**Before:**
```typescript
// 4 sequential queries
const project = await findProject();
const lesson = await findLesson();
const user = await findUser();
const progress = await findProgress();
```

**After:**
```typescript
// 2 queries: 1 for lesson+project, 1 parallel for user+progress
const lesson = await findLessonWithProject();
const [user, progress] = await Promise.all([findUser(), findProgress()]);
```

### 4. Component Memoization

All lesson components use `React.memo`:
```typescript
export const MarkdownRenderer = memo(function MarkdownRenderer({ content }) {
  const rendered = useMemo(() => renderMarkdown(content), [content]);
  return <>{rendered}</>;
});
```

### 5. Code Splitting

- Lessons loaded on-demand per route
- Components lazy-loaded where appropriate
- Hooks eliminate duplicate logic
- Modular lesson files enable better tree-shaking

---

## Development Progress

### Completed Features

- [x] Landing page with all sections
- [x] User authentication (email/password)
- [x] Protected routes
- [x] Dashboard with stats
- [x] Projects listing by phase
- [x] Project detail page
- [x] Interactive lesson page with 6 tabs
- [x] Python code execution (Piston API)
- [x] Syntax highlighting
- [x] Markdown rendering
- [x] Hint system
- [x] Progress tracking
- [x] Premium content gating
- [x] Stripe payment integration
- [x] Admin dashboard
- [x] Custom logo component
- [x] Redirect logged-in users from landing

### Lesson Content Status

| Phase | Project | Lessons | Status |
|-------|---------|---------|--------|
| 1 | Python Essentials | 7 | ✅ Complete |
| 1 | Data Manipulation | 5 | ✅ Complete |
| 1 | APIs & HTTP | 5 | ✅ Complete |
| 2 | OpenAI API Mastery | 8 | ✅ Complete |
| 2 | Prompt Engineering | 9 | ✅ Complete |
| 2 | LangChain Essentials | 10 | ✅ Complete |
| 2 | Structured Outputs | 7 | ✅ Complete |
| 2 | Vector Databases | 9 | ✅ Complete |
| 2 | RAG Applications | 10 | ✅ Complete |
| 3 | Agent Fundamentals | 6 | ✅ Complete |
| 3 | LangGraph | 5 | ✅ Complete |
| 3 | Multi-Agent Systems | 5 | ✅ Complete |
| 4 | LLMOps | 5 | ✅ Complete |
| 4 | Deployment | 5 | ✅ Complete |
| 4 | Advanced Patterns | 5 | ✅ Complete |

**Total: 102 lessons across 15 projects**

---

## Future Roadmap

### Short Term
- [ ] Add code saving to database
- [ ] Implement lesson completion tracking
- [ ] Add progress persistence
- [ ] Certificate generation

### Medium Term
- [ ] AI-powered code feedback
- [ ] Community features (comments, Q&A)
- [ ] Live coding challenges
- [ ] Leaderboards

### Long Term
- [ ] Mobile app
- [ ] Team/Enterprise plans
- [ ] Custom learning paths
- [ ] AI tutor chat

---

## Development Commands

```bash
# Start development server
wasp start

# Run database migrations
wasp db migrate-dev

# Open Prisma Studio
wasp db studio

# Type check
npx tsc --noEmit

# Build for production (fix email sender first)
wasp build
```

---

## Environment Variables

### Client (`.env.client`)
```
REACT_APP_PLAUSIBLE_DOMAIN=your-domain.com
```

### Server (`.env.server`)
```
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
PISTON_URL=https://emkc.org/api/v2/piston
```

---

## Contributing

### Adding New Lessons

1. Create a new `.ts` file in the appropriate topic directory:
   ```
   src/learning/data/lessons/{topic}/{lesson-slug}.ts
   ```

2. Follow the lesson template:
   ```typescript
   import type { LessonContent } from '../types';

   export const myNewLesson: LessonContent = {
     slug: "my-new-lesson",
     problemContent: `...`,
     solutionContent: `...`,
     // ... all fields
   };
   ```

3. Update the topic's `index.ts` to import and export the lesson:
   ```typescript
   import { myNewLesson } from './my-new-lesson';

   export const topicLessons: Record<string, LessonContent> = {
     // ... existing lessons
     "my-new-lesson": myNewLesson,
   };
   ```

4. Test with `npx tsc --noEmit` before committing

### Code Guidelines

1. Follow the existing code structure
2. Use TypeScript strictly
3. Keep lesson files under 500 lines
4. One lesson per file for maintainability

---

*Built with Wasp Framework - https://wasp-lang.dev*
