import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should redirect to login page', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/login/);
  });

  test('should display login form', async ({ page }) => {
    await page.goto('/login');

    // Check for essential elements (Spanish is the default locale)
    await expect(page.getByRole('heading', { name: /inicia sesión en tu cuenta/i })).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
  });

  test('should have link to register page', async ({ page }) => {
    await page.goto('/login');
    const registerLink = page.getByRole('link', { name: /sign up/i });
    await expect(registerLink).toBeVisible();
    await registerLink.click();
    await expect(page).toHaveURL(/\/register/);
  });
});

test.describe('Register Page', () => {
  test('should display registration form', async ({ page }) => {
    await page.goto('/register');

    // Heading is in Spanish (default locale) but form labels are in English (hardcoded in RegisterForm)
    await expect(page.getByRole('heading', { name: /crea tu cuenta/i })).toBeVisible();
    await expect(page.getByLabel(/name/i)).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
    await expect(
      page.getByRole('button', { name: /create account/i })
    ).toBeVisible();
  });

  test('should have link to login page', async ({ page }) => {
    await page.goto('/register');
    const loginLink = page.getByRole('link', { name: /sign in/i });
    await expect(loginLink).toBeVisible();
    await loginLink.click();
    await expect(page).toHaveURL(/\/login/);
  });
});

test.describe('Language Switcher', () => {
  test.skip('should be present on dashboard', async () => {
    // This test would need authentication setup
    // For now, it's a placeholder
  });
});
