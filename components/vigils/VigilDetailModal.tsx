'use client';

import { useTranslations } from 'next-intl';
import { Modal, ModalBody, ModalFooter } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { CalendarEvent } from '@/types/calendar';

interface VigilDetailModalProps {
  vigil: CalendarEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (vigil: CalendarEvent) => void;
  onDelete?: (vigil: CalendarEvent) => void;
}

const statusColors = {
  programada: 'bg-blue-100 text-blue-800',
  en_curso: 'bg-yellow-100 text-yellow-800',
  finalizada: 'bg-green-100 text-green-800',
  cancelada: 'bg-red-100 text-red-800',
} as const;

export function VigilDetailModal({
  vigil,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}: VigilDetailModalProps) {
  const t = useTranslations('vigilDetail');
  const tStatus = useTranslations('vigilia.status');
  const tCommon = useTranslations('common');

  if (!vigil) return null;

  const formatDateTime = (date: Date) => {
    return new Date(date).toLocaleString('es', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDuration = (start: Date, end: Date) => {
    const diff =
      (new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60 * 60);
    return `${diff.toFixed(1)} ${t('hours')}`;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('title')} size="lg">
      <ModalBody>
        <div className="space-y-4">
          {/* Header with status */}
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">
              {t('turnNumber', { number: vigil.turnNumber })}
            </h3>
            <span
              className={`rounded-full px-3 py-1 text-sm font-medium ${statusColors[vigil.status]}`}
            >
              {tStatus(vigil.status)}
            </span>
          </div>

          {/* Details grid */}
          <div className="grid gap-4 sm:grid-cols-2">
            <DetailItem
              icon={<CalendarIcon />}
              label={t('startDate')}
              value={formatDateTime(vigil.startDate)}
            />
            <DetailItem
              icon={<ClockIcon />}
              label={t('endDate')}
              value={formatDateTime(vigil.endDate)}
            />
            <DetailItem
              icon={<TimerIcon />}
              label={t('duration')}
              value={formatDuration(vigil.startDate, vigil.endDate)}
            />
            {vigil.parroquia && (
              <DetailItem
                icon={<LocationIcon />}
                label={t('parish')}
                value={vigil.parroquia}
              />
            )}
            <DetailItem
              icon={<UserIcon />}
              label={t('patron')}
              value={vigil.title}
            />
          </div>
        </div>
      </ModalBody>

      <ModalFooter>
        <Button variant="outline" onClick={onClose}>
          {tCommon('close')}
        </Button>
        {onEdit && (
          <Button
            variant="secondary"
            onClick={() => {
              onEdit(vigil);
              onClose();
            }}
          >
            {tCommon('edit')}
          </Button>
        )}
        {onDelete && vigil.status === 'programada' && (
          <Button
            variant="danger"
            onClick={() => {
              onDelete(vigil);
              onClose();
            }}
          >
            {tCommon('delete')}
          </Button>
        )}
      </ModalFooter>
    </Modal>
  );
}

function DetailItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600">
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="font-medium text-gray-900">{value}</p>
      </div>
    </div>
  );
}

function CalendarIcon() {
  return (
    <svg
      className="h-4 w-4"
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

function ClockIcon() {
  return (
    <svg
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

function TimerIcon() {
  return (
    <svg
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
    </svg>
  );
}
