import { render, screen, fireEvent } from '@testing-library/react';
import StocksCard from './StocksCard';
import { describe, it, expect, vi } from 'vitest';
import { DualQuoteDTO } from '@/types/Market';

const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: mockPush,
    }),
}));

const mockData: DualQuoteDTO & { name?: string } = {
    localSymbol: "GGAL",
    usSymbol: "GGAL",
    localPriceARS: 1000,
    usPriceUSD: 10,
    usPriceARS: 10000, // Derived usually, but simplifying
    cedearRatio: 10,
    usedDollarRate: 1000,
    dollarRateName: "CCL",
    localChangePct: 2.0,
    usChangePct: 1.5,
    lastUpdate: "2023-01-01",
    name: "Grupo Galicia"
};

describe('StocksCard', () => {
    it('renders stock information', () => {
        render(<StocksCard data={mockData} />);
        expect(screen.getByText('Grupo Galicia')).toBeInTheDocument();
        expect(screen.getByText(/GGAL ↔ GGAL/)).toBeInTheDocument();
        expect(screen.getByText(/Precio local = CEDEAR/)).toBeInTheDocument();
    });

    it('renders without name using title prop', () => {
        render(<StocksCard data={{ ...mockData, name: undefined }} title="My Title" />);
        expect(screen.getByText('My Title')).toBeInTheDocument();
    });

    it('navigates to local symbol', () => {
        render(<StocksCard data={mockData} />);
        fireEvent.click(screen.getByText('Grupo Galicia').closest('div[class*="MuiCard-root"]')!);
        expect(mockPush).toHaveBeenCalledWith('/activos/GGAL');
    });
});
