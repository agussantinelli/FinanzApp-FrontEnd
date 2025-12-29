import { render, screen, fireEvent, waitFor } from '@/test/test-utils';
import DolarCard from './DolarCard';
import { describe, it, expect, vi } from 'vitest';
import { DolarDTO } from '@/types/Dolar';

const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: mockPush,
    }),
}));

const mockData = {
    nombre: 'Blue',
    compra: 1000,
    venta: 1020,
    fecha: '2023-01-01',
    valor: 1010
} as any;

describe('DolarCard', () => {
    it('renders null when no data', () => {
        const { container } = render(<DolarCard data={null} title="Dolar Oficial" />);
        expect(container).toBeEmptyDOMElement();
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
