import { render, screen, fireEvent } from '@/test/test-utils';
import IndexCard from '../IndexCard';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DualQuoteDTO } from '@/types/Market';

const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: mockPush,
    }),
}));

describe('IndexCard', () => {
    const mockData: DualQuoteDTO = {
        localSymbol: "^GSPC",
        usSymbol: "^GSPC",
        localPriceARS: 0,
        usPriceUSD: 4500.5,
        usPriceARS: 4500000,
        localPriceUSD: 4500.5,
        cedearRatio: undefined,
        usedDollarRate: 1000,
        dollarRateName: "USD",
        localChangePct: undefined,
        usChangePct: 0.5,
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders Index information correctly (S&P 500)', () => {
        render(<IndexCard data={mockData} />);
        expect(screen.getByText("S&P 500")).toBeInTheDocument();
        expect(screen.getByText(/Índice Standard & Poor/)).toBeInTheDocument();
        // Use regex for flexible price matching (4.500.000)
        expect(screen.getByText(/\$\s*4\.500\.000/)).toBeInTheDocument(); 
        expect(screen.getByText(/US\$\s*4\.500/)).toBeInTheDocument();
    });

    it('renders as Risk Card for EMBI_AR', () => {
        const riskData = { ...mockData, localSymbol: 'EMBI_AR', usSymbol: 'EMBI_AR' };
        render(<IndexCard data={riskData} />);
        expect(screen.getByText("Riesgo País")).toBeInTheDocument();
        expect(screen.getByText("4501")).toBeInTheDocument(); // Math.round(4500.5)
        expect(screen.getByText("Puntos Básicos (pbs)")).toBeInTheDocument();
    });

    it('applies positive variation style', () => {
        render(<IndexCard data={mockData} />);
        const change = screen.getAllByText("+0,50%")[0];
        expect(change).toHaveClass(/positive/);
    });

    it('applies negative variation style', () => {
        render(<IndexCard data={{ ...mockData, usChangePct: -1.2 }} />);
        const change = screen.getAllByText("-1,20%")[0];
        expect(change).toHaveClass(/negative/);
    });

    it('navigates to detail on click', () => {
        render(<IndexCard data={mockData} />);
        const card = screen.getByText("S&P 500").closest('.MuiPaper-root')!;
        fireEvent.click(card);
        expect(mockPush).toHaveBeenCalledWith('/activos/^GSPC');
    });
});
