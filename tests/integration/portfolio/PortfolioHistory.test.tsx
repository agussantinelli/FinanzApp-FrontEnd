import { vi, describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@/test/test-utils';
import PortfolioPage from '@/app/portfolio/page';
import { server } from '@/test/msw/server';
import { http, HttpResponse } from 'msw';

// Mock navigation
vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: vi.fn(),
    }),
    useSearchParams: () => new URLSearchParams(),
}));

const mockUser = { id: 1, nombre: 'Agus', rol: 'INVERSOR' };

// Mock AuthService
vi.mock('@/services/AuthService', async (importOriginal) => {
    const original = await importOriginal<typeof import('@/services/AuthService')>();
    return {
        ...original,
        hasRole: vi.fn(() => true),
        getCurrentUser: vi.fn(() => mockUser),
    };
});

describe('PortfolioHistory Integration', () => {
    beforeEach(() => {
        server.use(
            http.get('*/portafolios/mis-portafolios', () => {
                return HttpResponse.json([
                    { id: '1', nombre: 'Cartera Principal' }
                ]);
            }),
            http.get('*/portafolios/1', () => {
                return HttpResponse.json({
                    id: '1',
                    nombre: 'Cartera Principal',
                    totalPesos: 1500000,
                    totalDolares: 1500,
                    activos: [
                        { symbol: 'AAPL', cantidad: 10, valorizadoNativo: 1500, porcentajeCartera: 100 }
                    ]
                });
            }),
            http.get('*/portafolios/1/evolucion', () => {
                return HttpResponse.json([
                    { fecha: '2024-03-01', valorTotal: 1000 },
                    { fecha: '2024-03-18', valorTotal: 1200 }
                ]);
            })
        );
    });

    it('should load portfolio details and renders composition section', async () => {
        render(<PortfolioPage />);
        
        await waitFor(() => {
            expect(screen.getByText(/Distribución de Activos/i)).toBeInTheDocument();
            expect(screen.getByText(/AAPL/i)).toBeInTheDocument();
        });
    });
});
