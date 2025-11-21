import { getTranslations } from 'next-intl/server';
import { MinuteWizardClient } from './MinuteWizardClient';

interface PageProps {
  params: {
    id: string;
  };
}

export default async function MinutePage({ params }: PageProps) {
  const t = await getTranslations('vigilia.minuteWizard');

  // TODO: Fetch vigil data and calculate summaries
  const { id: vigilId } = await params;
  const vigilData = {
    asistencia: {
      activos: 0,
      prueba: 0,
      comuniones: 0,
      aspirantes: 0,
      extraordinaria: 0,
    },
    finanzas: {
      recibosMes: 0,
      recibosAtrasados: 0,
      semillas: 0,
      honorarios: 0,
      sumaTotal: 0,
    },
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <MinuteWizardClient vigilId={vigilId} vigilData={vigilData} />
    </div>
  );
}
