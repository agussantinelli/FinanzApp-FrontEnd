import { test, expect } from '@playwright/test';

test('Flujo Completo: Login -> Inversor -> Portafolio -> Comprar BTC', async ({ page }) => {
    test.setTimeout(180000); // 3 minutes max
    // 1. Login
    await page.goto('/auth/login');

    // Credentials from README
    await page.fill('input[type="email"]', 'agus@gmail.com');
    await page.fill('input[type="password"]', 'agus');

    // Start waiting for response before clicking.
    const loginResponsePromise = page.waitForResponse(response =>
        response.url().includes('/auth/login') && response.request().method() === 'POST'
    );

    await page.click('button[type="submit"]');

    const loginResponse = await loginResponsePromise;

    if (!loginResponse.ok()) {
        console.log('Login failed with status:', loginResponse.status());
        // Optional: Fail test immediately with clear message
        // throw new Error(`Login failed with status ${ loginResponse.status() } `);
    }

    // 2. Dashboard Inversor
    await expect(page).toHaveURL(/\/dashboard-inversor/);

    // 3. Navigate to Portafolio
    // Iterate to find the link, sometimes it takes a bit to appear in navbar
    const portfolioLink = page.getByRole('link', { name: /Portafolio/i }).first();
    await expect(portfolioLink).toBeVisible({ timeout: 150000 });
    await portfolioLink.click();

    await expect(page).toHaveURL(/\/portfolio/);

    // 4. Click "Registrar Operación" (Button in Portfolio Header - Green, Top Right)
    // Wait for the button to be attached and visible
    const registrarBtn = page.getByRole('button', { name: /Registrar Operación/i });
    await expect(registrarBtn).toBeVisible({ timeout: 150000 });
    await registrarBtn.click();

    await expect(page).toHaveURL(/\/registrar-operacion/, { timeout: 15000 });

    // 5. Select Asset: BTC (Ticker) + Bitcoin (Name)
    // Wait for the combobox to appear
    const combo = page.locator('input[role="combobox"]');
    await expect(combo).toBeVisible({ timeout: 1500000 });
    await combo.click();
    await combo.fill('BTC');

    // Wait for the specific option complying with user requirement: Ticker BTC + Name Bitcoin
    // Using filter to ensure we get the item that has BOTH "BTC" and "Bitcoin"
    const btcOption = page.locator('li').filter({ hasText: 'BTC' }).filter({ hasText: 'Bitcoin' }).first();
    await expect(btcOption).toBeVisible({ timeout: 15000 });
    await btcOption.click({ force: true });

    // 6. Enter Quantity: 0.0005
    // Use getByLabel because MUI Textfield label is "Cantidad Nominal"
    await page.getByLabel('Cantidad Nominal').fill('0.0005');

    // 7. Confirm
    await page.getByRole('button', { name: /Confirmar Operación/i }).click();

    // 8. Return to Portfolio
    await expect(page).toHaveURL(/\/portfolio/, { timeout: 20000 });

    // 9. Stay for 10 seconds
    await page.waitForTimeout(10000);
});
