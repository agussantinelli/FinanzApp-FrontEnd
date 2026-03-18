import { vi, describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@/test/test-utils';
import ExpertPage from '@/app/dashboard-experto/page';
import { server } from '@/test/msw/server';
import { http, HttpResponse } from 'msw';
import { RolUsuario } from '@/types/Usuario';

// Mock navigation
vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: vi.fn(),
        replace: vi.fn(),
    }),
}));

// Mock useAuth
const mockUser = { id: 1, nombre: 'Agus', rol: 'Experto' };
vi.mock('@/hooks/useAuth', () => ({
    useAuth: () => ({
        user: mockUser,
        isAuthenticated: true,
        loading: false
    })
}));

describe('ExpertDashboard Integration', () => {
    const mockStats = {
        totalRecomendaciones: 15,
        recomendacionesActivas: 8,
        efectividad: '75%',
        ranking: 3
    };

    const mockValuation = {
        totalPesos: 2500000,
        totalDolares: 2500,
        gananciaPesos: 250000,
        gananciaDolares: 250,
        variacionPorcentajePesos: 11.1,
        variacionPorcentajeDolares: 11.1,
        activos: []
    };

    beforeEach(() => {
        server.use(
            http.get('**/api/dashboard/experto/stats', () => HttpResponse.json(mockStats)),
            http.get('**/portafolios/mis-portafolios', () => HttpResponse.json([{ id: 'P-EX', nombre: 'Cartera Expert' }])),
            http.get('**/portafolios/P-EX', () => HttpResponse.json(mockValuation))
        );
    });

    it('should render expert panel with stats and ranking', async () => {
        render(<ExpertPage />);

        // Wait for stats to load (looking for ranking)
        await screen.findByText(/#3/i, {}, { timeout: 10000 });

        // Verify Panel Expert title
        expect(screen.getByText(/Panel experto/i)).toBeInTheDocument();

        // Verify recommendation stats
        expect(screen.getByText('15')).toBeInTheDocument(); // total
        expect(screen.getByText('8')).toBeInTheDocument();  // active
        expect(screen.getByText('75%')).toBeInTheDocument(); // effectiveness

        // Verify portfolio valuation (from usePortfolioData integration)
        expect(screen.getAllByText(/2[.,]500[.,]000/).length).toBeGreaterThan(0);
        expect(screen.getAllByText(/2[.,]500/).length).toBeGreaterThan(0);
    });

    it('should show "Expert" chip', async () => {
        render(<ExpertPage />);
        await screen.findByText(/Panel experto/i);
        // Look for the chip specifically or check multiple matches
        const expertChips = screen.getAllByText('Experto');
        expect(expertChips.length).toBeGreaterThan(0);
    });
});
