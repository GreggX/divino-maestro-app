# Testing Guide

Comprehensive testing documentation for the Divino Maestro App, covering unit tests, end-to-end tests, and testing best practices.

## Table of Contents

- [Testing Stack](#testing-stack)
- [Unit Testing (Jest)](#unit-testing-jest)
- [End-to-End Testing (Playwright)](#end-to-end-testing-playwright)
- [Test Organization](#test-organization)
- [Running Tests](#running-tests)
- [Writing Tests](#writing-tests)
- [Code Coverage](#code-coverage)
- [Continuous Integration](#continuous-integration)
- [Troubleshooting](#troubleshooting)

## Testing Stack

### Unit Testing
- **Jest 29**: JavaScript testing framework
- **React Testing Library**: Component testing utilities
- **@testing-library/jest-dom**: Custom Jest matchers for DOM
- **@testing-library/user-event**: User interaction simulation

### End-to-End Testing
- **Playwright**: Browser automation for E2E tests
- **Multiple browsers**: Chromium, Firefox, WebKit
- **Mobile testing**: Mobile Chrome and Safari viewports

### Coverage Requirements
- **Minimum**: 50% code coverage
- **Thresholds**: Branches, Functions, Lines, Statements
- **Enforcement**: Tests fail if coverage drops below threshold

## Unit Testing (Jest)

### Configuration

Located in `jest.config.ts`:

```typescript
{
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  collectCoverageFrom: [
    '**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    // ... excluded files
  ],
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50,
    },
  },
}
```

### Test Structure

Tests are located in `__tests__/` directory, mirroring the source structure:

```
__tests__/
├── components/
│   └── ui/
│       ├── Button.test.tsx
│       └── Input.test.tsx
└── lib/
    └── utils/
        └── cn.test.ts
```

### Example Component Test

```typescript
// __tests__/components/ui/Button.test.tsx
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/ui/Button';

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('handles click events', async () => {
    const handleClick = jest.fn();
    const { user } = render(
      <Button onClick={handleClick}>Click me</Button>
    );

    await user.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('shows loading state', () => {
    render(<Button isLoading>Submit</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
});
```

### Example Utility Test

```typescript
// __tests__/lib/utils/cn.test.ts
import { cn } from '@/lib/utils/cn';

describe('cn utility', () => {
  it('merges class names', () => {
    const result = cn('base', 'additional');
    expect(result).toBe('base additional');
  });

  it('handles conditional classes', () => {
    const result = cn('base', { active: true, disabled: false });
    expect(result).toContain('active');
    expect(result).not.toContain('disabled');
  });
});
```

### Testing Hooks

```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { useSession } from '@/lib/auth/client';

describe('useSession', () => {
  it('returns session data when authenticated', async () => {
    const { result } = renderHook(() => useSession());

    await waitFor(() => {
      expect(result.current.data).toBeDefined();
    });
  });
});
```

## End-to-End Testing (Playwright)

### Configuration

Located in `playwright.config.ts`:

```typescript
{
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  projects: [
    { name: 'chromium' },
    { name: 'firefox' },
    { name: 'webkit' },
    { name: 'Mobile Chrome' },
    { name: 'Mobile Safari' },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
}
```

### Test Structure

E2E tests are located in `e2e/` directory:

```
e2e/
├── auth.setup.ts          # Authentication setup
├── example.spec.ts        # Homepage and basic navigation
└── registration.spec.ts   # User registration flow
```

### Example E2E Test

```typescript
// e2e/registration.spec.ts
import { test, expect } from '@playwright/test';

test.describe('User Registration Flow', () => {
  const timestamp = Date.now();
  const testEmail = `test-${timestamp}@example.com`;
  const testPassword = 'TestPassword123!';

  test('should successfully register a new user', async ({ page }) => {
    await page.goto('/register');

    // Fill in registration form
    await page.getByLabel(/name/i).fill('Test User');
    await page.getByLabel(/email/i).fill(testEmail);
    await page.getByLabel(/password/i).fill(testPassword);

    // Submit form
    await page.getByRole('button', { name: /create account/i }).click();

    // Verify redirect to dashboard
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });
  });

  test('should validate email format', async ({ page }) => {
    await page.goto('/register');

    await page.getByLabel(/email/i).fill('invalid-email');
    await page.getByRole('button', { name: /create account/i }).click();

    // Should stay on register page
    await expect(page).toHaveURL(/\/register/);
  });
});
```

### Page Object Model

For complex flows, use the Page Object Model:

```typescript
// e2e/pages/login.page.ts
export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.page.getByLabel(/email/i).fill(email);
    await this.page.getByLabel(/password/i).fill(password);
    await this.page.getByRole('button', { name: /sign in/i }).click();
  }

  async expectError(message: string) {
    await expect(this.page.getByText(message)).toBeVisible();
  }
}

// Usage in test
test('login with invalid credentials', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('wrong@example.com', 'wrongpassword');
  await loginPage.expectError(/invalid credentials/i);
});
```

## Test Organization

### Naming Conventions

**Test Files:**
- Unit tests: `*.test.ts` or `*.test.tsx`
- E2E tests: `*.spec.ts`

**Test Names:**
- Use descriptive, behavior-focused names
- Start with "should" for unit tests
- Use full sentences for E2E tests

```typescript
// Good
it('should render error message when email is invalid', () => { });
test('user can successfully register with valid credentials', async () => { });

// Avoid
it('error', () => { });
test('test1', async () => { });
```

### Test Structure (AAA Pattern)

```typescript
test('description', async () => {
  // Arrange - Set up test data and conditions
  const email = 'test@example.com';
  const password = 'password123';

  // Act - Perform the action being tested
  await login(email, password);

  // Assert - Verify the expected outcome
  expect(isLoggedIn()).toBe(true);
});
```

## Running Tests

### Unit Tests

```bash
# Run all unit tests
npm test

# Run in watch mode (re-runs on file changes)
npm run test:watch

# Run with coverage report
npm run test:coverage

# Run specific test file
npm test Button.test.tsx

# Run tests matching pattern
npm test -- --testNamePattern="Button"
```

### End-to-End Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run in UI mode (interactive)
npm run test:e2e:ui

# Run in headed mode (see browser)
npm run test:e2e:headed

# Run specific test file
npx playwright test e2e/registration.spec.ts

# Run in specific browser
npx playwright test --project=chromium

# Run with debugging
npx playwright test --debug
```

### All Tests

```bash
# Run all checks (lint + unit + e2e + build)
npm run test:all
```

This is required to pass before committing.

## Writing Tests

### Best Practices

#### 1. Test User Behavior, Not Implementation

```typescript
// Good - Tests what user sees
expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();

// Avoid - Tests implementation details
expect(component.props.onClick).toBeDefined();
```

#### 2. Use Accessibility Queries

```typescript
// Priority order:
screen.getByRole('button', { name: /submit/i })  // Best
screen.getByLabelText(/email/i)                   // Good for forms
screen.getByText(/welcome/i)                      // Good for text
screen.getByTestId('submit-button')               // Last resort
```

#### 3. Avoid Testing Implementation Details

```typescript
// Good - Tests behavior
expect(screen.getByText(/3 items/i)).toBeInTheDocument();

// Avoid - Tests state
expect(component.state.itemCount).toBe(3);
```

#### 4. Mock External Dependencies

```typescript
// Mock API calls
jest.mock('@/lib/api', () => ({
  fetchUser: jest.fn().mockResolvedValue({ name: 'John' }),
}));

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    pathname: '/',
  }),
}));
```

#### 5. Clean Up After Tests

```typescript
afterEach(() => {
  jest.clearAllMocks();
  cleanup(); // React Testing Library
});
```

### Testing Async Code

```typescript
// Using waitFor
await waitFor(() => {
  expect(screen.getByText(/loaded/i)).toBeInTheDocument();
});

// Using findBy (implicit wait)
const element = await screen.findByText(/loaded/i);
expect(element).toBeInTheDocument();
```

### Testing Forms

```typescript
test('validates form submission', async () => {
  const user = userEvent.setup();
  render(<LoginForm />);

  const emailInput = screen.getByLabelText(/email/i);
  const passwordInput = screen.getByLabelText(/password/i);
  const submitButton = screen.getByRole('button', { name: /sign in/i });

  // Fill in form
  await user.type(emailInput, 'test@example.com');
  await user.type(passwordInput, 'password123');

  // Submit
  await user.click(submitButton);

  // Verify
  await waitFor(() => {
    expect(mockLogin).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
  });
});
```

### Testing Error States

```typescript
test('displays error message on failed submission', async () => {
  mockLogin.mockRejectedValue(new Error('Invalid credentials'));

  render(<LoginForm />);

  await userEvent.click(screen.getByRole('button', { name: /sign in/i }));

  await expect(screen.findByText(/invalid credentials/i)).resolves.toBeInTheDocument();
});
```

## Code Coverage

### Viewing Coverage Reports

```bash
# Generate coverage report
npm run test:coverage

# Open HTML report in browser
open coverage/lcov-report/index.html
```

### Coverage Thresholds

Current thresholds (enforced):

```javascript
{
  branches: 50,
  functions: 50,
  lines: 50,
  statements: 50,
}
```

Tests will fail if coverage drops below these values.

### Excluding Files from Coverage

In `jest.config.ts`:

```typescript
collectCoverageFrom: [
  '**/*.{js,jsx,ts,tsx}',
  '!**/*.d.ts',
  '!**/node_modules/**',
  '!**/.next/**',
  '!**/coverage/**',
  '!**/jest.config.ts',
  '!**/next.config.ts',
],
```

## Continuous Integration

### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '22'

      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint

      - name: Run unit tests
        run: npm test

      - name: Install Playwright browsers
        run: npx playwright install --with-deps

      - name: Run E2E tests
        run: npm run test:e2e

      - name: Build
        run: npm run build
```

## Troubleshooting

### Common Issues

#### Jest

**Issue: "Cannot find module"**
```bash
# Solution: Check moduleNameMapper in jest.config.ts
# Ensure path aliases match tsconfig.json
```

**Issue: "Tests timing out"**
```bash
# Solution: Increase timeout
jest.setTimeout(10000);
```

**Issue: "clearMocks not working"**
```bash
# Solution: Add to jest.config.ts
clearMocks: true,
```

#### Playwright

**Issue: "Browser not installed"**
```bash
# Solution: Install browsers
npx playwright install
```

**Issue: "Timeout waiting for element"**
```typescript
// Solution: Increase timeout
await expect(page.getByText(/text/i)).toBeVisible({ timeout: 10000 });
```

**Issue: "Test flakiness"**
```typescript
// Solution: Use better selectors and explicit waits
await page.waitForLoadState('networkidle');
await expect(element).toBeVisible();
```

### Debugging Tests

#### Jest

```bash
# Run with --verbose flag
npm test -- --verbose

# Run in watch mode and filter
npm run test:watch -- --testNamePattern="Button"

# Debug with Node debugger
node --inspect-brk node_modules/.bin/jest --runInBand
```

#### Playwright

```bash
# Run with --debug flag
npx playwright test --debug

# Run with UI mode
npm run test:e2e:ui

# Run headed to see browser
npm run test:e2e:headed

# Generate trace on failure
npx playwright test --trace on
npx playwright show-trace trace.zip
```

### Performance Tips

1. **Use test.describe.configure()** for parallel tests
2. **Mock expensive operations** (API calls, DB queries)
3. **Clean up properly** between tests
4. **Use test.beforeEach sparingly** - consider test.beforeAll
5. **Avoid unnecessary waitFor** - use findBy queries

## Additional Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Library Queries](https://testing-library.com/docs/queries/about)
- [Common Testing Mistakes](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## Support

For testing-related issues:
1. Check test output for error messages
2. Review test configuration files
3. Ensure all dependencies are installed
4. Clear test caches if needed
5. Consult documentation for specific testing library
