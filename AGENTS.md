# Agent instructions — Cohort PM (Project 1)

## Project

Next.js 14 + Supabase PM platform for the Hult cohort (`admissions-task-board-fall26`).

## Commands

```bash
npm install
cp .env.example .env.local   # add Supabase URL + anon key
npm test
npm run build
npm run dev
```

Run `supabase/schema.sql` in Supabase SQL Editor before first use.

## Validation before handoff

- `npm test` and `npm run build` pass
- Sign up → create project → add task → move statuses → activity feed updates
- Production URL returns 200 (not 500)

## Scope

- Do not commit `.env.local` or secrets
- `forth/` is a separate reference clone — not part of this PM submission
- Preserve Supabase RLS; client checks are not authorization
