import { render, screen, fireEvent } from '@testing-library/react';
import IndexesSection from './IndexesSection';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useIndicesData } from '@/hooks/useIndicesData';

vi.mock('@/hooks/useIndicesData');
vi.mock('@/components/cards/IndexCard', () => ({
    default: ({ data }: any) => <div>{data.usSymbol}</div>
}));

describe('IndexesSection', () => {
    const mockFetchData = vi.fn();

    beforeEach(() => {
        (useIndicesData as any).mockReturnValue({
            data: [],
            row1: [{ usSymbol: 'SPY' }],
            row2: [],
            national: [{ usSymbol: 'MERVAL' }],
            loading: false,
            updatedAt: new Date(),
            fetchData: mockFetchData
        });
    });

    it('renders indexes', () => {
        render(<IndexesSection />);
        expect(screen.getByText('SPY')).toBeInTheDocument();
        expect(screen.getByText('MERVAL')).toBeInTheDocument();
    });

    it('handles refresh', () => {
        render(<IndexesSection />);
        const refreshBtn = screen.getByText('Actualizar');
        fireEvent.click(refreshBtn);
        expect(mockFetchData).toHaveBeenCalled();
    });
});
