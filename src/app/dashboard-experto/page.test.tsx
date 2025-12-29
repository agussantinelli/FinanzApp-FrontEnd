import { render, screen, waitFor } from '@testing-library/react';
import ExpertPage from './page';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAuth } from '@/hooks/useAuth';
import { getExpertoStats } from '@/services/DashboardService';
import { usePortfolioData } from '@/hooks/usePortfolioData';

vi.mock('@/hooks/useAuth');
vi.mock('@/services/DashboardService');
vi.mock('@/hooks/usePortfolioData');
vi.mock('@/components/auth/RoleGuard', () => ({
    RoleGuard: ({ children }: any) => <div>{children}</div>
}));
vi.mock('next/navigation', () => ({
    useRouter: () => ({ push: vi.fn() })
}));

describe('ExpertPage', () => {
    beforeEach(() => {
        (useAuth as any).mockReturnValue({ user: { rol: 'Experto', nombre: 'TestExpert' } });
        (getExpertoStats as any).mockResolvedValue({
            ranking: 1,
            totalRecomendaciones: 10,
            recomendacionesActivas: 5,
            efectividad: '80%'
        });
        (usePortfolioData as any).mockReturnValue({
            valuacion: { totalPesos: 1000 },
            refresh: vi.fn(),
            loading: false
        });
    });

    it('renders expert stats', async () => {
        render(<ExpertPage />);
        expect(await screen.findByText('Panel experto')).toBeInTheDocument();
        expect(screen.getByText('#1')).toBeInTheDocument();
    });
});
