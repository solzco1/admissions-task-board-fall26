import { LoginForm } from '@/components/LoginForm';

type Props = { searchParams?: { error?: string } };

export default function LoginPage({ searchParams }: Props) {
  const authError =
    searchParams?.error === 'auth'
      ? 'Sign-in link expired or invalid. Please try again.'
      : undefined;

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="card w-full max-w-md">
        <h1 className="mb-1 text-2xl font-bold">Welcome back</h1>
        <p className="mb-6 text-sm text-slate-600">Log in to your Cohort PM account</p>
        <LoginForm authError={authError} />
      </div>
    </div>
  );
}
