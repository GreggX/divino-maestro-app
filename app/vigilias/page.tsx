import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

interface Vigilia {
  id: string;
  turnoNumero: number;
  fecha: string;
  estado: string;
  asistencia: number;
}

export default async function VigiliasDashboard() {
  const t = await getTranslations('vigilia');
  const tCommon = await getTranslations('common');

  // TODO: Fetch vigils from database
  const vigilias: Vigilia[] = [];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">{t('dashboard.title')}</h1>
              <p className="mt-1 text-gray-400">
                {/* TODO: Fetch section and parish from database */}
                Sección - Parroquia
              </p>
            </div>
            <Link href="/socios">
              <Button variant="outline" size="lg">
                {t('dashboard.manageMembers')}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Start New Vigil Button */}
        <div className="mb-8">
          <Link href="/vigilias/new">
            <Button
              size="lg"
              className="w-full bg-amber-600 py-6 text-xl font-semibold hover:bg-amber-700 sm:w-auto sm:px-12"
            >
              {t('dashboard.startNewVigil')}
            </Button>
          </Link>
        </div>

        {/* Vigil History */}
        <section>
          <h2 className="mb-4 text-2xl font-semibold">
            {t('dashboard.vigilHistory')}
          </h2>

          {vigilias.length === 0 ? (
            <div className="rounded-lg border border-gray-800 bg-gray-800/50 p-8 text-center">
              <p className="text-gray-400">{tCommon('loading')}</p>
              <p className="mt-2 text-sm text-gray-500">
                {/* TODO: Remove this placeholder */}
                No hay vigilias registradas aún
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {vigilias.map((vigilia: any) => (
                <div
                  key={vigilia.id}
                  className="rounded-lg border border-gray-800 bg-gray-800/50 p-6 transition-colors hover:border-gray-700 hover:bg-gray-800"
                >
                  <div className="mb-4 flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">
                        {t('turnNumber')}: {vigilia.turnoNumero}
                      </h3>
                      <p className="text-sm text-gray-400">{vigilia.fecha}</p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        vigilia.estado === 'finalizada'
                          ? 'bg-green-900/50 text-green-400'
                          : 'bg-blue-900/50 text-blue-400'
                      }`}
                    >
                      {vigilia.estado === 'finalizada'
                        ? t('dashboard.completed')
                        : t('dashboard.draft')}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">
                        {t('dashboard.totalAttendance')}:
                      </span>
                      <span className="font-medium">{vigilia.asistencia}</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Link href={`/vigilias/${vigilia.id}`}>
                      <Button variant="outline" size="sm" className="w-full">
                        {tCommon('edit')}
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
