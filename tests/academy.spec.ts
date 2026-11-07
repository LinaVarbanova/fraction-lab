import { test, expect } from '@playwright/test';
test('four interactive discoveries, exact feedback and persisted progress', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await page.getByRole('button', { name: 'Влез в академията' }).click();
  for (let i = 0; i < 3; i++) await page.getByRole('button', { name: 'Повече части' }).click();
  for (let i = 1; i <= 3; i++) await page.getByRole('button', { name: `Част ${i} от 4`, exact: true }).click();
  await expect(page.locator('.feedback')).toContainText('Точно така');
  await expect(page.getByRole('progressbar')).toHaveAttribute('value', '1');
  await page.getByRole('button', { name: 'Следва: Равни дроби' }).click();
  await page.getByLabel('Раздели всяка част на').fill('3');
  await expect(page.locator('.feedback')).toContainText('същото количество');
  await expect(page.getByRole('group', { name: '6 от 9 части' }).locator('.filled')).toHaveCount(6);
  await page.getByRole('button', { name: 'Следва: Числова ос' }).click();
  const slider = page.getByRole('slider', { name: 'Позиция на дробта' });
  await slider.focus();
  await slider.press('ArrowRight');
  await page.getByRole('button', { name: 'Провери позицията' }).click();
  await expect(page.locator('.feedback')).toContainText('Опитай пак');
  for (let i = 0; i < 3; i++) await slider.press('ArrowRight');
  await page.getByRole('button', { name: 'Провери позицията' }).click();
  await expect(page.locator('.feedback')).toContainText('точното място');
  await page.getByRole('button', { name: 'Следва: Общ знаменател' }).click();
  await page.getByLabel('Общ знаменател', { exact: true }).fill('24');
  await page.getByRole('button', { name: 'Провери', exact: true }).click();
  await expect(page.locator('.feedback')).toContainText('по-малък');
  await page.getByLabel('Общ знаменател', { exact: true }).fill('12');
  await page.getByRole('button', { name: 'Провери', exact: true }).click();
  await expect(page.locator('.feedback')).toContainText('еднакви части');
  await expect(page.getByRole('progressbar')).toHaveAttribute('value', '4');
  await expect(page.getByText('100 XP', { exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('progressbar')).toHaveAttribute('value', '4');
  await page.getByRole('button', { name: 'Карта на уменията' }).click();
  await expect(page.locator('.skill-number.done')).toHaveCount(4);
  expect(errors).toEqual([]);
});
test('number line supports pointer dragging', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('tab', { name: '03 Числова ос' }).click();
  const track = page.locator('.number-track');
  const box = (await track.boundingBox())!;
  await page.mouse.move(box.x + box.width / 4, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * 0.75, box.y + box.height / 2, { steps: 10 });
  await page.mouse.up();
  await expect(page.getByRole('slider', { name: 'Позиция на дробта' })).toHaveAttribute('aria-valuenow', '6');
  await page.getByRole('button', { name: 'Провери позицията' }).click();
  await expect(page.locator('.feedback')).toContainText('точното място');
});
for (const viewport of [{ width: 1440, height: 1000 }, { width: 1024, height: 768 }, { width: 768, height: 1024 }, { width: 390, height: 844 }]) {
  test(`responsive academy ${viewport.width}, reduced motion`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Големи открития');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    for (const id of ['split', 'equivalence', 'line', 'common']) {
      await page.locator(`#tab-${id}`).click();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    }
    await page.evaluate(() => { (document.activeElement as HTMLElement)?.blur(); window.scrollTo(0, 0); });
    await page.screenshot({ path: `test-results/academy-${viewport.width}.png`, fullPage: true });
  });
}
test('corrupt saved data does not break startup', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('fraction-lab-stage-a-v1', '{invalid'));
  await page.goto('/');
  await expect(page.getByRole('progressbar')).toHaveAttribute('value', '0');
});
