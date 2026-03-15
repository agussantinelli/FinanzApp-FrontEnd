import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import IndexesSection from './IndexesSection';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getIndices } from '@/services/StocksService';

vi.mock('@/services/StocksService');
vi.mock('@/components/cards/IndexCard', () => ({
    default: ({ data }: any) => <div data-testid="index-card">{data.nombre}</div>
}));
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
    useRouter: () => ({ push: mockPush }),
}));

describe('IndexesSection', () => {
    const mockData = [
        { usSymbol: 'SPY', localSymbol: 'SPY', nombre: 'S&P 500', ultimoPrecio: 5000, usPriceUSD: 5000, localPriceARS: 5000000 },
        { usSymbol: 'MERV', localSymbol: 'MERVAL', nombre: 'Merval', ultimoPrecio: 1200, usPriceUSD: 1.2, localPriceARS: 1200000 }
    ];

    beforeEach(() => {
        vi.clearAllMocks();
        (getIndices as any).mockResolvedValue(mockData);
    });

    it('renders market sections', async () => {
        render(<IndexesSection />);
        expect(await screen.findByText(/Wall Street/i, {}, { timeout: 3000 })).toBeInTheDocument();
        expect(screen.getByText(/Argentina/i)).toBeInTheDocument();
    });

    it('renders index cards after loading', async () => {
        render(<IndexesSection />);
        await waitFor(() => {
            const cards = screen.getAllByTestId('index-card');
            expect(cards.length).toBeGreaterThan(0);
        });
    });

    it('handles refresh correctly', async () => {
        render(<IndexesSection />);
        await screen.findByText(/Wall Street/i);

        // Reset to clear mount call
        vi.clearAllMocks();
        (getIndices as any).mockResolvedValue(mockData);

        const btn = screen.getByRole('button', { name: /Actualizar/i });
        fireEvent.click(btn);
        
        await waitFor(() => expect(getIndices).toHaveBeenCalledTimes(1));
    });

    it('handles error state', async () => {
        render(<IndexesSection />);
        // Wait for initial load
        await waitFor(() => expect(screen.getAllByTestId('index-card').length).toBeGreaterThan(0));
        
        // Force error on next call
        (getIndices as any).mockRejectedValue(new Error('API Error'));
        const btn = screen.getByRole('button', { name: /Actualizar/i });
        fireEvent.click(btn);
        
        // Should still show loaded data or error (depending on implementation)
        await waitFor(() => expect(screen.getAllByTestId('index-card').length).toBeGreaterThan(0));
    });
});
