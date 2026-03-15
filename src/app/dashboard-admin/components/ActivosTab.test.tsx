import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ActivosTab from './ActivosTab';
import { useAdminAssets } from '@/hooks/useAdminAssets';
import { useActivosFilterAndSort } from '@/hooks/useActivosFilterAndSort';

// Mock hooks
vi.mock('@/hooks/useAdminAssets', () => ({
    useAdminAssets: vi.fn(),
}));

vi.mock('@/hooks/useActivosFilterAndSort', () => ({
    useActivosFilterAndSort: vi.fn(),
}));

// Mock components
vi.mock('@/components/common/ConfirmDialog', () => ({
    ConfirmDialog: ({ open, onConfirm, onClose }: any) => 
        open ? (
            <div data-testid="confirm-dialog">
                <button onClick={onConfirm}>Confirm</button>
                <button onClick={onClose}>Cancel</button>
            </div>
        ) : null,
}));

vi.mock('./AssetFormDialog', () => ({
    default: ({ open, onSave, onClose }: any) => 
        open ? (
            <div data-testid="asset-form-dialog">
                <button onClick={() => onSave({ symbol: 'NEW' })}>Save</button>
                <button onClick={onClose}>Close</button>
            </div>
        ) : null,
}));

vi.mock('@/components/ui/FloatingMessage', () => ({
    default: ({ open, message }: any) => open ? <div data-testid="floating-message">{message}</div> : null,
}));

// Mock styles
vi.mock('../styles/Admin.module.css', () => ({
    default: {
        controlsStack: 'controlsStack',
        tableContainer: 'tableContainer',
        tableHead: 'tableHead',
        chipSymbol: 'chipSymbol',
    },
}));

describe('ActivosTab', () => {
    const mockActivos = [
        { id: '1', symbol: 'AAPL', nombre: 'Apple', tipo: 'Accion', sector: 'Tech', monedaBase: 'USD' },
    ];

    const mockFilterAndSort = {
        tipos: [{ id: 1, nombre: 'Accion' }],
        sectores: [{ id: 1, nombre: 'Tech' }],
        searchTerm: '',
        setSearchTerm: vi.fn(),
        selectedType: 'Todos',
        setSelectedType: vi.fn(),
        selectedSector: 'Todos',
        setSelectedSector: vi.fn(),
        order: 'asc',
        orderBy: 'symbol',
        handleRequestSort: vi.fn(),
        filteredAndSortedActivos: mockActivos,
    };

    const mockAdminAssets = {
        activos: mockActivos,
        loading: false,
        error: null,
        addAsset: vi.fn(),
        updateAsset: vi.fn(),
        removeAsset: vi.fn(),
    };

    beforeEach(() => {
        vi.clearAllMocks();
        (useAdminAssets as any).mockReturnValue(mockAdminAssets);
        (useActivosFilterAndSort as any).mockReturnValue(mockFilterAndSort);
    });

    it('renders correctly', () => {
        render(<ActivosTab />);
        expect(screen.getByPlaceholderText(/Buscar por símbolo/i)).toBeDefined();
        expect(screen.getByText('Nuevo Activo')).toBeDefined();
        expect(screen.getByText('AAPL')).toBeDefined();
    });

    it('opens create dialog on button click', () => {
        render(<ActivosTab />);
        fireEvent.click(screen.getByText('Nuevo Activo'));
        expect(screen.getByTestId('asset-form-dialog')).toBeDefined();
    });

    it('opens confirm dialog on delete click', () => {
        render(<ActivosTab />);
        fireEvent.click(screen.getByTitle('Eliminar Activo'));
        expect(screen.getByTestId('confirm-dialog')).toBeDefined();
    });

    it('calls removeAsset on confirm delete', async () => {
        render(<ActivosTab />);
        fireEvent.click(screen.getByTitle('Eliminar Activo'));
        fireEvent.click(screen.getByText('Confirm'));
        expect(mockAdminAssets.removeAsset).toHaveBeenCalledWith('1');
    });

    it('shows error message if error exists', () => {
        (useAdminAssets as any).mockReturnValue({
            ...mockAdminAssets,
            error: 'Some error',
        });
        render(<ActivosTab />);
        expect(screen.getByTestId('floating-message')).toHaveTextContent('Some error');
    });
});
