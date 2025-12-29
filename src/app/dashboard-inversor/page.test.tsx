import { render, screen, fireEvent } from '@testing-library/react';
import DashboardPage from './page';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAuth } from '@/hooks/useAuth';
import { usePortfolioData } from '@/hooks/usePortfolioData';
import { getInversorStats, getExpertoStats, getAdminStats } from '@/services/DashboardService';

vi.mock('@/hooks/useAuth');
vi.mock('@/hooks/usePortfolioData');
vi.mock('@/services/DashboardService');
vi.mock('@/components/auth/RoleGuard', () => ({
    RoleGuard: ({ children }: any) => <div>{children}</div>
}));
vi.mock('@/components/common/CurrencyToggle', () => ({
    CurrencyToggle: () => <div>CurrencyToggle</div>
}));
vi.mock('next/link', () => ({
    default: ({ children }: any) => <a>{children}</a>,
}));


describe('DashboardPage', () => {
    beforeEach(() => {
        (usePortfolioData as any).mockReturnValue({
            valuacion: {
                activos: [], totalPesos: 1000, totalDolares: 10,
                gananciaPesos: 100, gananciaDolares: 1,
                variacionPorcentajePesos: 10, variacionPorcentajeDolares: 10
            },
            loading: false
        });
        (getInversorStats as any).mockResolvedValue({ valorTotal: 1000, exposicionCripto: 10 });
        (getExpertoStats as any).mockResolvedValue({ totalRecomendaciones: 5 });
        (getAdminStats as any).mockResolvedValue({ totalUsuarios: 50 });
    });

    it('renders Inversor dashboard', async () => {
        (useAuth as any).mockReturnValue({
            user: { nombre: 'Juan', rol: 'Inversor' }
        });

        render(<DashboardPage />);

        expect(await screen.findByText('Hola, Juan 👋')).toBeInTheDocument();
        expect(screen.getByText('Valor estimado (USD)')).toBeInTheDocument();
        expect(screen.getByText('Exposición en cripto')).toBeInTheDocument();
        expect(screen.getByText('Mi Portafolio')).toBeInTheDocument();
    });

    it('renders Experto dashboard', async () => {
        (useAuth as any).mockReturnValue({
            user: { nombre: 'Ana', rol: 'Experto' }
        });

        render(<DashboardPage />);

        expect(await screen.findByText('Total Recomendaciones')).toBeInTheDocument();
        expect(screen.getByText('Gestión Rápida')).toBeInTheDocument();
    });

    it('renders Admin dashboard', async () => {
        (useAuth as any).mockReturnValue({
            user: { nombre: 'Admin', rol: 'Admin' }
        });

        render(<DashboardPage />);

        expect(await screen.findByText('Total Usuarios')).toBeInTheDocument();
        expect(screen.getByText('Atajos de Administración')).toBeInTheDocument();
    });

    it('handles skeleton loading', () => {
        (useAuth as any).mockReturnValue({ user: { rol: 'Inversor' } });
        (usePortfolioData as any).mockReturnValue({ loading: true });

        render(<DashboardPage />);
        // Skeletons don't have text, but we can verify text is absent
        expect(screen.queryByText('Valor estimado (USD)')).not.toBeInTheDocument();
    });
});
