import { test, expect } from '@playwright/test';

test.describe('Panel de Administración (Admin)', () => {
    test.setTimeout(90000);

    test('Acceso denegado para Inversores', async ({ page }) => {
        await page.goto('/auth/login');
        await page.fill('input[type="email"]', 'agus@gmail.com'); // Usuario Inversor
        await page.fill('input[type="password"]', 'agus');
        await page.click('button[type="submit"]');
        
        // Esperar a estar logueado (redirección al dashboard de inversor)
        await expect(page).toHaveURL(/\/dashboard-inversor/, { timeout: 30000 });
        await page.waitForTimeout(1500);
        
        await page.goto('/dashboard-admin');
        await page.waitForTimeout(1500);
        await expect(page).toHaveURL(/\/access-denied/, { timeout: 30000 });
    });

    test('Gestión de Usuarios como Administrador', async ({ page }) => {
        await page.goto('/auth/login');
        await page.fill('input[type="email"]', 'admin@gmail.com'); // Seed Data
        await page.fill('input[type="password"]', 'admin');
        await page.click('button[type="submit"]');

        await page.waitForTimeout(1500);
        await expect(page).toHaveURL(/\/dashboard-admin/, { timeout: 30000 });
        await page.waitForTimeout(1500);
        
        // Verificar tabla de usuarios
        await expect(page.locator('table')).toBeVisible();
        await expect(page.locator('tr').first()).toBeVisible();
        const count = await page.locator('tr').count();
        expect(count).toBeGreaterThan(1);

        // Cambiar rol de un usuario (flujo básico)
        const editBtn = page.locator('button[aria-label*="editar" i]').first();
        await editBtn.click();
        
        const roleSelect = page.locator('div[role="combobox"], #role-select');
        await roleSelect.click();
        await page.locator('li:has-text("EXPERTO")').click();
        
        await page.click('button:has-text("Guardar")');
        await expect(page.locator('.MuiAlert-message')).toContainText(/exitosamente/i);
    });
});
