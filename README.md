# Cohort PM — Hult Developer Program

Project management platform for the Hult Cohort Developer Program Summer Pilot 2026. Built on the admissions task board foundation, extended with accounts, projects, task assignments, status workflows, and motivation features.

## Stack

- **Frontend:** Next.js 14 (App Router) + Tailwind CSS
- **Backend / Auth / DB:** Supabase (PostgreSQL + Auth)
- **Hosting:** Vercel (`*.vercel.app`)

## Features

- User authentication (sign up / log in)
- Projects with member access
- Task CRUD with assignee support
- Kanban status columns: **To Do → In Progress → Done**
- Progress bars per project
- **Latest Activity** feed when cohort members complete work

## Setup (fresh clone)

```bash
git clone https://github.com/solzco1/admissions-task-board-fall26.git
cd admissions-task-board-fall26
npm install
cp .env.example .env.local
# Fill in NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Supabase setup

1. Create a project at [supabase.com](https://supabase.com)
2. Run the SQL in `supabase/schema.sql` in the Supabase SQL Editor
3. Copy your project URL and anon key into `.env.local`
4. In Supabase Auth settings, disable email confirmation for local dev (optional)

### Deploy to Vercel

1. Push to GitHub and import the repo in Vercel
2. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` as environment variables
3. Deploy — Vercel provides the production HTTPS URL

## Scripts

| Command       | Description              |
|---------------|--------------------------|
| `npm run dev` | Start dev server         |
| `npm run build` | Production build       |
| `npm test`    | Run unit tests           |
| `npm start`   | Start production server  |

## Known limitations

- MVP focuses on core CRUD for tasks and projects
- No push notifications or real-time mobile updates
- No email notifications
- Project membership is owner-only (no invite flow yet)

## Legacy admissions API

The original Express task board API lives in `legacy/` for reference. It was the starting point for this project.

## Agent usage

Built with Cursor AI Composer for architecture, Supabase integration, UI implementation, and test coverage.
