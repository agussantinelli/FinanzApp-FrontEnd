import { test, expect } from '@playwright/test';

test.describe('Operaciones con Activos Locales', () => {
    // test.setTimeout(120000); // Removido para usar timeout global de 60s

    test.beforeEach(async ({ page }) => {
        await page.goto('/auth/login');
        await page.fill('input[type="email"]', 'agus@gmail.com');
        await page.fill('input[type="password"]', 'agus');
        await page.click('button[type="submit"]');
        await page.waitForTimeout(1500);
        await page.goto('/registrar-operacion');
        // Esperar a que el loader desaparezca
        await expect(page.locator('.NeonLoader')).not.toBeVisible({ timeout: 20000 });
    });

    test('Compra de un CEDEAR (AAPL.BA) con pesos', async ({ page }) => {
        // Seleccionar activo
        const combo = page.locator('input[role="combobox"]');
        await combo.click();
        await combo.fill('AAPL.BA');
        const option = page.locator('li').filter({ hasText: 'AAPL.BA' }).first();
        await expect(option).toBeVisible({ timeout: 15000 });
        await option.click({ force: true });

        // Completar datos
        await page.fill('input[name="cantidad"]', '10');
        await page.fill('input[name="precio"]', '50000'); // Precio ficticio en ARS

        // Verificar que detecta ARS (opcional si hay UI de moneda)

        // Confirmar
        await page.click('button:has-text("Confirmar"), button:has-text("Aceptar")');
        await page.waitForTimeout(1500);

        // Verificar redirección y presencia en portafolio
        await expect(page).toHaveURL(/\/portfolio/, { timeout: 30000 });
        await expect(page.locator('table')).toContainText('AAPL', { timeout: 15000 });
    });

    test('Navegación a Detalle de Activo desde Buscador', async ({ page }) => {
        await page.goto('/activos');
        await page.fill('input[placeholder*="buscar" i]', 'Aluar');
        await page.keyboard.press('Enter');

        const row = page.locator('tr').filter({ hasText: 'ALUA' }).first();
        await expect(row).toBeVisible();
        await row.locator('a:has-text("Ver Detalles"), button:has-text("Ver Detalles")').click();

        await expect(page).toHaveURL(/\/activos\/.+/, { timeout: 30000 });
        await expect(page.locator('h1, h2, h3, h4')).toContainText(/Aluar/i, { timeout: 15000 });
    });
});
