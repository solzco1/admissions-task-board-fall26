## Summary

Cohort PM — a Next.js + Supabase project management platform extending the admissions task board. Supports authenticated accounts, projects, task CRUD, assignee workflows, kanban status columns (To Do / In Progress / Done), progress visibility, and a Latest Activity feed.

## Production URL

https://admissions-task-board-fall26.vercel.app

## Setup steps verified on fresh clone

```bash
git clone https://github.com/solzco1/admissions-task-board-fall26.git
cd admissions-task-board-fall26
npm install
cp .env.example .env.local
# Add Supabase URL + anon key, run supabase/schema.sql in Supabase SQL Editor
npm test
npm run dev
```

<!-- Confirm after verifying on clean machine -->
_Verified: pending fresh-clone check_

## Architecture summary

A unified Next.js project. Supabase handles the database and user authentication, while the frontend handles project management workflows and task status updates.

- **App Router** pages: landing, auth, dashboard, project board
- **Server Actions** for mutations (create project/task, update status, assign, delete)
- **Supabase RLS** policies enforce project membership access
- **lib/tasks.js** — pure status/progress utilities (unit tested, inherited from admissions store patterns)

## Motivation / engagement design notes

Prioritizing a **Task Status column view** (To Do / In Progress / Done) to show progress, and a **Latest Activity** feed to see when cohort members complete work.

- Progress bars on dashboard cards and project pages (% tasks done)
- Kanban columns with task counts per status
- Activity feed surfaces completions and status changes with relative timestamps
- "All tasks complete" celebration message at 100%

## Known limitations

The MVP will focus on core CRUD (Create, Read, Update, Delete) tasks. Notifications and real-time mobile push updates will be excluded from this initial release.

- No invite flow for project members (owner-only creation)
- No email/push notifications
- No real-time subscriptions (page refresh via revalidatePath)

## Agent usage summary

Used Cursor with the AI Composer to architect the app, implement the Supabase integration, and ensure all tests passed.

## Agent usage

- **Research:** Supabase Auth + RLS patterns, Next.js App Router server actions, cohort PM requirements
- **Dev:** Next.js scaffold, Supabase schema, kanban UI, activity feed, auth flow, migrated admissions logic to `lib/tasks.js`
- **QA:** `npm test` unit tests for status workflow; build verification pending Supabase env vars

## Test plan

- [ ] `npm test` passes locally
- [ ] `npm run build` succeeds with env vars set
- [ ] Sign up → create project → add task → move through statuses → see activity feed
- [ ] Production URL loads over HTTPS
- [ ] Fresh clone setup works on clean machine
