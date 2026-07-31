'use client';

import Link from 'next/link';
import { useFormState } from 'react-dom';
import { signIn } from '@/app/actions';

export function LoginForm({ authError }: { authError?: string }) {
  const [state, formAction] = useFormState(signIn, undefined);

  return (
    <>
      {authError && (
        <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {authError}
        </p>
      )}
      {state?.error && (
        <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {state.error}
        </p>
      )}
      <form action={formAction} className="space-y-4">
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium">
            Email
          </label>
          <input id="email" name="email" type="email" required className="input-field" />
        </div>
        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium">
            Password
          </label>
          <input id="password" name="password" type="password" required className="input-field" />
        </div>
        <button type="submit" className="btn-primary w-full">
          Log in
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-slate-600">
        No account?{' '}
        <Link href="/signup" className="font-medium text-brand-600 hover:underline">
          Sign up
        </Link>
      </p>
    </>
  );
}
