import { test, expect } from '@playwright/test';

test.describe('Registro y Onboarding de Nuevo Usuario', () => {
    // test.setTimeout(90000); // Usar global 60s

    test('Flujo de Registro Completo', async ({ page }) => {
        await page.goto('/');
        // Ir a Registro desde Landing
        await page.click('a:has-text("Empezar"), a:has-text("Registrarse")');
        await expect(page).toHaveURL(/\/auth\/register/, { timeout: 20000 });
        await page.waitForTimeout(2000); // Dar tiempo a que cargue el form
        
        // Completar Formulario
        await expect(page.locator('input[name="nombre"]')).toBeVisible({ timeout: 15000 });
        const randomEmail = `testuser_${Date.now()}@gmail.com`;
        await page.fill('input[name="nombre"]', 'Test');
        await page.fill('input[name="apellido"]', 'User');
        await page.fill('input[name="email"]', randomEmail);
        await page.fill('input[name="password"]', 'Password123!');
        await page.fill('input[name="confirmPassword"]', 'Password123!');
        
        // Submit
        await page.click('button[type="submit"]');
 
        // Verificar mensaje de éxito y redirección a Login
        await expect(page.locator('.MuiAlert-message')).toContainText(/exitoso/i, { timeout: 30000 });
        await expect(page).toHaveURL(/\/auth\/login/, { timeout: 30000 });
        await page.waitForTimeout(1500);

        // Opcional: Probar el primer Login
        await page.fill('input[type="email"]', randomEmail);
        await page.fill('input[type="password"]', 'Password123!');
        await page.click('button[type="submit"]');
        await expect(page).toHaveURL(/\/dashboard-inversor/);
    });
});
