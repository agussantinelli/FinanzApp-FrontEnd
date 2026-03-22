import { render, screen, fireEvent } from '@testing-library/react';
import CedearsSection from './CedearsSection';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useCedearsData } from '@/hooks/useCedearsData';

vi.mock('@/hooks/useCedearsData');
vi.mock('@/components/cards/StocksCard', () => ({
    default: ({ title }: any) => <div>{title}</div>
}));

describe('CedearsSection', () => {
    const mockFetchData = vi.fn();
    const mockRows = [[{ localSymbol: 'AAPL.BA', usSymbol: 'AAPL', localPrice: 100 }]];

    beforeEach(() => {
        (useCedearsData as any).mockReturnValue({
            rows: mockRows,
            withDerived: mockRows[0],
            loading: false,
            updatedAt: new Date(),
            fetchData: mockFetchData
        });
    });

    it('renders cedears', () => {
        render(<CedearsSection />);
        expect(screen.getByText('Apple')).toBeInTheDocument();
    });

    it('handles refresh', () => {
        render(<CedearsSection />);
        const refreshBtn = screen.getByText('Actualizar');
        fireEvent.click(refreshBtn);
        expect(mockFetchData).toHaveBeenCalled();
    });

    it('renders empty state', () => {
        (useCedearsData as any).mockReturnValue({
            rows: [], withDerived: [], loading: false, fetchData: mockFetchData
        });
        render(<CedearsSection />);
        expect(screen.getByText('No se encontraron cotizaciones.')).toBeInTheDocument();
    });

    it('uses usSymbol if company mapping is missing', () => {
        (useCedearsData as any).mockReturnValue({
            rows: [[{ localSymbol: 'XYZ.BA', usSymbol: 'XYZ' }]],
            withDerived: [{ localSymbol: 'XYZ.BA', usSymbol: 'XYZ' }],
            loading: false, fetchData: mockFetchData
        });
        render(<CedearsSection />);
        expect(screen.getByText('XYZ')).toBeInTheDocument();
    });

    it('shows loading state on button', () => {
        (useCedearsData as any).mockReturnValue({
            rows: [], withDerived: [], loading: true, fetchData: mockFetchData
        });
        render(<CedearsSection />);
        expect(screen.getByText('Actualizando...')).toBeInTheDocument();
        expect(screen.getByRole('button')).toBeDisabled();
    });

    it('displays formatted updatedAt correctly', () => {
        const date = new Date(2025, 2, 22, 10, 15);
        (useCedearsData as any).mockReturnValue({
            rows: [], withDerived: [], loading: false, updatedAt: date, fetchData: mockFetchData
        });
        render(<CedearsSection />);
        expect(screen.getByText(/10:15/i)).toBeInTheDocument();
    });

    it('renders multiple rows of cards', () => {
         const extendedRows = [
            [{ localSymbol: 'AAPL.BA', usSymbol: 'AAPL' }],
            [{ localSymbol: 'AMZN.BA', usSymbol: 'AMZN' }]
         ];
         (useCedearsData as any).mockReturnValue({
            rows: extendedRows, withDerived: extendedRows.flat(),
            loading: false, fetchData: mockFetchData
        });
        render(<CedearsSection />);
        expect(screen.getByText('Apple')).toBeInTheDocument();
        expect(screen.getByText('Amazon')).toBeInTheDocument();
    });
});
