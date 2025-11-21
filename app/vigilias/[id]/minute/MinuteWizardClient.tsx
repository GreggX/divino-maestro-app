'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface VigilData {
  asistencia: {
    activos: number;
    prueba: number;
    comuniones: number;
    aspirantes: number;
    extraordinaria: number;
  };
  finanzas: {
    recibosMes: number;
    recibosAtrasados: number;
    semillas: number;
    honorarios: number;
    sumaTotal: number;
  };
}

interface MinuteWizardClientProps {
  vigilId: string;
  vigilData: VigilData;
}

export function MinuteWizardClient({
  vigilId,
  vigilData,
}: MinuteWizardClientProps) {
  const t = useTranslations('vigilia.minuteWizard');
  const tCommon = useTranslations('common');
  const tActa = useTranslations('acta');

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 2 - Administrative movements
    aspirantes: [] as { nombre: string; domicilio: string; padrino: string }[],
    cambiosDomicilio: [] as { miembro: string; nuevoDomicilio: string }[],
    bajas: [] as { miembro: string; causa: string }[],
    // Step 3 - Formalities
    lecturaCirculares: false,
    correspondencia: '',
    otrosAsuntos: '',
    jefeTurno: '',
    secretario: '',
    tesorero: '',
  });

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinalize = () => {
    // TODO: Submit minute data to API
    console.log('Finalizing minute...', formData);
  };

  return (
    <>
      {/* Header with Wizard Steps */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur">
        <div className="container mx-auto px-4 py-6">
          <h1 className="mb-4 text-3xl font-bold">{t('title')}</h1>

          {/* Step Indicator */}
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex flex-1 items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full font-bold ${
                    step === currentStep
                      ? 'bg-amber-600 text-white'
                      : step < currentStep
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-700 text-gray-400'
                  }`}
                >
                  {step}
                </div>
                <div className="ml-3 hidden sm:block">
                  <p
                    className={`text-sm font-medium ${
                      step === currentStep ? 'text-white' : 'text-gray-400'
                    }`}
                  >
                    {t(`step${step}`)}
                  </p>
                </div>
                {step < 3 && (
                  <div
                    className={`mx-2 h-1 flex-1 ${
                      step < currentStep ? 'bg-green-600' : 'bg-gray-700'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Step Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Step 1: Automatic Review */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="mb-4 text-2xl font-bold">{t('review.title')}</h2>
              <p className="text-gray-400">{t('review.validate')}</p>
            </div>

            {/* Attendance Summary */}
            <div className="rounded-lg border border-gray-800 bg-gray-800/50 p-6">
              <h3 className="mb-4 text-xl font-semibold">
                {t('review.attendanceSummary')}
              </h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <p className="text-sm text-gray-400">{tActa('attendance.active')}</p>
                  <p className="text-2xl font-bold">{vigilData.asistencia.activos}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">{tActa('attendance.trial')}</p>
                  <p className="text-2xl font-bold">{vigilData.asistencia.prueba}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">{tActa('attendance.communions')}</p>
                  <p className="text-2xl font-bold">{vigilData.asistencia.comuniones}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">{tActa('attendance.aspirants')}</p>
                  <p className="text-2xl font-bold">{vigilData.asistencia.aspirantes}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">{tActa('attendance.extraordinary')}</p>
                  <p className="text-2xl font-bold">{vigilData.asistencia.extraordinaria}</p>
                </div>
              </div>
            </div>

            {/* Financial Summary */}
            <div className="rounded-lg border border-gray-800 bg-gray-800/50 p-6">
              <h3 className="mb-4 text-xl font-semibold">
                {t('review.financialSummary')}
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-gray-400">{tActa('collection.monthlyReceipts')}</p>
                  <p className="text-2xl font-bold text-green-500">
                    ${vigilData.finanzas.recibosMes.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">{tActa('collection.feeDebts')}</p>
                  <p className="text-2xl font-bold text-yellow-500">
                    ${vigilData.finanzas.recibosAtrasados.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">{tActa('collection.seeds')}</p>
                  <p className="text-2xl font-bold">
                    ${vigilData.finanzas.semillas.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">{tActa('collection.honoraries')}</p>
                  <p className="text-2xl font-bold">
                    ${vigilData.finanzas.honorarios.toFixed(2)}
                  </p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-sm text-gray-400">{tActa('collection.total')}</p>
                  <p className="text-3xl font-bold text-amber-500">
                    ${vigilData.finanzas.sumaTotal.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Administrative Movements */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">{t('movements.title')}</h2>

            {/* Tabs */}
            <div className="space-y-6 rounded-lg border border-gray-800 bg-gray-800/50 p-6">
              <div>
                <h3 className="mb-4 text-xl font-semibold">{t('movements.aspirants')}</h3>
                <p className="mb-4 text-sm text-gray-400">
                  {tActa('movements.trial')}
                </p>
                <Button variant="outline" size="sm">
                  {t('movements.newAspirant')}
                </Button>
              </div>

              <div>
                <h3 className="mb-4 text-xl font-semibold">{t('movements.applications')}</h3>
                <p className="text-sm text-gray-400">
                  {tActa('movements.activeApplications')}
                </p>
              </div>

              <div>
                <h3 className="mb-4 text-xl font-semibold">{t('movements.changesRemovals')}</h3>
                <div className="space-y-4">
                  <div>
                    <p className="mb-2 text-sm text-gray-400">
                      {t('movements.addressChange')}
                    </p>
                    <Button variant="outline" size="sm">
                      {tCommon('create')}
                    </Button>
                  </div>
                  <div>
                    <p className="mb-2 text-sm text-gray-400">
                      {t('movements.removal')}
                    </p>
                    <Button variant="outline" size="sm">
                      {tCommon('create')}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Formalities and Signatures */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">{t('formalities.title')}</h2>

            {/* Readings */}
            <div className="rounded-lg border border-gray-800 bg-gray-800/50 p-6">
              <h3 className="mb-4 text-xl font-semibold">{t('formalities.readings')}</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="lecturaCirculares"
                    checked={formData.lecturaCirculares}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        lecturaCirculares: e.target.checked,
                      }))
                    }
                    className="h-5 w-5 rounded border-gray-600 bg-gray-700 text-amber-600 focus:ring-2 focus:ring-amber-500"
                  />
                  <label htmlFor="lecturaCirculares" className="font-medium">
                    {t('formalities.readCirculars')}
                  </label>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    {t('formalities.correspondence')}
                  </label>
                  <textarea
                    value={formData.correspondencia}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        correspondencia: e.target.value,
                      }))
                    }
                    rows={3}
                    className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-white focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>
            </div>

            {/* Other Matters */}
            <div className="rounded-lg border border-gray-800 bg-gray-800/50 p-6">
              <h3 className="mb-4 text-xl font-semibold">{t('formalities.otherMatters')}</h3>
              <textarea
                value={formData.otrosAsuntos}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    otrosAsuntos: e.target.value,
                  }))
                }
                rows={5}
                className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-white focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Digital Signatures */}
            <div className="rounded-lg border border-gray-800 bg-gray-800/50 p-6">
              <h3 className="mb-4 text-xl font-semibold">{t('formalities.digitalSignatures')}</h3>
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    {tActa('signatures.chief')}
                  </label>
                  <Input
                    value={formData.jefeTurno}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        jefeTurno: e.target.value,
                      }))
                    }
                    placeholder={tActa('signatures.chief')}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    {tActa('signatures.secretary')}
                  </label>
                  <Input
                    value={formData.secretario}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        secretario: e.target.value,
                      }))
                    }
                    placeholder={tActa('signatures.secretary')}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    {tActa('signatures.treasurer')}
                  </label>
                  <Input
                    value={formData.tesorero}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        tesorero: e.target.value,
                      }))
                    }
                    placeholder={tActa('signatures.treasurer')}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-8 flex gap-4">
          {currentStep > 1 && (
            <Button variant="outline" size="lg" onClick={handlePrevious}>
              {tCommon('previous')}
            </Button>
          )}
          {currentStep < 3 ? (
            <Button size="lg" onClick={handleNext} fullWidth>
              {tCommon('next')}
            </Button>
          ) : (
            <Button
              size="lg"
              onClick={handleFinalize}
              fullWidth
              className="bg-green-600 hover:bg-green-700"
            >
              {t('formalities.generateMinute')}
            </Button>
          )}
        </div>
      </main>
    </>
  );
}
