import { test, expect } from '@playwright/test';

test.describe('Asistente Financiero (FinanzAI)', () => {
    // test.setTimeout(120000); // Removido para usar timeout global de 60s

    test.beforeEach(async ({ page }) => {
        await page.goto('/auth/login');
        await page.fill('input[type="email"]', 'agus@gmail.com');
        await page.fill('input[type="password"]', 'agus');
        await page.click('button[type="submit"]');
        await page.waitForTimeout(1500);
    });

    test('Consulta y Respuesta con Streaming en Chatbot', async ({ page }) => {
        // Abrir Chatbot
        const chatFab = page.locator('button[aria-label="Abrir asistente IA"], .finanz-ai-fab').first();
        await expect(chatFab).toBeVisible({ timeout: 30000 });
        await page.waitForTimeout(2000); // Dar tiempo a la animación
        await chatFab.click();

        // Enviar Mensaje
        const input = page.locator('textarea[placeholder*="consulta" i], textarea[placeholder*="Escribe" i]').first();
        await expect(input).toBeVisible();
        await input.fill('¿Cómo está el mercado hoy?');
        await page.keyboard.press('Enter');

        // Verificar que aparece el mensaje del usuario
        await expect(page.locator('[class*="userMessage"]')).toContainText('Cómo está el mercado hoy');

        // Verificar respuesta de IA (Streaming/Loading)
        const aiMessage = page.locator('.message-ai, [class*="aiMessage"]').last();
        // Esperar a que el indicador de carga desaparezca si existe
        await expect(page.locator('.TypingIndicator, [class*="TypingIndicator"]').first()).not.toBeVisible({ timeout: 45000 });
        await expect(aiMessage).toBeVisible({ timeout: 15000 });

        // Verificar que la respuesta tiene contenido (no está vacía)
        await expect(async () => {
            const text = await aiMessage.innerText();
            expect(text.length).toBeGreaterThan(10);
        }).toPass({ timeout: 10000 });
    });
});
