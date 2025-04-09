import { createFileRoute, useNavigate } from '@tanstack/react-router';

import { useState } from 'react';
import { authClient } from '../auth-client';

export const Route = createFileRoute('/auth')({
  component: RouteComponent,
});

function RouteComponent() {
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  function handleToggleAuth() {
    setIsSignup((prev) => !prev);
    setError('');
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    setError('');
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    try {
      let errResponse: {
        code?: string | undefined;
        message?: string | undefined;
        t?: boolean | undefined;
        status: number;
        statusText: string;
    } | null;

      if (isSignup) {
        const { data, error } = await authClient.signUp.email({
          email: formData.get('email')?.toString() || '',
          password: formData.get('password')?.toString() || '',
          name: formData.get('email')?.toString() || '',
        });
        errResponse = error;
      } else {
        const { data, error } = await authClient.signIn.email({
          email: formData.get('email')?.toString() || '',
          password: formData.get('password')?.toString() || '',
        });
        errResponse = error;
      }

      if (errResponse) {
        setError(errResponse.message || 'Signing up failed, please try again later.');
        return;
      }

      navigate({ to: '/', replace: true });
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  }

  return (
    <main className="max-w-[30rem] mx-auto my-8">
      <h1 className="font-bold text-2xl">Authentication required</h1>
      <form className="my-4 rounded-md p-4 bg-gray-800" onSubmit={handleSubmit}>
        <p>
          <label className="font-bold mb-1 text-sm">E-mail</label>
          <input
            className="block p-1 rounded-sm bg-gray-900 w-full"
            type="email"
            name="email"
          />
        </p>
        <p>
          <label className="font-bold mb-1 text-sm">Password</label>
          <input
            className="block p-1 rounded-sm bg-gray-900 w-full"
            type="password"
            name="password"
          />
        </p>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        <p className="mt-4 text-center flex flex-col gap-1">
          <button
            className="bg-indigo-500 text-white rounded-sm px-4 py-1 hover:bg-indigo-600"
            type="submit"
          >
            {isSignup ? 'Create User' : 'Login'}
          </button>
          <button
            type="button"
            onClick={handleToggleAuth}
            className="text-gray-400 hover:text-gray-200"
          >
            {isSignup
              ? 'I have an account. Login instead.'
              : 'Create a new account.'}
          </button>
        </p>
      </form>
    </main>
  );
}
