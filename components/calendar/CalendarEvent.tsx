'use client';

import { CalendarEvent as CalendarEventType } from '@/types/calendar';
import { useTranslations } from 'next-intl';

interface CalendarEventProps {
  event: CalendarEventType;
  onClick?: (event: CalendarEventType) => void;
}

const statusColors = {
  programada: 'bg-blue-100 text-blue-800 border-blue-200',
  en_curso: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  finalizada: 'bg-green-100 text-green-800 border-green-200',
  cancelada: 'bg-red-100 text-red-800 border-red-200',
} as const;

export function CalendarEventComponent({ event, onClick }: CalendarEventProps) {
  const t = useTranslations('vigilia.status');

  const handleClick = () => {
    if (onClick) {
      onClick(event);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={`
        w-full text-left px-2 py-1 text-xs rounded border truncate
        transition-opacity hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500
        ${statusColors[event.status]}
      `}
      title={`${event.title} - ${t(event.status)}`}
    >
      <span className="font-medium">T{event.turnNumber}</span>
      {event.parroquia && (
        <span className="ml-1 opacity-75">· {event.parroquia}</span>
      )}
    </button>
  );
}
