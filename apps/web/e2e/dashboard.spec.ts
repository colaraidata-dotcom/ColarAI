import { test, expect } from '@playwright/test';

const DASHBOARD_PAGES = [
  { path: '/dashboard', heading: 'Dashboard' },
  { path: '/profiles', heading: 'Profiles' },
  { path: '/reports', heading: 'Usage Reports' },
  { path: '/notifications', heading: 'Notifications' },
  { path: '/settings', heading: 'Settings' },
];

test.describe('Dashboard navigation', () => {
  for (const { path, heading } of DASHBOARD_PAGES) {
    test(`${path} renders without error`, async ({ page }) => {
      await page.goto(path);
      await expect(page.getByRole('heading', { name: heading, level: 1 })).toBeVisible();
    });
  }

  test('sidebar shows active state on /profiles', async ({ page }) => {
    await page.goto('/profiles');
    const profilesLink = page.getByRole('link', { name: 'Profiles' });
    await expect(profilesLink).toHaveClass(/text-\[#F1F5F9\]/);
  });

  test('profile detail page renders for first profile', async ({ page }) => {
    await page.goto('/profiles/prof_001');
    await expect(page.getByRole('heading', { name: 'Emma', level: 1 })).toBeVisible();
    await expect(page.getByText('Content Rules')).toBeVisible();
  });
});
