'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Modal, ModalBody, ModalFooter } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { vigilSchema } from '@/lib/utils/validators';
import { CalendarEvent, VigilStatus } from '@/types/calendar';

interface VigilFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  vigil?: CalendarEvent | null;
  defaultDate?: Date;
}

interface FormErrors {
  numeroTurno?: string;
  fechaInicio?: string;
  fechaFin?: string;
  parroquia?: string;
  titular?: string;
  estado?: string;
  general?: string;
}

export function VigilForm({
  isOpen,
  onClose,
  onSuccess,
  vigil,
  defaultDate,
}: VigilFormProps) {
  const t = useTranslations('vigilForm');
  const tCommon = useTranslations('common');
  const tStatus = useTranslations('vigilia.status');

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const [formData, setFormData] = useState({
    numeroTurno: '',
    fechaInicio: '',
    fechaFin: '',
    parroquia: '',
    titular: '',
    estado: 'programada' as VigilStatus,
  });

  useEffect(() => {
    if (vigil) {
      setFormData({
        numeroTurno: vigil.turnNumber.toString(),
        fechaInicio: formatDateTimeLocal(new Date(vigil.startDate)),
        fechaFin: formatDateTimeLocal(new Date(vigil.endDate)),
        parroquia: vigil.parroquia || '',
        titular: vigil.title,
        estado: vigil.status,
      });
    } else if (defaultDate) {
      const startDate = new Date(defaultDate);
      startDate.setHours(20, 0, 0, 0);
      const endDate = new Date(defaultDate);
      endDate.setDate(endDate.getDate() + 1);
      endDate.setHours(6, 0, 0, 0);

      setFormData({
        numeroTurno: '',
        fechaInicio: formatDateTimeLocal(startDate),
        fechaFin: formatDateTimeLocal(endDate),
        parroquia: '',
        titular: '',
        estado: 'programada',
      });
    } else {
      setFormData({
        numeroTurno: '',
        fechaInicio: '',
        fechaFin: '',
        parroquia: '',
        titular: '',
        estado: 'programada',
      });
    }
    setErrors({});
  }, [vigil, defaultDate, isOpen]);

  const formatDateTimeLocal = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    const data = {
      numeroTurno: parseInt(formData.numeroTurno, 10),
      fechaInicio: formData.fechaInicio,
      fechaFin: formData.fechaFin,
      parroquia: formData.parroquia || undefined,
      titular: formData.titular,
      estado: formData.estado,
    };

    const validation = vigilSchema.safeParse(data);
    if (!validation.success) {
      const fieldErrors: FormErrors = {};
      validation.error.errors.forEach(err => {
        const field = err.path[0] as keyof FormErrors;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      setIsLoading(false);
      return;
    }

    try {
      const url = vigil ? `/api/vigils/${vigil.id}` : '/api/vigils';
      const method = vigil ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        setErrors({ general: result.error || t('errorSaving') });
        setIsLoading(false);
        return;
      }

      onSuccess();
      onClose();
    } catch (error) {
      setErrors({
        general: error instanceof Error ? error.message : t('errorSaving'),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const isEditing = !!vigil;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? t('editTitle') : t('createTitle')}
      size="lg"
    >
      <form onSubmit={handleSubmit}>
        <ModalBody>
          <div className="space-y-4">
            {errors.general && (
              <div className="rounded-lg bg-red-50 p-4 text-sm text-red-800">
                {errors.general}
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                name="numeroTurno"
                type="number"
                label={t('turnNumber')}
                value={formData.numeroTurno}
                onChange={handleChange}
                error={errors.numeroTurno}
                required
                min={1}
              />

              <div>
                <label
                  htmlFor="estado"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  {t('status')}
                </label>
                <select
                  id="estado"
                  name="estado"
                  value={formData.estado}
                  onChange={handleChange}
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="programada">{tStatus('programada')}</option>
                  <option value="en_curso">{tStatus('en_curso')}</option>
                  <option value="finalizada">{tStatus('finalizada')}</option>
                  <option value="cancelada">{tStatus('cancelada')}</option>
                </select>
              </div>
            </div>

            <Input
              name="titular"
              type="text"
              label={t('patron')}
              value={formData.titular}
              onChange={handleChange}
              error={errors.titular}
              required
              placeholder={t('patronPlaceholder')}
            />

            <Input
              name="parroquia"
              type="text"
              label={t('parish')}
              value={formData.parroquia}
              onChange={handleChange}
              error={errors.parroquia}
              placeholder={t('parishPlaceholder')}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                name="fechaInicio"
                type="datetime-local"
                label={t('startDate')}
                value={formData.fechaInicio}
                onChange={handleChange}
                error={errors.fechaInicio}
                required
              />

              <Input
                name="fechaFin"
                type="datetime-local"
                label={t('endDate')}
                value={formData.fechaFin}
                onChange={handleChange}
                error={errors.fechaFin}
                required
              />
            </div>
          </div>
        </ModalBody>

        <ModalFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            {tCommon('cancel')}
          </Button>
          <Button type="submit" isLoading={isLoading}>
            {isEditing ? tCommon('save') : tCommon('create')}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
