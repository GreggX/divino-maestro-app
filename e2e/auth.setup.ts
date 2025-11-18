/**
 * Authentication setup for E2E tests
 * This file can be used to set up authenticated sessions for tests
 */

import { test as setup } from '@playwright/test';

// const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page }) => {
  // This is a placeholder for authentication setup
  // In a real scenario, you would:
  // 1. Navigate to login page
  // 2. Fill in credentials
  // 3. Submit form
  // 4. Save authentication state

  await page.goto('/login');
  // await page.fill('input[name="email"]', 'test@example.com');
  // await page.fill('input[name="password"]', 'password');
  // await page.click('button[type="submit"]');
  // await page.waitForURL('/dashboard');
  // await page.context().storageState({ path: authFile });

  // For now, skip this setup
  setup.skip();
});
