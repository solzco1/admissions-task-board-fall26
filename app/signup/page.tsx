import Link from 'next/link';
import { signUp } from '@/app/actions';

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="card w-full max-w-md">
        <h1 className="mb-1 text-2xl font-bold">Join Cohort PM</h1>
        <p className="mb-6 text-sm text-slate-600">Create an account to start tracking work</p>
        <form action={signUp} className="space-y-4">
          <div>
            <label htmlFor="displayName" className="mb-1 block text-sm font-medium">
              Display name
            </label>
            <input id="displayName" name="displayName" type="text" className="input-field" />
          </div>
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
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={6}
              className="input-field"
            />
          </div>
          <button type="submit" className="btn-primary w-full">
            Create account
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-slate-600">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-brand-600 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
