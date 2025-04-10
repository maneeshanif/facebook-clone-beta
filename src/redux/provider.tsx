'use client';

import { Provider } from 'react-redux';
import { store } from './store';
import { ReactNode, useEffect } from 'react';
import { fetchUserProfile } from './userSlice';

export function ReduxProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Fetch user profile when the app loads
    store.dispatch(fetchUserProfile());
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session) {
          store.dispatch(fetchUserProfile());
        }
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return <Provider store={store}>{children}</Provider>;
}

// Import supabase after the component to avoid circular dependency
import { supabase } from '@/lib/supabase/client';
