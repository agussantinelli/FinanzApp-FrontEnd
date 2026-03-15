import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import CryptoSection from './CryptoSection';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getTopCryptos } from '@/services/CryptoService';

vi.mock('@/services/CryptoService');
vi.mock('@/components/cards/CryptoCard', () => ({
    default: ({ data }: any) => <div data-testid="crypto-card">{data.name}</div>
}));

describe('CryptoSection', () => {
    const mockData = [
        { symbol: 'BTC', name: 'Bitcoin', priceUsd: 50000 },
        { symbol: 'ETH', name: 'Ethereum', priceUsd: 3000 }
    ];

    beforeEach(() => {
        vi.clearAllMocks();
        vi.useFakeTimers();
        (getTopCryptos as any).mockResolvedValue(mockData);
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('fetches and renders data on load', async () => {
        render(<CryptoSection />);
        expect(getTopCryptos).toHaveBeenCalled();
        
        await waitFor(() => {
            expect(screen.getAllByTestId('crypto-card')).toHaveLength(2);
        });
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
        
        await waitFor(() => expect(screen.getByText('Actualizar')).toBeInTheDocument());
    });

    it('periodically refreshes data', async () => {
        render(<CryptoSection />);
        await waitFor(() => expect(getTopCryptos).toHaveBeenCalledTimes(1));

        await act(async () => {
            vi.advanceTimersByTime(300000); // 5 minutes
        });

        expect(getTopCryptos).toHaveBeenCalledTimes(2);
    });

    it('displays last update time', async () => {
        const now = new Date();
        render(<CryptoSection />);
        await waitFor(() => screen.getByText(/Última actualización/));
        
        const timeStr = now.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
        expect(screen.getByText(new RegExp(timeStr))).toBeInTheDocument();
    });

    it('handles manual refresh', async () => {
        render(<CryptoSection />);
        await waitFor(() => expect(getTopCryptos).toHaveBeenCalledTimes(1));

        const btn = screen.getByText('Actualizar');
        fireEvent.click(btn);

        expect(getTopCryptos).toHaveBeenCalledTimes(2);
    });
});
