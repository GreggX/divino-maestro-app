import { test, expect } from '@playwright/test';

test.describe('User Registration Flow', () => {
  // Generate a unique email for each test run to avoid conflicts
  const timestamp = Date.now();
  const testEmail = `test-${timestamp}@example.com`;
  const testPassword = 'TestPassword123!';
  const testName = 'Test User';

  test.beforeEach(async ({ page }) => {
    await page.goto('/register');
  });

  test('should successfully register a new user', async ({ page }) => {
    // Fill in registration form
    await page.getByLabel(/name/i).fill(testName);
    await page.getByLabel(/email/i).fill(testEmail);
    await page.getByLabel(/password/i).fill(testPassword);

    // Submit the form
    await page.getByRole('button', { name: /create account/i }).click();

    // Wait for navigation or success indicator
    // Should redirect to dashboard after successful registration
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });

    // Verify we're logged in - check for user-specific elements
    await expect(page.getByText(/dashboard/i)).toBeVisible();
  });

  test('should show error for duplicate email', async ({ page }) => {
    // First, register a user
    await page.getByLabel(/name/i).fill(testName);
    await page.getByLabel(/email/i).fill(`duplicate-${timestamp}@example.com`);
    await page.getByLabel(/password/i).fill(testPassword);
    await page.getByRole('button', { name: /create account/i }).click();

    // Wait for registration to complete
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });

    // Logout
    await page.goto('/login');

    // Try to register again with the same email
    await page.goto('/register');
    await page.getByLabel(/name/i).fill('Another User');
    await page.getByLabel(/email/i).fill(`duplicate-${timestamp}@example.com`);
    await page.getByLabel(/password/i).fill(testPassword);
    await page.getByRole('button', { name: /create account/i }).click();

    // Should show an error message
    await expect(
      page.getByText(/already exists|already registered/i)
    ).toBeVisible({ timeout: 5000 });
  });

  test('should validate required fields', async ({ page }) => {
    // Try to submit without filling any fields
    await page.getByRole('button', { name: /create account/i }).click();

    // Should show validation errors or prevent submission
    // The exact behavior depends on the form implementation
    // Check that we're still on the register page
    await expect(page).toHaveURL(/\/register/);
  });

  test('should validate email format', async ({ page }) => {
    await page.getByLabel(/name/i).fill(testName);
    await page.getByLabel(/email/i).fill('invalid-email');
    await page.getByLabel(/password/i).fill(testPassword);

    await page.getByRole('button', { name: /create account/i }).click();

    // Should show email validation error or stay on page
    await expect(page).toHaveURL(/\/register/);
  });

  test('should validate password requirements', async ({ page }) => {
    await page.getByLabel(/name/i).fill(testName);
    await page.getByLabel(/email/i).fill(`weak-${timestamp}@example.com`);
    // Try a weak password
    await page.getByLabel(/password/i).fill('123');

    await page.getByRole('button', { name: /create account/i }).click();

    // Should show password validation error or stay on page
    await expect(page).toHaveURL(/\/register/);
  });

  test('should allow navigation to login page', async ({ page }) => {
    const loginLink = page.getByRole('link', { name: /sign in/i });
    await expect(loginLink).toBeVisible();
    await loginLink.click();
    await expect(page).toHaveURL(/\/login/);
  });

  test('should have accessible form elements', async ({ page }) => {
    // Check for proper labels and accessibility
    await expect(page.getByLabel(/name/i)).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();

    // Check that form elements are keyboard accessible
    await page.keyboard.press('Tab');
    await expect(page.getByLabel(/name/i)).toBeFocused();
  });
});

test.describe('Registration and Login Flow', () => {
  const timestamp = Date.now();
  const testEmail = `login-test-${timestamp}@example.com`;
  const testPassword = 'TestPassword123!';
  const testName = 'Login Test User';

  test('should register and then login with new credentials', async ({
    page,
  }) => {
    // Register
    await page.goto('/register');
    await page.getByLabel(/name/i).fill(testName);
    await page.getByLabel(/email/i).fill(testEmail);
    await page.getByLabel(/password/i).fill(testPassword);
    await page.getByRole('button', { name: /create account/i }).click();

    // Wait for redirect to dashboard
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });

    // Navigate to login page (simulating logout)
    await page.goto('/login');

    // Login with the same credentials
    await page.getByLabel(/email/i).fill(testEmail);
    await page.getByLabel(/password/i).fill(testPassword);
    await page.getByRole('button', { name: /sign in/i }).click();

    // Should redirect to dashboard
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });
  });
});
