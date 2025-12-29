import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DolarSection from './DolarSection';
import { describe, it, expect, vi } from 'vitest';
import { useDolarData } from '@/hooks/useDolarData';

// Mock hook
vi.mock('@/hooks/useDolarData');
// Mock Card to simplify
vi.mock('@/components/cards/DolarCard', () => ({
    default: ({ title }: any) => <div data-testid="dolar-card">{title}</div>
}));
// Mock Link
vi.mock('next/link', () => ({
    default: ({ children }: any) => <a>{children}</a>,
}));

describe('DolarSection', () => {
    const mockFetchData = vi.fn();

    beforeEach(() => {
        (useDolarData as any).mockReturnValue({
            firstRow: [{ nombre: 'Oficial', compra: 100, venta: 105 }],
            secondRow: [{ nombre: 'Blue', compra: 1100, venta: 1150 }],
            loading: false,
            updatedAt: new Date('2023-01-01T12:00:00'),
            fetchData: mockFetchData,
            normalizeName: (name: string) => name,
        });
    });

    it('renders correctly with data', () => {
        render(<DolarSection />);
        expect(screen.getByText('Cotizaciones del dólar')).toBeInTheDocument();
        expect(screen.getAllByTestId('dolar-card')).toHaveLength(2);
        expect(screen.getByText('Oficial')).toBeInTheDocument();
        expect(screen.getByText('Blue')).toBeInTheDocument();
    });

    it('calls fetchData on refresh', () => {
        render(<DolarSection />);
        const refreshBtn = screen.getByText('Actualizar');
        fireEvent.click(refreshBtn);
        expect(mockFetchData).toHaveBeenCalled();
    });

    it('shows loading state', () => {
        (useDolarData as any).mockReturnValue({
            firstRow: [],
            secondRow: [],
            loading: true,
            updatedAt: null,
            fetchData: mockFetchData,
            normalizeName: (name: string) => name,
        });
        render(<DolarSection />);
        expect(screen.getByText('Actualizando...')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Actualizando/ })).toBeDisabled();
    });
});
