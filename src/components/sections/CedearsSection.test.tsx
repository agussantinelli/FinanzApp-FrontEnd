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
            rows: [],
            withDerived: [],
            loading: false,
            fetchData: mockFetchData
        });
        render(<CedearsSection />);
        expect(screen.getByText('No se encontraron cotizaciones.')).toBeInTheDocument();
    });
});
