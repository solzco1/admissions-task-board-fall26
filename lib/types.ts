export const TASK_STATUSES = ['todo', 'in_progress', 'done'] as const;

export type TaskStatus = (typeof TASK_STATUSES)[number];

export const STATUS_COLUMNS: { id: TaskStatus; label: string; color: string }[] = [
  { id: 'todo', label: 'To Do', color: 'bg-slate-100 border-slate-300' },
  { id: 'in_progress', label: 'In Progress', color: 'bg-amber-50 border-amber-300' },
  { id: 'done', label: 'Done', color: 'bg-emerald-50 border-emerald-300' },
];

export type Profile = {
  id: string;
  email: string;
  display_name: string | null;
  created_at: string;
};

export type Project = {
  id: string;
  name: string;
  description: string | null;
  owner_id: string;
  created_at: string;
};

export type Task = {
  id: string;
  project_id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  assignee_id: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
  assignee?: Profile | null;
};

export type Activity = {
  id: string;
  project_id: string;
  user_id: string;
  task_id: string | null;
  action: string;
  detail: string | null;
  created_at: string;
  profile?: Profile | null;
  task?: Task | null;
};

export function isValidStatus(status: string): status is TaskStatus {
  return TASK_STATUSES.includes(status as TaskStatus);
}

export function nextStatus(current: TaskStatus): TaskStatus {
  const order: TaskStatus[] = ['todo', 'in_progress', 'done'];
  const idx = order.indexOf(current);
  return order[Math.min(idx + 1, order.length - 1)];
}

export function statusLabel(status: TaskStatus): string {
  return STATUS_COLUMNS.find((c) => c.id === status)?.label ?? status;
}
