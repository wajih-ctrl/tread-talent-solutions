# Tread Talent Solutions

Recruiting operations platform for managing clients, jobs, candidates, AI CV reviews, reports, and client-facing read-only views.

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- pnpm

## Prerequisites

Install these before running the project:

- Node.js 20 or newer
- pnpm
- Git

If pnpm is not installed, enable it with Corepack:

```bash
corepack enable
corepack prepare pnpm@latest --activate
```

## Getting Started

Clone the repository:

```bash
git clone https://github.com/wajih-ctrl/tread-talent-solutions.git
cd tread-talent-solutions
```

Install dependencies:

```bash
pnpm install
```

Start the development server:

```bash
pnpm dev
```

Open the app:

```text
http://localhost:3000
```

## Demo Access

The login screen is set up for prototype/demo access.

- For admin access, click `Admin Access`, then click `Sign In`.
- For client access, click `Client View`, then click `Sign In`.
- Any credentials also work for the prototype form.

Client view is read-only and scoped to the client account. It can view its own dashboard, jobs, candidates, reports, and candidate details, but cannot add, edit, delete, or view other clients' data.

## Available Scripts

Run the local dev server:

```bash
pnpm dev
```

Create a production build:

```bash
pnpm build
```

Start the production server after building:

```bash
pnpm start
```

Type-check the project:

```bash
pnpm exec tsc --noEmit
```

Linting note:

```bash
pnpm lint
```

The `lint` script exists in `package.json`, but ESLint is not currently installed in the project dependencies. Install and configure ESLint before using this script.

## Project Structure

```text
app/
  apply/[jobId]/        Public application route
  globals.css           Global Tailwind/theme styles
  layout.tsx            App metadata and root layout
  page.tsx              Main app shell

components/
  app-context.tsx       Navigation, role, toast, and sidebar state
  store.tsx             In-memory prototype data store
  sidebar.tsx           Desktop navigation
  topbar.tsx            Header and notifications
  mobile-nav.tsx        Mobile navigation
  screens/              Main app screens
  ui-kit.tsx            Shared UI primitives
  icons.tsx             Local SVG icon set

lib/
  data.ts               Seed data for clients, jobs, candidates, reports
  utils.ts              Shared utility helpers

public/
  Static images and icons
```

## Important Screens

- `Dashboard`: admin and client dashboard views
- `Clients`: admin client list, client read-only jobs list
- `Job Detail`: job overview and candidate access
- `Candidates`: admin candidate pipeline, client-scoped candidate list
- `Candidate Profile`: candidate report, CV preview, AI evaluation, PDF report download
- `AI Analyzer`: admin CV scoring table
- `Reports`: admin reports and client-scoped reports
- `Email Automation`: admin templates and automation rules

## Notes For Developers

- This is currently a prototype app with in-memory seed data from `lib/data.ts`.
- There is no backend database yet; refreshing the app resets runtime changes.
- No `.env` file is required for local development.
- The production build may need internet access because `next/font` fetches Google font files during build.
- Do not commit `node_modules`, `.next`, log files, or `tsconfig.tsbuildinfo`; these are ignored by `.gitignore`.

## Deployment

The app can be deployed to Vercel or any platform that supports Next.js.

Basic production flow:

```bash
pnpm install
pnpm build
pnpm start
```
