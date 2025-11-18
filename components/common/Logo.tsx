'use client';

import { HTMLAttributes } from 'react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils/cn';

interface LogoProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
}

export function Logo({ size = 'md', className, ...props }: LogoProps) {
  const t = useTranslations('common');

  const sizes = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  return (
    <div
      className={cn('font-bold text-blue-600', sizes[size], className)}
      {...props}
    >
      {t('appName')}
    </div>
  );
}
