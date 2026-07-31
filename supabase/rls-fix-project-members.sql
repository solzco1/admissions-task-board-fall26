-- Fix project_members RLS recursion (empty dashboard / broken project access).
-- Run in Supabase SQL Editor if projects or tasks fail to load after signup.

drop policy if exists "Members can view project membership" on public.project_members;

create policy "View own project membership"
  on public.project_members for select
  to authenticated
  using (user_id = auth.uid());

create policy "Owners view all project members"
  on public.project_members for select
  to authenticated
  using (
    exists (
      select 1 from public.projects p
      where p.id = project_members.project_id and p.owner_id = auth.uid()
    )
  );

grant select on public.project_members to authenticated;
