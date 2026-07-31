import { SignUpForm } from '@/components/SignUpForm';

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="card w-full max-w-md">
        <h1 className="mb-1 text-2xl font-bold">Join Cohort PM</h1>
        <p className="mb-6 text-sm text-slate-600">Create an account to start tracking work</p>
        <SignUpForm />
      </div>
    </div>
  );
}
