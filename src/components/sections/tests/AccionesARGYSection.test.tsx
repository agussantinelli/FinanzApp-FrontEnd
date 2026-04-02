import { render, screen, fireEvent } from '@testing-library/react';
import AccionesARSection from '../AccionesARGYSection';
import { describe, it, expect, vi, beforeEach } from 'vitest';
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
    
    it('shows loading state in button when loading', () => {
        (useStocksData as any).mockReturnValue({
            rowsEnergetico: [], rowsBancario: [], rowsExtra: [],
            loading: true, error: null, updatedAt: new Date(), fetchData: mockFetchData
        });
        render(<AccionesARSection />);
        expect(screen.getByText('Actualizando...')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /actualizando/i })).toBeDisabled();
    });

    it('displays formatted updatedAt timestamp', () => {
        const date = new Date(2025, 2, 22, 14, 30);
        (useStocksData as any).mockReturnValue({
            rowsEnergetico: [], rowsBancario: [], rowsExtra: [],
            loading: false, error: null, updatedAt: date, fetchData: mockFetchData
        });
        render(<AccionesARSection />);
        // Use a regex that ignores dots/spaces between AM/PM (e.g., "02:30 p. m.")
        expect(screen.getByText(/2:30/i)).toBeInTheDocument();
    });

    it('renders extra sector when populated', () => {
        (useStocksData as any).mockReturnValue({
            rowsEnergetico: [], rowsBancario: [],
            rowsExtra: [[{ localSymbol: 'TXAR' }]],
            loading: false, error: null, updatedAt: new Date(), fetchData: mockFetchData
        });
        render(<AccionesARSection />);
        expect(screen.getByText('Otros')).toBeInTheDocument();
        expect(screen.getByText('TXAR')).toBeInTheDocument();
    });

    it('does not render data rows if sectors are empty', () => {
        (useStocksData as any).mockReturnValue({
            rowsEnergetico: [], rowsBancario: [], rowsExtra: [],
            loading: false, error: null, updatedAt: new Date(), fetchData: mockFetchData
        });
        render(<AccionesARSection />);
        const cards = screen.queryAllByTestId('stocks-card');
        expect(cards.length).toBe(0);
    });
});
