import { CalendarDay, CalendarEvent } from '@/types/calendar';

/**
 * Get the number of days in a month
 */
export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

/**
 * Get the day of week for the first day of the month (0 = Sunday, 6 = Saturday)
 */
export function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

/**
 * Check if two dates are the same day
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

/**
 * Check if a date is today
 */
export function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

/**
 * Generate calendar days for a given month, including padding days from prev/next months
 */
export function generateCalendarDays(
  year: number,
  month: number,
  events: CalendarEvent[] = []
): CalendarDay[] {
  const days: CalendarDay[] = [];
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfMonth = getFirstDayOfMonth(year, month);

  // Previous month padding
  const prevMonth = month === 0 ? 11 : month - 1;
  const prevYear = month === 0 ? year - 1 : year;
  const daysInPrevMonth = getDaysInMonth(prevYear, prevMonth);

  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    const date = new Date(prevYear, prevMonth, daysInPrevMonth - i);
    days.push({
      date,
      isCurrentMonth: false,
      isToday: isToday(date),
      events: getEventsForDay(date, events),
    });
  }

  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    days.push({
      date,
      isCurrentMonth: true,
      isToday: isToday(date),
      events: getEventsForDay(date, events),
    });
  }

  // Next month padding (fill to complete 6 rows = 42 days)
  const nextMonth = month === 11 ? 0 : month + 1;
  const nextYear = month === 11 ? year + 1 : year;
  const remainingDays = 42 - days.length;

  for (let day = 1; day <= remainingDays; day++) {
    const date = new Date(nextYear, nextMonth, day);
    days.push({
      date,
      isCurrentMonth: false,
      isToday: isToday(date),
      events: getEventsForDay(date, events),
    });
  }

  return days;
}

/**
 * Get events that occur on a specific day
 */
export function getEventsForDay(
  date: Date,
  events: CalendarEvent[]
): CalendarEvent[] {
  return events.filter(event => {
    const eventStart = new Date(event.startDate);
    const eventEnd = new Date(event.endDate);
    const dayStart = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
    const dayEnd = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      23,
      59,
      59
    );

    return eventStart <= dayEnd && eventEnd >= dayStart;
  });
}

/**
 * Format month name
 */
export function getMonthName(month: number, locale: string = 'es'): string {
  const date = new Date(2024, month, 1);
  return date.toLocaleDateString(locale, { month: 'long' });
}

/**
 * Get weekday names
 */
export function getWeekdayNames(
  locale: string = 'es',
  format: 'short' | 'narrow' = 'short'
): string[] {
  const weekdays: string[] = [];
  // Start from Sunday (0)
  for (let i = 0; i < 7; i++) {
    const date = new Date(2024, 0, i); // Jan 2024 starts on Monday, so i gives us Sun-Sat
    weekdays.push(date.toLocaleDateString(locale, { weekday: format }));
  }
  return weekdays;
}

/**
 * Navigate to previous month
 */
export function getPreviousMonth(
  year: number,
  month: number
): { year: number; month: number } {
  if (month === 0) {
    return { year: year - 1, month: 11 };
  }
  return { year, month: month - 1 };
}

/**
 * Navigate to next month
 */
export function getNextMonth(
  year: number,
  month: number
): { year: number; month: number } {
  if (month === 11) {
    return { year: year + 1, month: 0 };
  }
  return { year, month: month + 1 };
}
