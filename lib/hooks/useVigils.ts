'use client';

import { useState, useEffect, useCallback } from 'react';
import { CalendarEvent } from '@/types/calendar';

interface UseVigilsOptions {
  startDate?: Date;
  endDate?: Date;
  status?: string;
}

interface UseVigilsResult {
  events: CalendarEvent[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useVigils(options: UseVigilsOptions = {}): UseVigilsResult {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVigils = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();

      if (options.startDate) {
        params.set('startDate', options.startDate.toISOString());
      }
      if (options.endDate) {
        params.set('endDate', options.endDate.toISOString());
      }
      if (options.status) {
        params.set('status', options.status);
      }

      const url = `/api/vigils${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Failed to fetch vigils');
      }

      const data = await response.json();

      // Parse dates
      const parsedEvents = data.events.map((event: CalendarEvent) => ({
        ...event,
        startDate: new Date(event.startDate),
        endDate: new Date(event.endDate),
      }));

      setEvents(parsedEvents);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [options.startDate, options.endDate, options.status]);

  useEffect(() => {
    fetchVigils();
  }, [fetchVigils]);

  return {
    events,
    isLoading,
    error,
    refetch: fetchVigils,
  };
}
