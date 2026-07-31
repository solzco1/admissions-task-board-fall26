'use client';

import { useFormState } from 'react-dom';
import { createProject } from '@/app/actions';

export function CreateProjectForm() {
  const [state, formAction] = useFormState(createProject, undefined);

  return (
    <>
      {state?.error && (
        <p className="mb-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {state.error}
        </p>
      )}
      <form action={formAction} className="space-y-3">
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
    </>
  );
}
