import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/env';
import { redirect } from 'next/navigation';

export default async function HomePage() {
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-slate-100">
      {!isSupabaseConfigured() && (
        <div className="border-b border-amber-200 bg-amber-50 px-6 py-3 text-center text-sm text-amber-900">
          Supabase env vars are missing on this deploy. Add{' '}
          <code className="rounded bg-amber-100 px-1">NEXT_PUBLIC_SUPABASE_URL</code> and{' '}
          <code className="rounded bg-amber-100 px-1">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> in
          Vercel, then redeploy.
        </div>
      )}
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
        <span className="text-lg font-semibold text-brand-700">Cohort PM</span>
        <div className="flex gap-3">
          <Link href="/login" className="btn-secondary">
            Log in
          </Link>
          <Link href="/signup" className="btn-primary">
            Sign up
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-16">
        <div className="max-w-2xl">
          <p className="mb-3 text-sm font-medium uppercase tracking-wide text-brand-600">
            Hult Cohort Developer Program
          </p>
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Ship together. Track progress. Stay motivated.
          </h1>
          <p className="mb-8 text-lg text-slate-600">
            A project management platform built for cohort collaboration — kanban status
            columns, task assignments, and a live activity feed so everyone sees momentum.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/signup" className="btn-primary px-6 py-3 text-base">
              Get started
            </Link>
            <Link href="/login" className="btn-secondary px-6 py-3 text-base">
              I have an account
            </Link>
          </div>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-3">
          {[
            {
              title: 'Status columns',
              desc: 'To Do → In Progress → Done. Clear visual progress at a glance.',
            },
            {
              title: 'Assignments',
              desc: 'Assign tasks to cohort members so everyone knows their next action.',
            },
            {
              title: 'Activity feed',
              desc: 'See when teammates complete work — social proof that keeps you shipping.',
            },
          ].map((feature) => (
            <div key={feature.title} className="card">
              <h3 className="mb-2 font-semibold text-slate-900">{feature.title}</h3>
              <p className="text-sm text-slate-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
