import { test, expect } from '@playwright/test';

test.describe('Panel de Administración (Admin)', () => {
    test.setTimeout(90000);

    test('Acceso denegado para Inversores', async ({ page }) => {
        await page.goto('/auth/login');
        await page.fill('input[type="email"]', 'agus@gmail.com'); // Usuario Inversor
        await page.fill('input[type="password"]', 'agus');
        await page.click('button[type="submit"]');
        
        await page.goto('/dashboard-admin');
        await expect(page).toHaveURL(/\/access-denied/);
    });

    test('Gestión de Usuarios como Administrador', async ({ page }) => {
        await page.goto('/auth/login');
        await page.fill('input[type="email"]', 'admin@admin.com'); // Asumimos cuenta admin existe
        await page.fill('input[type="password"]', 'admin123');
        await page.click('button[type="submit"]');

        await expect(page).toHaveURL(/\/dashboard-admin/);
        
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
