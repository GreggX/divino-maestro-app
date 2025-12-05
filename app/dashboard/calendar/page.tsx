import { getTranslations } from 'next-intl/server';
import { Container } from '@/components/ui/Container';
import { CalendarClient } from './CalendarClient';

export default async function CalendarPage() {
  const t = await getTranslations('calendar');

  return (
    <Container>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            {t('title')}
          </h1>
          <p className="mt-2 text-gray-600">{t('description')}</p>
        </div>

        <CalendarClient />
      </div>
    </Container>
  );
}
