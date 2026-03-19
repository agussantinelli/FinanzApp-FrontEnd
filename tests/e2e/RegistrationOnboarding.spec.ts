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
        const randomEmail = `testuser_${Date.now()}@gmail.com`;
        
        await page.getByLabel('Nombre').fill('Test');
        await page.getByLabel('Apellido').fill('User');
        await page.getByLabel('Email').fill(randomEmail);
        await page.getByLabel('Fecha de nacimiento').fill('1990-01-01');
        
        // Nacionalidad (Select de MUI)
        const nacionalidad = page.getByLabel(/Nacionalidad/i);
        await nacionalidad.click();
        await page.locator('li[role="option"]').first().click(); // Seleccionar el primero
        
        // Pais Residencia
        const pais = page.getByLabel(/País de residencia/i);
        await pais.click();
        await page.locator('li[role="option"]').filter({ hasText: /Argentina/i }).first().click();
        
        // Otros datos si aparecen (Provincia/Localidad debieran aparecer al elegir Argentina)
        await page.waitForTimeout(1000);
        if (await page.getByLabel(/Provincia/i).isVisible()) {
            await page.getByLabel(/Provincia/i).click();
            await page.locator('li[role="option"]').first().click();
            await page.waitForTimeout(500);
            await page.getByLabel(/Localidad/i).click();
            await page.locator('li[role="option"]').first().click();
        }

        await page.getByLabel(/^Contraseña$/).fill('Password123!');
        await page.getByLabel('Repetir contraseña').fill('Password123!');
        
        // Esperar al CAPTCHA (el usuario debe resolverlo en modo headed o el test fallará/bloqueará)
        const captchaSection = page.getByLabel('Sección de CAPTCHA');
        await expect(captchaSection).toBeVisible({ timeout: 15000 });
        
        // Nota: En un entorno de CI real, usaríamos una clave de test o un bypass
        // Por ahora, damos tiempo para que el usuario interactúe si es necesario
        console.log('Esperando resolución de CAPTCHA...');
        await page.waitForTimeout(2000); 

        // Submit
        await page.click('button[type="submit"]');
 
        // Verificar mensaje de éxito y redirección a Login
        // El alert de éxito puede tardar por la validación del CAPTCHA
        await expect(page.locator('.MuiAlert-message, [class*="Alert"]')).toContainText(/exitoso/i, { timeout: 45000 });
        await expect(page).toHaveURL(/\/auth\/login/, { timeout: 30000 });
        await page.waitForTimeout(1500);

        // Opcional: Probar el primer Login
        await page.fill('input[type="email"]', randomEmail);
        await page.fill('input[type="password"]', 'Password123!');
        await page.click('button[type="submit"]');
        await expect(page).toHaveURL(/\/dashboard-inversor/);
    });
});
