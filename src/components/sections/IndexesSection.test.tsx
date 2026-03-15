import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import IndexesSection from './IndexesSection';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getIndices } from '@/services/StocksService';

vi.mock('@/services/StocksService');
vi.mock('@/components/cards/IndexCard', () => ({
    default: ({ data }: any) => <div data-testid="index-card">{data.nombre}</div>
}));

describe('IndexesSection', () => {
    const mockData = [
        { symbol: 'SPY', nombre: 'S&P 500', ultimoPrecio: 5000 },
        { symbol: 'MERVAL', nombre: 'Riesgo Pais', ultimoPrecio: 1200 }
    ];

    beforeEach(() => {
        vi.clearAllMocks();
        (getIndices as any).mockResolvedValue(mockData);
    });

    it('renders market sections', async () => {
        render(<IndexesSection />);
        await waitFor(() => expect(screen.getByText(/Wall Street/i)).toBeInTheDocument());
        expect(screen.getByText(/Argentina/i)).toBeInTheDocument();
    });

    it('renders index cards after loading', async () => {
        render(<IndexesSection />);
        await waitFor(() => {
            const cards = screen.getAllByTestId('index-card');
            expect(cards.length).toBeGreaterThan(0);
        });
    });

    it('displays loading state while updating', async () => {
        let resolve: any;
        const promise = new Promise(r => { resolve = r; });
        (getIndices as any).mockReturnValue(promise);

        render(<IndexesSection />);
        await waitFor(() => expect(screen.getByText('Actualizando...')).toBeInTheDocument());
        
        await act(async () => {
            resolve(mockData);
        });
        await waitFor(() => expect(screen.queryByText('Actualizando...')).not.toBeInTheDocument());
    });

    it('handles refresh correctly', async () => {
        render(<IndexesSection />);
        await waitFor(() => screen.getByText('Wall Street'));

        const btn = screen.getByRole('button');
        await act(async () => {
            fireEvent.click(btn);
        });
        
        expect(getIndices).toHaveBeenCalledTimes(2);
    });

    it('handles error state', async () => {
        (getIndices as any).mockRejectedValue(new Error('API Error'));
        render(<IndexesSection />);
        await waitFor(() => expect(screen.getByText(/Error al cargar/)).toBeInTheDocument());
    });
});
