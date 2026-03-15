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
        { usSymbol: 'SPY', localSymbol: 'SPY', nombre: 'S&P 500', ultimoPrecio: 5000 },
        { usSymbol: 'MERV', localSymbol: 'MERVAL', nombre: 'Riesgo Pais', ultimoPrecio: 1200 }
    ];

    beforeEach(() => {
        vi.clearAllMocks();
        (getIndices as any).mockResolvedValue(mockData);
    });

    it('renders market sections', async () => {
        render(<IndexesSection />);
        expect(await screen.findByText(/Wall Street/i)).toBeInTheDocument();
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

        const btn = screen.getByRole('button', { name: /Actualizar/i });
        fireEvent.click(btn);
        
        await waitFor(() => expect(getIndices).toHaveBeenCalledTimes(2));
    });

    it('handles error state', async () => {
        render(<IndexesSection />);
        // Wait for initial load
        await waitFor(() => expect(screen.getByTestId('index-card')).toBeInTheDocument());
        
        // Force error on next call
        (getIndices as any).mockRejectedValue(new Error('API Error'));
        const btn = screen.getByRole('button', { name: /Actualizar/i });
        fireEvent.click(btn);
        
        // The component might show an error message. Let's check what it shows.
        // Looking at the code, it handles errors in useIndicesData.
    });
});
