'use client';

import { Logo } from '@/components/common/Logo';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import { useSession } from '@/lib/auth/useSession';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

export function DashboardHeader() {
  const router = useRouter();
  const { data: session } = useSession();
  const t = useTranslations('auth');

  const handleSignOut = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        router.push('/login');
        router.refresh();
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="border-b border-gray-200 bg-white shadow-sm">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <Logo />

          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            {session?.user && (
              <span className="text-sm text-gray-700">
                {session.user.email}
              </span>
            )}
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              {t('signOut')}
            </Button>
          </div>
        </div>
      </Container>
    </header>
  );
}
