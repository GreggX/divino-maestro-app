import {
  getDaysInMonth,
  getFirstDayOfMonth,
  isSameDay,
  isToday,
  generateCalendarDays,
  getEventsForDay,
  getPreviousMonth,
  getNextMonth,
} from '@/lib/utils/calendar';
import { CalendarEvent } from '@/types/calendar';

describe('Calendar Utils', () => {
  describe('getDaysInMonth', () => {
    it('returns 31 days for January', () => {
      expect(getDaysInMonth(2024, 0)).toBe(31);
    });

    it('returns 28 days for February in non-leap year', () => {
      expect(getDaysInMonth(2023, 1)).toBe(28);
    });

    it('returns 29 days for February in leap year', () => {
      expect(getDaysInMonth(2024, 1)).toBe(29);
    });

    it('returns 30 days for April', () => {
      expect(getDaysInMonth(2024, 3)).toBe(30);
    });
  });

  describe('getFirstDayOfMonth', () => {
    it('returns correct day of week for January 2024 (Monday = 1)', () => {
      expect(getFirstDayOfMonth(2024, 0)).toBe(1);
    });

    it('returns 0 for Sunday', () => {
      // December 2024 starts on Sunday
      expect(getFirstDayOfMonth(2024, 11)).toBe(0);
    });
  });

  describe('isSameDay', () => {
    it('returns true for same day', () => {
      const date1 = new Date(2024, 5, 15, 10, 30);
      const date2 = new Date(2024, 5, 15, 18, 45);
      expect(isSameDay(date1, date2)).toBe(true);
    });

    it('returns false for different days', () => {
      const date1 = new Date(2024, 5, 15);
      const date2 = new Date(2024, 5, 16);
      expect(isSameDay(date1, date2)).toBe(false);
    });

    it('returns false for same day different month', () => {
      const date1 = new Date(2024, 5, 15);
      const date2 = new Date(2024, 6, 15);
      expect(isSameDay(date1, date2)).toBe(false);
    });
  });

  describe('isToday', () => {
    it('returns true for today', () => {
      const today = new Date();
      expect(isToday(today)).toBe(true);
    });

    it('returns false for yesterday', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(isToday(yesterday)).toBe(false);
    });
  });

  describe('generateCalendarDays', () => {
    it('generates 42 days (6 weeks) for calendar grid', () => {
      const days = generateCalendarDays(2024, 5);
      expect(days).toHaveLength(42);
    });

    it('marks current month days correctly', () => {
      const days = generateCalendarDays(2024, 5); // June 2024
      const currentMonthDays = days.filter(d => d.isCurrentMonth);
      expect(currentMonthDays).toHaveLength(30); // June has 30 days
    });

    it('includes padding days from previous and next months', () => {
      const days = generateCalendarDays(2024, 5);
      const paddingDays = days.filter(d => !d.isCurrentMonth);
      expect(paddingDays.length).toBeGreaterThan(0);
    });

    it('attaches events to correct days', () => {
      const events: CalendarEvent[] = [
        {
          id: '1',
          title: 'Test Vigil',
          startDate: new Date(2024, 5, 15, 20, 0),
          endDate: new Date(2024, 5, 16, 6, 0),
          status: 'programada',
          turnNumber: 1,
        },
      ];

      const days = generateCalendarDays(2024, 5, events);
      const dayWithEvent = days.find(
        d => d.date.getDate() === 15 && d.isCurrentMonth
      );

      expect(dayWithEvent?.events).toHaveLength(1);
      expect(dayWithEvent?.events[0].title).toBe('Test Vigil');
    });
  });

  describe('getEventsForDay', () => {
    const events: CalendarEvent[] = [
      {
        id: '1',
        title: 'Event 1',
        startDate: new Date(2024, 5, 15, 20, 0),
        endDate: new Date(2024, 5, 16, 6, 0),
        status: 'programada',
        turnNumber: 1,
      },
      {
        id: '2',
        title: 'Event 2',
        startDate: new Date(2024, 5, 20, 20, 0),
        endDate: new Date(2024, 5, 21, 6, 0),
        status: 'en_curso',
        turnNumber: 2,
      },
    ];

    it('returns events for a specific day', () => {
      const result = getEventsForDay(new Date(2024, 5, 15), events);
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Event 1');
    });

    it('returns empty array when no events', () => {
      const result = getEventsForDay(new Date(2024, 5, 10), events);
      expect(result).toHaveLength(0);
    });

    it('handles multi-day events', () => {
      const result = getEventsForDay(new Date(2024, 5, 16), events);
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Event 1');
    });
  });

  describe('getPreviousMonth', () => {
    it('returns previous month same year', () => {
      expect(getPreviousMonth(2024, 5)).toEqual({ year: 2024, month: 4 });
    });

    it('handles year boundary (January to December)', () => {
      expect(getPreviousMonth(2024, 0)).toEqual({ year: 2023, month: 11 });
    });
  });

  describe('getNextMonth', () => {
    it('returns next month same year', () => {
      expect(getNextMonth(2024, 5)).toEqual({ year: 2024, month: 6 });
    });

    it('handles year boundary (December to January)', () => {
      expect(getNextMonth(2024, 11)).toEqual({ year: 2025, month: 0 });
    });
  });
});
