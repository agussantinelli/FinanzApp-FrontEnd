import { test, expect } from '@playwright/test';

test.describe('Gestión de Portafolios (CRUD)', () => {
    // test.setTimeout(90000); // Usar global 60s

    test.beforeEach(async ({ page }) => {
        await page.goto('/auth/login');
        await page.fill('input[type="email"]', 'agus@gmail.com');
        await page.fill('input[type="password"]', 'agus');
        await page.click('button[type="submit"]');
        await page.waitForTimeout(1500);
        await expect(page).toHaveURL(/\/dashboard-inversor/, { timeout: 30000 });
        await page.goto('/portfolio');
        // Esperar a que el loader desaparezca
        await expect(page.locator('.NeonLoader')).not.toBeVisible({ timeout: 20000 });
    });

    test('Crear, Editar y Borrar un Portafolio', async ({ page }) => {
        const portfolioName = `Portfolio E2E ${Date.now()}`;
        const editedName = `${portfolioName} EDIT`;

        // Crear
        await page.click('button[aria-label="Nuevo portafolio"], button:has-text("Crear Nuevo Portafolio")');
        await page.getByLabel('Nombre').fill(portfolioName);
        await page.getByLabel('Descripción (Opcional)').fill('Creado por test E2E');
        await page.click('button:has-text("Crear")');
        await page.waitForTimeout(2500);

        // Cambiar al nuevo portafolio si no se seleccionó automáticamente
        await page.click('button[aria-label="Cambiar de portafolio"]');
        await page.waitForTimeout(1000);
        await page.click(`text=${portfolioName}`);
        await page.waitForTimeout(2000);

        // Verificar creación - Usar clase específica para evitar colisión con Navbar/Cards
        await expect(page.locator('[class*="headerTitle"]').first()).toContainText(portfolioName);

        // Editar
        await page.click('button[aria-label="Editar portafolio"]');
        await page.getByLabel('Nombre').fill(editedName);
        await page.click('button:has-text("Guardar Cambios")');
        await page.waitForTimeout(2000);

        // Verificar edición
        await expect(page.locator('[class*="headerTitle"]').first()).toContainText(editedName);

        // Borrar - Está dentro del diálogo de edición
        await page.click('button[aria-label="Editar portafolio"]');
        await page.click('button[aria-label="Eliminar portafolio"]');
        await page.click('button[aria-label="Confirmar eliminación de portafolio"]');
        
        // Verificar mensaje de éxito
        await expect(page.locator('text=Portafolio Borrado Correctamente')).toBeVisible({ timeout: 10000 });
        await page.waitForTimeout(2000);

        // Verificar que ya no está el nombre editado
        await expect(page.locator('[class*="headerTitle"]').first()).not.toContainText(editedName);
    });
});
