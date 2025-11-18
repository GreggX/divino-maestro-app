# Internationalization (i18n) Documentation

This application supports multiple languages using **next-intl**, the recommended i18n library for Next.js 15+ with App Router.

## Supported Languages

- **English** (en) - 🇺🇸
- **Spanish** (es) - 🇪🇸 (Default)

## Architecture

### Cookie-Based Locale Detection

This implementation uses **cookie-based locale persistence** instead of URL-based routing. Benefits:

- No URL changes when switching languages
- Cleaner URLs without locale prefixes
- Persistent language preference across sessions
- Better for SEO with hreflang tags

### File Structure

```
i18n/
├── config.ts          # Locale configuration (supported locales, default)
├── request.ts         # Next-intl request configuration
└── README.md          # This file

messages/
├── en.json            # English translations
└── es.json            # Spanish translations

lib/
├── actions/
│   └── locale.ts      # Server action to change locale
└── utils/
    └── locale.ts      # Locale utility functions

components/common/
└── LanguageSwitcher.tsx  # Language switcher component
```

## Usage

### In Server Components

Use `getTranslations` from `next-intl/server`:

```typescript
import { getTranslations } from 'next-intl/server';

export default async function MyPage() {
  const t = await getTranslations('namespace');

  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>
    </div>
  );
}
```

### In Client Components

Use `useTranslations` hook:

```typescript
'use client';

import { useTranslations } from 'next-intl';

export function MyComponent() {
  const t = useTranslations('namespace');

  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>
    </div>
  );
}
```

### With Variables

```typescript
// In translation file (en.json):
{
  "welcome": "Welcome back, {name}!"
}

// In component:
t('welcome', { name: 'John' }) // "Welcome back, John!"
```

### Pluralization

```typescript
// In translation file:
{
  "items": {
    "zero": "No items",
    "one": "One item",
    "other": "{count} items"
  }
}

// In component:
t('items', { count: 0 }) // "No items"
t('items', { count: 1 }) // "One item"
t('items', { count: 5 }) // "5 items"
```

## Translation Namespaces

### `common`
- App name
- Common actions (save, cancel, delete, etc.)
- Navigation elements

### `auth`
- Sign in/sign up pages
- Authentication forms
- Email/password labels

### `dashboard`
- Dashboard page
- Profile, security, activity sections

### `vigilia`
- Vigil management
- Vigil status labels

### `socio`
- Member management
- Member types and classes

### `acta`
- Meeting minutes
- Meeting details, attendance, collections

### `validation`
- Form validation messages
- Error messages

### `errors`
- Generic error messages
- HTTP error codes

### `success`
- Success messages for CRUD operations

## Adding a New Language

1. **Create translation file**:
   ```bash
   cp messages/en.json messages/fr.json
   ```

2. **Update `i18n/config.ts`**:
   ```typescript
   export const locales = ['en', 'es', 'fr'] as const;

   export const localeNames: Record<Locale, string> = {
     en: 'English',
     es: 'Español',
     fr: 'Français',
   };

   export const localeFlags: Record<Locale, string> = {
     en: '🇺🇸',
     es: '🇪🇸',
     fr: '🇫🇷',
   };
   ```

3. **Translate all strings** in the new `messages/fr.json` file.

## Adding New Translations

### 1. Add to English file (`messages/en.json`):
```json
{
  "myNamespace": {
    "newKey": "New translation",
    "withVariable": "Hello {name}!"
  }
}
```

### 2. Add to Spanish file (`messages/es.json`):
```json
{
  "myNamespace": {
    "newKey": "Nueva traducción",
    "withVariable": "¡Hola {name}!"
  }
}
```

### 3. Use in component:
```typescript
const t = useTranslations('myNamespace');
t('newKey'); // "New translation" or "Nueva traducción"
t('withVariable', { name: 'Juan' }); // "Hello Juan!" or "¡Hola Juan!"
```

## Language Switcher

The `LanguageSwitcher` component is available globally in the dashboard header:

```typescript
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';

// Use it anywhere
<LanguageSwitcher />
```

It automatically:
- Shows current language
- Lists all available languages
- Persists selection in cookie
- Refreshes page to apply changes

## Server Actions

### Change Locale

```typescript
import { changeLocale } from '@/lib/actions/locale';

// In a server action or event handler
await changeLocale('es');
```

### Get Current Locale

```typescript
import { getLocale } from '@/lib/utils/locale';

const locale = await getLocale(); // 'en' | 'es'
```

## Type Safety

All translation keys are type-safe when using TypeScript. The editor will autocomplete available keys and show errors for missing translations.

## Best Practices

1. **Keep translations organized**: Use namespaces to group related translations
2. **Use consistent naming**: Use camelCase for keys
3. **Avoid hardcoded strings**: Always use translation keys
4. **Provide context**: Add comments in translation files when meaning is ambiguous
5. **Test both languages**: Ensure UI works well with different text lengths
6. **Use variables**: For dynamic content, use variables instead of string concatenation

## Debugging

### Missing Translation

If a translation key is missing, next-intl will:
1. Show a warning in development
2. Display the translation key as fallback

### Check Current Locale

```typescript
'use client';
import { useLocale } from 'next-intl';

export function LocaleDebug() {
  const locale = useLocale();
  return <div>Current locale: {locale}</div>;
}
```

## Performance

- Translations are loaded only for the current locale
- Messages are cached automatically
- Cookie-based detection has no URL overhead
- Minimal bundle size impact (~10KB)

## References

- [next-intl Documentation](https://next-intl-docs.vercel.app/)
- [Next.js Internationalization](https://nextjs.org/docs/app/building-your-application/routing/internationalization)
