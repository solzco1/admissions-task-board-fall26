'use client';

import { useRef, useState } from 'react';
import { createTask } from '@/app/actions';
import type { Profile } from '@/lib/types';

type Props = {
  projectId: string;
  members: Profile[];
};

export function CreateTaskForm({ projectId, members }: Props) {
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setError(null);
    const result = await createTask(formData);
    if (result?.error) {
      setError(result.error);
      return;
    }
    formRef.current?.reset();
  }

  return (
    <div className="card">
      <h2 className="mb-3 font-semibold">Add task</h2>
      {error && (
        <p className="mb-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}
      <form ref={formRef} action={handleSubmit} className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <input type="hidden" name="projectId" value={projectId} />
        <input
          name="title"
          placeholder="What needs to be done?"
          required
          className="input-field min-w-[200px] flex-1"
        />
        <input
          name="description"
          placeholder="Description (optional)"
          className="input-field min-w-[200px] flex-1"
        />
        <select name="assigneeId" className="input-field w-auto min-w-[140px]" aria-label="Assignee">
          <option value="">Assign to…</option>
          {members.map((m) => (
            <option key={m.id} value={m.id}>
              {m.display_name ?? m.email}
            </option>
          ))}
        </select>
        <button type="submit" className="btn-primary">
          Add task
        </button>
      </form>
    </div>
  );
}
