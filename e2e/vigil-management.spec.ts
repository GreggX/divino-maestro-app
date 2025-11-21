import { test, expect } from '@playwright/test';

test.describe('Vigil Management Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to vigilias dashboard
    await page.goto('/vigilias');
  });

  test('should display vigilias dashboard', async ({ page }) => {
    // Check if dashboard title is visible
    await expect(
      page.getByRole('heading', { name: /control dashboard|tablero de control/i })
    ).toBeVisible();

    // Check if "Start New Vigil" button is visible
    await expect(
      page.getByRole('link', { name: /start new vigil|iniciar nueva vigilia/i })
    ).toBeVisible();

    // Check if "Manage Members" button is visible
    await expect(
      page.getByRole('link', { name: /manage members|gestionar socios/i })
    ).toBeVisible();
  });

  test('should navigate to members page when clicking manage members', async ({
    page,
  }) => {
    await page
      .getByRole('link', { name: /manage members|gestionar socios/i })
      .click();
    await expect(page).toHaveURL(/\/socios/);
  });
});

test.describe('Attendance and Finance Registration', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to attendance page for a test vigil
    // Note: This assumes a test vigil with ID 'test-vigil' exists
    await page.goto('/vigilias/test-vigil/attendance');
  });

  test('should display attendance summary', async ({ page }) => {
    // Check if title is visible
    await expect(
      page.getByRole('heading', {
        name: /attendance.*finance registration|asistencia.*finanzas/i,
      })
    ).toBeVisible();

    // Check if summary cards are visible
    await expect(
      page.getByText(/attendees|asistentes/i)
    ).toBeVisible();

    await expect(
      page.getByText(/total money|dinero total/i)
    ).toBeVisible();
  });

  test('should toggle member attendance', async ({ page }) => {
    // Find all attendance toggles (switches)
    const toggles = page.getByRole('switch');

    // Count should be greater than 0 if members exist
    const count = await toggles.count();
    if (count > 0) {
      // Get initial state
      const firstToggle = toggles.first();
      const initialState = await firstToggle.getAttribute('aria-checked');

      // Click toggle
      await firstToggle.click();

      // Verify state changed
      const newState = await firstToggle.getAttribute('aria-checked');
      expect(newState).not.toBe(initialState);
    }
  });

  test('should open finance modal when finance button clicked', async ({
    page,
  }) => {
    // Find and click first finance button
    const financeButtons = page.getByRole('button', {
      name: /finances|finanzas/i,
    });

    const count = await financeButtons.count();
    if (count > 0) {
      await financeButtons.first().click();

      // Check if modal is visible
      await expect(
        page.getByText(/monthly fee|cuota.*mes/i)
      ).toBeVisible();

      await expect(
        page.getByText(/overdue fee|cuotas.*atrasadas/i)
      ).toBeVisible();

      await expect(
        page.getByText(/extra donation|donativo extra/i)
      ).toBeVisible();
    }
  });

  test('should update finance data when modal saved', async ({ page }) => {
    const financeButtons = page.getByRole('button', {
      name: /finances|finanzas/i,
    });

    const count = await financeButtons.count();
    if (count > 0) {
      // Open modal
      await financeButtons.first().click();

      // Find monthly fee input
      const monthlyFeeInput = page.getByLabel(/monthly fee|cuota.*mes/i);
      await monthlyFeeInput.fill('100');

      // Save modal
      await page
        .getByRole('button', { name: /save.*close|guardar/i })
        .click();

      // Modal should be closed
      await expect(
        page.getByText(/monthly fee|cuota.*mes/i)
      ).not.toBeVisible();
    }
  });

  test('should close modal when cancel clicked', async ({ page }) => {
    const financeButtons = page.getByRole('button', {
      name: /finances|finanzas/i,
    });

    const count = await financeButtons.count();
    if (count > 0) {
      // Open modal
      await financeButtons.first().click();

      // Click cancel
      await page.getByRole('button', { name: /cancel|cancelar/i }).click();

      // Modal should be closed
      await expect(
        page.getByText(/monthly fee|cuota.*mes/i)
      ).not.toBeVisible();
    }
  });
});

test.describe('Guard Assignment', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/vigilias/test-vigil/guards');
  });

  test('should display guard assignment interface', async ({ page }) => {
    // Check if title is visible
    await expect(
      page.getByRole('heading', {
        name: /guard assignment|asignaci.*guardia/i,
      })
    ).toBeVisible();

    // Check if instructions are visible
    await expect(
      page.getByText(/drag.*members|arrastra.*miembros/i)
    ).toBeVisible();
  });

  test('should display available members section', async ({ page }) => {
    await expect(
      page.getByText(/available members|miembros disponibles/i)
    ).toBeVisible();
  });

  test('should display timeline section', async ({ page }) => {
    await expect(
      page.getByText(/timeline|línea.*tiempo/i)
    ).toBeVisible();
  });

  test('should display special roles section', async ({ page }) => {
    await expect(
      page.getByText(/special roles|roles especiales/i)
    ).toBeVisible();

    await expect(
      page.getByText(/torch bearers|porta hachas/i)
    ).toBeVisible();

    await expect(
      page.getByText(/mass helpers|ayudaron.*misa/i)
    ).toBeVisible();
  });

  test('should display choir drop zones', async ({ page }) => {
    // Check for first and second choir labels
    await expect(
      page.getByText(/first choir|primer coro/i).first()
    ).toBeVisible();

    await expect(
      page.getByText(/second choir|segundo coro/i).first()
    ).toBeVisible();
  });

  test('should open split block modal when split button clicked', async ({
    page,
  }) => {
    const splitButtons = page.getByRole('button', {
      name: /split block|dividir bloque/i,
    });

    const count = await splitButtons.count();
    if (count > 0) {
      await splitButtons.first().click();

      // Modal should be visible
      await expect(page.getByRole('dialog')).toBeVisible();
    }
  });
});

test.describe('Minute Wizard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/vigilias/test-vigil/minute');
  });

  test('should display minute wizard with step indicator', async ({ page }) => {
    // Check if title is visible
    await expect(
      page.getByRole('heading', {
        name: /minute wizard|asistente.*acta/i,
      })
    ).toBeVisible();

    // Check if step indicators are visible (1, 2, 3)
    await expect(page.getByText('1')).toBeVisible();
    await expect(page.getByText('2')).toBeVisible();
    await expect(page.getByText('3')).toBeVisible();
  });

  test('should display step 1 content (review)', async ({ page }) => {
    await expect(
      page.getByText(/automatic review|revisi.*autom/i)
    ).toBeVisible();

    await expect(
      page.getByText(/attendance summary|resumen.*asistencia/i)
    ).toBeVisible();

    await expect(
      page.getByText(/financial summary|resumen.*financiero/i)
    ).toBeVisible();
  });

  test('should navigate to step 2 when next clicked', async ({ page }) => {
    // Click next button
    await page.getByRole('button', { name: /^(next|siguiente)$/i }).click();

    // Step 2 content should be visible
    await expect(
      page.getByRole('heading', { name: /administrative movements|movimientos.*administrativos/i })
    ).toBeVisible();

    await expect(
      page.getByText(/new aspirants|nuevos aspirantes/i)
    ).toBeVisible();
  });

  test('should navigate to step 3 when next clicked twice', async ({
    page,
  }) => {
    // Click next button twice
    await page.getByRole('button', { name: /^(next|siguiente)$/i }).click();
    await page.getByRole('button', { name: /^(next|siguiente)$/i }).click();

    // Step 3 content should be visible
    await expect(
      page.getByText(/formalities.*signatures|formalidades.*firmas/i)
    ).toBeVisible();

    await expect(
      page.getByText(/digital signatures|firmas digitales/i)
    ).toBeVisible();
  });

  test('should navigate back to step 1 from step 2', async ({ page }) => {
    // Go to step 2
    await page.getByRole('button', { name: /^(next|siguiente)$/i }).click();

    // Click previous button
    await page
      .getByRole('button', { name: /previous|anterior/i })
      .click();

    // Should be back to step 1
    await expect(
      page.getByText(/automatic review|revisi.*autom/i)
    ).toBeVisible();
  });

  test('should not show previous button on step 1', async ({ page }) => {
    // Previous button should not be visible on step 1
    await expect(
      page.getByRole('button', { name: /previous|anterior/i })
    ).not.toBeVisible();
  });

  test('should show generate minute button on step 3', async ({ page }) => {
    // Navigate to step 3
    await page.getByRole('button', { name: /^(next|siguiente)$/i }).click();
    await page.getByRole('button', { name: /^(next|siguiente)$/i }).click();

    // Generate minute button should be visible
    await expect(
      page.getByRole('button', {
        name: /generate minute|generar acta/i,
      })
    ).toBeVisible();

    // Next button should not be visible
    await expect(
      page.getByRole('button', { name: /^(next|siguiente)$/i })
    ).not.toBeVisible();
  });

  test('should allow updating checkbox on step 3', async ({ page }) => {
    // Navigate to step 3
    await page.getByRole('button', { name: /^(next|siguiente)$/i }).click();
    await page.getByRole('button', { name: /^(next|siguiente)$/i }).click();

    // Find and click checkbox
    const checkbox = page.getByRole('checkbox').first();
    const initialState = await checkbox.isChecked();

    await checkbox.click();

    const newState = await checkbox.isChecked();
    expect(newState).toBe(!initialState);
  });

  test('should allow typing in textarea fields on step 3', async ({
    page,
  }) => {
    // Navigate to step 3
    await page.getByRole('button', { name: /^(next|siguiente)$/i }).click();
    await page.getByRole('button', { name: /^(next|siguiente)$/i }).click();

    // Find first textarea
    const textareas = page.getByRole('textbox');
    const count = await textareas.count();

    if (count > 0) {
      const textarea = textareas.first();
      await textarea.fill('Test correspondence text');

      await expect(textarea).toHaveValue('Test correspondence text');
    }
  });

  test('should allow typing in signature inputs on step 3', async ({
    page,
  }) => {
    // Navigate to step 3
    await page.getByRole('button', { name: /^(next|siguiente)$/i }).click();
    await page.getByRole('button', { name: /^(next|siguiente)$/i }).click();

    // Find chief input
    const chiefInput = page.getByPlaceholder(/chief|jefe/i);
    if (await chiefInput.isVisible()) {
      await chiefInput.fill('John Doe');
      await expect(chiefInput).toHaveValue('John Doe');
    }
  });
});
