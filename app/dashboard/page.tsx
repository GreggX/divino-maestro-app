import { getTranslations } from 'next-intl/server';
import { Container } from '@/components/ui/Container';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card';
import { getSession } from '@/lib/auth';

export default async function DashboardPage() {
  const session = await getSession();
  const t = await getTranslations('dashboard');

  return (
    <Container>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            {t('title')}
          </h1>
          <p className="mt-2 text-gray-600">
            {t('welcome', { email: session?.user?.email || 'User' })}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>{t('profile.title')}</CardTitle>
              <CardDescription>{t('profile.description')}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">{t('profile.content')}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('security.title')}</CardTitle>
              <CardDescription>{t('security.description')}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">{t('security.content')}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('activity.title')}</CardTitle>
              <CardDescription>{t('activity.description')}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">{t('activity.content')}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Container>
  );
}
