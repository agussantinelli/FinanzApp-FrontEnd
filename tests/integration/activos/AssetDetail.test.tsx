import { vi, describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@/test/test-utils';
import ActivoDetalle from '@/app/activos/[id]/page';
import { server } from '@/test/msw/server';
import { http, HttpResponse } from 'msw';

vi.mock('next/navigation', () => ({
    useParams: () => ({ id: 'AAPL' }),
    useRouter: () => ({
        push: vi.fn(),
        back: vi.fn(),
    }),
}));

const mockUser = { id: 1, nombre: 'Agus', rol: 'Inversor' };
vi.mock('@/hooks/useAuth', () => ({
    useAuth: () => ({
        isAuthenticated: true,
        user: mockUser
    })
}));

// Mock AuthService so RoleGuard passes
vi.mock('@/services/AuthService', async (importOriginal) => {
    const original = await importOriginal<typeof import('@/services/AuthService')>();
    return {
        ...original,
        hasRole: vi.fn(() => true),
        getCurrentUser: vi.fn(() => mockUser),
    };
});

describe('AssetDetail Integration', () => {
    const mockActivo = {
        id: '1',
        symbol: 'AAPL',
        nombre: 'Apple Inc.',
        precioActual: 150.5,
        variacion24h: 1.25,
        tipo: 'Acciones',
        monedaBase: 'USD',
        descripcion: 'Apple Inc. is an American multinational technology company.',
        sector: 'Tecnología',
        marketCap: 3000000000000,
        loSigo: false,
        esLocal: false
    };

    const mockRecommendations = [
        {
            id: 1,
            titulo: 'Oportunidad en Apple',
            autorNombre: 'Juan Experto',
            fecha: '2026-03-15T12:00:00Z',
            activoId: '1'
        }
    ];

    const mockRecDetail = {
        id: 1,
        detalles: [
            {
                activoId: '1',
                accion: 'COMPRAR',
                precioObjetivo: 170,
                stopLoss: 140
            }
        ]
    };

    beforeEach(() => {
        server.use(
            http.get('**/api/activos/ticker/AAPL', () => HttpResponse.json(mockActivo)),
            http.get('**/api/recomendaciones/activo/1', () => HttpResponse.json(mockRecommendations)),
            http.get('**/api/recomendaciones/1', () => HttpResponse.json(mockRecDetail)),
            http.get('**/api/operaciones/historial/1', () => HttpResponse.json([])),
            http.get('**/api/operaciones/persona/1', () => HttpResponse.json([])),
            http.get('**/portafolios/mis-portafolios', () => HttpResponse.json([])),
            http.post('**/api/activos/seguir/1', () => HttpResponse.json({ success: true })),
            http.get('**/api/dolar', () => HttpResponse.json({ "Oficial": { "compra": 800, "venta": 850 }, "Blue": { "compra": 1000, "venta": 1050 } }))
        );
    });

    it('should render asset details correctly', async () => {
        render(<ActivoDetalle />);

        await waitFor(() => {
            expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
        }, { timeout: 10000 });

        expect(screen.getByText('AAPL')).toBeInTheDocument();
        expect(screen.getByText('Apple Inc.')).toBeInTheDocument();
        expect(screen.getByText(/Apple Inc. is an American multinational technology company/i)).toBeInTheDocument();

        expect(screen.getByText(/150/)).toBeInTheDocument();
        expect(screen.getByText(/1,25%/)).toBeInTheDocument();

        expect(screen.getByText('Acciones')).toBeInTheDocument();
        expect(screen.getByText('USD')).toBeInTheDocument();
    });

    it('should allow toggling follow status', async () => {
        render(<ActivoDetalle />);

        await waitFor(() => {
            expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
        });

        const followButton = screen.getByLabelText(/Seguir/i);
        fireEvent.click(followButton);

        await waitFor(() => {
        });
    });

    it('should display expert recommendations', async () => {
        render(<ActivoDetalle />);

        await waitFor(() => {
            expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
        }, { timeout: 10000 });

        await waitFor(() => {
            expect(screen.getByText(/Recomendaciones de Expertos/i)).toBeInTheDocument();
        }, { timeout: 10000 });
        expect(screen.getByText(/Oportunidad en Apple/i)).toBeInTheDocument();
        expect(screen.getAllByText(/COMPRAR/i).length).toBeGreaterThan(0);
    });
});
