'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import RightSidebar from '@/components/layout/RightSidebar';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      
      if (!data.session) {
        router.push('/login');
      } else {
        setIsLoading(false);
      }
    };

    checkAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        router.push('/login');
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto flex gap-4 px-4 py-4">
        <Sidebar className="sticky top-16 hidden w-1/5 lg:block" />
        <main className="w-full lg:w-3/5">{children}</main>
        <RightSidebar className="sticky top-16 hidden w-1/5 lg:block" />
      </div>
    </div>
  );
}
