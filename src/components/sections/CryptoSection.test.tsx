import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import CryptoSection from './CryptoSection';
import { getTopCryptos } from '@/services/CryptoService';

vi.mock('@/services/CryptoService', () => ({
    getTopCryptos: vi.fn(),
}));

vi.mock('@/components/cards/CryptoCard', () => ({
    default: ({ data }: any) => <div data-testid="crypto-card">{data.name}</div>
}));

const mockData = [
    { symbol: 'BTC', name: 'Bitcoin', priceUsd: 50000, changePct24h: 2.5, rank: 1, source: 'coingecko', timestampUtc: '2024-01-01' },
    { symbol: 'ETH', name: 'Ethereum', priceUsd: 3000, changePct24h: -1.2, rank: 2, source: 'coingecko', timestampUtc: '2024-01-01' },
];

describe('CryptoSection', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.useRealTimers();
        (getTopCryptos as any).mockResolvedValue(mockData);
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('fetches and renders data on load', async () => {
        render(<CryptoSection />);
        expect(getTopCryptos).toHaveBeenCalled();
        
        const cards = await screen.findAllByTestId('crypto-card');
        expect(cards).toHaveLength(2);
        expect(screen.getByText('Bitcoin')).toBeInTheDocument();
    });

    it('shows loading state in button during refresh', async () => {
        let resolvePromise: any;
        const slowPromise = new Promise((resolve) => { resolvePromise = resolve; });
        (getTopCryptos as any).mockReturnValue(slowPromise);

        render(<CryptoSection />);
        
        await waitFor(() => expect(screen.getByText('Actualizando...')).toBeInTheDocument());
        expect(screen.getByRole('button')).toBeDisabled();

        await act(async () => {
            resolvePromise(mockData);
        });
        
        await waitFor(() => expect(screen.getByText(/Actualizar/i)).toBeInTheDocument());
    });

    it('periodically refreshes data', async () => {
        vi.useFakeTimers();
        render(<CryptoSection />);
        
        // Initial call on mount
        expect(getTopCryptos).toHaveBeenCalledTimes(1);

        await act(async () => {
            vi.advanceTimersByTime(300_000);
        });

        expect(getTopCryptos).toHaveBeenCalledTimes(2);
    });

    it('displays last update time', async () => {
        const now = new Date();
        render(<CryptoSection />);
        
        expect(await screen.findByText(/Última actualización/)).toBeInTheDocument();
        
        const timeStr = now.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
        // Use a flexible regex to handle potential non-breaking spaces or different space chars
        const flexibleRegex = new RegExp(timeStr.replace(/[\s\u202f]/g, '.*'));
        expect(screen.getByText(flexibleRegex)).toBeInTheDocument();
    });

    it('handles manual refresh', async () => {
        render(<CryptoSection />);
        
        // Wait for initial load
        await screen.findAllByTestId('crypto-card');
        
        const btn = screen.getByText(/Actualizar/i);
        fireEvent.click(btn);

        await waitFor(() => expect(getTopCryptos).toHaveBeenCalledTimes(2));
    });
});
