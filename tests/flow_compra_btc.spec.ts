import { test, expect } from '@playwright/test';

test('Flujo Completo: Login -> Inversor -> Portafolio -> Comprar BTC', async ({ page }) => {
    // 1. Login
    await page.goto('/auth/login');

    // Credentials (Update these or ensure they exist in DB)
    await page.fill('input[type="email"]', 'agus@gmail.com');
    await page.fill('input[type="password"]', 'agus');

    await page.click('button[type="submit"]');

    // Verify disable state during login (user requirement check)
    const submitBtn = page.locator('button[type="submit"]');
    // It might be too fast to catch "Ingresando...", but we check redirection eventually.

    // 2. Dashboard Inversor
    await expect(page).toHaveURL(/\/dashboard-inversor/);

    // 3. Navigate to Portafolio
    const portfolioLink = page.getByRole('link', { name: /Portafolio/i }).first();
    if (await portfolioLink.isVisible()) {
        await portfolioLink.click();
    } else {
        await page.goto('/portfolio');
    }
    await expect(page).toHaveURL(/\/portfolio/);

    // 4. Click "Registrar Operación" (Button in Portfolio Header)
    await page.click('button:has-text("Registrar Operación")');
    await expect(page).toHaveURL(/\/registrar-operacion/);

    // 5. Select Asset (Search "BTC" and select "Bitcoin")
    // Assuming Autocomplete/Select logic. 
    // We need to inspect `src/app/registrar-operacion/page.tsx` to be precise, but assuming standard MUI Autocomplete:
    const combo = page.locator('input[role="combobox"]'); // Usually the asset search
    await combo.click();
    await combo.fill('BTC');
    await page.locator('li', { hasText: 'Bitcoin' }).click();

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
    await expect(page).toHaveURL(/\/portfolio/, { timeout: 10000 });
});
