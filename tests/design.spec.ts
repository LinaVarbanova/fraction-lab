import { test, expect } from "@playwright/test";
for (const viewport of [
  { width: 1280, height: 900 },
  { width: 1024, height: 768 },
  { width: 390, height: 844 },
]) {
  test(`task is prominent and split steps respond at ${viewport.width}px`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await page.getByRole("button", { name: "Свободна лаборатория" }).click();
    const task = page.locator(".task-action");
    await expect(task).toContainText("4 равни части");
    expect(
      await task.evaluate((el) => parseFloat(getComputedStyle(el).fontSize)),
    ).toBeGreaterThanOrEqual(25);
    expect((await task.boundingBox())!.y).toBeLessThan(viewport.height / 2);
    await expect(
      page.locator('.task-steps [aria-current="step"]'),
    ).toContainText("Раздели на 4");
    for (let i = 0; i < 3; i++)
      await page.getByRole("button", { name: "Повече части" }).click();
    await expect(task).toContainText("Оцвети 3");
    await expect(
      page.locator('.task-steps [aria-current="step"]'),
    ).toContainText("Оцвети 3 части");
    const detail = (await page.locator(".task-detail").boundingBox())!;
    const target = (await page.locator(".task-target").boundingBox())!;
    expect(detail.y).toBeGreaterThanOrEqual(target.y + target.height - 1);
    for (let i = 1; i <= 3; i++)
      await page
        .getByRole("button", { name: `Част ${i} от 4`, exact: true })
        .click();
    await expect(page.locator(".feedback.success")).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.screenshot({
      path: `test-results/task-focus-${viewport.width}.png`,
      fullPage: true,
    });
  });
}
test("every mission displays a specific action and an unclipped model on mobile", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page
    .getByRole("button", { name: "Карта на уменията", exact: true })
    .click();
  const titles = await page
    .locator(".missions-skill-heading + .skills-list strong")
    .allTextContents();
  for (const title of titles) {
    await page
      .getByRole("button", { name: "Карта на уменията", exact: true })
      .click();
    await page.getByRole("button", { name: new RegExp(title) }).click();
    await expect(page.locator(".task-action")).toBeVisible();
    expect((await page.locator(".task-action").boundingBox())!.y).toBeLessThan(
      430,
    );
    const detail = (await page.locator(".task-detail").boundingBox())!;
    const target = (await page.locator(".task-target").boundingBox())!;
    expect(detail.y).toBeGreaterThanOrEqual(target.y + target.height - 1);
    await expect(
      page.getByRole("button", { name: "Провери модела" }),
    ).toBeInViewport();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
});
