'use client';

import { createBrowserClient } from '@supabase/ssr';
import { createContext, useContext, useState } from 'react';

type SupabaseClientType = ReturnType<typeof createBrowserClient>;

const SupabaseContext = createContext<SupabaseClientType | undefined>(undefined);

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  // Initialize the Supabase client using environment variables
  const [supabase] = useState(() =>
    createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  );

  return (
    <SupabaseContext.Provider value={supabase}>
      {children}
    </SupabaseContext.Provider>
  );
}

// Custom hook to easily access the client
export function useSupabase() {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
}
