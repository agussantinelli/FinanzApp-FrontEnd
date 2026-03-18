import { vi, describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor, within } from '@/test/test-utils';
import PortfolioPage from '@/app/portfolio/page';
import { server } from '@/test/msw/server';
import { http, HttpResponse } from 'msw';

// Mock routing
vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: vi.fn(),
        back: vi.fn(),
        replace: vi.fn(),
    }),
    useSearchParams: () => ({
        get: vi.fn((key) => {
            if (key === 'id') return 'P-123';
            return null;
        })
    }),
    useParams: () => ({ id: 'P-123' }),
    usePathname: () => '/portfolio',
}));

// Mock useAuth
vi.mock('@/hooks/useAuth', () => ({
    useAuth: () => ({
        user: { id: 1, nombre: 'Agus', rol: 'Inversor' },
        isAuthenticated: true,
        loading: false
    })
}));

// Mock NeonLoader
vi.mock('@/components/ui/NeonLoader', () => ({
    default: ({ message }: { message: string }) => <div data-testid="neon-loader">{message}</div>
}));

describe('PortfolioValuation Integration', () => {
    const mockPortfolios = [
        { id: 'P-123', nombre: 'Cartera Principal', idUsuario: 1 }
    ];

    const mockValuation = {
        id: 'P-123', // Added ID to match isOwner logic
        nombre: 'Cartera Principal',
        totalPesos: 1500000,
        totalDolares: 1500,
        gananciaPesos: 150000,
        gananciaDolares: 150,
        variacionPorcentajePesos: 11.1,
        variacionPorcentajeDolares: 11.1,
        activos: [
            { 
                activoId: 'AAPL', // Match ActivoId in the component
                symbol: 'AAPL', 
                cantidad: 10, 
                precioActual: 150, 
                precioPromedioCompra: 135,
                valorizadoDolares: 1500, 
                porcentajeCartera: 100,
                tipoActivo: 'Acciones',
                moneda: 'USD'
            }
        ]
    };

    beforeEach(() => {
        server.use(
            http.get('**/portafolios/mis-portafolios', () => HttpResponse.json(mockPortfolios)),
            http.get('**/portafolios/P-123', () => HttpResponse.json(mockValuation))
        );
    });

    it('should render portfolio details with valuation data', async () => {
        render(<PortfolioPage />);

        // Wait for data to load (looking for the portfolio name)
        await screen.findByText(/Cartera Principal/i, {}, { timeout: 10000 });

        // Check for total values (flexible for formatting variations)
        expect(screen.getByText(/1[.,]500[.,]000/)).toBeInTheDocument();
        expect(screen.getByText(/1[.,]500/)).toBeInTheDocument();

        // Check for performance %
        expect(screen.getByText(/11[.,]1%/)).toBeInTheDocument();

        // Check for asset in table
        try {
            const assetRow = await screen.findByText('AAPL');
            const row = assetRow.closest('tr');
            expect(within(row!).getByText(/10[.,]00/)).toBeInTheDocument(); // Quantity (formatted)
        } catch (e) {
            screen.debug();
            throw e;
        }
    });

    it('should show empty state if no portfolios exist', async () => {
        server.use(
            http.get('**/portafolios/mis-portafolios', () => HttpResponse.json([]))
        );

        render(<PortfolioPage />);

        // This text is shown when portfolios list is empty
        await screen.findByText(/Tu portafolio está vacío/i, {}, { timeout: 10000 });
    });

    it('should show message if the specific portfolio has no assets', async () => {
        server.use(
            http.get('**/portafolios/P-123', () => HttpResponse.json({
                ...mockValuation,
                activos: [],
                totalPesos: 0,
                totalDolares: 0
            }))
        );

        render(<PortfolioPage />);

        await screen.findByText(/Aún no tienes activos en este portafolio/i, {}, { timeout: 10000 });
    });
});
