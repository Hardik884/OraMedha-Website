import { expect, test } from '@playwright/test';
import { hasHorizontalOverflow, trackConsoleErrors, waitForPageReady } from './helpers';

test.describe('Privacy Policy page', () => {
  test('loads at /privacy with the right title and no console errors', async ({ page }) => {
    const errors = trackConsoleErrors(page);

    const response = await page.goto('/privacy');
    expect(response?.status()).toBeLessThan(400);
    await expect(page).toHaveTitle(/Privacy Policy/);

    await page.waitForLoadState('networkidle');
    expect(errors).toEqual([]);
  });

  test('renders the heading and all nineteen numbered sections', async ({ page }) => {
    await page.goto('/privacy');
    await waitForPageReady(page);

    await expect(page.getByRole('heading', { name: 'Privacy Policy', level: 1 })).toBeVisible();
    await expect(page.getByText(/^Last updated:/)).toBeVisible();

    // Every section is a numbered <h2> generated from the same content array
    // the table of contents is built from — see PrivacyPolicy/constants.ts.
    const headings = await page.locator('h2').allTextContents();
    const numbered = headings.filter((t) => /^\d+\.\s/.test(t.trim()));
    expect(numbered.length).toBe(19);
    expect(numbered[0]).toContain('Introduction');
    expect(numbered.at(-1)).toContain('Changes to This Policy');
  });

  test('table of contents links scroll to their section', async ({ page }) => {
    await page.goto('/privacy');
    await waitForPageReady(page);

    const tocLink = page.locator('nav[aria-label="Table of contents"] a', {
      hasText: 'Data Security',
    });
    await tocLink.click();
    await page.waitForTimeout(600);

    await expect(page).toHaveURL(/#data-security$/);
    await expect(
      page.locator('#data-security').getByRole('heading', { name: /Data Security/ })
    ).toBeInViewport();
  });

  test('has no horizontal overflow at any tested width', async ({ page }) => {
    for (const width of [375, 390, 430, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/privacy');
      await page.waitForLoadState('networkidle');
      expect(await hasHorizontalOverflow(page), `overflow at ${width}px`).toBe(false);
    }
  });

  test('footer Privacy Policy link navigates to /privacy from the homepage', async ({
    page,
  }) => {
    await page.goto('/');
    await waitForPageReady(page);

    // Exactly one, under Company. It was briefly duplicated in the legal row
    // below; the count is asserted so a second copy cannot creep back in.
    const links = page.getByRole('link', { name: 'Privacy Policy' });
    await expect(links).toHaveCount(1);
    await expect(links).toHaveAttribute('href', '/privacy');

    await links.scrollIntoViewIfNeeded();
    await links.click();

    await expect(page).toHaveURL(/\/privacy$/);
    await expect(page.getByRole('heading', { name: 'Privacy Policy', level: 1 })).toBeVisible();
  });

  test('footer Privacy Policy link works from the mobile menu', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await waitForPageReady(page);

    const link = page.getByRole('link', { name: 'Privacy Policy' });
    await link.scrollIntoViewIfNeeded();
    await expect(link).toBeVisible();
    await link.click();

    await expect(page).toHaveURL(/\/privacy$/);
  });

  test('the privacy page still has the site header and footer', async ({ page }) => {
    await page.goto('/privacy');
    await waitForPageReady(page);

    await expect(page.getByTestId('site-nav')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Book a Demo' }).first()).toBeVisible();
    await expect(
      page.getByRole('link', { name: 'Privacy Policy' })
    ).toBeVisible();
  });
});
