# Internationalization (i18n) Guide

Complete guide to internationalization in the Divino Maestro App using next-intl.

## Table of Contents

- [Overview](#overview)
- [Supported Languages](#supported-languages)
- [Configuration](#configuration)
- [Translation Files](#translation-files)
- [Using Translations](#using-translations)
- [Language Switching](#language-switching)
- [Adding New Languages](#adding-new-languages)
- [Best Practices](#best-practices)
- [Common Patterns](#common-patterns)

## Overview

The application uses **next-intl** for internationalization, providing:

- Multiple language support (English and Spanish)
- Type-safe translations
- Server and client component support
- URL-based locale detection
- Cookie-based locale persistence

### Why next-intl?

- **Type Safety**: Full TypeScript support
- **Server Components**: Works with Next.js 13+ App Router
- **Performance**: Optimized for server-side rendering
- **Developer Experience**: Simple API, easy to use
- **Small Bundle**: Only loads translations for active locale

## Supported Languages

Currently supported languages:

| Language | Code | Flag | Default |
|----------|------|------|---------|
| Spanish  | `es` | 🇪🇸 | ✓ Yes   |
| English  | `en` | 🇺🇸 | No      |

## Configuration

### i18n Configuration

```typescript
// i18n/config.ts
export const locales = ['en', 'es'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'es';

export const localeNames: Record<Locale, string> = {
  en: 'English',
  es: 'Español',
};

export const localeFlags: Record<Locale, string> = {
  en: '🇺🇸',
  es: '🇪🇸',
};
```

### Request Configuration

```typescript
// i18n/request.ts
import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';
import { defaultLocale, locales, type Locale } from './config';

export default getRequestConfig(async () => {
  // Get locale from cookies or use default
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get('NEXT_LOCALE')?.value;

  const locale =
    localeCookie && locales.includes(localeCookie as Locale)
      ? localeCookie
      : defaultLocale;

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
```

### Next.js Configuration

```typescript
// next.config.ts
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
  // ... other config
};

export default withNextIntl(nextConfig);
```

## Translation Files

Translation files are located in `messages/` directory:

```
messages/
├── en.json    # English translations
└── es.json    # Spanish translations (default)
```

### File Structure

```json
{
  "common": {
    "welcome": "Welcome",
    "loading": "Loading...",
    "error": "An error occurred",
    "save": "Save",
    "cancel": "Cancel"
  },
  "auth": {
    "signIn": "Sign In",
    "signUp": "Sign Up",
    "signOut": "Sign Out",
    "signInTitle": "Sign in to your account",
    "signInDescription": "Enter your credentials to access your account",
    "email": "Email",
    "password": "Password",
    "rememberMe": "Remember me",
    "forgotPassword": "Forgot password?",
    "noAccount": "Don't have an account?",
    "createAccount": "Create Account",
    "alreadyHaveAccount": "Already have an account?"
  },
  "dashboard": {
    "title": "Dashboard",
    "welcome": "Welcome, {name}!",
    "stats": {
      "members": "Total Members",
      "events": "Upcoming Events",
      "payments": "Pending Payments"
    }
  }
}
```

### Nested Translations

```json
{
  "pages": {
    "home": {
      "title": "Home Page",
      "sections": {
        "hero": {
          "title": "Welcome",
          "subtitle": "To our application"
        }
      }
    }
  }
}
```

## Using Translations

### In Server Components

```typescript
// app/dashboard/page.tsx
import { getTranslations } from 'next-intl/server';

export default async function DashboardPage() {
  const t = await getTranslations('dashboard');

  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('welcome', { name: 'John' })}</p>
    </div>
  );
}
```

### In Client Components

```typescript
'use client';

import { useTranslations } from 'next-intl';

export function WelcomeMessage() {
  const t = useTranslations('common');

  return <h1>{t('welcome')}</h1>;
}
```

### Multiple Namespaces

```typescript
export default async function Page() {
  const tCommon = await getTranslations('common');
  const tAuth = await getTranslations('auth');

  return (
    <div>
      <h1>{tCommon('welcome')}</h1>
      <button>{tAuth('signIn')}</button>
    </div>
  );
}
```

### With Interpolation

```json
{
  "greeting": "Hello, {name}!",
  "items": "You have {count} items in your cart"
}
```

```typescript
const t = useTranslations();

// Simple interpolation
<p>{t('greeting', { name: 'John' })}</p>

// With numbers
<p>{t('items', { count: 5 })}</p>
```

### Pluralization

```json
{
  "items": {
    "zero": "No items",
    "one": "One item",
    "other": "{count} items"
  }
}
```

```typescript
const t = useTranslations('cart');

<p>{t('items', { count: 0 })}</p>  // "No items"
<p>{t('items', { count: 1 })}</p>  // "One item"
<p>{t('items', { count: 5 })}</p>  // "5 items"
```

### Rich Text

```json
{
  "terms": "I agree to the <link>terms and conditions</link>"
}
```

```typescript
const t = useTranslations('legal');

<p>
  {t.rich('terms', {
    link: (chunks) => <a href="/terms">{chunks}</a>
  })}
</p>
```

### Arrays

```json
{
  "steps": ["First step", "Second step", "Third step"]
}
```

```typescript
const t = useTranslations('tutorial');

const steps = t.raw('steps') as string[];

<ol>
  {steps.map((step, index) => (
    <li key={index}>{step}</li>
  ))}
</ol>
```

## Language Switching

### Language Switcher Component

```typescript
// components/LanguageSwitcher.tsx
'use client';

import { useTransition } from 'react';
import { locales, localeNames, localeFlags } from '@/i18n/config';

export function LanguageSwitcher() {
  const [isPending, startTransition] = useTransition();

  function changeLanguage(locale: string) {
    startTransition(() => {
      // Set locale cookie
      document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000`; // 1 year

      // Refresh page to apply new locale
      window.location.reload();
    });
  }

  return (
    <div className="flex gap-2">
      {locales.map((locale) => (
        <button
          key={locale}
          onClick={() => changeLanguage(locale)}
          disabled={isPending}
          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100"
        >
          <span>{localeFlags[locale]}</span>
          <span>{localeNames[locale]}</span>
        </button>
      ))}
    </div>
  );
}
```

### Dropdown Language Switcher

```typescript
'use client';

import { useState } from 'react';
import { locales, localeNames, localeFlags, type Locale } from '@/i18n/config';
import { useLocale } from 'next-intl';

export function LanguageDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const currentLocale = useLocale() as Locale;

  function changeLanguage(locale: string) {
    document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000`;
    window.location.reload();
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100"
      >
        <span>{localeFlags[currentLocale]}</span>
        <span>{localeNames[currentLocale]}</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1">
          {locales.map((locale) => (
            <button
              key={locale}
              onClick={() => {
                changeLanguage(locale);
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
            >
              <span>{localeFlags[locale]}</span>
              <span>{localeNames[locale]}</span>
              {locale === currentLocale && (
                <span className="ml-auto text-green-600">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
```

## Adding New Languages

### Step 1: Update Configuration

```typescript
// i18n/config.ts
export const locales = ['en', 'es', 'fr'] as const; // Add 'fr'

export const localeNames: Record<Locale, string> = {
  en: 'English',
  es: 'Español',
  fr: 'Français', // Add French
};

export const localeFlags: Record<Locale, string> = {
  en: '🇺🇸',
  es: '🇪🇸',
  fr: '🇫🇷', // Add French flag
};
```

### Step 2: Create Translation File

```bash
# Copy existing translations
cp messages/en.json messages/fr.json
```

### Step 3: Translate Content

```json
// messages/fr.json
{
  "common": {
    "welcome": "Bienvenue",
    "loading": "Chargement...",
    "error": "Une erreur s'est produite",
    "save": "Enregistrer",
    "cancel": "Annuler"
  }
}
```

### Step 4: Test New Language

```bash
# Set cookie manually or use language switcher
document.cookie = 'NEXT_LOCALE=fr; path=/'
location.reload()
```

## Best Practices

### 1. Use Namespaces

Organize translations by feature/page:

```json
{
  "common": { /* shared translations */ },
  "auth": { /* authentication translations */ },
  "dashboard": { /* dashboard translations */ },
  "socios": { /* members translations */ }
}
```

### 2. Keep Keys Descriptive

```json
// Good
{
  "auth": {
    "signInButton": "Sign In",
    "emailPlaceholder": "Enter your email"
  }
}

// Avoid
{
  "auth": {
    "btn1": "Sign In",
    "txt2": "Enter your email"
  }
}
```

### 3. Use Consistent Naming

```json
{
  "form": {
    "submit": "Submit",
    "cancel": "Cancel",
    "reset": "Reset"
  }
}
```

### 4. Group Related Translations

```json
{
  "validation": {
    "required": "This field is required",
    "email": "Invalid email address",
    "minLength": "Must be at least {min} characters"
  }
}
```

### 5. Document Complex Interpolations

```json
{
  // Params: {name: string, count: number}
  "welcomeMessage": "Welcome {name}! You have {count} notifications"
}
```

### 6. Keep Translations in Sync

When adding a key to one language file, add it to all others:

```bash
# Check for missing keys
npm run i18n:check  # (if implemented)
```

### 7. Avoid Hardcoded Strings

```typescript
// Bad
<button>Sign In</button>

// Good
<button>{t('auth.signIn')}</button>
```

## Common Patterns

### Date Formatting

```typescript
import { useFormatter } from 'next-intl';

function DateDisplay({ date }: { date: Date }) {
  const format = useFormatter();

  return (
    <time>
      {format.dateTime(date, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })}
    </time>
  );
}
```

### Number Formatting

```typescript
import { useFormatter } from 'next-intl';

function PriceDisplay({ amount }: { amount: number }) {
  const format = useFormatter();

  return (
    <span>
      {format.number(amount, {
        style: 'currency',
        currency: 'EUR'
      })}
    </span>
  );
}
```

### Relative Time

```typescript
import { useFormatter } from 'next-intl';

function TimeAgo({ date }: { date: Date }) {
  const format = useFormatter();

  return (
    <span>
      {format.relativeTime(date)}
    </span>
  );
}
```

### Lists

```typescript
import { useFormatter } from 'next-intl';

function ItemList({ items }: { items: string[] }) {
  const format = useFormatter();

  return (
    <p>
      {format.list(items, { type: 'conjunction' })}
      {/* Output: "Item 1, Item 2, and Item 3" */}
    </p>
  );
}
```

### Conditional Translations

```typescript
const t = useTranslations('status');

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={status === 'active' ? 'text-green-600' : 'text-red-600'}>
      {t(status as any)} {/* 'active' or 'inactive' */}
    </span>
  );
}
```

## Type Safety

### Typed Translations

```typescript
// types/i18n.ts
import en from '@/messages/en.json';

type Messages = typeof en;

declare global {
  interface IntlMessages extends Messages {}
}
```

### Usage with TypeScript

```typescript
// TypeScript will autocomplete and type-check translation keys
const t = useTranslations('auth');

t('signIn'); // ✓ Valid
t('invalid'); // ✗ TypeScript error
```

## Testing Translations

### Test Translation Keys Exist

```typescript
// __tests__/i18n.test.ts
import en from '@/messages/en.json';
import es from '@/messages/es.json';

describe('Translations', () => {
  it('should have same keys in all languages', () => {
    const enKeys = Object.keys(en);
    const esKeys = Object.keys(es);

    expect(enKeys).toEqual(esKeys);
  });
});
```

### Test Component Translations

```typescript
import { NextIntlClientProvider } from 'next-intl';
import messages from '@/messages/en.json';

test('renders translated content', () => {
  render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <MyComponent />
    </NextIntlClientProvider>
  );

  expect(screen.getByText('Welcome')).toBeInTheDocument();
});
```

## Troubleshooting

### Missing Translation Key

```typescript
// Will show key name if translation missing
t('nonexistent.key') // Output: "nonexistent.key"

// Provide fallback
t('nonexistent.key', { default: 'Fallback text' })
```

### Locale Not Changing

1. Check cookie is being set correctly
2. Clear browser cache
3. Verify cookie path is '/'
4. Check locale is in `locales` array

### TypeScript Errors

```bash
# Regenerate types
npm run build

# Or restart TypeScript server in VSCode
# Cmd+Shift+P > TypeScript: Restart TS Server
```

## Additional Resources

- [next-intl Documentation](https://next-intl-docs.vercel.app/)
- [Unicode CLDR](https://cldr.unicode.org/) - Locale data standards
- [i18n Best Practices](https://www.i18next.com/misc/migration-guide)

## Support

For internationalization issues:
1. Check translation files syntax (valid JSON)
2. Verify locale configuration
3. Clear browser cache and cookies
4. Check console for next-intl warnings
5. Consult next-intl documentation
