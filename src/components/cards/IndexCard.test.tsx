import { render, screen, fireEvent } from '@testing-library/react';
import IndexCard from './IndexCard';
import { describe, it, expect, vi } from 'vitest';
import { DualQuoteDTO } from '@/types/Market';

const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: mockPush,
    }),
}));

const mockData: DualQuoteDTO = {
    localSymbol: "^GSPC",
    usSymbol: "^GSPC",
    localPriceARS: 0,
    usPriceUSD: 4500,
    usPriceARS: 0,
    cedearRatio: null,
    usedDollarRate: 1,
    dollarRateName: "USD",
    localChangePct: null,
    usChangePct: 0.5,
    lastUpdate: "2023-01-01"
};

describe('IndexCard', () => {
    it('renders Standard & Poor information correctly', () => {
        render(<IndexCard data={mockData} />);
        // Checks logic for metadata resolution
        expect(screen.getByText("S&P 500")).toBeInTheDocument();
        expect(screen.getByText(/Índice Standard & Poor/)).toBeInTheDocument();
    });

    it('renders Riesgo Pais specifically', () => {
        const riesgoData = { ...mockData, localSymbol: "RIESGO", usPriceUSD: 1500 };
        render(<IndexCard data={riesgoData} />);
        expect(screen.getByText("Riesgo País")).toBeInTheDocument();
        expect(screen.getByText("1500")).toBeInTheDocument();
        expect(screen.getByText("Puntos Básicos (pbs)")).toBeInTheDocument();
    });

    it('navigates to symbol', () => {
        render(<IndexCard data={mockData} />);
        fireEvent.click(screen.getByText("S&P 500").closest('div[class*="MuiCard-root"]')!);
        expect(mockPush).toHaveBeenCalledWith('/activos/^GSPC');
    });
});
