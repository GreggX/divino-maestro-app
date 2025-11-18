import { getTranslations } from 'next-intl/server';
import { AuthLayout } from '@/components/layouts/AuthLayout';
import { RegisterForm } from '@/components/forms/RegisterForm';

export default async function RegisterPage() {
  const t = await getTranslations('auth');

  return (
    <AuthLayout title={t('signUpTitle')} description={t('signUpDescription')}>
      <RegisterForm />
    </AuthLayout>
  );
}
