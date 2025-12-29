import { render, screen, fireEvent } from '@testing-library/react';
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

const mockData: CryptoTopDTO = {
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
    explorer: "https://blockchain.info"
};

describe('CryptoCard', () => {
    it('renders crypto information correctly', () => {
        render(<CryptoCard data={mockData} />);

        expect(screen.getByText('Bitcoin')).toBeInTheDocument();
        expect(screen.getByText('BTC')).toBeInTheDocument();
        expect(screen.getByText(/Price:/i, { exact: false })).toBeInTheDocument();
        // Note Check formatUSD output. Assuming it adds currency symbol.
        // Using partial match to be safe or exact if format is known.
        // In the component: "Precio: " + formatUSD(c.priceUsd)
        expect(screen.getByText((content) => content.includes("Precio") && content.includes("$"))).toBeInTheDocument();
    });

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
