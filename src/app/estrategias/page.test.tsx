import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import StrategiesPage from './page';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getPortafoliosDestacados } from '@/services/PortafolioService';

vi.mock('@/services/PortafolioService');
vi.mock('@/components/auth/RoleGuard', () => ({
    RoleGuard: ({ children }: any) => <div>{children}</div>
}));
vi.mock('next/navigation', () => ({
    useRouter: () => ({ push: vi.fn() })
}));

describe('StrategiesPage', () => {
    const mockData = [
        { id: '1', nombre: 'Strategy 1', esTop: true, loSigo: false },
        { id: '2', nombre: 'Strategy 2', esTop: false, loSigo: true }
    ];

    beforeEach(() => {
        (getPortafoliosDestacados as any).mockResolvedValue(mockData);
    });

    it('renders portfolios', async () => {
        render(<StrategiesPage />);
        expect(await screen.findByText('Strategy 1')).toBeInTheDocument();
        expect(screen.getByText('Strategy 2')).toBeInTheDocument();
    });

    it('filters favorites', async () => {
        render(<StrategiesPage />);
        await waitFor(() => screen.getByText('Strategy 1')); // wait load

        const favBtn = screen.getByText('Mis Favoritos');
        fireEvent.click(favBtn);

        expect(screen.queryByText('Strategy 1')).not.toBeInTheDocument(); // not fav
        expect(screen.getByText('Strategy 2')).toBeInTheDocument();
    });
});
