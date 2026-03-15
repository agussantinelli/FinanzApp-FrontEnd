import { render, screen, fireEvent } from '@testing-library/react';
import IndexesSection from './IndexesSection';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useIndicesData } from '@/hooks/useIndicesData';

vi.mock('@/hooks/useIndicesData');
vi.mock('@/components/cards/IndexCard', () => ({
    default: ({ data }: any) => <div data-testid="index-card">{data.usSymbol || data.localSymbol}</div>
}));

describe('IndexesSection', () => {
    const mockFetchData = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        (useIndicesData as any).mockReturnValue({
            data: [],
            row1: [{ usSymbol: 'SPY' }],
            row2: [{ usSymbol: 'QQQ' }],
            national: [{ localSymbol: 'MERVAL' }],
            loading: false,
            updatedAt: new Date('2024-01-01T12:00:00'),
            fetchData: mockFetchData
        });
    });

    it('renders indexes and sections', () => {
        render(<IndexesSection />);
        expect(screen.getByText('Wall Street & Emergentes')).toBeInTheDocument();
        expect(screen.getByText('Argentina')).toBeInTheDocument();
        expect(screen.getByText('SPY')).toBeInTheDocument();
        expect(screen.getByText('MERVAL')).toBeInTheDocument();
    });

    it('shows last update time', () => {
        render(<IndexesSection />);
        expect(screen.getByText(/Última actualización: 12:00/)).toBeInTheDocument();
    });

    it('handles refresh click', () => {
        render(<IndexesSection />);
        const refreshBtn = screen.getByText('Actualizar');
        fireEvent.click(refreshBtn);
        expect(mockFetchData).toHaveBeenCalled();
    });

    it('shows updater state in button', () => {
        (useIndicesData as any).mockReturnValue({
            data: [], row1: [], row2: [], national: [],
            loading: true,
            updatedAt: null,
            fetchData: mockFetchData
        });
        render(<IndexesSection />);
        expect(screen.getByText('Actualizando...')).toBeInTheDocument();
        expect(screen.getByRole('button')).toBeDisabled();
    });

    it('shows empty message when no data', () => {
        (useIndicesData as any).mockReturnValue({
            data: [], row1: [], row2: [], national: [],
            loading: false,
            updatedAt: null,
            fetchData: mockFetchData
        });
        render(<IndexesSection />);
        expect(screen.getByText('Cargando índices de mercado...')).toBeInTheDocument();
    });
});
