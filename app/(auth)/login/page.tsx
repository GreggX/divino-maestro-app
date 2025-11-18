import { getTranslations } from 'next-intl/server';
import { AuthLayout } from '@/components/layouts/AuthLayout';
import { LoginForm } from '@/components/forms/LoginForm';

export default async function LoginPage() {
  const t = await getTranslations('auth');

  return (
    <AuthLayout title={t('signInTitle')} description={t('signInDescription')}>
      <LoginForm />
    </AuthLayout>
  );
}
