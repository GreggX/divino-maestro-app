# Claude Development Guide

This document provides essential commands and workflows for AI assistants (like Claude) working on this project.

## Quick Reference

### Development
```bash
npm run dev              # Start development server (http://localhost:3000)
npm run build            # Build for production
npm run start            # Start production server
```

### Testing
```bash
npm test                 # Run unit tests (Jest)
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Run tests with coverage report
npm run test:e2e         # Run end-to-end tests (Playwright)
npm run test:e2e:ui      # Run e2e tests with UI mode
npm run test:e2e:headed  # Run e2e tests in headed mode
npm run test:all         # Run all checks (lint + unit + e2e + build)
```

### Code Quality
```bash
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint errors automatically
npm run typecheck        # TypeScript type checking
```

## Development Workflow

### 1. Before Making Changes
```bash
# Ensure dependencies are installed
npm install

# Run type checking
npm run typecheck

# Run linter
npm run lint
```

### 2. During Development
```bash
# Start dev server
npm run dev

# In another terminal, run tests in watch mode
npm run test:watch
```

### 3. Before Committing
```bash
# Run all checks
npm run test:all
```

This will:
1. Run ESLint
2. Run unit tests
3. Run e2e tests
4. Build the project

All must pass before committing.

## Testing Guide

### Unit Tests (Jest + React Testing Library)

**Location**: `__tests__/` directory

**Run tests**:
```bash
npm test                    # Run all tests
npm run test:watch          # Watch mode
npm run test:coverage       # With coverage
```

**Writing tests**:
```typescript
import { render, screen } from '@testing-library/react';
import { MyComponent } from '@/components/MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText(/hello/i)).toBeInTheDocument();
  });
});
```

**Coverage thresholds**: 50% (branches, functions, lines, statements)

### E2E Tests (Playwright)

**Location**: `e2e/` directory

**Run tests**:
```bash
npm run test:e2e           # Run all e2e tests
npm run test:e2e:ui        # Interactive UI mode
npm run test:e2e:headed    # See browser while testing
```

**Writing tests**:
```typescript
import { test, expect } from '@playwright/test';

test('homepage redirects to login', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL(/\/login/);
});
```

**Browsers tested**: Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari

## Code Quality Standards

### TypeScript
- Strict mode enabled
- No unused variables/parameters
- No fallthrough cases in switch statements

### ESLint
- Next.js recommended config
- TypeScript recommended rules
- Prettier integration
- No console.log (use console.warn/error)

### Prettier
- Single quotes
- 2 space indentation
- Semicolons
- 80 character line width
- Trailing commas (ES5)

## Project Structure

```
divino-maestro-app/
├── app/                    # Next.js App Router pages
├── components/             # React components
│   ├── common/            # Shared components
│   ├── forms/             # Form components
│   ├── layouts/           # Layout components
│   └── ui/                # UI primitives
├── lib/                   # Utilities and libraries
│   ├── actions/           # Server actions
│   ├── auth/              # Authentication
│   ├── database/          # Database models and utils
│   └── utils/             # Helper functions
├── types/                 # TypeScript types
├── i18n/                  # Internationalization
├── messages/              # Translation files
├── __tests__/             # Unit tests
├── e2e/                   # End-to-end tests
└── public/                # Static assets
```

## Common Tasks

### Adding a New Component

1. Create component file:
   ```bash
   touch components/ui/MyComponent.tsx
   ```

2. Write component with TypeScript:
   ```typescript
   import { ComponentProps } from 'react';

   interface MyComponentProps extends ComponentProps<'div'> {
     title: string;
   }

   export function MyComponent({ title, ...props }: MyComponentProps) {
     return <div {...props}>{title}</div>;
   }
   ```

3. Write tests:
   ```bash
   touch __tests__/components/ui/MyComponent.test.tsx
   ```

4. Run tests:
   ```bash
   npm run test:watch
   ```

### Adding a New Page

1. Create page file in `app/`:
   ```bash
   mkdir -p app/my-page
   touch app/my-page/page.tsx
   ```

2. Add translations in `messages/en.json` and `messages/es.json`

3. Use translations in page:
   ```typescript
   import { getTranslations } from 'next-intl/server';

   export default async function MyPage() {
     const t = await getTranslations('myPage');
     return <h1>{t('title')}</h1>;
   }
   ```

4. Write e2e test:
   ```bash
   touch e2e/my-page.spec.ts
   ```

### Adding Database Model

1. Create model in `lib/database/models/`:
   ```bash
   touch lib/database/models/MyModel.ts
   ```

2. Export from index:
   ```typescript
   // lib/database/models/index.ts
   export { default as MyModel } from './MyModel';
   ```

3. Add types to `types/models.ts`

4. Update documentation in `lib/database/README.md`

## Internationalization (i18n)

### Adding Translations

1. Add keys to `messages/en.json`:
   ```json
   {
     "myFeature": {
       "title": "My Feature",
       "description": "Description here"
     }
   }
   ```

2. Add Spanish translations to `messages/es.json`:
   ```json
   {
     "myFeature": {
       "title": "Mi Función",
       "description": "Descripción aquí"
     }
   }
   ```

3. Use in components:
   ```typescript
   const t = useTranslations('myFeature');
   return <h1>{t('title')}</h1>;
   ```

## Troubleshooting

### Tests Failing

1. Check if all dependencies are installed:
   ```bash
   npm install
   ```

2. Clear Jest cache:
   ```bash
   npm test -- --clearCache
   ```

3. Check test output for specific errors

### Build Failing

1. Run type check:
   ```bash
   npm run typecheck
   ```

2. Fix TypeScript errors

3. Run linter:
   ```bash
   npm run lint:fix
   ```

### E2E Tests Failing

1. Ensure dev server is running
2. Check Playwright browsers are installed:
   ```bash
   npx playwright install
   ```

3. Run in headed mode to see what's happening:
   ```bash
   npm run test:e2e:headed
   ```

## Best Practices

### Always Run Before Committing
```bash
npm run test:all
```

### Keep Tests Updated
- Write tests for new components
- Update tests when modifying components
- Aim for >50% code coverage

### Type Safety
- Use TypeScript for all new files
- Define proper interfaces/types
- Avoid `any` type

### Code Style
- Run `npm run lint:fix` before committing
- Follow existing code patterns
- Use meaningful variable names

### i18n
- Never hardcode strings in UI
- Always use translation keys
- Test both English and Spanish

## Performance Monitoring

### Build Analysis
```bash
npm run build
```

Check output for:
- Bundle sizes
- Build warnings
- Optimization suggestions

### Lighthouse Scores
Run in production build:
```bash
npm run build
npm run start
```

Then use Chrome DevTools Lighthouse

## Environment Variables

Required in `.env.local`:
```env
MONGODB_URI=mongodb://localhost:27017/divino-maestro
JWT_SECRET=your-secret-key-here-min-32-characters
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Version Requirements

- Node.js: ≥22.0.0
- npm: ≥10.0.0

Check versions:
```bash
node --version
npm --version
```

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [next-intl Documentation](https://next-intl-docs.vercel.app/)

## Support

For issues or questions:
1. Check this guide first
2. Review error messages carefully
3. Check relevant documentation
4. Search for similar issues in the codebase
