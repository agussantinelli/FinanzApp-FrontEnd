import { render, screen, fireEvent, waitFor } from '@/test/test-utils';
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
    localPriceUSD: 4500,
    cedearRatio: undefined,
    usedDollarRate: 1,
    dollarRateName: "USD",
    localChangePct: undefined,
    usChangePct: 0.5,
};

const mockIndex = {
    symbol: 'SPY',
    price: 450,
    change: undefined,
    changePercent: undefined,
    lastUpdate: '2023-01-01'
} as any;

describe('IndexCard', () => {
    it('renders Standard & Poor information correctly', () => {
        render(<IndexCard data={mockData} />);
        expect(screen.getByText("S&P 500")).toBeInTheDocument();
        expect(screen.getByText(/Índice Standard & Poor/)).toBeInTheDocument();
    });



    it('navigates to symbol', () => {
        render(<IndexCard data={mockData} />);
        fireEvent.click(screen.getByText("S&P 500").closest('div[class*="MuiCard-root"]')!);
        expect(mockPush).toHaveBeenCalledWith('/activos/^GSPC');
    });
});
