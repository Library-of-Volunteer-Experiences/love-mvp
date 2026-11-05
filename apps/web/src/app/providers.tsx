'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ConvexProvider, ConvexReactClient } from 'convex/react';
import type { ReactNode } from 'react';
import { getPublicEnv } from '@love/config';
import { getQueryClient } from '@/lib/query-client';

const convex = new ConvexReactClient(getPublicEnv().CONVEX_URL);

export function Providers({ children }: { children: ReactNode }) {
  const queryClient = getQueryClient();
  return (
    <ConvexProvider client={convex}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ConvexProvider>
  );
}
