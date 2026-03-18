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
        
        // IR A LA TAB DE USUARIOS
        const usersTab = page.getByRole('tab', { name: /Usuarios/i });
        await usersTab.click();
        await page.waitForTimeout(1500);

        // Esperar a que el skeleton desaparezca si existe
        await expect(page.locator('.MuiSkeleton-root')).not.toBeVisible({ timeout: 20000 });

        // Verificar tabla de usuarios
        const table = page.locator('table');
        await expect(table).toBeVisible({ timeout: 20000 });
        
        const row = page.locator('tr').filter({ hasText: '@gmail.com' }).first();
        await expect(row).toBeVisible();

        // Cambiar rol de un usuario (Ascender a experto)
        const ascendBtn = row.locator('button[title*="Ascender" i]');
        if (await ascendBtn.isVisible()) {
            await ascendBtn.click();
            await page.waitForTimeout(1000);
            await page.click('button:has-text("Confirmar")');
            await page.waitForTimeout(1500);
            await expect(page.locator('.MuiAlert-message')).toContainText(/exitosamente/i);
        }
    });
});
