import { test, expect } from '@playwright/test';

test.describe('Autenticación y Sesión', () => {
    test.setTimeout(60000);

    test('Login Exitoso, Logout y Persistencia', async ({ page }) => {
        await page.goto('/auth/login');
        
        // Login
        await page.fill('input[type="email"]', 'agus@gmail.com');
        await page.fill('input[type="password"]', 'agus');
        await page.click('button[type="submit"]');

        // Verificar redirección al dashboard
        await expect(page).toHaveURL(/\/dashboard-inversor/);
        await expect(page.locator('h4')).toContainText(/Hola/i);

        // Logout
        await page.click('button[aria-label*="perfil" i], button:has-text("Perfil"), .user-menu-trigger'); // Intentar encontrar el menú de usuario
        await page.click('li:has-text("Cerrar Sesión"), button:has-text("Cerrar Sesión"), [data-testid="logout-button"]');

        // Verificar redirección a login
        await expect(page).toHaveURL(/\/auth\/login/);
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
