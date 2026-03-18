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
        await page.click('button:has-text("Nuevo Portafolio"), [aria-label="Nuevo Portafolio"]');
        await page.fill('input[name="nombre"]', portfolioName);
        await page.fill('textarea[name="descripcion"]', 'Creado por test E2E');
        await page.click('button:has-text("Guardar"), button:has-text("Crear")');
        await page.waitForTimeout(1500);

        // Verificar creación
        await expect(page.locator('h5, .MuiTypography-h5')).toContainText(portfolioName);

        // Editar
        await page.click('button[aria-label*="editar" i], .edit-portfolio-btn');
        await page.fill('input[name="nombre"]', editedName);
        await page.click('button:has-text("Guardar"), button:has-text("Actualizar")');

        // Verificar edición
        await expect(page.locator('h5, .MuiTypography-h5')).toContainText(editedName);

        // Borrar
        await page.click('button[aria-label*="eliminar" i], .delete-portfolio-btn');
        await page.click('button:has-text("Confirmar"), button:has-text("Eliminar")');

        // Verificar que ya no está el nombre editado
        await expect(page.locator('h5, .MuiTypography-h5')).not.toContainText(editedName);
    });
});
