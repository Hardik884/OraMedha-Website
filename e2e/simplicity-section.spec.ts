import { expect, test } from '@playwright/test';

test.describe('Simplicity section', () => {
  test('sits between the Action Layer and the clinical section', async ({
    page,
  }) => {
    await page.goto('/');

    const section = page.getByTestId('simplicity-section');
    await section.scrollIntoViewIfNeeded();

    await expect(section.getByRole('heading', { name: 'Everything connected.' })).toBeVisible();
    await expect(section.getByRole('heading', { name: 'Nothing complicated.' })).toBeVisible();
    await expect(
      section.getByText('The intelligence stays in the background', {
        exact: false,
      })
    ).toBeVisible();

    // Kept as a small typography-only moment: no screenshot or product UI.
    await expect(section.locator('img')).toHaveCount(0);

    const order = await page.evaluate(() => {
      const headings = Array.from(document.querySelectorAll('h1')).map(
        (h) => h.textContent?.trim() ?? ''
      );
      const actionLayerIndex = headings.findIndex((t) => t.includes('do next.'));
      const simplicityIndex = headings.findIndex((t) =>
        t.includes('Nothing complicated.')
      );
      const clinicalIndex = headings.findIndex((t) => t.includes('Treat with context'));
      return { actionLayerIndex, simplicityIndex, clinicalIndex };
    });

    expect(order.actionLayerIndex).toBeGreaterThan(-1);
    expect(order.simplicityIndex).toBeGreaterThan(-1);
    expect(order.clinicalIndex).toBeGreaterThan(-1);
    expect(order.actionLayerIndex).toBeLessThan(order.simplicityIndex);
    expect(order.simplicityIndex).toBeLessThan(order.clinicalIndex);
  });
});
