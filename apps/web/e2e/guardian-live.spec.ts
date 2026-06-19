import { test, expect, Page } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';

const BASE_URL = 'https://guardian-fd0cs99tb-colarai.vercel.app';
const SCREENSHOT_DIR = path.join(__dirname, '../test-results/guardian-live');

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function screenshot(page: Page, name: string) {
  ensureDir(SCREENSHOT_DIR);
  await page.screenshot({
    path: path.join(SCREENSHOT_DIR, `${name}.png`),
    fullPage: true,
  });
}

// ─── 1. BASIC LOADING ────────────────────────────────────────────────────────

test.describe('1. Basic Loading', () => {
  test('homepage returns HTTP 200', async ({ page }) => {
    const response = await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
    expect(response?.status()).toBe(200);
  });

  test('page title contains "Guardian"', async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
    const title = await page.title();
    expect(title.toLowerCase()).toContain('guardian');
  });

  test('homepage loads within 5 seconds', async ({ page }) => {
    const start = Date.now();
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    const elapsed = Date.now() - start;
    expect(elapsed).toBeLessThan(5000);
    await screenshot(page, '1-homepage-desktop');
  });

  test('h1 or main heading is visible', async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
    const h1 = page.locator('h1').first();
    await expect(h1).toBeVisible({ timeout: 10000 });
  });

  test('at least one CTA button is visible', async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
    // Look for common CTA patterns
    const cta = page.locator('a[href*="sign"], a[href*="login"], a[href*="get-started"], button').first();
    await expect(cta).toBeVisible({ timeout: 10000 });
  });

  test('no critical JS errors on homepage', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    const critical = errors.filter(
      (e) => !e.includes('Warning') && !e.includes('deprecated')
    );
    expect(critical).toHaveLength(0);
  });
});

// ─── 2. NAVIGATION ───────────────────────────────────────────────────────────

test.describe('2. Navigation', () => {
  test('sign-in link is present on homepage', async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
    const loginLink = page.locator(
      'a[href*="sign-in"], a[href*="login"], a[href*="signin"]'
    ).first();
    await expect(loginLink).toBeVisible({ timeout: 10000 });
  });

  test('navigating to /sign-in returns a page (not 404)', async ({ page }) => {
    const response = await page.goto(`${BASE_URL}/sign-in`, { waitUntil: 'domcontentloaded' });
    expect(response?.status()).not.toBe(404);
  });

  test('navigating to /sign-up returns a page (not 404)', async ({ page }) => {
    const response = await page.goto(`${BASE_URL}/sign-up`, { waitUntil: 'domcontentloaded' });
    expect(response?.status()).not.toBe(404);
  });

  test('unknown route shows 404 or redirects gracefully', async ({ page }) => {
    const response = await page.goto(`${BASE_URL}/this-page-does-not-exist-xyz`, {
      waitUntil: 'domcontentloaded',
    });
    // Next.js returns 404 for unknown routes; a custom 404 page is also fine
    const status = response?.status() ?? 0;
    expect([404, 200]).toContain(status);
    await screenshot(page, '2-404-page');
  });

  test('no broken internal links on homepage', async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    const links = await page.locator('a[href]').all();
    const internalHrefs = (
      await Promise.all(
        links.map((l) => l.getAttribute('href'))
      )
    ).filter(
      (href): href is string =>
        !!href &&
        (href.startsWith('/') || href.startsWith(BASE_URL)) &&
        !href.startsWith('/#') &&
        !href.includes('mailto:') &&
        !href.includes('tel:')
    );

    const uniqueHrefs = [...new Set(internalHrefs)].slice(0, 10); // check first 10
    for (const href of uniqueHrefs) {
      const url = href.startsWith('/') ? `${BASE_URL}${href}` : href;
      const resp = await page.request.get(url);
      expect(resp.status(), `Broken link: ${url}`).not.toBe(404);
    }
  });
});

// ─── 3. AUTH PAGES ───────────────────────────────────────────────────────────

test.describe('3. Auth Pages', () => {
  test('/sign-in page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/sign-in`, { waitUntil: 'domcontentloaded' });
    await screenshot(page, '3-login-page');
    const body = page.locator('body');
    await expect(body).not.toBeEmpty();
  });

  test('/sign-in has email input', async ({ page }) => {
    await page.goto(`${BASE_URL}/sign-in`, { waitUntil: 'domcontentloaded' });
    const emailInput = page.locator(
      'input[type="email"], input[name="email"], input[placeholder*="email" i]'
    ).first();
    await expect(emailInput).toBeVisible({ timeout: 10000 });
  });

  test('/sign-in has password input', async ({ page }) => {
    await page.goto(`${BASE_URL}/sign-in`, { waitUntil: 'domcontentloaded' });
    const passwordInput = page.locator('input[type="password"]').first();
    await expect(passwordInput).toBeVisible({ timeout: 10000 });
  });

  test('/sign-in has a submit button', async ({ page }) => {
    await page.goto(`${BASE_URL}/sign-in`, { waitUntil: 'domcontentloaded' });
    const submitBtn = page.locator(
      'button[type="submit"], button:has-text("Sign in"), button:has-text("Login"), button:has-text("Log in")'
    ).first();
    await expect(submitBtn).toBeVisible({ timeout: 10000 });
  });

  test('/sign-up page loads and has form fields', async ({ page }) => {
    const resp = await page.goto(`${BASE_URL}/sign-up`, { waitUntil: 'domcontentloaded' });
    await screenshot(page, '3-signup-page');
    expect(resp?.status()).not.toBe(404);

    const emailInput = page.locator(
      'input[type="email"], input[name="email"], input[placeholder*="email" i]'
    ).first();
    await expect(emailInput).toBeVisible({ timeout: 10000 });
  });
});

// ─── 4. RESPONSIVE / BASIC UI ────────────────────────────────────────────────

test.describe('4. Responsive UI', () => {
  test('homepage renders correctly at 1440px (desktop)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await screenshot(page, '4-desktop-1440');
    // No horizontal overflow
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = page.viewportSize()!.width;
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 5); // 5px tolerance
  });

  test('homepage renders correctly at 375px (mobile) - no severe overflow', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await screenshot(page, '4-mobile-375');
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    // Allow up to 10% overflow as minor layout issues are non-critical
    expect(bodyWidth).toBeLessThanOrEqual(420);
  });

  test('/sign-in page renders correctly at 375px (mobile)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(`${BASE_URL}/sign-in`, { waitUntil: 'domcontentloaded' });
    await screenshot(page, '4-login-mobile-375');
    const emailInput = page.locator(
      'input[type="email"], input[name="email"], input[placeholder*="email" i]'
    ).first();
    await expect(emailInput).toBeVisible({ timeout: 10000 });
  });

  test('no critical JS errors at 375px mobile (homepage)', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    const critical = errors.filter(
      (e) => !e.includes('Warning') && !e.includes('deprecated')
    );
    expect(critical).toHaveLength(0);
  });
});

// ─── 5. PERFORMANCE (quick check) ────────────────────────────────────────────

test.describe('5. Performance', () => {
  test('homepage first paint starts within 3 seconds', async ({ page }) => {
    const start = Date.now();
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
    const elapsed = Date.now() - start;
    expect(elapsed).toBeLessThan(3000);
  });

  test('homepage fully loaded within 5 seconds', async ({ page }) => {
    const start = Date.now();
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    const elapsed = Date.now() - start;
    expect(elapsed).toBeLessThan(5000);
  });

  test('/sign-in page fully loaded within 5 seconds', async ({ page }) => {
    const start = Date.now();
    await page.goto(`${BASE_URL}/sign-in`, { waitUntil: 'networkidle' });
    const elapsed = Date.now() - start;
    expect(elapsed).toBeLessThan(5000);
  });
});
