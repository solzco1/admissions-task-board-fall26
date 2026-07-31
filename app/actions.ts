'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { isValidStatus, type TaskStatus } from '@/lib/types';

async function logActivity(
  projectId: string,
  userId: string,
  action: string,
  detail: string | null,
  taskId?: string
) {
  const supabase = await createClient();
  await supabase.from('activities').insert({
    project_id: projectId,
    user_id: userId,
    task_id: taskId ?? null,
    action,
    detail,
  });
}

export async function signUp(_prev: { error?: string } | undefined, formData: FormData) {
  const supabase = await createClient();
  const email = String(formData.get('email') ?? '');
  const password = String(formData.get('password') ?? '');
  const displayName = String(formData.get('displayName') ?? '');

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { display_name: displayName } },
  });

  if (error) return { error: error.message };
  if (!data.session) {
    return {
      error:
        'Account created. Confirm your email if required, then log in. (Disable email confirmation in Supabase Auth for instant access.)',
    };
  }
  redirect('/dashboard');
}

export async function signIn(_prev: { error?: string } | undefined, formData: FormData) {
  const supabase = await createClient();
  const email = String(formData.get('email') ?? '');
  const password = String(formData.get('password') ?? '');

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message };
  redirect('/dashboard');
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/');
}

export async function createProject(_prev: { error?: string } | undefined, formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  const name = String(formData.get('name') ?? '').trim();
  const description = String(formData.get('description') ?? '').trim() || null;
  if (!name) return { error: 'Project name required' };

  const { data: project, error } = await supabase
    .from('projects')
    .insert({ name, description, owner_id: user.id })
    .select()
    .single();

  if (error) return { error: error.message };

  await supabase.from('project_members').insert({
    project_id: project.id,
    user_id: user.id,
    role: 'owner',
  });

  revalidatePath('/dashboard');
  redirect(`/projects/${project.id}`);
}

export async function createTask(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  const projectId = String(formData.get('projectId') ?? '');
  const title = String(formData.get('title') ?? '').trim();
  const description = String(formData.get('description') ?? '').trim() || null;
  const assigneeId = String(formData.get('assigneeId') ?? '') || null;
  if (!title) return { error: 'Task title required' };

  const { data: task, error } = await supabase
    .from('tasks')
    .insert({
      project_id: projectId,
      title,
      description,
      assignee_id: assigneeId,
      created_by: user.id,
      status: 'todo',
    })
    .select()
    .single();

  if (error) return { error: error.message };

  await logActivity(projectId, user.id, 'created', title, task.id);
  revalidatePath(`/projects/${projectId}`);
  return { success: true };
}

export async function updateTaskStatus(taskId: string, projectId: string, status: TaskStatus) {
  if (!isValidStatus(status)) return { error: 'Invalid status' };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  const { data: task, error } = await supabase
    .from('tasks')
    .update({ status })
    .eq('id', taskId)
    .select('title, status')
    .single();

  if (error) return { error: error.message };

  const action = status === 'done' ? 'completed' : 'status_changed';
  await logActivity(projectId, user.id, action, task.title, taskId);
  revalidatePath(`/projects/${projectId}`);
  return { success: true };
}

export async function assignTask(taskId: string, projectId: string, assigneeId: string | null) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  const { data: task, error } = await supabase
    .from('tasks')
    .update({ assignee_id: assigneeId })
    .eq('id', taskId)
    .select('title')
    .single();

  if (error) return { error: error.message };

  await logActivity(projectId, user.id, 'assigned', task.title, taskId);
  revalidatePath(`/projects/${projectId}`);
  return { success: true };
}

export async function deleteTask(taskId: string, projectId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  const { data: task } = await supabase.from('tasks').select('title').eq('id', taskId).single();

  const { error } = await supabase.from('tasks').delete().eq('id', taskId);
  if (error) return { error: error.message };

  await logActivity(projectId, user.id, 'deleted', task?.title ?? null, taskId);
  revalidatePath(`/projects/${projectId}`);
  return { success: true };
}
