import { expect, test } from '@playwright/test';

test.describe('FAQ', () => {
  test('accordion opens one answer at a time and reflects state in aria-expanded', async ({
    page,
  }) => {
    await page.goto('/');

    const firstQuestion = page.getByRole('button', {
      name: 'What does OraMedha actually cover?',
    });
    const secondQuestion = page.getByRole('button', {
      name: 'Who in the clinic uses it?',
    });

    await firstQuestion.scrollIntoViewIfNeeded();

    await expect(firstQuestion).toHaveAttribute('aria-expanded', 'false');
    await firstQuestion.click();
    await expect(firstQuestion).toHaveAttribute('aria-expanded', 'true');
    await expect(
      page.getByText('surface what needs attention, and help you act on it.')
    ).toBeVisible();

    // Opening a second item closes the first — one answer at a time.
    await secondQuestion.click();
    await expect(secondQuestion).toHaveAttribute('aria-expanded', 'true');
    await expect(firstQuestion).toHaveAttribute('aria-expanded', 'false');

    // Clicking the open question again closes it.
    await secondQuestion.click();
    await expect(secondQuestion).toHaveAttribute('aria-expanded', 'false');
  });

  test('covers OraMedha differentiation and clinic sizing', async ({ page }) => {
    await page.goto('/');

    const differentQuestion = page.getByRole('button', {
      name: 'What makes OraMedha different?',
    });
    await differentQuestion.scrollIntoViewIfNeeded();
    await differentQuestion.click();
    await expect(
      page.getByText('an intelligent system for running a dental clinic')
    ).toBeVisible();

    const sizingQuestion = page.getByRole('button', {
      name: 'What kind of clinics is OraMedha built for?',
    });
    await sizingQuestion.click();
    await expect(
      page.getByText('from solo and independent clinics to larger teams')
    ).toBeVisible();
  });
});
