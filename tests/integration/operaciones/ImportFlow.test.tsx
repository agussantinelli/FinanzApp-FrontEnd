import { vi, describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@/test/test-utils';
import MyOperationsPage from '@/app/operaciones/me/page';
import { server } from '@/test/msw/server';
import { http, HttpResponse } from 'msw';

// Mock navigation
vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: vi.fn(),
        back: vi.fn(),
    }),
    useSearchParams: () => new URLSearchParams(),
}));

const mockUser = { id: 1, nombre: 'Agus', rol: 'INVERSOR' };

// Mock AuthService so RoleGuard passes
vi.mock('@/services/AuthService', async (importOriginal) => {
    const original = await importOriginal<typeof import('@/services/AuthService')>();
    return {
        ...original,
        hasRole: vi.fn(() => true),
        getCurrentUser: vi.fn(() => mockUser),
    };
});

describe('ImportFlow Integration', () => {
    beforeEach(() => {
        server.use(
            http.get('*/portafolios/mis-portafolios', () => {
                return HttpResponse.json([{ id: '1', nombre: 'Cartera Principal' }]);
            }),
            http.get('*/api/operaciones/me', () => {
                return HttpResponse.json([]);
            }),
            http.post('*/api/import/analyze', () => {
                return HttpResponse.json({
                    items: [
                        { symbol: 'AAPL', cantidad: 10, precioUnitario: 150, tipoOperacion: 'Compra', fecha: '2024-03-18T10:00:00Z', isValid: true, moneda: 'USD' }
                    ],
                    canImport: true,
                    globalErrors: []
                });
            }),
            http.post('*/api/import/confirm', () => {
                return HttpResponse.json({ message: 'Importación exitosa' });
            }),
            http.get('*/api/operaciones/persona/1', () => {
                return HttpResponse.json([]);
            }),
            http.get('*/api/dolar/cotizaciones', () => {
                return HttpResponse.json([]);
            })
        );
    });

    it('should complete the full excel import flow', async () => {
        render(<MyOperationsPage />);

        // 1. Open Modal
        const importBtn = await screen.findByRole('button', { name: /Importar Excel/i });
        fireEvent.click(importBtn);

        // 2. Select file
        const input = screen.getByLabelText(/Click o arrastra tu Excel aquí/i);
        const file = new File(['dummy content'], 'test.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        
        fireEvent.change(input, { target: { files: [file] } });

        // 3. Analyze
        const analyzeBtn = screen.getByRole('button', { name: /Analizar Archivo/i });
        fireEvent.click(analyzeBtn);

        // 4. Preview and Confirm
        await waitFor(() => {
            expect(screen.getByText(/Resumen de Análisis/i)).toBeInTheDocument();
            expect(screen.getByText(/AAPL/i)).toBeInTheDocument();
        }, { timeout: 5000 });

        const confirmBtn = screen.getByRole('button', { name: /Confirmar Importación/i });
        fireEvent.click(confirmBtn);

        // 5. Success
        await waitFor(() => {
            expect(screen.getByText(/Importación Exitosa/i)).toBeInTheDocument();
        });

        fireEvent.click(screen.getByRole('button', { name: /Finalizar/i }));
        
        expect(screen.queryByText(/Importación Exitosa/i)).not.toBeInTheDocument();
    });
});
