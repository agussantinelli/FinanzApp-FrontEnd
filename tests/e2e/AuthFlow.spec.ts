import { test, expect } from '@playwright/test';

test.describe('Autenticación y Sesión', () => {
    test.setTimeout(60000);

    test('Login Exitoso, Logout y Persistencia', async ({ page }) => {
        await page.goto('/auth/login');
        
        // Login
        await page.fill('input[type="email"]', 'agus@gmail.com');
        await page.fill('input[type="password"]', 'agus');
        await page.click('button[type="submit"]');

        await page.waitForTimeout(1500);

        // Verificar redirección al dashboard
        await expect(page).toHaveURL(/\/dashboard-inversor/, { timeout: 30000 });
        await expect(page.getByRole('heading', { name: /Hola/i })).toBeVisible();

        await page.waitForTimeout(1500);

        // Logout
        // Abrir menú de usuario (puede ser un botón con el nombre o ícono)
        const userMenu = page.locator('button').filter({ hasText: /Agustín/i }).or(page.locator('button[aria-label*="perfil" i]')).first();
        await userMenu.click();
        
        await page.waitForTimeout(1000);

        const logoutBtn = page.locator('li').filter({ hasText: /Cerrar Sesión/i }).or(page.locator('button:has-text("Cerrar Sesión")')).first();
        await logoutBtn.click();

        await page.waitForTimeout(1500);

        // Verificar redirección a login
        await expect(page).toHaveURL(/\/auth\/login/, { timeout: 30000 });
    });

    test('Manejo de Credenciales Inválidas', async ({ page }) => {
        await page.goto('/auth/login');
        
        await page.fill('input[type="email"]', 'incorrecto@gmail.com');
        await page.fill('input[type="password"]', '123456');
        await page.click('button[type="submit"]');

        // Verificar mensaje de error
        await expect(page.locator('.MuiAlert-message, [role="alert"]')).toBeVisible();
        await expect(page).toHaveURL(/\/auth\/login/);
    });

    test('Protección de Rutas para No Autenticados', async ({ page }) => {
        await page.goto('/portfolio');
        // Debería redirigir a login o mostrar acceso denegado
        await expect(page).toHaveURL(/\/auth\/login/);
    });
});
