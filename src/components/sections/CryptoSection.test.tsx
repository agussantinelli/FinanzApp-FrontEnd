import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CryptoSection from './CryptoSection';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getTopCryptos } from '@/services/CryptoService';

// Mock service
vi.mock('@/services/CryptoService');
// Mock Card
vi.mock('@/components/cards/CryptoCard', () => ({
    default: ({ data }: any) => <div data-testid="crypto-card">{data.name}</div>
}));

describe('CryptoSection', () => {
    beforeEach(() => {
        (getTopCryptos as any).mockResolvedValue([
            { symbol: 'BTC', name: 'Bitcoin', priceUsd: 50000 },
            { symbol: 'ETH', name: 'Ethereum', priceUsd: 3000 }
        ]);
    });

    it('fetches and renders data on load', async () => {
        render(<CryptoSection />);

        await waitFor(() => {
            expect(screen.getAllByTestId('crypto-card')).toHaveLength(2);
        });
        expect(screen.getByText('Bitcoin')).toBeInTheDocument();
        expect(screen.getByText('Ethereum')).toBeInTheDocument();
    });

    it('allows manual refresh', async () => {
        render(<CryptoSection />);
        await waitFor(() => expect(getTopCryptos).toHaveBeenCalledTimes(1));

        const refreshBtn = screen.getByText('Actualizar');
        fireEvent.click(refreshBtn);

        // Should call again
        await waitFor(() => expect(getTopCryptos).toHaveBeenCalledTimes(2));
    });
});
