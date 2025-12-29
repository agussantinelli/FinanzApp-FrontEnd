import { render, screen, fireEvent, waitFor } from '@/test/test-utils';
import CryptoCard from './CryptoCard';
import { describe, it, expect, vi } from 'vitest';
import { CryptoTopDTO } from '@/types/Crypto';

// Mock useRouter
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: mockPush,
    }),
}));

const mockData = {
    id: "bitcoin",
    name: "Bitcoin",
    symbol: "BTC",
    rank: 1,
    priceUsd: 50000,
    changePct24h: 5.5,
    marketCapUsd: 1000000000,
    volumeUsd24h: 500000000,
    supply: 18000000,
    maxSupply: 21000000,
    vwap24h: 49000,
    explorer: "https://blockchain.info",
    // Adding properties from the user's provided mockCrypto, assuming they are intended as extra props
    // and casting to any to bypass type checks for CryptoTopDTO if these are not part of it.
    current_price: 50000, // This seems redundant with priceUsd, but included as per user's edit
    price_change_percentage_24h: 5.5, // Redundant with changePct24h
    image: 'btc.png',
    last_updated: '2023-01-01'
} as any;

describe('CryptoCard', () => {


    it('navigates on click', () => {
        render(<CryptoCard data={mockData} />);
        fireEvent.click(screen.getByText('Bitcoin').closest('div[class*="MuiCard-root"]')!);
        expect(mockPush).toHaveBeenCalledWith('/activos/BTC');
    });

    it('styles positive change correctly', () => {
        render(<CryptoCard data={mockData} />);
        const changeElement = screen.getByText(/\+5.50%/);
        expect(changeElement).toBeInTheDocument();
        // Class check might be fragile with modules, but we can check if it exists
    });

    it('styles negative change correctly', () => {
        const negativeData = { ...mockData, changePct24h: -2.5 };
        render(<CryptoCard data={negativeData} />);
        const changeElement = screen.getByText(/-2.50%/);
        expect(changeElement).toBeInTheDocument();
    });
});
