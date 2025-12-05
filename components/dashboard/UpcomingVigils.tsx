'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/Card';
import { CalendarEvent } from '@/types/calendar';

interface UpcomingVigilsProps {
  limit?: number;
}

const statusColors = {
  programada: 'bg-blue-100 text-blue-800',
  en_curso: 'bg-yellow-100 text-yellow-800',
  finalizada: 'bg-green-100 text-green-800',
  cancelada: 'bg-red-100 text-red-800',
} as const;

export function UpcomingVigils({ limit = 5 }: UpcomingVigilsProps) {
  const t = useTranslations('upcomingVigils');
  const tStatus = useTranslations('vigilia.status');
  const [vigils, setVigils] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchVigils() {
      try {
        const today = new Date();
        const response = await fetch(
          `/api/vigils?startDate=${today.toISOString()}&status=programada`
        );

        if (response.ok) {
          const data = await response.json();
          const parsedEvents = data.events
            .map((event: CalendarEvent) => ({
              ...event,
              startDate: new Date(event.startDate),
              endDate: new Date(event.endDate),
            }))
            .slice(0, limit);
          setVigils(parsedEvents);
        }
      } catch (error) {
        console.error('Error fetching vigils:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchVigils();
  }, [limit]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });
  };

  const getDaysUntil = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(date);
    target.setHours(0, 0, 0, 0);
    const diff = Math.ceil(
      (target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diff === 0) return t('today');
    if (diff === 1) return t('tomorrow');
    return t('inDays', { days: diff });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{t('title')}</CardTitle>
            <CardDescription>{t('description')}</CardDescription>
          </div>
          <Link
            href="/dashboard/calendar"
            className="text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            {t('viewAll')}
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
          </div>
        ) : vigils.length === 0 ? (
          <div className="py-8 text-center text-gray-500">{t('noVigils')}</div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {vigils.map(vigil => (
              <li key={vigil.id} className="py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                      <CalendarIcon />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {t('turnLabel', { number: vigil.turnNumber })}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatDate(vigil.startDate)}
                        {vigil.parroquia && ` · ${vigil.parroquia}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">
                      {getDaysUntil(vigil.startDate)}
                    </span>
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${statusColors[vigil.status]}`}
                    >
                      {tStatus(vigil.status)}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

function CalendarIcon() {
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
  );
}
