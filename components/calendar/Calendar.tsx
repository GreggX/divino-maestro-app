'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { CalendarEvent, CalendarDay } from '@/types/calendar';
import { CalendarDayComponent } from './CalendarDay';
import {
  generateCalendarDays,
  getMonthName,
  getWeekdayNames,
  getPreviousMonth,
  getNextMonth,
} from '@/lib/utils/calendar';
import { Button } from '@/components/ui/Button';

interface CalendarProps {
  events?: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
  onDayClick?: (date: Date) => void;
  locale?: string;
}

export function Calendar({
  events = [],
  onEventClick,
  onDayClick,
  locale = 'es',
}: CalendarProps) {
  const t = useTranslations('calendar');
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());

  const weekdays = useMemo(() => getWeekdayNames(locale, 'short'), [locale]);
  const monthName = useMemo(
    () => getMonthName(currentMonth, locale),
    [currentMonth, locale]
  );

  const days: CalendarDay[] = useMemo(
    () => generateCalendarDays(currentYear, currentMonth, events),
    [currentYear, currentMonth, events]
  );

  const handlePreviousMonth = () => {
    const { year, month } = getPreviousMonth(currentYear, currentMonth);
    setCurrentYear(year);
    setCurrentMonth(month);
  };

  const handleNextMonth = () => {
    const { year, month } = getNextMonth(currentYear, currentMonth);
    setCurrentYear(year);
    setCurrentMonth(month);
  };

  const handleToday = () => {
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth());
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreviousMonth}
            aria-label={t('previousMonth')}
          >
            <ChevronLeftIcon />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextMonth}
            aria-label={t('nextMonth')}
          >
            <ChevronRightIcon />
          </Button>
          <Button variant="outline" size="sm" onClick={handleToday}>
            {t('today')}
          </Button>
        </div>

        <h2 className="text-lg font-semibold text-gray-900 capitalize">
          {monthName} {currentYear}
        </h2>

        <div className="w-32" />
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 border-b border-gray-200">
        {weekdays.map((day, index) => (
          <div
            key={index}
            className="px-2 py-2 text-center text-sm font-medium text-gray-700 bg-gray-50 border-r last:border-r-0"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7">
        {days.map((day, index) => (
          <CalendarDayComponent
            key={index}
            day={day}
            onEventClick={onEventClick}
            onDayClick={onDayClick}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="px-4 py-3 border-t border-gray-200 flex flex-wrap gap-4">
        <LegendItem
          color="bg-blue-100 border-blue-200"
          label={t('legend.scheduled')}
        />
        <LegendItem
          color="bg-yellow-100 border-yellow-200"
          label={t('legend.inProgress')}
        />
        <LegendItem
          color="bg-green-100 border-green-200"
          label={t('legend.completed')}
        />
        <LegendItem
          color="bg-red-100 border-red-200"
          label={t('legend.cancelled')}
        />
      </div>
    </div>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-600">
      <span className={`w-4 h-4 rounded border ${color}`} />
      {label}
    </div>
  );
}

function ChevronLeftIcon() {
  return (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 19l-7-7 7-7"
      />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 5l7 7-7 7"
      />
    </svg>
  );
}
