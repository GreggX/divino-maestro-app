'use client';

import { useEffect, useState } from 'react';

export interface SessionUser {
  id: string;
  email: string;
  name?: string;
}

export interface SessionData {
  user: SessionUser | null;
}

export interface UseSessionReturn {
  data: SessionData | null;
  loading: boolean;
  error: Error | null;
}

/**
 * Custom hook to get the current user session
 * Fetches session data from the API and maintains loading/error state
 */
export function useSession(): UseSessionReturn {
  const [data, setData] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchSession = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/auth/session', {
          method: 'GET',
          credentials: 'include',
        });

        if (!isMounted) return;

        if (response.ok) {
          const result = await response.json();
          setData({ user: result.user });
          setError(null);
        } else if (response.status === 401) {
          // Not authenticated
          setData({ user: null });
          setError(null);
        } else {
          throw new Error('Failed to fetch session');
        }
      } catch (err) {
        if (!isMounted) return;
        setError(err instanceof Error ? err : new Error('Unknown error'));
        setData({ user: null });
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchSession();

    return () => {
      isMounted = false;
    };
  }, []);

  return { data, loading, error };
}
