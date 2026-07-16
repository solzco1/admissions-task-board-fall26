'use client';

import { useRef } from 'react';
import { createTask } from '@/app/actions';
import type { Profile } from '@/lib/types';

type Props = {
  projectId: string;
  members: Profile[];
};

export function CreateTaskForm({ projectId, members }: Props) {
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    await createTask(formData);
    formRef.current?.reset();
  }

  return (
    <div className="card">
      <h2 className="mb-3 font-semibold">Add task</h2>
      <form ref={formRef} action={handleSubmit} className="flex flex-wrap gap-3">
        <input type="hidden" name="projectId" value={projectId} />
        <input
          name="title"
          placeholder="What needs to be done?"
          required
          className="input-field min-w-[200px] flex-1"
        />
        <select name="assigneeId" className="input-field w-auto min-w-[140px]">
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
