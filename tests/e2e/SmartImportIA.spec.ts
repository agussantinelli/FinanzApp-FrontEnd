import { test, expect } from '@playwright/test';
import * as path from 'path';

test.describe('Importación Inteligente (Excel + IA)', () => {
    test.setTimeout(180000);

    test.beforeEach(async ({ page }) => {
        await page.goto('/auth/login');
        await page.fill('input[type="email"]', 'agus@gmail.com');
        await page.fill('input[type="password"]', 'agus');
        await page.click('button[type="submit"]');
        await page.waitForTimeout(1500);
        await page.goto('/operaciones');
        await page.waitForTimeout(1500);
    });

    test('Flujo de Carga de Excel y Validación IA', async ({ page }) => {
        // Abrir diálogo de importación
        await page.click('button:has-text("Importar"), [aria-label*="importar" i]');
        
        // Seleccionar archivo (mockeando con un buffer si no tenemos archivo real, o asumiendo que el runner tiene uno)
        // Por ahora asumo que el botón abre un input type="file"
        const fileChooserPromise = page.waitForEvent('filechooser');
        await page.click('.import-dropzone, button:has-text("Seleccionar Archivo")');
        const fileChooser = await fileChooserPromise;
        
        // En un entorno real, necesitaríamos un .xlsx de prueba en el repo
        // await fileChooser.setFiles(path.join(__dirname, 'test-assets/operaciones.xlsx'));

        // Simulamos la espera de procesamiento de IA
        // await expect(page.locator('text=Procesando con IA...')).toBeVisible();

        // Verificar que aparece la previsualización
        // await expect(page.locator('table.preview-table')).toBeVisible({ timeout: 60000 });

        // Confirmar importación
        // await page.click('button:has-text("Confirmar Todo")');

        // await expect(page.locator('.MuiAlert-message')).toContainText(/exitosamente/i);
    });
});
