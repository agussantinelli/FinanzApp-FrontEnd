import { test, expect } from '@playwright/test';

test('Flujo Completo: Login -> Inversor -> Portafolio -> Comprar BTC', async ({ page }) => {
    test.setTimeout(1200000);
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
    await expect(portfolioLink).toBeVisible();
    await portfolioLink.click();

    await expect(page).toHaveURL(/\/portfolio/);

    // 4. Click "Registrar Operación" (Button in Portfolio Header - Green, Top Right)
    // Wait for the button to be attached and visible
    const registrarBtn = page.getByRole('button', { name: /Registrar Operación/i });
    await expect(registrarBtn).toBeVisible({ timeout: 1500000 });
    await registrarBtn.click();

    await expect(page).toHaveURL(/\/registrar-operacion/, { timeout: 15000 });

    // 5. Select Asset (Search "BTC" and select "Bitcoin")
    // Wait for the combobox to appear
    const combo = page.locator('input[role="combobox"]');
    await expect(combo).toBeVisible({ timeout: 1500000 });
    await combo.click();
    await combo.fill('BTC');

    // Wait for options dropdown
    const bitcoinOption = page.locator('li', { hasText: 'Bitcoin' }).first();
    await expect(bitcoinOption).toBeVisible({ timeout: 1500000 });
    await bitcoinOption.click();

    // 6. Enter Quantity
    // "que compre 0.005 en cantidad"
    await page.fill('input[name="cantidad"]', '0.005');

    // 7. Ensure "Compra" is selected (Default usually, but verify)
    // If there's a toggle:
    // await page.click('button:has-text("Compra")'); 

    // 8. Confirm
    await page.click('button[type="submit"]');

    // 9. Return to Portfolio (Redirects automatically or via link)
    // Expect redirect to portfolio or success message then redirect
    await expect(page).toHaveURL(/\/portfolio/, { timeout: 20000 });
});
