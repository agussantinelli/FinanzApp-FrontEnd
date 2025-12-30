import { test, expect } from '@playwright/test';

test('Flujo Completo: Login -> Inversor -> Portafolio -> Comprar BTC', async ({ page }) => {
    test.setTimeout(180000);

    await page.goto('/auth/login');

    await page.fill('input[type="email"]', 'agus@gmail.com');
    await page.fill('input[type="password"]', 'agus');

    const loginResponsePromise = page.waitForResponse(response =>
        response.url().includes('/auth/login') && response.request().method() === 'POST'
    );

    await page.click('button[type="submit"]');

    const loginResponse = await loginResponsePromise;

    if (!loginResponse.ok()) {
        console.log('Login failed with status:', loginResponse.status());
    }

    await expect(page).toHaveURL(/\/dashboard-inversor/);

    const portfolioLink = page.getByRole('link', { name: /Portafolio/i }).first();
    await expect(portfolioLink).toBeVisible({ timeout: 150000 });
    await portfolioLink.click();

    await expect(page).toHaveURL(/\/portfolio/);

    const registrarBtn = page.getByRole('button', { name: /Registrar Operación/i });
    await expect(registrarBtn).toBeVisible({ timeout: 150000 });
    await registrarBtn.click();

    await expect(page).toHaveURL(/\/registrar-operacion/, { timeout: 15000 });

    const combo = page.locator('input[role="combobox"]');
    await expect(combo).toBeVisible({ timeout: 1500000 });
    await combo.click();
    await combo.fill('BTC');

    const btcOption = page.locator('li').filter({ hasText: 'BTC' }).filter({ hasText: 'Bitcoin' }).first();
    await expect(btcOption).toBeVisible({ timeout: 15000 });
    await btcOption.click({ force: true });

    await page.getByLabel('Cantidad Nominal').fill('0.0005');

    await page.getByRole('button', { name: /Confirmar Operación/i }).click();

    await expect(page).toHaveURL(/\/portfolio/, { timeout: 20000 });

    await page.waitForTimeout(10000);
});
