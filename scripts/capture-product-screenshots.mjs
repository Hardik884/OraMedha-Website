/**
 * Captures the product screenshots the marketing site uses, from a real running
 * instance of the OraMedha PMS.
 *
 * This script did not exist for the previous round — the captures were done by
 * hand — which meant "re-shoot the screenshots" was an undocumented, unrepeatable
 * job. It is committed now so the next brand or UI change is a single command.
 *
 * ## Prerequisites
 *
 *   1. Local Supabase running for the PMS   (cd <pms> && npm run db:start)
 *   2. PMS dev server on :3200              (cd <pms> && npm run dev:local -- -p 3200)
 *   3. The demo clinic's activity shifted so the app's own "today" lands on the
 *      densest seeded day. See PRODUCT_SCREENSHOTS.md — without it every screen
 *      shows an empty Tuesday.
 *
 * ## What it does NOT do
 *
 * It writes only the full-screen captures, into `capture/`. The thirteen files
 * the site actually ships are deliberate crops of these, made by
 * `crop-product-screenshots.mjs`, because each one is composed for the slot it
 * fills rather than being a uniform resize.
 *
 * Run: node scripts/capture-product-screenshots.mjs
 */

import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

const APP = process.env.PMS_URL ?? 'http://localhost:3200';
const EMAIL = process.env.PMS_EMAIL ?? 'brain@dentgrow.test';
const PASSWORD = process.env.PMS_PASSWORD ?? 'password123';
const OUT = 'capture';

/**
 * One context per screen.
 *
 * Each screen gets the viewport its composition needs rather than one fixed size
 * stretched everywhere — a dashboard wants width, a patient profile wants less.
 * deviceScaleFactor 2 so the captures stay sharp when the site renders them
 * inside a smaller frame.
 */
const SCREENS = [
  { name: 'dashboard', path: '/dentist', width: 1920, height: 1150 },
  { name: 'business-brain', path: '/dentist/business-brain', width: 1680, height: 1300 },
  { name: 'payments', path: '/dentist/payments', width: 1680, height: 1200 },
  { name: 'appointments', path: '/dentist/appointments?filter=today', width: 1680, height: 1200 },
];

/**
 * Patient-scoped screens, resolved after login because the ids are seeded
 * UUIDs. `match: 'Rohan'` named a patient from the original "BrightSmile
 * Dental Studio" dataset (see PRODUCT_SCREENSHOTS.md) — that data no longer
 * exists locally, so this pointed at nothing and the screen was silently
 * skipped. Asha Menon is the local seed's own patient with dental-chart
 * entries; her chart is shaped for this capture by
 * scripts/capture-data-dashboard-chart.sql.
 */
const PATIENT_SCREENS = [
  { name: 'patient-treatments', tab: 'treatments', match: 'Priya', width: 1600, height: 1100 },
  { name: 'patient-chart', tab: 'dental-chart', match: 'Asha', width: 1920, height: 1150 },
];

/**
 * Optional scope, so a re-shoot of one or two screens doesn't have to run
 * (and log in for) the other four. `SCREENS_ONLY=dashboard,patient-chart
 * node scripts/capture-product-screenshots.mjs`. Unset, every screen below
 * runs, exactly as before.
 */
const only = process.env.SCREENS_ONLY?.split(',').map((s) => s.trim());
const screens = only ? SCREENS.filter((s) => only.includes(s.name)) : SCREENS;
const patientScreens = only
  ? PATIENT_SCREENS.filter((s) => only.includes(s.name))
  : PATIENT_SCREENS;

/** Everything that must settle before a frame is worth keeping. */
async function settle(page) {
  await page.waitForLoadState('networkidle').catch(() => {});
  await page.evaluate(() => document.fonts?.ready).catch(() => {});
  // Scrollbars differ per platform and would show up as a grey gutter. The
  // Next.js dev-tools bubble sits bottom-left and would otherwise appear in
  // every frame — it is the one thing in these captures that is not the product.
  await page.addStyleTag({
    content: `*::-webkit-scrollbar{display:none!important}
              html{scrollbar-width:none!important}
              *{caret-color:transparent!important}
              nextjs-portal,
              [data-nextjs-dev-tools-button],
              [data-nextjs-toast],
              #__next-build-watcher,
              #__next-prerender-indicator{display:none!important}`,
  });
  await page.waitForTimeout(1200);
}

async function signIn(context) {
  const page = await context.newPage();
  await page.goto(`${APP}/login`, { waitUntil: 'domcontentloaded' });
  await page.getByPlaceholder('you@clinic.com').fill(EMAIL);
  await page.getByPlaceholder('Enter your password').fill(PASSWORD);
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.waitForURL(/\/dentist/, { timeout: 30_000 });
  await page.close();
}

await mkdir(OUT, { recursive: true });

const browser = await chromium.launch();
const shot = async ({ name, path: route, width, height }, storageState) => {
  const context = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: 2,
    timezoneId: 'Asia/Kolkata',
    colorScheme: 'light',
    storageState,
  });
  const page = await context.newPage();
  await page.goto(`${APP}${route}`, { waitUntil: 'domcontentloaded' });
  await settle(page);
  await page.screenshot({ path: `${OUT}/${name}.png` });
  console.log(`${OUT}/${name}.png  ${width}x${height} @2x`);
  await context.close();
};

// One signed-in session, reused for every capture.
const auth = await browser.newContext({ viewport: { width: 1440, height: 900 } });
await signIn(auth);
const storageState = await auth.storageState();
await auth.close();

for (const screen of screens) await shot(screen, storageState);

// Patient screens need real ids. Resolved through the app's own search box rather
// than by scraping the first page of the list: the list is alphabetical and
// paginated, and both named patients sit past page one.
{
  const context = await browser.newContext({
    viewport: { width: 1600, height: 1100 },
    storageState,
  });
  const page = await context.newPage();

  for (const screen of patientScreens) {
    await page.goto(`${APP}/dentist/patients`, { waitUntil: 'domcontentloaded' });
    await page.getByPlaceholder(/Search by name or phone/i).fill(screen.match);
    // Search is debounced and refetches; wait for the row itself to appear.
    const link = page
      .locator(`a[href*="/dentist/patients/"]`)
      .filter({ hasText: screen.match })
      .first();
    await link.waitFor({ state: 'visible', timeout: 15_000 }).catch(() => {});
    const href = await link.getAttribute('href').catch(() => null);
    if (!href) {
      console.warn(`! could not find a patient matching "${screen.match}" - skipped`);
      continue;
    }
    await shot({ ...screen, path: `${href}?tab=${screen.tab}` }, storageState);
  }
  await context.close();
}

await browser.close();
console.log('done');
