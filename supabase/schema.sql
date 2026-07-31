-- Hult Cohort PM — run in Supabase SQL Editor

create extension if not exists "pgcrypto";

-- Profiles (linked to auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  display_name text,
  created_at timestamptz not null default now()
);

-- Projects
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  owner_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now()
);

-- Project membership
create table if not exists public.project_members (
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null default 'member' check (role in ('owner', 'member')),
  primary key (project_id, user_id)
);

-- Tasks with status workflow
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  title text not null,
  description text,
  status text not null default 'todo' check (status in ('todo', 'in_progress', 'done')),
  assignee_id uuid references public.profiles(id) on delete set null,
  created_by uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Activity feed
create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  task_id uuid references public.tasks(id) on delete set null,
  action text not null,
  detail text,
  created_at timestamptz not null default now()
);

create index if not exists idx_tasks_project on public.tasks(project_id);
create index if not exists idx_tasks_status on public.tasks(status);
create index if not exists idx_activities_project on public.activities(project_id, created_at desc);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Updated_at trigger
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists tasks_updated_at on public.tasks;
create trigger tasks_updated_at
  before update on public.tasks
  for each row execute function public.set_updated_at();

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.project_members enable row level security;
alter table public.tasks enable row level security;
alter table public.activities enable row level security;

-- Profiles: users can read all profiles (for assignee pickers), update own
create policy "Profiles are viewable by authenticated users"
  on public.profiles for select to authenticated using (true);

create policy "Users can update own profile"
  on public.profiles for update to authenticated using (auth.uid() = id);

-- Projects: members can view; owner can insert
create policy "Members can view projects"
  on public.projects for select to authenticated
  using (
    exists (
      select 1 from public.project_members pm
      where pm.project_id = projects.id and pm.user_id = auth.uid()
    )
  );

create policy "Authenticated users can create projects"
  on public.projects for insert to authenticated
  with check (auth.uid() = owner_id);

create policy "Owners can update projects"
  on public.projects for update to authenticated
  using (owner_id = auth.uid());

create policy "Owners can delete projects"
  on public.projects for delete to authenticated
  using (owner_id = auth.uid());

-- Project members (no self-referential policy — avoids RLS recursion)
drop policy if exists "Members can view project membership" on public.project_members;
drop policy if exists "View own project membership" on public.project_members;
drop policy if exists "Owners view all project members" on public.project_members;

create policy "View own project membership"
  on public.project_members for select to authenticated
  using (user_id = auth.uid());

create policy "Owners view all project members"
  on public.project_members for select to authenticated
  using (
    exists (
      select 1 from public.projects p
      where p.id = project_members.project_id and p.owner_id = auth.uid()
    )
  );

create policy "Owners can manage membership"
  on public.project_members for all to authenticated
  using (
    exists (
      select 1 from public.projects p
      where p.id = project_members.project_id and p.owner_id = auth.uid()
    )
  );

create policy "Users can join as member on insert"
  on public.project_members for insert to authenticated
  with check (user_id = auth.uid() or exists (
    select 1 from public.projects p
    where p.id = project_members.project_id and p.owner_id = auth.uid()
  ));

-- Tasks
create policy "Members can view tasks"
  on public.tasks for select to authenticated
  using (
    exists (
      select 1 from public.project_members pm
      where pm.project_id = tasks.project_id and pm.user_id = auth.uid()
    )
  );

create policy "Members can create tasks"
  on public.tasks for insert to authenticated
  with check (
    created_by = auth.uid() and exists (
      select 1 from public.project_members pm
      where pm.project_id = tasks.project_id and pm.user_id = auth.uid()
    )
  );

create policy "Members can update tasks"
  on public.tasks for update to authenticated
  using (
    exists (
      select 1 from public.project_members pm
      where pm.project_id = tasks.project_id and pm.user_id = auth.uid()
    )
  );

create policy "Members can delete tasks"
  on public.tasks for delete to authenticated
  using (
    exists (
      select 1 from public.project_members pm
      where pm.project_id = tasks.project_id and pm.user_id = auth.uid()
    )
  );

-- Activities
create policy "Members can view activities"
  on public.activities for select to authenticated
  using (
    exists (
      select 1 from public.project_members pm
      where pm.project_id = activities.project_id and pm.user_id = auth.uid()
    )
  );

create policy "Members can log activities"
  on public.activities for insert to authenticated
  with check (
    user_id = auth.uid() and exists (
      select 1 from public.project_members pm
      where pm.project_id = activities.project_id and pm.user_id = auth.uid()
    )
  );
