import { render, screen, fireEvent, waitFor } from '@/test/test-utils';
import MyOperationsPage from './page';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useMyOperations } from '@/hooks/useMyOperations';
import { deleteOperacion, updateOperacion } from '@/services/OperacionesService';

vi.mock('@/hooks/useMyOperations');
vi.mock('@/services/OperacionesService');
vi.mock('@/components/auth/RoleGuard', () => ({
    RoleGuard: ({ children }: any) => <div>{children}</div>
}));
// Mock ConfirmDialog to immediately trigger confirm for testing logic or just render simple buttons
vi.mock('@/components/common/ConfirmDialog', () => ({
    ConfirmDialog: ({ open, onConfirm, onClose }: any) => open ? (
        <div>
            ConfirmDialog
            <button onClick={onConfirm}>ConfirmDelete</button>
            <button onClick={onClose}>CancelDelete</button>
        </div>
    ) : null
}));
vi.mock('next/navigation', () => ({
    useRouter: () => ({ back: vi.fn() }),
}));
vi.mock('@/components/ui/FloatingMessage', () => ({
    default: ({ open, message }: any) => open ? <div>{message}</div> : null
}));

describe('MyOperationsPage', () => {
    const mockRefresh = vi.fn();
    const mockCheckValidation = vi.fn().mockReturnValue({ valid: true });

    const defaultOps = [
        {
            id: 1,
            tipo: 'Compra',
            moneda: 'USD',
            activoSymbol: 'AAPL',
            cantidad: 10,
            precioUnitario: 150,
            totalOperado: 1500,
            fecha: new Date().toISOString()
        }
    ];

    beforeEach(() => {
        (useMyOperations as any).mockReturnValue({
            operaciones: defaultOps,
            loading: false,
            user: { id: 1 },
            orderBy: 'fecha',
            order: 'desc',
            filterType: 'TODAS',
            setFilterType: vi.fn(),
            filterCurrency: 'TODAS',
            setFilterCurrency: vi.fn(),
            handleRequestSort: vi.fn(),
            refresh: mockRefresh,
            checkValidation: mockCheckValidation
        });
    });

    it('renders operations list', () => {
        render(<MyOperationsPage />);
        expect(screen.getByText('AAPL')).toBeInTheDocument();
        expect(screen.getByText('Compra')).toBeInTheDocument();
    });

    it('handles delete flow', async () => {
        render(<MyOperationsPage />);
        const deleteBtn = screen.getByLabelText('Eliminar'); // Tooltip is "Eliminar"
        fireEvent.click(deleteBtn);

        expect(screen.getByText('ConfirmDialog')).toBeInTheDocument();

        fireEvent.click(screen.getByText('ConfirmDelete'));

        await waitFor(() => {
            expect(deleteOperacion).toHaveBeenCalledWith(1);
            expect(mockRefresh).toHaveBeenCalled();
        });
    });

    it('handles edit flow', async () => {
        render(<MyOperationsPage />);
        const editBtn = screen.getByLabelText('Editar');
        fireEvent.click(editBtn);

        expect(screen.getByText('Editar Operación')).toBeInTheDocument();

        // Change value
        // Inputs are labelled "Cantidad" and "Precio Unitario"
        const cantInput = screen.getByLabelText('Cantidad');
        fireEvent.change(cantInput, { target: { value: '20' } });

        const saveBtn = screen.getByText('Guardar Cambios');
        fireEvent.click(saveBtn);

        await waitFor(() => {
            expect(updateOperacion).toHaveBeenCalledWith(1, expect.objectContaining({ cantidad: 20 }));
            expect(mockRefresh).toHaveBeenCalled();
        });
    });


});
