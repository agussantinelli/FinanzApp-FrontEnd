import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ResumenTab from './ResumenTab';
import { useAdminStats } from '@/hooks/useAdminStats';
import { useAdminUsers } from '@/hooks/useAdminUsers';
import { useAdminPortfolios } from '@/hooks/useAdminPortfolios';

// Mock hooks
vi.mock('@/hooks/useAdminStats', () => ({
    useAdminStats: vi.fn(),
}));

vi.mock('@/hooks/useAdminUsers', () => ({
    useAdminUsers: vi.fn(),
}));

vi.mock('@/hooks/useAdminPortfolios', () => ({
    useAdminPortfolios: vi.fn(),
}));

// Mock components
vi.mock('@/components/charts/UserDistributionChart', () => ({
    default: () => <div data-testid="user-dist-chart">User Distribution Chart</div>,
}));

// Mock styles
vi.mock('../styles/Admin.module.css', () => ({
    default: {
        card: 'card',
        kpiLabel: 'kpiLabel',
        kpiValue: 'kpiValue',
        kpiChange: 'kpiChange',
        highlightCard: 'highlightCard',
        sectionPaper: 'sectionPaper',
        sectionTitle: 'sectionTitle',
        divider: 'divider',
    },
}));

describe('ResumenTab', () => {
    const mockStats = {
        totalUsuarios: 100,
        nuevosUsuariosMes: 10,
        recomendacionesPendientes: 5,
    };

    const mockPortfolioStats = {
        valorGlobalPesos: 1000000,
        valorGlobalDolares: 10000,
    };

    const mockUsers = [
        { id: '1', nombre: 'Admin User', email: 'admin@test.com', rol: 'Admin' },
        { id: '2', nombre: 'Expert User', email: 'expert@test.com', rol: 'Experto' },
    ];

    const mockPortfolios = [
        { id: 'p1', totalInvertidoUSD: 1000, totalValuadoUSD: 1100 },
    ];

    beforeEach(() => {
        vi.clearAllMocks();
        (useAdminStats as any).mockReturnValue({
            params: {
                stats: mockStats,
                portfolioStats: mockPortfolioStats,
                loading: false,
            },
        });
        (useAdminUsers as any).mockReturnValue({
            users: mockUsers,
        });
        (useAdminPortfolios as any).mockReturnValue({
            portfolios: mockPortfolios,
            loading: false,
        });
    });

    it('renders loading state', () => {
        (useAdminStats as any).mockReturnValue({
            params: { stats: null, loading: true },
        });
        render(<ResumenTab />);
        expect(document.querySelectorAll('.MuiSkeleton-root').length).toBeGreaterThan(0);
    });

    it('renders KPIs and charts correctly', () => {
        render(<ResumenTab />);
        
        expect(screen.getByText(/Total Usuarios/i)).toBeDefined();
        expect(screen.getByText(/100/)).toBeDefined();
        expect(screen.getByText(/\+10/)).toBeDefined();
        
        expect(screen.getByText(/Recomendaciones/i)).toBeDefined();
        expect(screen.getByText(/5/)).toBeDefined();
        
        // Match $1.000.000 or $1,000,000 or 1.000.000
        expect(screen.getByText(/\$?\s*1[.,]000[.,]000/)).toBeDefined();
        expect(screen.getByText(/USD\s*10[.,]000/i)).toBeDefined();
        
        expect(screen.getByTestId('user-dist-chart')).toBeDefined();
        expect(screen.getByText(/Admin User/i)).toBeDefined();
        expect(screen.getByText(/Expert User/i)).toBeDefined();
    });

    it('calculates average return correctly', () => {
        render(<ResumenTab />);
        // Match 10.00% or 10,00%
        expect(screen.getByText(/\+10[.,]00%/)).toBeDefined();
    });

    it('shows error message if no stats available', () => {
        (useAdminStats as any).mockReturnValue({
            params: { stats: null, loading: false },
        });
        render(<ResumenTab />);
        expect(screen.getByText(/No se pudieron cargar las estadísticas/i)).toBeDefined();
    });
});
