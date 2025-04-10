'use client';

import { useState } from 'react';
// We're using window.location.href instead of router for redirection
// import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { supabase } from '@/lib/supabase/client';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: { email: string; password: string }) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('Attempting to sign in with:', { email: data.email });

      const { error, data: authData } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      console.log('Login response:', { error, session: authData?.session });

      if (error) {
        // Handle specific error cases
        if (error.message.includes('Email not confirmed')) {
          throw new Error('Please check your email and confirm your account before logging in.');
        } else if (error.message.includes('Invalid login credentials')) {
          throw new Error('Invalid email or password. If you just signed up, please confirm your email first.');
        } else {
          throw error;
        }
      }

      console.log('Login successful, redirecting to home page...');

      // Force a hard navigation to the main feed page to ensure proper redirection
      window.location.href = '/main';

      // The following lines won't execute due to the hard redirect above
      // router.push('/');
      // router.refresh();
    } catch (error: unknown) {
      console.error('Login error:', error);
      setError(
        error instanceof Error ? error.message : 'Failed to sign in'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-blue-600">facebook</h1>
          <p className="mt-2 text-xl">Connect with friends and the world around you.</p>
        </div>

        <div className="rounded-lg bg-white p-8 shadow-md">
          {error && (
            <div className="mb-4 rounded-md bg-red-50 p-4 text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                {...register('email', { required: 'Email is required' })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                {...register('password', { required: 'Password is required' })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-md bg-blue-600 px-4 py-2 text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? 'Signing in...' : 'Log In'}
            </button>
          </form>

          <div className="mt-4 text-center">
            <Link href="/forgot-password" className="text-sm text-blue-600 hover:underline">
              Forgot Password?
            </Link>
          </div>

          <hr className="my-6 border-gray-300" />

          <div className="text-center">
            <Link
              href="/signup"
              className="inline-block rounded-md bg-green-500 px-4 py-2 text-white shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Create New Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
