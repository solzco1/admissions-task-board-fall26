import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { signOut } from '@/app/actions';
import { KanbanBoard } from '@/components/KanbanBoard';
import { ActivityFeed } from '@/components/ActivityFeed';
import { ProgressBar } from '@/components/ProgressBar';
import { CreateTaskForm } from '@/components/CreateTaskForm';
import { computeProgress } from '@/lib/tasks.js';
import type { Task, Profile } from '@/lib/types';

export default async function ProjectPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const supabase = await createClient();

  const { data: project } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single();

  if (!project) notFound();

  const { data: tasks } = await supabase
    .from('tasks')
    .select('*, assignee:profiles!tasks_assignee_id_fkey(id, email, display_name)')
    .eq('project_id', id)
    .order('created_at', { ascending: true });

  const { data: members } = await supabase
    .from('project_members')
    .select('user_id, profile:profiles(id, email, display_name)')
    .eq('project_id', id);

  const { data: activities } = await supabase
    .from('activities')
    .select('*, profile:profiles(display_name, email), task:tasks(title)')
    .eq('project_id', id)
    .order('created_at', { ascending: false })
    .limit(20);

  const memberProfiles = (members ?? [])
   .map((m) => m.profile as unknown as Profile | null)
    .filter(Boolean) as Profile[];

  const progress = computeProgress((tasks ?? []) as Task[]);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-sm text-brand-600 hover:underline">
              ← Dashboard
            </Link>
            <h1 className="text-lg font-semibold">{project.name}</h1>
          </div>
          <form action={signOut}>
            <button type="submit" className="btn-secondary text-sm">
              Sign out
            </button>
          </form>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        {project.description && (
          <p className="mb-4 text-slate-600">{project.description}</p>
        )}

        <ProgressBar progress={progress} className="mb-8" />

        <div className="grid gap-8 lg:grid-cols-4">
          <div className="lg:col-span-3 space-y-6">
            <CreateTaskForm projectId={id} members={memberProfiles} />
            <KanbanBoard
              tasks={(tasks ?? []) as Task[]}
              projectId={id}
              members={memberProfiles}
            />
          </div>
          <aside>
            <ActivityFeed activities={activities ?? []} title="Latest activity" />
          </aside>
        </div>
      </main>
    </div>
  );
}
