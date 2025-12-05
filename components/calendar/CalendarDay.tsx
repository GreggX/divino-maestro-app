'use client';

import {
  CalendarDay as CalendarDayType,
  CalendarEvent,
} from '@/types/calendar';
import { CalendarEventComponent } from './CalendarEvent';

interface CalendarDayProps {
  day: CalendarDayType;
  onEventClick?: (event: CalendarEvent) => void;
  onDayClick?: (date: Date) => void;
}

export function CalendarDayComponent({
  day,
  onEventClick,
  onDayClick,
}: CalendarDayProps) {
  const handleDayClick = () => {
    if (onDayClick) {
      onDayClick(day.date);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleDayClick();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleDayClick}
      onKeyDown={handleKeyDown}
      className={`
        min-h-24 p-1 border-b border-r border-gray-200
        transition-colors cursor-pointer
        ${day.isCurrentMonth ? 'bg-white' : 'bg-gray-50'}
        ${day.isToday ? 'bg-blue-50' : ''}
        hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500
      `}
    >
      <div className="flex items-center justify-between mb-1">
        <span
          className={`
            text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full
            ${day.isToday ? 'bg-blue-600 text-white' : ''}
            ${!day.isCurrentMonth ? 'text-gray-400' : 'text-gray-900'}
          `}
        >
          {day.date.getDate()}
        </span>
      </div>

      <div className="space-y-1">
        {day.events.slice(0, 2).map(event => (
          <CalendarEventComponent
            key={event.id}
            event={event}
            onClick={onEventClick}
          />
        ))}
        {day.events.length > 2 && (
          <span className="text-xs text-gray-500 px-2">
            +{day.events.length - 2} más
          </span>
        )}
      </div>
    </div>
  );
}
