import { test, expect } from '@playwright/test';

test.describe('Panel de Administración (Admin)', () => {
    // test.setTimeout(90000); // Removido para usar timeout global de 60s

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

        // Buscar un usuario con rol Inversor para poder ascenderlo
        const inversorRow = page.locator('tr').filter({ hasText: 'Inversor' }).first();
        await expect(inversorRow).toBeVisible({ timeout: 15000 });

        // Guardar el nombre del usuario para identificarlo luego de que cambie el rol
        const firstCell = inversorRow.locator('td').first();
        const userName = await firstCell.textContent();

        // === ASCENDER a Experto ===
        const ascendBtn = inversorRow.locator('button[title*="Ascender" i]');
        await expect(ascendBtn).toBeEnabled({ timeout: 10000 });
        await ascendBtn.click();
        await page.waitForTimeout(800);
        // El ConfirmDialog usa "Aceptar" como texto de confirmación por defecto
        await page.click('button:has-text("Aceptar")');
        await page.waitForTimeout(2000);

        // === VERIFICAR que el rol cambió a Experto ===
        const updatedRow = page.locator('tr').filter({ hasText: userName?.trim() ?? '' }).first();
        await expect(updatedRow).toContainText(/Experto/i, { timeout: 15000 });

        // === DESCENDER de vuelta a Inversor ===
        const descendBtn = updatedRow.locator('button[title*="Descender" i]');
        await expect(descendBtn).toBeEnabled({ timeout: 10000 });
        await descendBtn.click();
        await page.waitForTimeout(800);
        await page.click('button:has-text("Aceptar")');
        await page.waitForTimeout(2000);

        // === VERIFICAR que el rol volvió a Inversor ===
        await expect(updatedRow).toContainText(/Inversor/i, { timeout: 15000 });
    });
});
