import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@/test/test-utils';
import { RolUsuario } from '@/types/Usuario';

// Mocks
vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: vi.fn(),
        replace: vi.fn(),
        back: vi.fn(),
        prefetch: vi.fn(),
    }),
    usePathname: () => '/',
    useSearchParams: () => ({
        get: vi.fn(),
    }),
}));

vi.mock('next/link', () => ({
    default: ({ children }: any) => <a>{children}</a>,
}));

vi.mock('@/hooks/useAuth');
vi.mock('@/hooks/usePortfolioData');
vi.mock('@/services/DashboardService');
vi.mock('@/components/auth/RoleGuard', () => ({
    RoleGuard: ({ children }: any) => <div>{children}</div>
}));
vi.mock('@/components/common/CurrencyToggle', () => ({
    CurrencyToggle: () => <div>CurrencyToggle</div>
}));
vi.mock('@/utils/format', () => ({
    formatARS: (val: number) => `$ ${val}`,
    formatUSD: (val: number) => `USD ${val}`,
    formatPercentage: (val: number) => `${val}`
}));

import DashboardPage from './page';
import { getInversorStats, getExpertoStats, getAdminStats, getAdminPortfolioStats } from '@/services/DashboardService';
import { usePortfolioData } from '@/hooks/usePortfolioData';
import { useAuth } from '@/hooks/useAuth';


describe('DashboardPage', () => {
    const mockUser = { id: 1, nombre: 'Agus', rol: RolUsuario.Inversor };

    beforeEach(() => {
        vi.clearAllMocks();
        (useAuth as any).mockReturnValue({ user: mockUser });
        (usePortfolioData as any).mockReturnValue({
            valuacion: {
                activos: [{ symbol: 'BTC', porcentajeCartera: 10 }],
                totalPesos: 1500000,
                totalDolares: 1500,
                gananciaPesos: 15000,
                gananciaDolares: 15,
                variacionPorcentajePesos: 1.5,
                variacionPorcentajeDolares: 1.5
            },
            loading: false
        });
        (getInversorStats as any).mockResolvedValue({
            valorTotal: 1500000,
            rendimientoDiario: 1.5,
            cantidadActivos: 5,
            exposicionCripto: 10
        });
    });

    it('renders inversor stats correctly', async () => {
        render(<DashboardPage />);

        await waitFor(() => {
            expect(screen.getByText(/Hola, Agus/i)).toBeInTheDocument();
        });

        expect(screen.getByText(/Valor estimado/i)).toBeInTheDocument();
        expect(screen.getByText(/USD 1500/i)).toBeInTheDocument();
        expect(screen.getByText(/1.5%/)).toBeInTheDocument();
    });

    it('renders experto dashboard when user is experto', async () => {
        (useAuth as any).mockReturnValue({ user: { ...mockUser, rol: RolUsuario.Experto } });
        (getExpertoStats as any).mockResolvedValue({
            totalRecomendaciones: 12,
            recomendacionesActivas: 3,
            ranking: 5
        });

        render(<DashboardPage />);

        await waitFor(() => {
            expect(screen.getByText(/Total Recomendaciones/i)).toBeInTheDocument();
            expect(screen.getByText('12')).toBeInTheDocument();
            expect(screen.getByText('#5')).toBeInTheDocument();
        });
    });

    it('renders admin dashboard when user is admin', async () => {
        (useAuth as any).mockReturnValue({ user: { ...mockUser, rol: RolUsuario.Admin } });
        (getAdminStats as any).mockResolvedValue({
            totalUsuarios: 100,
            nuevosUsuariosMes: 10,
            totalActivos: 50,
            recomendacionesPendientes: 2
        });
        (getAdminPortfolioStats as any).mockResolvedValue({
            valorGlobalPesos: 50000000,
            valorGlobalDolares: 50000,
            activosMasPopulares: [{ symbol: 'AAPL', cantidadInversores: 20 }]
        });

        render(<DashboardPage />);

        await waitFor(() => {
            expect(screen.getByText(/Total Usuarios/i)).toBeInTheDocument();
            expect(screen.getByText('100')).toBeInTheDocument();
            expect(screen.getByText('AAPL')).toBeInTheDocument();
        });
    });

    it('shows loading skeletons when data is fetching', () => {
        (usePortfolioData as any).mockReturnValue({ loading: true });
        render(<DashboardPage />);
        // Skeletons are rendered using Box/Paper with specific classes or structure
        // We can check for the absence of final data or presence of certain Typography placeholders
        expect(screen.queryByText(/Valor estimado/i)).not.toBeInTheDocument();
    });
});
