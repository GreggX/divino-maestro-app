'use server';

import { cookies } from 'next/headers';
import { type Locale, locales } from '@/i18n/config';

/**
 * Server action to change the locale
 */
export async function changeLocale(locale: Locale) {
  if (!locales.includes(locale)) {
    throw new Error(`Invalid locale: ${locale}`);
  }

  const cookieStore = await cookies();
  cookieStore.set('NEXT_LOCALE', locale, {
    path: '/',
    maxAge: 365 * 24 * 60 * 60, // 1 year
  });

  return { success: true };
}
