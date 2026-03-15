import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import UsuariosTab from './UsuariosTab';
import { useAdminUsers } from '@/hooks/useAdminUsers';

// Mock hooks
vi.mock('@/hooks/useAdminUsers', () => ({
    useAdminUsers: vi.fn(),
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

vi.mock('@/components/ui/FloatingMessage', () => ({
    default: ({ open, message }: any) => open ? <div data-testid="floating-message">{message}</div> : null,
}));

// Mock styles
vi.mock('../styles/Admin.module.css', () => ({
    default: {
        tableContainer: 'tableContainer',
        tableHead: 'tableHead',
    },
}));

describe('UsuariosTab', () => {
    const mockUsers = [
        {
            id: 'user-1',
            nombre: 'John Doe',
            email: 'john@test.com',
            rol: 'Inversor',
            cantidadOperaciones: 5,
            cantidadRecomendaciones: 2,
            cantidadRecomendacionesAcertadas: 1,
            cantidadPortafoliosPropios: 1,
            cantidadPortafoliosDestacados: 0,
            urlFotoPerfil: '',
            fechaAlta: '2023-01-01T12:00:00Z',
        },
        {
            id: 'user-2',
            nombre: 'Jane Expert',
            email: 'jane@test.com',
            rol: 'Experto',
            cantidadOperaciones: 20,
            cantidadRecomendaciones: 10,
            cantidadRecomendacionesAcertadas: 8,
            cantidadPortafoliosPropios: 3,
            cantidadPortafoliosDestacados: 2,
            urlFotoPerfil: '',
            fechaAlta: '2023-01-02T12:00:00Z',
        },
    ];

    const mockAdminUsers = {
        users: mockUsers,
        loading: false,
        error: null,
        changeRole: vi.fn(),
        removeUser: vi.fn(),
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders loading state', () => {
        (useAdminUsers as any).mockReturnValue({
            ...mockAdminUsers,
            loading: true,
        });

        render(<UsuariosTab />);
        expect(document.querySelector('.MuiSkeleton-root')).toBeDefined();
    });

    it('renders users table correctly', () => {
        (useAdminUsers as any).mockReturnValue(mockAdminUsers);

        render(<UsuariosTab />);
        
        expect(screen.getByText('John Doe')).toBeDefined();
        expect(screen.getByText('john@test.com')).toBeDefined();
        expect(screen.getByText('Jane Expert')).toBeDefined();
        expect(screen.getByText('Experto')).toBeDefined();
    });

    it('handles ascend role click', async () => {
        (useAdminUsers as any).mockReturnValue(mockAdminUsers);

        render(<UsuariosTab />);
        
        fireEvent.click(screen.getByTitle('Ascender a Experto'));
        expect(screen.getByTestId('confirm-dialog')).toBeDefined();
        
        fireEvent.click(screen.getByText('Confirm'));
        expect(mockAdminUsers.changeRole).toHaveBeenCalledWith(mockUsers[0], 'up');
    });

    it('handles descend role click', async () => {
        (useAdminUsers as any).mockReturnValue(mockAdminUsers);

        render(<UsuariosTab />);
        
        fireEvent.click(screen.getByTitle('Descender a Inversor'));
        expect(screen.getByTestId('confirm-dialog')).toBeDefined();
        
        fireEvent.click(screen.getByText('Confirm'));
        expect(mockAdminUsers.changeRole).toHaveBeenCalledWith(mockUsers[1], 'down');
    });

    it('handles remove user click', async () => {
        (useAdminUsers as any).mockReturnValue(mockAdminUsers);

        render(<UsuariosTab />);
        
        fireEvent.click(screen.getAllByTitle('Eliminar usuario')[0]);
        expect(screen.getByTestId('confirm-dialog')).toBeDefined();
        
        fireEvent.click(screen.getByText('Confirm'));
        expect(mockAdminUsers.removeUser).toHaveBeenCalledWith('user-1');
    });
});
