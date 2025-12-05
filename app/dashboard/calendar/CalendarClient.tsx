'use client';

import { useState, useCallback } from 'react';
import { useVigils } from '@/lib/hooks/useVigils';
import { Calendar } from '@/components/calendar';
import { VigilDetailModal, VigilForm } from '@/components/vigils';
import { Button } from '@/components/ui/Button';
import { CalendarEvent } from '@/types/calendar';
import { useTranslations } from 'next-intl';

export function CalendarClient() {
  const t = useTranslations('calendar');
  const { events, isLoading, error, refetch } = useVigils();

  const [selectedVigil, setSelectedVigil] = useState<CalendarEvent | null>(
    null
  );
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingVigil, setEditingVigil] = useState<CalendarEvent | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEventClick = useCallback((event: CalendarEvent) => {
    setSelectedVigil(event);
    setIsDetailOpen(true);
  }, []);

  const handleDayClick = useCallback((date: Date) => {
    setSelectedDate(date);
    setEditingVigil(null);
    setIsFormOpen(true);
  }, []);

  const handleCreateNew = useCallback(() => {
    setSelectedDate(undefined);
    setEditingVigil(null);
    setIsFormOpen(true);
  }, []);

  const handleEdit = useCallback((vigil: CalendarEvent) => {
    setEditingVigil(vigil);
    setSelectedDate(undefined);
    setIsFormOpen(true);
  }, []);

  const handleDelete = useCallback(
    async (vigil: CalendarEvent) => {
      if (!confirm(t('confirmDelete'))) return;

      setIsDeleting(true);
      try {
        const response = await fetch(`/api/vigils/${vigil.id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          refetch();
        }
      } catch (error) {
        console.error('Error deleting vigil:', error);
      } finally {
        setIsDeleting(false);
      }
    },
    [refetch, t]
  );

  const handleFormSuccess = useCallback(() => {
    refetch();
  }, [refetch]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-gray-500">{t('loading')}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-red-500">
          {t('error')}: {error}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-4 flex justify-end">
        <Button onClick={handleCreateNew}>{t('createVigil')}</Button>
      </div>

      <Calendar
        events={events}
        onEventClick={handleEventClick}
        onDayClick={handleDayClick}
        locale="es"
      />

      <VigilDetailModal
        vigil={selectedVigil}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <VigilForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={handleFormSuccess}
        vigil={editingVigil}
        defaultDate={selectedDate}
      />

      {isDeleting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="rounded-lg bg-white p-6 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
              <span>{t('deleting')}</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
