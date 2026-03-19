import { test, expect } from '@playwright/test';

test.describe('Operaciones con Activos Locales', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('/auth/login');
        await page.fill('input[type="email"]', 'agus@gmail.com');
        await page.fill('input[type="password"]', 'agus');
        await page.click('button[type="submit"]');
        await page.waitForTimeout(1500);
        await expect(page).toHaveURL(/\/dashboard-inversor/, { timeout: 30000 });
    });

    test('Compra de un CEDEAR (AAPL.BA) con pesos', async ({ page }) => {
        await page.goto('/registrar-operacion');

        // Esperar a que el formulario esté listo (título h4 o h1 visible)
        await expect(page.getByRole('heading', { name: /Registrar Operación/i })).toBeVisible({ timeout: 20000 });
        await page.waitForTimeout(1000);

        // === Seleccionar activo (Autocomplete) ===
        const combo = page.locator('input[role="combobox"]').first();
        await combo.click();
        await combo.fill('AAPL.BA');
        // options aparecen como <li role="option"> en el dropdown del autocomplete
        const option = page.locator('li[role="option"]').filter({ hasText: 'AAPL.BA' }).first();
        await expect(option).toBeVisible({ timeout: 15000 });
        await option.click({ force: true });
        await page.waitForTimeout(800);

        // === Completar Cantidad (MUI TextField sin name, buscar por label) ===
        const cantidadInput = page.getByLabel('Cantidad Nominal');
        await cantidadInput.click();
        await cantidadInput.fill('10');
        await page.waitForTimeout(400);

        // === Completar Precio Unitario ===
        const precioInput = page.getByLabel('Precio Unitario');
        await precioInput.click();
        await precioInput.fill('50000');
        await page.waitForTimeout(400);

        // === Confirmar Operación (el botón real dice "Confirmar Operación") ===
        const submitBtn = page.getByRole('button', { name: /Confirmar Operación/i });
        await expect(submitBtn).toBeEnabled({ timeout: 10000 });
        await submitBtn.click();

        // === Verificar éxito: primero aparece FloatingMessage, luego redirige a /portfolio ===
        // El hook hace: setSuccess("Operación registrada...") -> setTimeout 1s -> router.push("/portfolio")
        await expect(page).toHaveURL(/\/portfolio/, { timeout: 20000 });
    });

    test('Navegación a Detalle de Activo desde Buscador', async ({ page }) => {
        await page.goto('/activos');
        await page.waitForTimeout(1000);

        // Buscar usando el input del Autocomplete de activos
        const searchInput = page.locator('input[role="combobox"]').first();
        await searchInput.click();
        await searchInput.fill('Aluar');
        await page.waitForTimeout(1000);
        await page.keyboard.press('Enter');
        
        // Esperar a que el loader desaparezca si aparece y que la tabla se actualice
        await page.waitForTimeout(2000);

        // Buscar la fila por el símbolo ALUA. Al usar filter(hasText), el texto de la fila completa debe contener 'ALUA'
        const row = page.getByRole('row').filter({ hasText: 'ALUA' }).first();
        await expect(row).toBeVisible({ timeout: 15000 });
        
        // Clic en Ver Detalles dentro de esa fila
        const detailsBtn = row.getByLabel(/Ver detalles de ALUA/i);
        await expect(detailsBtn).toBeVisible({ timeout: 10000 });
        await detailsBtn.click();

        await expect(page).toHaveURL(/\/activos\/.+/, { timeout: 30000 });
        // Verificación robusta del símbolo y nombre
        await expect(page.locator('[class*="symbolText"]').first()).toContainText('ALUA.BA', { timeout: 15000 });
        
        // El usuario reportó que no "toca el botón de comprar"
        const buyBtn = page.locator('button:has-text("Comprar ALUA.BA"), button:has-text("Comprar")').first();
        await expect(buyBtn).toBeVisible({ timeout: 10000 });
        await buyBtn.click();
        
        // Debería ir a registrar operación
        await expect(page).toHaveURL(/\/registrar-operacion/, { timeout: 15000 });
    });
});
