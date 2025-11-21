'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Toggle } from '@/components/ui/Toggle';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';

interface Member {
  id: string;
  nombre: string;
  presente: boolean;
  finanzas: {
    cuotasMes: number;
    cuotasAtrasadas: number;
    donativoExtra: number;
  };
}

interface AttendanceClientProps {
  vigilId: string;
  initialMembers: Member[];
}

export function AttendanceClient({
  vigilId,
  initialMembers,
}: AttendanceClientProps) {
  const t = useTranslations('vigilia.attendance');
  const tCommon = useTranslations('common');

  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [isFinanceModalOpen, setIsFinanceModalOpen] = useState(false);
  const [financeForm, setFinanceForm] = useState({
    cuotasMes: 0,
    cuotasAtrasadas: 0,
    donativoExtra: 0,
  });

  // Calculate totals
  const totalPresent = members.filter((m) => m.presente).length;
  const totalMoney = members.reduce(
    (sum, m) =>
      sum +
      m.finanzas.cuotasMes +
      m.finanzas.cuotasAtrasadas +
      m.finanzas.donativoExtra,
    0
  );

  const handleToggleAttendance = (memberId: string) => {
    setMembers((prev) =>
      prev.map((m) =>
        m.id === memberId ? { ...m, presente: !m.presente } : m
      )
    );
  };

  const handleOpenFinanceModal = (member: Member) => {
    setSelectedMember(member);
    setFinanceForm(member.finanzas);
    setIsFinanceModalOpen(true);
  };

  const handleSaveFinance = () => {
    if (!selectedMember) return;

    setMembers((prev) =>
      prev.map((m) =>
        m.id === selectedMember.id ? { ...m, finanzas: financeForm } : m
      )
    );
    setIsFinanceModalOpen(false);
    setSelectedMember(null);
  };

  return (
    <>
      {/* Summary Bar */}
      <div className="sticky top-0 z-10 border-b border-gray-800 bg-gray-900/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">{t('title')}</h1>
            <div className="flex gap-6">
              <div className="text-right">
                <p className="text-sm text-gray-400">{t('attendeeCount')}</p>
                <p className="text-2xl font-bold text-amber-500">
                  {totalPresent}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400">{t('totalMoney')}</p>
                <p className="text-2xl font-bold text-green-500">
                  ${totalMoney.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Members List */}
      <main className="container mx-auto px-4 py-6">
        <h2 className="mb-4 text-xl font-semibold">{t('activeMembers')}</h2>

        <div className="space-y-2">
          {members.length === 0 ? (
            <div className="rounded-lg border border-gray-800 bg-gray-800/50 p-8 text-center">
              <p className="text-gray-400">{tCommon('loading')}</p>
            </div>
          ) : (
            members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between rounded-lg border border-gray-800 bg-gray-800/50 p-4 transition-colors hover:border-gray-700"
              >
                {/* Toggle */}
                <div className="flex items-center gap-4">
                  <Toggle
                    checked={member.presente}
                    onChange={() => handleToggleAttendance(member.id)}
                    label={t('present')}
                  />
                  <div>
                    <p className="font-medium">{member.nombre}</p>
                    <p className="text-sm text-gray-400">
                      {member.presente ? t('present') : t('absent')}
                    </p>
                  </div>
                </div>

                {/* Finance Button */}
                <button
                  onClick={() => handleOpenFinanceModal(member)}
                  className="flex items-center gap-2 rounded-lg bg-green-900/30 px-4 py-2 text-green-400 transition-colors hover:bg-green-900/50"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="hidden sm:inline">{t('financeButton')}</span>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Visitors Section */}
        <div className="mt-8">
          <h2 className="mb-4 text-xl font-semibold">{t('visitors')}</h2>
          <Button variant="secondary" size="lg" fullWidth>
            {t('registerVisitor')}
          </Button>
        </div>
      </main>

      {/* Finance Modal */}
      <Modal
        isOpen={isFinanceModalOpen}
        onClose={() => setIsFinanceModalOpen(false)}
        title={selectedMember?.nombre || ''}
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              {t('monthlyFee')}
            </label>
            <Input
              type="number"
              value={financeForm.cuotasMes}
              onChange={(e) =>
                setFinanceForm((prev) => ({
                  ...prev,
                  cuotasMes: parseFloat(e.target.value) || 0,
                }))
              }
              placeholder="0.00"
              min="0"
              step="0.01"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              {t('overdueFee')}
            </label>
            <Input
              type="number"
              value={financeForm.cuotasAtrasadas}
              onChange={(e) =>
                setFinanceForm((prev) => ({
                  ...prev,
                  cuotasAtrasadas: parseFloat(e.target.value) || 0,
                }))
              }
              placeholder="0.00"
              min="0"
              step="0.01"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              {t('extraDonation')}
            </label>
            <Input
              type="number"
              value={financeForm.donativoExtra}
              onChange={(e) =>
                setFinanceForm((prev) => ({
                  ...prev,
                  donativoExtra: parseFloat(e.target.value) || 0,
                }))
              }
              placeholder="0.00"
              min="0"
              step="0.01"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => setIsFinanceModalOpen(false)}
              fullWidth
            >
              {tCommon('cancel')}
            </Button>
            <Button onClick={handleSaveFinance} fullWidth>
              {t('saveAndClose')}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
