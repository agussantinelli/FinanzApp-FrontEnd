import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AdminPortfolioView from './page';
import { useParams, useRouter } from 'next/navigation';
import { getPortafolioValuado } from '@/services/PortafolioService';
import { usePortfolioSort } from '@/hooks/usePortfolioSort';

// Mock next/navigation
vi.mock('next/navigation', () => ({
    useParams: vi.fn(),
    useRouter: vi.fn(),
}));

// Mock services
vi.mock('@/services/PortafolioService', () => ({
    getPortafolioValuado: vi.fn(),
}));

// Mock hooks
vi.mock('@/hooks/usePortfolioSort', () => ({
    usePortfolioSort: vi.fn(),
}));

// Mock components
vi.mock('@/components/auth/RoleGuard', () => ({
    RoleGuard: ({ children }: any) => <div data-testid="role-guard">{children}</div>,
}));

vi.mock('@/components/common/CurrencyToggle', () => ({
    CurrencyToggle: () => <div data-testid="currency-toggle">Currency Toggle</div>,
}));

vi.mock('@/components/portfolio/PortfolioCompositionChart', () => ({
    default: () => <div data-testid="portfolio-chart">Portfolio Chart</div>,
}));

// Mock utils
vi.mock('@/utils/format', () => ({
    formatARS: (val: number) => `$ARS ${val}`,
    formatUSD: (val: number) => `$USD ${val}`,
    formatPercentage: (val: number) => `${val}%`,
    formatQuantity: (val: number) => `${val}`,
}));

describe('AdminPortfolioView', () => {
    const mockRouter = {
        back: vi.fn(),
    };

    const mockValuacion = {
        nombre: 'Portfolio Test',
        descripcion: 'Test Description',
        totalPesos: 1000,
        totalDolares: 10,
        gananciaPesos: 100,
        gananciaDolares: 1,
        variacionPorcentajePesos: 10,
        variacionPorcentajeDolares: 10,
        nombreAutor: 'Admin User',
        rolUsuario: 'Admin',
        activos: [
            { activoId: 1, symbol: 'AAPL', cantidad: 10, precioActual: 150, precioPromedioCompra: 140, porcentajeCartera: 100 },
        ],
    };

    beforeEach(() => {
        vi.clearAllMocks();
        (useRouter as any).mockReturnValue(mockRouter);
        (useParams as any).mockReturnValue({ id: 'port-123' });
        (getPortafolioValuado as any).mockResolvedValue(mockValuacion);
        (usePortfolioSort as any).mockReturnValue({
            order: 'asc',
            orderBy: 'symbol',
            handleRequestSort: vi.fn(),
            sortedActivos: mockValuacion.activos,
        });
    });

    it('renders loading state initially', () => {
        render(<AdminPortfolioView />);
        expect(document.querySelector('.MuiSkeleton-root')).toBeDefined();
    });

    it('renders portfolio details after loading', async () => {
        render(<AdminPortfolioView />);
        
        await waitFor(() => {
            expect(screen.getByText('Portfolio Test')).toBeDefined();
            expect(screen.getByText('Vista Admin')).toBeDefined();
            expect(screen.getByTestId('portfolio-chart')).toBeDefined();
            expect(screen.getByText('AAPL')).toBeDefined();
        });
    });

    it('handles non-existent portfolio', async () => {
        (getPortafolioValuado as any).mockResolvedValue(null);
        render(<AdminPortfolioView />);

        await waitFor(() => {
            expect(screen.getByText('Portafolio no encontrado')).toBeDefined();
        });
    });

    it('calls router.back when "Volver" is clicked', async () => {
        render(<AdminPortfolioView />);
        
        await waitFor(() => screen.getByText('Volver al Panel'));
        screen.getByText('Volver al Panel').click();
        
        expect(mockRouter.back).toHaveBeenCalled();
    });
});
