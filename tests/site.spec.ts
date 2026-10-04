import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const gameUrl = 'https://games.soeborg-madsen.dk/lattice/';

test('visitors can navigate the complete site without JavaScript', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Lattice', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Play Lattice', exact: true })).toHaveAttribute('href', gameUrl);
  await page.getByRole('navigation').getByRole('link', { name: 'Library', exact: true }).click();
  await expect(page).toHaveURL('/library/');
  await expect(page.getByRole('heading', { name: 'The library.' })).toBeVisible();
  await expect(page.getByRole('navigation').getByRole('link', { name: 'Library', exact: true })).toHaveAttribute('aria-current', 'page');
  await expect(page.getByRole('article')).toHaveCount(1);
  for (const link of await page.getByRole('link', { name: 'Play Lattice', exact: true }).all()) {
    await expect(link).toHaveAttribute('href', gameUrl);
  }
  await expect(page.locator('body')).not.toContainText(/Undertow|Night Shift|Mossbound|Driftline|Dead Air|Hex RTS/);
  await page.getByRole('navigation').getByRole('link', { name: 'About', exact: true }).click();
  await expect(page).toHaveURL('/about/');
  await expect(page.getByRole('heading', { name: 'Made for the love of play.' })).toBeVisible();
  await page.getByRole('link', { name: 'Explore the library', exact: true }).click();
  await expect(page).toHaveURL('/library/');
});

test('keyboard users can skip navigation and discover the game', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Play Lattice', exact: true })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Discover the game' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL('/#discover');
  await expect(page.getByRole('heading', { name: 'Small decisions. Chain reactions.' })).toBeInViewport();
});

for (const path of ['/', '/library/', '/about/']) {
  test(`${path} has loaded artwork, one main heading, and no horizontal overflow`, async ({ page }, testInfo) => {
    const failures: string[] = [];
    page.on('response', (response) => {
      if (response.status() >= 400) failures.push(`${response.status()} ${response.url()}`);
    });
    await page.goto(path);
    await page.evaluate(() => document.fonts.ready);
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
    await expect.poll(() => page.evaluate(() => Array.from(document.images).every((image) => image.complete && image.naturalWidth > 0))).toBe(true);
    await page.evaluate(() => Promise.all(Array.from(document.images, (image) => image.decode())));
    const dimensions = await page.evaluate(() => ({
      page: document.documentElement.scrollWidth,
      viewport: window.innerWidth,
    }));
    expect(dimensions.page).toBeLessThanOrEqual(dimensions.viewport);
    expect(failures).toEqual([]);
    await page.screenshot({ path: testInfo.outputPath(`${path === '/' ? 'home' : path.replaceAll('/', '')}.png`), fullPage: true, animations: 'disabled' });
  });
}

test('an unknown URL has a useful 404 and a route back', async ({ page }) => {
  const response = await page.goto('/lost-in-space/');
  expect(response!.status()).toBe(404);
  await expect(page.getByRole('heading', { name: 'Off the map.' })).toBeVisible();
  await page.getByRole('link', { name: 'Back to the library' }).click();
  await expect(page).toHaveURL('/library/');
});

test.describe('accessibility', () => {
  test.use({ javaScriptEnabled: true });

  for (const path of ['/', '/library/', '/about/']) {
    test(`${path} passes automated WCAG checks`, async ({ page }) => {
      await page.goto(path);
      await page.emulateMedia({ reducedMotion: 'reduce' });
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze();
      expect(results.violations).toEqual([]);
    });
  }
});
