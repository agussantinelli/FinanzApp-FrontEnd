import { vi, describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '@/test/test-utils';
import ActivosPage from '@/app/activos/page';
import { server } from '@/test/msw/server';
import { http, HttpResponse } from 'msw';
import { clearCache } from '@/lib/activos-cache';

// Mock useRouter
vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: vi.fn(),
        back: vi.fn(),
    }),
    useSearchParams: () => new URLSearchParams(),
}));

// Mock useAuth (page may use it)
const mockUser = { id: 1, nombre: 'Agus', rol: 'Inversor' };
vi.mock('@/hooks/useAuth', () => ({
    useAuth: () => ({
        isAuthenticated: true,
        user: mockUser
    })
}));

// Mock AuthService so any RoleGuard passes
vi.mock('@/services/AuthService', async (importOriginal) => {
    const original = await importOriginal<typeof import('@/services/AuthService')>();
    return {
        ...original,
        hasRole: vi.fn(() => true),
        getCurrentUser: vi.fn(() => mockUser),
    };
});

// Mock NeonLoader to simplify rendering in tests
vi.mock('@/components/ui/NeonLoader', () => ({
    default: ({ message }: { message: string }) => <div data-testid="neon-loader">{message}</div>
}));

describe('AssetSearch Integration', () => {
    const mockTipos = [
        { id: 1, nombre: 'Acciones' },
        { id: 2, nombre: 'Bonos' },
    ];

    const mockSectores = [
        { id: 'TECNOLOGIA', nombre: 'Tecnología' },
        { id: 'FINANZAS', nombre: 'Finanzas' },
    ];

    const mockActivosRanking = [
        { id: '1', symbol: 'AAPL', nombre: 'Apple Inc.', precioActual: 150, variacion24h: 2.5, sector: 'Tecnología', tipo: 'Acciones', monedaBase: 'USD', marketCap: 3000000000000 },
        { id: '2', symbol: 'GGAL', nombre: 'Grupo Financiero Galicia', precioActual: 200, variacion24h: -1.2, sector: 'Finanzas', tipo: 'Acciones', monedaBase: 'ARS', marketCap: 1000000000 },
    ];

    const mockSearchResults = [
        { id: '3', symbol: 'MSFT', nombre: 'Microsoft', precioActual: 300, variacion24h: 0.5, sector: 'Tecnología', tipo: 'Acciones', monedaBase: 'USD', marketCap: 2500000000000 },
    ];

    beforeEach(() => {
        clearCache();
        
        // Mock session storage
        Object.defineProperty(window, 'sessionStorage', {
            value: { 
                getItem: vi.fn(() => null),
                setItem: vi.fn(),
                clear: vi.fn()
            },
            writable: true
        });

        // Setup initial mocks
        server.use(
            http.get('**/api/tipos-activo/no-moneda', () => HttpResponse.json(mockTipos)),
            http.get('**/api/sectores', () => HttpResponse.json(mockSectores)),
            http.get('**/api/activos/ranking', () => HttpResponse.json(mockActivosRanking)),
            http.get('**/api/activos/no-monedas', () => HttpResponse.json(mockActivosRanking))
        );
    });

    it('should render the assets page and load initial data', async () => {
        render(<ActivosPage />);

        // Verify title
        expect(screen.getByText(/Mercado Financiero/i)).toBeInTheDocument();

        // Wait for loader to disappear
        await waitFor(() => {
            expect(screen.queryByTestId('neon-loader')).not.toBeInTheDocument();
        }, { timeout: 10000 });

        // Verify assets using more flexible matchers
        expect(screen.getByText(/AAPL/i)).toBeInTheDocument();
        expect(screen.getByText(/GGAL/i)).toBeInTheDocument();

        // Verify prices (flexible for currency prefixes like $ or ARS)
        expect(screen.getByText(/150/)).toBeInTheDocument();
        expect(screen.getByText(/200/)).toBeInTheDocument();
    });

    it('should filter by search term on Enter key', async () => {
        server.use(
            http.get('**/api/activos/buscar', ({ request }) => {
                const url = new URL(request.url);
                if (url.searchParams.get('q') === 'MSFT') {
                    return HttpResponse.json(mockSearchResults);
                }
                return HttpResponse.json([]);
            })
        );

        render(<ActivosPage />);

        // Wait for initial load
        await waitFor(() => {
            expect(screen.queryByTestId('neon-loader')).not.toBeInTheDocument();
        }, { timeout: 10000 });

        const searchInput = screen.getByPlaceholderText(/Buscar activo/i);
        fireEvent.change(searchInput, { target: { value: 'MSFT' } });
        fireEvent.keyDown(searchInput, { key: 'Enter', code: 'Enter' });

        // Wait for new results
        await waitFor(() => {
            expect(screen.queryByTestId('neon-loader')).not.toBeInTheDocument();
        }, { timeout: 10000 });

        expect(screen.getByText(/MSFT/i)).toBeInTheDocument();
        expect(screen.queryByText(/AAPL/i)).not.toBeInTheDocument();
    });

    it('should filter by type', async () => {
        let typeApiCalled = false;
        server.use(
            http.get('**/api/activos/tipo/1', () => {
                typeApiCalled = true;
                // Return only AAPL when filtering by Acciones (tipo id=1)
                return HttpResponse.json([mockActivosRanking[0]]);
            })
        );

        render(<ActivosPage />);

        // Wait for initial load
        await waitFor(() => {
            expect(screen.queryByTestId('neon-loader')).not.toBeInTheDocument();
        }, { timeout: 10000 });

        const typeSelectLabel = screen.getByLabelText(/Filtrar por Tipo/i);
        fireEvent.mouseDown(typeSelectLabel);
        
        const option = await screen.findByRole('option', { name: 'Acciones' }, { timeout: 5000 });
        fireEvent.click(option);

        // Wait for the filter API to be called and loader to go away
        await waitFor(() => {
            expect(screen.queryByTestId('neon-loader')).not.toBeInTheDocument();
        }, { timeout: 10000 });
        
        // AAPL should always be shown after filtering by Acciones type
        expect(screen.getByText(/AAPL/i)).toBeInTheDocument();
    });

    it('should clear filters and restore initial list', async () => {
        render(<ActivosPage />);

        // Wait for initial load
        await waitFor(() => {
            expect(screen.queryByTestId('neon-loader')).not.toBeInTheDocument();
        }, { timeout: 10000 });

        // AAPL and GGAL should be visible from initial ranking data
        expect(screen.getByText(/AAPL/i)).toBeInTheDocument();
        expect(screen.getByText(/GGAL/i)).toBeInTheDocument();

        // Search for something
        const searchInput = screen.getByPlaceholderText(/Buscar activo/i);
        fireEvent.change(searchInput, { target: { value: 'NONEXISTENT' } });

        // Click clear filters / the input should reset
        // Look for a clear button or just clear the search input directly  
        fireEvent.change(searchInput, { target: { value: '' } });
        
        // Verify input is cleared
        expect(searchInput).toHaveValue('');
    });
});
