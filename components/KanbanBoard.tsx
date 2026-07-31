'use client';

import { useMemo, useState } from 'react';
import { updateTaskStatus, assignTask, deleteTask } from '@/app/actions';
import { STATUS_COLUMNS, type Task, type TaskStatus, type Profile } from '@/lib/types';
import { groupTasksByStatus } from '@/lib/tasks.js';

type Props = {
  tasks: Task[];
  projectId: string;
  members: Profile[];
};

export function KanbanBoard({ tasks, projectId, members }: Props) {
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');
  const [assigneeFilter, setAssigneeFilter] = useState<string>('all');

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (statusFilter !== 'all' && task.status !== statusFilter) return false;
      if (assigneeFilter === 'unassigned' && task.assignee_id) return false;
      if (assigneeFilter !== 'all' && assigneeFilter !== 'unassigned' && task.assignee_id !== assigneeFilter) {
        return false;
      }
      return true;
    });
  }, [tasks, statusFilter, assigneeFilter]);

  const grouped = groupTasksByStatus(filteredTasks);

  async function handleStatusChange(taskId: string, status: TaskStatus) {
    await updateTaskStatus(taskId, projectId, status);
  }

  async function handleAssign(taskId: string, assigneeId: string) {
    await assignTask(taskId, projectId, assigneeId || null);
  }

  async function handleDelete(taskId: string) {
    if (confirm('Delete this task?')) {
      await deleteTask(taskId, projectId);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <label className="flex items-center gap-2 text-sm">
          <span className="text-slate-600">Status</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as TaskStatus | 'all')}
            className="input-field w-auto py-1.5 text-sm"
          >
            <option value="all">All</option>
            {STATUS_COLUMNS.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm">
          <span className="text-slate-600">Assignee</span>
          <select
            value={assigneeFilter}
            onChange={(e) => setAssigneeFilter(e.target.value)}
            className="input-field w-auto py-1.5 text-sm"
          >
            <option value="all">All</option>
            <option value="unassigned">Unassigned</option>
            {members.map((m) => (
              <option key={m.id} value={m.id}>
                {m.display_name ?? m.email}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {STATUS_COLUMNS.map((column) => (
          <div key={column.id} className={`rounded-xl border-2 p-4 ${column.color}`}>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold text-slate-800">{column.label}</h3>
              <span className="rounded-full bg-white/80 px-2 py-0.5 text-xs font-medium text-slate-600">
                {grouped[column.id].length}
              </span>
            </div>
            <div className="space-y-3">
              {grouped[column.id].map((task: Task) => (
                <div key={task.id} className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
                  <p className="mb-2 font-medium text-slate-900">{task.title}</p>
                  {task.description && (
                    <p className="mb-2 text-xs text-slate-500">{task.description}</p>
                  )}
                  <div className="mb-2">
                    <select
                      value={task.assignee_id ?? ''}
                      onChange={(e) => handleAssign(task.id, e.target.value)}
                      className="w-full rounded border border-slate-200 px-2 py-1 text-xs"
                      aria-label={`Assignee for ${task.title}`}
                    >
                      <option value="">Unassigned</option>
                      {members.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.display_name ?? m.email}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {STATUS_COLUMNS.filter((c) => c.id !== task.status).map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => handleStatusChange(task.id, c.id)}
                        className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-600 hover:bg-slate-200"
                      >
                        → {c.label}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => handleDelete(task.id)}
                      className="ml-auto rounded px-2 py-0.5 text-xs text-red-500 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              {grouped[column.id].length === 0 && (
                <p className="py-4 text-center text-xs text-slate-400">No tasks</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
