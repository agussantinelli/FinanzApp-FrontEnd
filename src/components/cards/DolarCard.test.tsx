import { render, screen, fireEvent } from '@testing-library/react';
import DolarCard from './DolarCard';
import { describe, it, expect, vi } from 'vitest';
import { DolarDTO } from '@/types/Dolar';

const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: mockPush,
    }),
}));

const mockData: DolarDTO = {
    compra: 1000,
    venta: 1020,
    variacion: 1.5,
    fecha: "2023-01-01",
    valor: 1010
};

describe('DolarCard', () => {
    it('renders null when no data', () => {
        const { container } = render(<DolarCard data={null} title="Dolar Oficial" />);
        expect(container).toBeEmptyDOMElement();
    });

    it('renders dollar information correctly', () => {
        render(<DolarCard data={mockData} title="Dolar Oficial" ticker="DOLAR" />);
        expect(screen.getByText('Dolar Oficial')).toBeInTheDocument();
        // Flexible matcher for Compra/Venta formatting
        expect(screen.getByText((content) => content.includes("Compra") && content.includes("1,000"))).toBeInTheDocument();
    });

    it('navigates if ticker is provided', () => {
        render(<DolarCard data={mockData} title="Dolar Oficial" ticker="DOLAR" />);
        fireEvent.click(screen.getByText('Dolar Oficial').closest('div[class*="MuiCard-root"]')!);
        expect(mockPush).toHaveBeenCalledWith('/activos/DOLAR');
    });

    it('does not navigate if no ticker', () => {
        mockPush.mockClear();
        render(<DolarCard data={mockData} title="Dolar Oficial" />);
        fireEvent.click(screen.getByText('Dolar Oficial').closest('div[class*="MuiCard-root"]')!);
        expect(mockPush).not.toHaveBeenCalled();
    });
});
