'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in and redirect accordingly
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (session) {
          // User is logged in, redirect to main feed
          console.log('User is logged in, redirecting to main feed');
          router.push('/main');
        } else {
          // User is not logged in, redirect to login
          console.log('User is not logged in, redirecting to login');
          router.push('/login');
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        // On error, redirect to login
        router.push('/login');
      }
    };

    checkAuth();
  }, [router]);

  // Show loading spinner while checking auth status
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-blue-600"></div>
    </div>
  );
}
