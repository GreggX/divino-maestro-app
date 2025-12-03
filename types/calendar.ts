/**
 * Calendar types for the vigil calendar feature
 */

export type VigilStatus =
  | 'programada'
  | 'en_curso'
  | 'finalizada'
  | 'cancelada';

export interface CalendarEvent {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
  status: VigilStatus;
  turnNumber: number;
  parroquia?: string;
}

export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: CalendarEvent[];
}

export interface CalendarMonth {
  year: number;
  month: number;
  days: CalendarDay[];
}
