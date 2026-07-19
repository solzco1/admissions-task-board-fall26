import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { signOut, createProject } from '@/app/actions';
import { computeProgress } from '@/lib/tasks.js';
import { ActivityFeed } from '@/components/ActivityFeed';

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: memberships } = await supabase
    .from('project_members')
    .select('project_id, projects(id, name, description, created_at)')
    .eq('user_id', user!.id);

  const projectIds = memberships?.map((m) => m.project_id) ?? [];

  let taskCounts: { project_id: string; status: string }[] | null = [];
  let recentActivity: Parameters<typeof ActivityFeed>[0]['activities'] = [];

  if (projectIds.length > 0) {
    const { data: tasks } = await supabase
      .from('tasks')
      .select('project_id, status')
      .in('project_id', projectIds);
    taskCounts = tasks;

    const { data: activities } = await supabase
      .from('activities')
      .select('*, profile:profiles(display_name, email), task:tasks(title)')
      .in('project_id', projectIds)
      .order('created_at', { ascending: false })
      .limit(10);
      recentActivity = activities || [];
  }

  const progressByProject = projectIds.reduce<Record<string, number>>((acc, id) => {
    const tasks = taskCounts?.filter((t) => t.project_id === id) ?? [];
    acc[id] = computeProgress(tasks as any);
    return acc;
  }, {});

  const projects = memberships?.map((m) => m.projects).filter(Boolean) ?? [];

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/dashboard" className="text-lg font-semibold text-brand-700">
            Cohort PM
          </Link>
          <form action={signOut}>
            <button type="submit" className="btn-secondary text-sm">
              Sign out
            </button>
          </form>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-8 px-6 py-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <section>
            <h1 className="mb-1 text-2xl font-bold">Your projects</h1>
            <p className="mb-6 text-sm text-slate-600">
              Track cohort work, deadlines, and shipping momentum.
            </p>

            {projects.length === 0 ? (
              <div className="card text-center text-slate-600">
                <p className="mb-2">No projects yet.</p>
                <p className="text-sm">Create your first project below to get started.</p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {projects.map((project) => {
                  const p = project as unknown as { id: string; name: string; description: string | null }; 
                  const progress = progressByProject[p.id] ?? 0;
                  return (
                    <Link
                      key={p.id}
                      href={`/projects/${p.id}`}
                      className="card block transition-shadow hover:shadow-md"
                    >
                      <h2 className="mb-1 font-semibold text-slate-900">{p.name}</h2>
                      {p.description && (
                        <p className="mb-3 text-sm text-slate-600 line-clamp-2">{p.description}</p>
                      )}
                      <div className="mt-auto">
                        <div className="mb-1 flex justify-between text-xs text-slate-500">
                          <span>Progress</span>
                          <span>{progress}%</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full bg-brand-500 transition-all"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </section>

          <section className="card">
            <h2 className="mb-4 font-semibold">New project</h2>
            <form action={async (formData) => { await createProject(formData); }} className="space-y-3">
              <input name="name" placeholder="Project name" required className="input-field" />
              <textarea
                name="description"
                placeholder="Description (optional)"
                rows={2}
                className="input-field"
              />
              <button type="submit" className="btn-primary">
                Create project
              </button>
            </form>
          </section>
        </div>

        <aside>
          <ActivityFeed activities={recentActivity ?? []} title="Latest activity" />
        </aside>
      </main>
    </div>
  );
}
