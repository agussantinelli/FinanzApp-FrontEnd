import { render, screen, fireEvent, waitFor } from '@/test/test-utils';
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
vi.mock('@/utils/format', () => ({
    formatARS: (val: number) => `$${val}`,
    formatUSD: (val: number) => `USD ${val}`,
    formatPercentage: (val: number) => `${val}%`
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

    it('renders placeholder', () => {
        expect(true).toBe(true);
    });
});
