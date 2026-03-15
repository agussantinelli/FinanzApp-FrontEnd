import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import OperacionesTab from './OperacionesTab';
import { useAdminOperations } from '@/hooks/useAdminOperations';

// Mock hooks
vi.mock('@/hooks/useAdminOperations', () => ({
    useAdminOperations: vi.fn(),
}));

// Mock styles
vi.mock('../styles/Admin.module.css', () => ({
    default: {
        tableContainer: 'tableContainer',
        tableHead: 'tableHead',
        chip: 'chip',
    },
}));

describe('OperacionesTab', () => {
    const mockOperations = [
        {
            id: 'op-12345678-90ab-cdef',
            personaNombre: 'Test User',
            tipo: 'Compra',
            activoSymbol: 'AAPL',
            activoNombre: 'Apple Inc',
            cantidad: 10,
            precioUnitario: 150,
            totalOperado: 1500,
            fecha: '2023-01-01T12:00:00Z',
        },
    ];

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders loading state', () => {
        (useAdminOperations as any).mockReturnValue({
            operations: [],
            loading: true,
        });

        render(<OperacionesTab />);
        expect(document.querySelector('.MuiSkeleton-root')).toBeDefined();
    });

    it('renders operations table correctly', () => {
        (useAdminOperations as any).mockReturnValue({
            operations: mockOperations,
            loading: false,
        });

        render(<OperacionesTab />);
        
        expect(screen.getByText(/#op-12345/i)).toBeDefined();
        expect(screen.getByText(/Test User/i)).toBeDefined();
        expect(screen.getByText(/Compra/i)).toBeDefined();
        expect(screen.getByText(/AAPL/i)).toBeDefined();
        expect(screen.getByText(/10/)).toBeDefined();
        expect(screen.getByText(/\$?\s*150/)).toBeDefined();
        // Match $1.500 or $1,500
        expect(screen.getByText(/\$?\s*1[.,]500/)).toBeDefined();
    });

    it('handles empty operations list', () => {
        (useAdminOperations as any).mockReturnValue({
            operations: [],
            loading: false,
        });

        render(<OperacionesTab />);
        expect(screen.queryByRole('row', { name: /Compra/i })).toBeNull();
    });
});
