import { render, screen, fireEvent } from '@testing-library/react';
import PortfolioPage from './page';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { usePortfolioData } from '@/hooks/usePortfolioData';
import { usePortfolioSort } from '@/hooks/usePortfolioSort';

vi.mock('@/hooks/usePortfolioData');
vi.mock('@/hooks/usePortfolioSort');
vi.mock('@/components/auth/RoleGuard', () => ({
    RoleGuard: ({ children }: any) => <div>{children}</div>
}));
vi.mock('@/components/common/CurrencyToggle', () => ({
    CurrencyToggle: () => <div>CurrencyToggle</div>
}));
vi.mock('@/components/portfolio/PortfolioCompositionChart', () => ({
    default: () => <div>PortfolioCompositionChart</div>
}));
vi.mock('@/components/portfolio/PortfolioDialogs', () => ({
    CreatePortfolioDialog: () => <div>CreatePortfolioDialog</div>,
    EditPortfolioDialog: () => <div>EditPortfolioDialog</div>
}));
vi.mock('next/navigation', () => ({
    useRouter: () => ({ push: vi.fn(), back: vi.fn() }),
    useSearchParams: () => ({ get: () => null })
}));


describe('PortfolioPage', () => {
    const defaultValuacion = {
        id: '1',
        nombre: 'Main Portfolio',
        totalPesos: 100000,
        totalDolares: 100,
        gananciaPesos: 5000,
        gananciaDolares: 5,
        variacionPorcentajePesos: 5,
        variacionPorcentajeDolares: 5,
        activos: [
            { activoId: 1, symbol: 'AAPL', cantidad: 10, precioActual: 150, precioPromedioCompra: 140, porcentajeCartera: 50, moneda: 'USD' }
        ]
    };

    beforeEach(() => {
        (usePortfolioData as any).mockReturnValue({
            portfolios: [{ id: '1', nombre: 'Main Portfolio' }],
            selectedId: '1',
            valuacion: defaultValuacion,
            loading: false,
            handlePortfolioChange: vi.fn(),
            refreshPortfolios: vi.fn(),
            refresh: vi.fn()
        });
        (usePortfolioSort as any).mockReturnValue({
            order: 'asc',
            orderBy: 'symbol',
            handleRequestSort: vi.fn(),
            sortedActivos: defaultValuacion.activos
        });
    });

    it('renders portfolio details', () => {
        render(<PortfolioPage />);
        expect(screen.getByText('Main Portfolio')).toBeInTheDocument();
        expect(screen.getByText('PortfolioCompositionChart')).toBeInTheDocument();
        expect(screen.getByText('AAPL')).toBeInTheDocument();
    });

    it('shows empty state', () => {
        (usePortfolioData as any).mockReturnValue({
            portfolios: [], loading: false, valuacion: null
        });
        render(<PortfolioPage />);
        expect(screen.getByText('Tu portafolio está vacío')).toBeInTheDocument();
        expect(screen.getByText('Crear Nuevo Portafolio')).toBeInTheDocument();
    });

    it('renders owner actions', () => {
        // Valuacion ID 1 matches portfolio ID 1 -> Is Owner
        render(<PortfolioPage />);
        expect(screen.getByText('Registrar Operación')).toBeInTheDocument();
        expect(screen.getByText('Mis Operaciones')).toBeInTheDocument();
    });

    it('renders loading state', () => {
        (usePortfolioData as any).mockReturnValue({ loading: true });
        render(<PortfolioPage />);
        // Check for skeleton elements indirectly or just absence of content
        expect(screen.queryByText('Main Portfolio')).not.toBeInTheDocument();
        // Maybe check for RoleGuard presence since skeletons are inside
    });
});
