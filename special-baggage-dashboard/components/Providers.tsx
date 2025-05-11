'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';
import { SettingsProvider } from '@/lib/context/settings-context';
import ThemeWrapper from './ThemeWrapper';

export default function Providers({ children }: { children: ReactNode }) {
  // Create a QueryClient inside the component to ensure it's not shared between users
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        // Disable automatic refetching to avoid hydration mismatch
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes (garbage collection time)
        refetchOnMount: false, // Don't refetch when the component mounts
        retry: 1, // Retry failed requests once
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <SettingsProvider>
        <ThemeWrapper>
          {children}
        </ThemeWrapper>
      </SettingsProvider>
    </QueryClientProvider>
  );
} 