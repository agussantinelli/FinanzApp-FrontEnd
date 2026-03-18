import { vi, describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent, within } from '@/test/test-utils';
import RegistrarOperacionPage from '@/app/registrar-operacion/page';
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

// Mock useAuth
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

describe('PerformOperation Integration', () => {
    const mockActivo = {
        id: '1',
        symbol: 'AAPL',
        nombre: 'Apple Inc.',
        precioActual: 150.5,
        tipo: 'Acciones',
        monedaBase: 'USD'
    };

    const mockPortfolios = [
        { id: 'P-1', nombre: 'Mi Cartera' }
    ];

    const mockPortfolioValuation = {
        id: 'P-1',
        nombre: 'Mi Cartera',
        activos: [],
        totalPesos: 0,
        totalDolares: 0
    };

    beforeEach(() => {
        server.use(
            http.get('**/api/activos/buscar', () => HttpResponse.json([mockActivo])),
            http.get('**/api/portafolios/mis-portafolios', () => HttpResponse.json(mockPortfolios)),
            http.get('**/api/portafolios/P-1', () => HttpResponse.json(mockPortfolioValuation)),
            http.get('**/api/operaciones/persona/1', () => HttpResponse.json([])),
            http.post('**/api/operaciones', () => HttpResponse.json({ success: true }))
        );
    });

    it('should allow searching for an asset and filling the form', async () => {
        render(<RegistrarOperacionPage />);

        // 1. Search for asset
        const autocomplete = screen.getByLabelText(/Buscar Activo/i);
        fireEvent.focus(autocomplete);
        fireEvent.change(autocomplete, { target: { value: 'AAPL' } });
        
        // Wait for suggestion and click it - the option renders symbol as bold text
        const option = await screen.findByText('AAPL', {}, { timeout: 10000 });
        fireEvent.click(option);

        // 2. Select Portfolio
        // Wait for portfolios to load and select one
        const portfolioSelect = await screen.findByLabelText(/Portafolio Destino/i);
        fireEvent.mouseDown(portfolioSelect);
        const portfolioOption = await screen.findByRole('option', { name: 'Mi Cartera' });
        fireEvent.click(portfolioOption);

        // 3. Enter Quantity
        const quantityInput = screen.getByLabelText(/Cantidad Nominal/i);
        fireEvent.change(quantityInput, { target: { value: '10' } });

        // 4. Enter Price (should be pre-filled from mockActivo.precioActual if mode is actual)
        // Wait for price to be set automatically or set it manually
        const priceInput = screen.getByLabelText(/Precio Unitario/i);
        // We verify pre-fill first
        await waitFor(() => {
            expect(priceInput).toHaveValue(150.5);
        });

        // 5. Submit
        const submitButton = screen.getByRole('button', { name: /Confirmar Operación/i });
        fireEvent.click(submitButton);

        // 6. Verify success
        await screen.findByText(/Operación registrada correctamente/i);
    });

    it('should show error when required fields are missing', async () => {
        render(<RegistrarOperacionPage />);

        const submitButton = screen.getByRole('button', { name: /Confirmar Operación/i });
        fireEvent.click(submitButton);

        await screen.findByText(/Debes seleccionar un activo/i);
    });
});
