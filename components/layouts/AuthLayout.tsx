import { ReactNode } from 'react';
import { Logo } from '@/components/common/Logo';
import { Card, CardContent } from '@/components/ui/Card';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
}

export function AuthLayout({ children, title, description }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Logo size="lg" className="mx-auto" />
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
            {title}
          </h2>
          {description && (
            <p className="mt-2 text-sm text-gray-600">{description}</p>
          )}
        </div>

        <Card>
          <CardContent className="pt-6">{children}</CardContent>
        </Card>
      </div>
    </div>
  );
}
