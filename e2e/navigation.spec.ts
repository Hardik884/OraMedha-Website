import { expect, test } from '@playwright/test';
import { waitForPageReady } from './helpers';

/**
 * Each nav link renders its label twice — once for the visible letters, once
 * in an `aria-hidden` layer used for the hover roll animation — so the
 * accessible name Chromium computes for it isn't a clean match on the label
 * text. The href is unique and stable, so links are targeted by that instead.
 */
test.describe('Header navigation', () => {
  test('desktop nav links scroll to their section', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/');
    await waitForPageReady(page);

    const nav = page.getByTestId('site-nav');
    await expect(nav.locator('a[href="/#product"]')).toBeVisible();
    await expect(nav.locator('a[href="/#intelligence"]')).toBeVisible();
    await expect(nav.locator('a[href="/#security"]')).toBeVisible();

    await nav.locator('a[href="/#security"]').click();
    await expect(page).toHaveURL(/#security$/);
    await expect(page.locator('#security')).toBeInViewport();
  });

  test('the header Book a Demo button opens the dialog', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/');

    await page.getByTestId('book-demo-compact').click();
    await expect(page.getByRole('dialog')).toBeVisible();
  });

  /**
   * Header and Footer render on every route (see Layout), so a section link
   * has to work from a page that doesn't have that section on it. It used to
   * carry a bare `#product`-style href, which on `/privacy` just appended the
   * hash to the current URL and went nowhere — the link looked clickable but
   * silently did nothing. The href now carries the homepage's own path.
   */
  test('a section link on /privacy navigates to the homepage section', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/privacy');
    await waitForPageReady(page);

    const nav = page.getByTestId('site-nav');
    await nav.locator('a[href="/#intelligence"]').click();

    await expect(page).toHaveURL(/\/#intelligence$/);
    await waitForPageReady(page);
    await expect(page.locator('#intelligence')).toBeInViewport();
  });
});

test.describe('Mobile menu', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test('opens, exposes the nav links, and closes after navigating', async ({
    page,
  }) => {
    await page.goto('/');

    const toggle = page.getByTestId('menu-toggle');
    const nav = page.getByTestId('site-nav');
    const productLink = nav.locator('a[href="/#product"]');

    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(productLink).not.toBeVisible();

    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(productLink).toBeVisible();

    await productLink.click();
    await expect(page).toHaveURL(/#product$/);
    // The panel closes itself once a link inside it navigates.
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  });

  test('the mobile Book a Demo button opens the dialog', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('menu-toggle').click();
    await page.getByTestId('book-demo-compact').click();
    await expect(page.getByRole('dialog')).toBeVisible();
  });
});
