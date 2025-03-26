"use client";

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";

/**
 * Simple NextAuth SessionProvider wrapper
 *
 * Note: We've purposely simplified this component to prevent hydration errors.
 * The previous implementation included a loading state and client-side error handling
 * that was causing React hydration mismatches between server and client rendering.
 *
 * Hydration errors occur when the server-rendered HTML doesn't match what the client
 * would render on first load. This commonly happens with:
 * - Client-side only features (like useState with an initial value)
 * - Browser-only APIs used during render
 * - Date formatting or other locale-specific operations
 */
export function SessionProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextAuthSessionProvider
      // Disable background refetching to reduce errors
      refetchInterval={0}
      refetchOnWindowFocus={false}
      refetchWhenOffline={false}
    >
      {children}
    </NextAuthSessionProvider>
  );
}
