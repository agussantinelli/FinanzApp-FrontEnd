import { test, expect } from '@playwright/test';

test.describe('Operaciones con Activos Locales', () => {
    test.setTimeout(120000);

    test.beforeEach(async ({ page }) => {
        await page.goto('/auth/login');
        await page.fill('input[type="email"]', 'agus@gmail.com');
        await page.fill('input[type="password"]', 'agus');
        await page.click('button[type="submit"]');
        await page.goto('/registrar-operacion');
    });

    test('Compra de un CEDEAR (AAPL) con pesos', async ({ page }) => {
        // Seleccionar activo
        const combo = page.locator('input[role="combobox"]');
        await combo.fill('AAPL');
        const option = page.locator('li').filter({ hasText: 'AAPL' }).first();
        await expect(option).toBeVisible();
        await option.click();

        // Completar datos
        await page.fill('input[name="cantidad"]', '10');
        await page.fill('input[name="precio"]', '50000'); // Precio ficticio en ARS
        
        // Verificar que detecta ARS (opcional si hay UI de moneda)
        
        // Confirmar
        await page.click('button:has-text("Confirmar")');

        // Verificar redirección y presencia en portafolio
        await expect(page).toHaveURL(/\/portfolio/);
        await expect(page.locator('table')).toContainText('AAPL');
    });

    test('Navegación a Detalle de Activo desde Buscador', async ({ page }) => {
        await page.goto('/activos');
        await page.fill('input[placeholder*="buscar" i]', 'Aluar');
        await page.keyboard.press('Enter');
        
        const row = page.locator('tr').filter({ hasText: 'ALUA' }).first();
        await expect(row).toBeVisible();
        await row.click();

        await expect(page).toHaveURL(/\/activos\/\d+/);
        await expect(page.locator('h4')).toContainText(/Aluar/i);
    });
});
