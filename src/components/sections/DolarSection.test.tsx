import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DolarSection from './DolarSection';
import { describe, it, expect, vi, beforeEach } from 'vitest';
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
            firstRow: [], secondRow: [], loading: true, updatedAt: null, fetchData: mockFetchData, normalizeName: (n: any) => n
        });
        render(<DolarSection />);
        expect(screen.getByText('Actualizando...')).toBeInTheDocument();
        expect(screen.getByRole('button')).toBeDisabled();
    });

    it('displays formatted updatedAt correctly', () => {
        const date = new Date(2025, 2, 22, 16, 45);
        (useDolarData as any).mockReturnValue({
            firstRow: [], secondRow: [], loading: false, updatedAt: date, fetchData: mockFetchData, normalizeName: (n: any) => n
        });
        render(<DolarSection />);
        // Matches "04:45 p. m." or "16:45"
        expect(screen.getByText(/4:45/i)).toBeInTheDocument();
    });

    it('renders only the headers if data is empty', () => {
        (useDolarData as any).mockReturnValue({
            firstRow: [], secondRow: [], loading: false, updatedAt: new Date(), fetchData: mockFetchData, normalizeName: (n: any) => n
        });
        render(<DolarSection />);
        expect(screen.queryByTestId('dolar-card')).not.toBeInTheDocument();
    });

    it('renders multiple cards in rows', () => {
        (useDolarData as any).mockReturnValue({
            firstRow: [{ nombre: 'D1' }, { nombre: 'D2' }],
            secondRow: [{ nombre: 'D3' }],
            loading: false, fetchData: mockFetchData, normalizeName: (n: any) => n
        });
        render(<DolarSection />);
        expect(screen.getAllByTestId('dolar-card')).toHaveLength(3);
    });

    it('contains a link to see more details/history', () => {
        render(<DolarSection />);
        expect(screen.getByText(/Ver gráfico/i)).toBeInTheDocument();
    });

    it('verifies typography variants used', () => {
        render(<DolarSection />);
        const title = screen.getByText('Cotizaciones del dólar');
        expect(title.tagName).toBe('H5');
    });
});
