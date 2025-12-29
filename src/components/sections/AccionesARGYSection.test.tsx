import { render, screen, fireEvent } from '@testing-library/react';
import AccionesARSection from './AccionesARGYSection';
import { describe, it, expect, vi } from 'vitest';
import { useStocksData } from '@/hooks/useStocksData';

// Mock hook
vi.mock('@/hooks/useStocksData');
vi.mock('@/components/cards/StocksCard', () => ({
    default: ({ data }: any) => <div data-testid="stocks-card">{data.localSymbol}</div>
}));

describe('AccionesARSection', () => {
    const mockFetchData = vi.fn();

    beforeEach(() => {
        (useStocksData as any).mockReturnValue({
            rowsEnergetico: [[{ localSymbol: 'YPFD' }]],
            rowsBancario: [[{ localSymbol: 'GGAL' }]],
            rowsExtra: [],
            loading: false,
            error: null,
            updatedAt: new Date(),
            fetchData: mockFetchData
        });
    });

    it('renders separate sectors', () => {
        render(<AccionesARSection />);
        expect(screen.getByText('Sector Energético')).toBeInTheDocument();
        expect(screen.getByText('Sector Bancario')).toBeInTheDocument();
        expect(screen.getByText('YPFD')).toBeInTheDocument();
        expect(screen.getByText('GGAL')).toBeInTheDocument();
    });

    it('shows error if present', () => {
        (useStocksData as any).mockReturnValue({
            rowsEnergetico: [],
            rowsBancario: [],
            rowsExtra: [],
            loading: false,
            error: "Failed to fetch",
            updatedAt: null,
            fetchData: mockFetchData
        });
        render(<AccionesARSection />);
        expect(screen.getByText("Failed to fetch")).toBeInTheDocument();
    });

    it('refresh button calls fetch', () => {
        render(<AccionesARSection />);
        fireEvent.click(screen.getByText('Actualizar'));
        expect(mockFetchData).toHaveBeenCalled();
    });
});
